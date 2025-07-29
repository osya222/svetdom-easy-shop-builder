import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("🚀 QR Manager Payment Function Started")

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
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
    let qrManagerApiUrl = Deno.env.get('QR_MANAGER_API_URL') || 'https://api.qrmanager.ru'
    
    // Добавляем протокол если он отсутствует
    if (!qrManagerApiUrl.startsWith('http://') && !qrManagerApiUrl.startsWith('https://')) {
      qrManagerApiUrl = 'https://' + qrManagerApiUrl
    }

    if (!qrManagerApiKey || !qrManagerMerchantId) {
      console.error("❌ Отсутствуют учетные данные QR Manager")
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'QR Manager credentials not configured' 
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

      // Генерируем уникальный ID платежа
      const paymentId = `QRM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log("💳 Создание платежа QR Manager:", {
        paymentId,
        amount,
        orderId,
        merchant: qrManagerMerchantId
      })

      // Подготавливаем параметры для QR Manager API
      const paymentParams = {
        merchant_id: qrManagerMerchantId,
        payment_id: paymentId,
        order_id: orderId,
        amount: amount, // Сумма в копейках
        currency: 'RUB',
        description: `Заказ №${orderId}`,
        customer: {
          name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone
        },
        success_url: `${req.headers.get('origin')}/payment-success`,
        fail_url: `${req.headers.get('origin')}/payment-canceled`,
        notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/qr-manager-webhook`
      }

      try {
        // Вызываем API QR Manager для создания платежа
        const response = await fetch(`${qrManagerApiUrl}/api/v1/payment/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${qrManagerApiKey}`,
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

        return new Response(
          JSON.stringify({
            success: true,
            paymentId: paymentId,
            qrData: qrManagerResponse.qr_data || qrManagerResponse.qr_code,
            paymentUrl: qrManagerResponse.payment_url || qrManagerResponse.redirect_url,
            qrManagerData: qrManagerResponse
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      } catch (apiError: any) {
        console.error("❌ Ошибка API QR Manager:", apiError)
        
        // Возвращаем mock ответ для тестирования
        return new Response(
          JSON.stringify({
            success: true,
            paymentId: paymentId,
            qrData: `QR_CODE_DATA_${paymentId}`,
            paymentUrl: `https://pay.qrmanager.ru/payment/${paymentId}`,
            mock: true,
            originalError: apiError.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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