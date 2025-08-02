import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("🚀 QR Manager Webhook Function Started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log(`📥 Webhook request: ${req.method} ${req.url}`)

    if (req.method !== 'POST') {
      console.log(`❌ Invalid method: ${req.method}`)
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse webhook data
    const webhookData = await req.json()
    console.log('📋 Webhook data received:', JSON.stringify(webhookData, null, 2))

    // Validate webhook structure
    if (!webhookData || typeof webhookData !== 'object') {
      console.log('❌ Invalid webhook data structure')
      return new Response(
        JSON.stringify({ error: 'Invalid webhook data' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract payment information
    const {
      operation_id,
      status,
      qrc_id,
      merchant_order_id,
      sum,
      payment_time,
      error_code,
      error_message
    } = webhookData

    console.log('💳 Payment status update:', {
      operation_id,
      status,
      merchant_order_id,
      sum,
      payment_time,
      error_info: error_code ? { error_code, error_message } : 'no_errors'
    })

    // Determine payment status
    let paymentStatus = 'unknown'
    let statusMessage = 'Unknown status'

    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        paymentStatus = 'success'
        statusMessage = 'Payment completed successfully'
        break
      case 'failed':
      case 'error':
      case 'declined':
        paymentStatus = 'failed'
        statusMessage = error_message || 'Payment failed'
        break
      case 'pending':
      case 'processing':
      case 'waiting':
        paymentStatus = 'pending'
        statusMessage = 'Payment is being processed'
        break
      case 'cancelled':
      case 'canceled':
        paymentStatus = 'cancelled'
        statusMessage = 'Payment was cancelled'
        break
      default:
        console.log(`⚠️ Unknown payment status: ${status}`)
        paymentStatus = 'unknown'
        statusMessage = `Unknown status: ${status}`
    }

    console.log(`✅ Payment status determined: ${paymentStatus} - ${statusMessage}`)

    // Log success/failure details
    if (paymentStatus === 'success') {
      console.log('🎉 Payment successful!', {
        operation_id,
        merchant_order_id,
        amount: sum,
        payment_time,
        qrc_id
      })
    } else if (paymentStatus === 'failed') {
      console.log('💥 Payment failed!', {
        operation_id,
        merchant_order_id,
        error_code,
        error_message,
        raw_status: status
      })
    }

    // Here you would typically:
    // 1. Update your database with the payment status
    // 2. Send notifications to the customer
    // 3. Trigger order fulfillment for successful payments
    // 4. Handle refunds or cancellations

    // For now, we'll just acknowledge the webhook
    const response = {
      success: true,
      message: 'Webhook processed successfully',
      payment_status: paymentStatus,
      operation_id,
      merchant_order_id,
      processed_at: new Date().toISOString()
    }

    console.log('📤 Webhook response:', response)

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('💥 Webhook error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})