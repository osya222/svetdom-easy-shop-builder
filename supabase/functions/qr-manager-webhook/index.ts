import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("🚀 QR Manager Webhook Function Started")

serve(async (req) => {
  console.log("📋", req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Log request headers
  console.log("📨 Request headers:")
  for (const [key, value] of req.headers.entries()) {
    console.log(`  ${key}: ${value}`)
  }

  try {
    const bodyText = await req.text()
    console.log("📏 Body length:", bodyText.length)
    console.log("📥 Raw request body:", bodyText.substring(0, 500) + (bodyText.length > 500 ? "..." : ""))

    let webhookData: any = {}
    
    try {
      webhookData = JSON.parse(bodyText)
      console.log("📊 Parsed webhook data:", JSON.stringify(webhookData, null, 2))
    } catch (parseError) {
      console.log("⚠️ Failed to parse as JSON, treating as form data or other format")
      
      // Попробуем парсить как URL-encoded данные
      if (bodyText.includes('=') && bodyText.includes('&')) {
        const params = new URLSearchParams(bodyText)
        for (const [key, value] of params.entries()) {
          webhookData[key] = value
        }
        console.log("📊 Parsed as URL-encoded:", webhookData)
      }
    }

    // Извлекаем данные QR Manager
    const qrManagerData = {
      payment_id: webhookData.payment_id || webhookData.paymentId || webhookData.id,
      order_id: webhookData.order_id || webhookData.orderId,
      status: webhookData.status || webhookData.payment_status,
      amount: webhookData.amount,
      currency: webhookData.currency || 'RUB',
      merchant_id: webhookData.merchant_id || "not provided"
    }

    console.log("📊 QR Manager webhook data:", JSON.stringify(qrManagerData, null, 2))

    // Проверяем наличие обязательных параметров
    const requiredParams = ["payment_id", "status", "amount"]
    const missingParams = requiredParams.filter(param => !qrManagerData[param as keyof typeof qrManagerData])

    if (missingParams.length > 0) {
      console.log("⚠️ Missing QR Manager parameters:", missingParams)
      
      // Возвращаем успешный ответ для webhook, даже если не все параметры присутствуют
      return new Response(
        JSON.stringify({ 
          status: "received", 
          message: "Webhook received but missing parameters",
          missing: missingParams 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Обрабатываем различные статусы платежа
    console.log(`💳 QR Manager Payment Status: ${qrManagerData.status}`)

    switch (qrManagerData.status?.toLowerCase()) {
      case 'success':
      case 'paid':
      case 'completed':
        console.log("✅ Payment successful")
        // Здесь можно добавить логику для обновления заказа в базе данных
        break
        
      case 'failed':
      case 'error':
      case 'cancelled':
        console.log("❌ Payment failed")
        break
        
      case 'pending':
      case 'processing':
        console.log("⏳ Payment pending")
        break
        
      default:
        console.log("❓ Unknown payment status:", qrManagerData.status)
    }

    // Возвращаем успешный ответ
    return new Response(
      JSON.stringify({ 
        status: "ok", 
        message: "Webhook processed successfully" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: any) {
    console.error("❌ Error in QR Manager webhook:", error)
    
    // Возвращаем успешный ответ даже при ошибке, чтобы QR Manager не повторял запрос
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})