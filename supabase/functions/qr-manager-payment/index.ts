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

    console.log("🔑 Проверка секретов:", {
      hasApiKey: !!qrManagerApiKey,
      hasMerchantId: !!qrManagerMerchantId,
      apiUrl: qrManagerApiUrl,
      apiKeyLength: qrManagerApiKey ? qrManagerApiKey.length : 0
    })

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

      // Подготавливаем параметры для QR Manager API согласно документации
      const sumKopecks = amount * 100;
      const paymentParams = {
        sum: sumKopecks, // Сумма в копейках
        qr_size: 400, // Размер QR кода
        payment_purpose: `Заказ ${orderId}`, // Назначение платежа на русском
        merchant_order_id: orderId, // ID заказа
        // Убираем лишние параметры, которые могут мешать СБП
        // currency: 'RUB', // СБП работает только с рублями, параметр может быть лишним
        // payment_method: 'sbp', // Может конфликтовать с QR Manager
        // Минимальные данные клиента
        // customer_name: `${customerData.firstName} ${customerData.lastName}`,
        // customer_phone: customerData.phone,
        // customer_email: customerData.email
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
        qr_size: paymentParams.qr_size
      })

      try {
        // Вызываем API QR Manager для создания QR кода
        const response = await fetch(`${qrManagerApiUrl}/operations/qr-code/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': qrManagerApiKey,
            'Accept': 'application/json'
          },
          body: JSON.stringify(paymentParams)
        })

        const responseText = await response.text()
        console.log("📊 Ответ QR Manager API:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        })

        if (!response.ok) {
          throw new Error(`QR Manager API error: ${response.status} ${responseText}`)
        }

        const qrManagerResponse = JSON.parse(responseText)
        console.log("✅ Успешный ответ QR Manager:", qrManagerResponse)

        // Дополнительная проверка QR кода
        if (qrManagerResponse && qrManagerResponse.results) {
          const qrData = qrManagerResponse.results;
          const sumFromQr = qrData.qr_link ? qrData.qr_link.match(/sum=(\d+)/)?.[1] : null;
          console.log("🔍 Анализ QR кода:", {
            qr_link: qrData.qr_link,
            qrc_id: qrData.qrc_id,
            operation_id: qrData.operation_id,
            sum_in_qr: sumFromQr,
            expected_sum: sumKopecks,
            sum_match: sumFromQr === sumKopecks.toString()
          });
          
          if (sumFromQr && sumFromQr !== sumKopecks.toString()) {
            console.error(`⚠️ Несоответствие суммы в QR коде! Ожидается: ${sumKopecks}, В QR: ${sumFromQr}`);
          }
        }

        // Проверяем наличие QR кода в ответе
        if (qrManagerResponse && qrManagerResponse.results && qrManagerResponse.results.qr_img) {
          const operationId = qrManagerResponse.results.operation_id || qrManagerResponse.results.payment_id || orderId;
          
          console.log("✅ QR код успешно создан:", {
            operation_id: operationId,
            amount_rubles: (sumKopecks / 100).toFixed(2),
            amount_kopecks: sumKopecks,
            qr_img: qrManagerResponse.results.qr_img.substring(0, 50) + '...'
          })
          
          return new Response(
            JSON.stringify({
              success: true,
              qr_img: qrManagerResponse.results.qr_img,
              payment_id: operationId,
              operation_id: qrManagerResponse.results.operation_id,
              qr_data: qrManagerResponse.results.qr_data,
              qr_link: qrManagerResponse.results.qr_link,
              amount: amount,
              amount_kopecks: sumKopecks,
              orderId: orderId,
              payment_purpose: paymentParams.payment_purpose
            }),
            { 
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