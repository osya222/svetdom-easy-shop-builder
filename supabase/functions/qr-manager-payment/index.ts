import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("🚀 QR Manager Payment Function Started")

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  comment?: string;
}

interface PaymentRequest {
  action: string;
  amount?: number;
  orderId?: string;
  customerData?: CustomerData;
  paymentId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Handle GET requests for health check
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'QR Manager Payment Service is running' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const requestData: PaymentRequest = await req.json()
    console.log("📥 Получен запрос QR Manager:", JSON.stringify(requestData, null, 2))

    // Получаем учетные данные QR Manager из переменных окружения
    const qrManagerApiKey = Deno.env.get('QR_MANAGER_API_KEY')
    const qrManagerMerchantId = Deno.env.get('QR_MANAGER_MERCHANT_ID')
    const qrManagerApiUrl = Deno.env.get('QR_MANAGER_API_URL') || 'https://app.wapiserv.qrm.ooo'

    if (!qrManagerApiKey || !qrManagerMerchantId) {
      console.error("❌ Отсутствуют учетные данные QR Manager")
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'QR Manager credentials not configured',
          details: {
            hasApiKey: !!qrManagerApiKey,
            hasMerchantId: !!qrManagerMerchantId
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    if (requestData.action === 'init') {
      const { amount, orderId, customerData } = requestData

      if (!amount || !orderId || !customerData) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing required fields: amount, orderId, customerData' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
      }

      console.log("💳 Создание платежа QR Manager:", {
        amount,
        orderId,
        customer: `${customerData.firstName} ${customerData.lastName}`
      })

      // Подготавливаем параметры для QR Manager API с учетом требований СБП
      const sumKopecks = amount * 100;
      
      // Создаем максимально совместимый с СБП идентификатор
      // СБП требует: короткие ID, только латиница, без спецсимволов
      const timestamp = Date.now().toString().slice(-12); // Последние 12 цифр timestamp
      const shortOrderId = timestamp; // Используем timestamp как безопасный ID
      
      // Webhook URL для получения уведомлений о статусе платежа
      const webhookUrl = `https://mcszrtlpbsesanylyzmi.supabase.co/functions/v1/qr-manager-webhook`;
      
      const paymentParams = {
        sum: sumKopecks, // Сумма в копейках (обязательное поле)
        qr_size: 400, // Размер QR кода
        // КРИТИЧНО: только латинские символы для СБП совместимости
        payment_purpose: `Payment ${shortOrderId}`,
        // merchant_order_id - короткий, безопасный идентификатор
        merchant_order_id: shortOrderId,
        // Добавляем webhook для получения уведомлений
        notification_url: webhookUrl,
        // Дополнительные параметры для улучшения совместимости
        qr_type: 'dynamic', // Динамический QR код
        currency: 'RUB' // Явно указываем валюту
      }

      // Валидация суммы для СБП (минимум 1 рубль, максимум 1 млн рублей)
      if (sumKopecks < 100 || sumKopecks > 100000000) {
        throw new Error(`Недопустимая сумма для СБП: ${sumKopecks} копеек (${amount} руб.). Минимум: 1 руб, Максимум: 1,000,000 руб`)
      }

      console.log("💳 Payment parameters:", {
        sum_kopecks: sumKopecks,
        sum_rubles: (sumKopecks / 100).toFixed(2),
        payment_purpose: paymentParams.payment_purpose,
        merchant_order_id: paymentParams.merchant_order_id,
        qr_size: paymentParams.qr_size,
        original_order_id: orderId,
        note: "Используем только латинские символы для СБП совместимости"
      })

      console.log('🔑 Проверка конфигурации:', {
        hasApiKey: !!qrManagerApiKey,
        hasMerchantId: !!qrManagerMerchantId,
        apiUrl: qrManagerApiUrl,
        apiKeyLength: qrManagerApiKey?.length,
        webhookUrl: paymentParams.notification_url
      })

      const qrManagerUrl = `${qrManagerApiUrl}/api/v1/payment/qr/create/`
      const requestBody = {
        ...paymentParams,
        merchant_id: qrManagerMerchantId
      }

      console.log('🌐 QR Manager API request:', {
        url: qrManagerUrl,
        method: 'POST',
        body: JSON.stringify(requestBody, null, 2),
        headers: { 'Authorization': `Token ${qrManagerApiKey?.substring(0, 10)}...` }
      })

      try {
        const qrManagerResponse = await fetch(qrManagerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${qrManagerApiKey}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        const responseText = await qrManagerResponse.text()
        console.log("📊 Ответ QR Manager API:", {
          status: qrManagerResponse.status,
          statusText: qrManagerResponse.statusText,
          response: responseText
        })

        if (!qrManagerResponse.ok) {
          const errorText = responseText
          console.error('❌ QR Manager API error:', {
            status: qrManagerResponse.status,
            statusText: qrManagerResponse.statusText,
            error: errorText,
            request_body: requestBody,
            possible_causes: [
              'Неверный API ключ или merchant_id',
              'Проблемы с форматом суммы',
              'Некорректные параметры payment_purpose или merchant_order_id',
              'Ошибки валидации СБП параметров'
            ]
          })
          throw new Error(`QR Manager API error: ${qrManagerResponse.status} - ${errorText}`)
        }

        const qrManagerResponseData = JSON.parse(responseText)
        console.log("✅ Успешный ответ QR Manager:", qrManagerResponseData)

        // Дополнительная проверка QR кода
        if (qrManagerResponseData && qrManagerResponseData.results) {
          const qrData = qrManagerResponseData.results;
          const sumFromQr = qrData.qr_link ? qrData.qr_link.match(/sum=(\d+)/)?.[1] : null;
          console.log("🔍 Анализ QR кода:", {
            qr_link: qrData.qr_link,
            qrc_id: qrData.qrc_id,
            operation_id: qrData.operation_id,
            sum_in_qr: sumFromQr,
            expected_sum: sumKopecks,
            sum_match: sumFromQr === sumKopecks.toString(),
            payment_purpose_used: paymentParams.payment_purpose,
            merchant_order_id_used: paymentParams.merchant_order_id,
            optimization: "Используем латиницу для СБП совместимости"
          });
          
          if (sumFromQr && sumFromQr !== sumKopecks.toString()) {
            console.error(`⚠️ Несоответствие суммы в QR коде! Ожидается: ${sumKopecks}, В QR: ${sumFromQr}`);
          }
        }

        // Проверяем наличие QR кода в ответе
        if (qrManagerResponseData && qrManagerResponseData.results && qrManagerResponseData.results.qr_img) {
          const operationId = qrManagerResponseData.results.operation_id || qrManagerResponseData.results.payment_id || orderId;
          
          console.log('✅ QR код успешно создан:', {
            operation_id: operationId,
            amount_rubles: (sumKopecks / 100).toFixed(2),
            amount_kopecks: sumKopecks,
            qr_img: qrManagerResponseData.results.qr_img.substring(0, 50) + '...',
            webhook_url: paymentParams.notification_url,
            final_payment_purpose: paymentParams.payment_purpose,
            final_merchant_order_id: paymentParams.merchant_order_id,
            sbp_optimizations: [
              "Латинские символы в payment_purpose",
              "Короткий merchant_order_id",
              "Webhook для уведомлений",
              "Явное указание валюты",
              "Динамический QR код"
            ]
          })
          
          return new Response(
            JSON.stringify({
              success: true,
              qr_img: qrManagerResponseData.results.qr_img,
              operation_id: operationId,
              qrc_id: qrManagerResponseData.results.qrc_id,
              amount: amount,
              merchant_order_id: paymentParams.merchant_order_id,
              original_order_id: orderId,
              webhook_url: paymentParams.notification_url,
              payment_instructions: {
                ru: "Отсканируйте QR код в приложении банка для оплаты через СБП",
                en: "Scan QR code in your bank app to pay via SBP"
              },
              sbp_compatible: true
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        } else {
          throw new Error('QR код не получен в ответе от API')
        }

      } catch (apiError: any) {
        console.error("❌ Ошибка API QR Manager:", apiError)
        
        return new Response(
          JSON.stringify({
            success: false,
            error: `Ошибка создания QR кода: ${apiError.message}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        )
      }
    }

    // Обработка проверки статуса платежа
    if (requestData.action === 'status') {
      const { paymentId } = requestData
      
      if (!paymentId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing paymentId for status check' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
      }

      console.log(`🔍 Checking payment status for ID: ${paymentId}`)

      try {
        // Запрос статуса платежа через QR Manager API
        const statusResponse = await fetch(`${qrManagerApiUrl}/operations/payment-status/${paymentId}/`, {
          method: 'GET',
          headers: {
            'X-Api-Key': qrManagerApiKey,
            'Accept': 'application/json'
          }
        })

        const statusData = await statusResponse.text()
        console.log(`📊 Status API response:`, {
          status: statusResponse.status,
          data: statusData
        })

        if (statusResponse.ok) {
          const statusResult = JSON.parse(statusData)
          return new Response(
            JSON.stringify({
              success: true,
              paymentId,
              status: statusResult.status || 'unknown',
              data: statusResult
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        } else {
          console.log(`⚠️ Status check failed: ${statusResponse.status}`)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Status check failed',
              paymentId,
              status: 'unknown'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      } catch (statusError: any) {
        console.error(`❌ Status check error:`, statusError)
        return new Response(
          JSON.stringify({
            success: false,
            error: `Status check error: ${statusError.message}`,
            paymentId,
            status: 'error'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Добавляем действие для тестирования
    if (requestData.action === 'test') {
      console.log(`🧪 Test request received`)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'QR Manager payment service is working',
          timestamp: new Date().toISOString(),
          config: {
            hasApiKey: !!qrManagerApiKey,
            hasMerchantId: !!qrManagerMerchantId,
            apiUrl: qrManagerApiUrl
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unknown action' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )

  } catch (error: any) {
    console.error("❌ Ошибка в QR Manager Payment Function:", error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})