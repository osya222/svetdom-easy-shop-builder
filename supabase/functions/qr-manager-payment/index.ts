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
      const paymentParams = {
        sum: amount, // Сумма в рублях
        qr_size: 400, // Размер QR кода
        payment_purpose: `Заказ №${orderId} - ${customerData.firstName} ${customerData.lastName}`,
        notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/qr-manager-webhook`
      }

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

        // Проверяем наличие QR кода в ответе
        if (qrManagerResponse && qrManagerResponse.results && qrManagerResponse.results.qr_img) {
          return new Response(
            JSON.stringify({
              success: true,
              qr_img: qrManagerResponse.results.qr_img,
              payment_id: qrManagerResponse.results.payment_id || orderId,
              qr_data: qrManagerResponse.results.qr_data,
              amount: amount,
              orderId: orderId
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

    // Обработка других действий (например, проверка статуса)
    if (requestData.action === 'status') {
      const { paymentId } = requestData
      
      if (!paymentId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing paymentId' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
      }

      // Здесь можно добавить проверку статуса платежа через API QR Manager
      return new Response(
        JSON.stringify({
          success: true,
          status: 'pending',
          paymentId
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