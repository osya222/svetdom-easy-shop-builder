import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log('🚀 QR Manager Webhook Function Started');

serve(async (req) => {
  console.log(`📋 ${req.method} ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET for health check  
  if (req.method === 'GET') {
    console.log('🔍 Health check request received');
    return new Response(
      JSON.stringify({ 
        status: 'OK',
        message: 'QR Manager webhook is running',
        timestamp: new Date().toISOString(),
        url: req.url
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  try {
    console.log(`📊 Request method: ${req.method}`);
    console.log(`📊 Request URL: ${req.url}`);
    
    // Log all headers for debugging
    console.log('📨 Request headers:');
    for (const [key, value] of req.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Only accept POST requests for QR Manager webhooks
    if (req.method !== 'POST') {
      console.log(`❌ Unsupported method: ${req.method}`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body to validate it's proper JSON
    let webhookData;
    try {
      const body = await req.text();
      console.log('📥 Raw request body:', body.substring(0, 200) + '...');
      console.log('📏 Body length:', body.length);
      
      // Try to parse as JSON
      webhookData = JSON.parse(body);
    } catch (error) {
      console.error('❌ Invalid JSON body:', error);
      return new Response(
        JSON.stringify({ error: 'webhook data is invalid' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📊 QR Manager webhook data:', {
      payment_id: webhookData.payment_id,
      amount: webhookData.amount,
      status: webhookData.status,
      merchant_id: webhookData.merchant_id || 'not provided'
    });

    // Log expected QR Manager parameters
    const requiredParams = ['payment_id', 'amount', 'status'];
    const missingParams = requiredParams.filter(param => !webhookData[param]);
    
    if (missingParams.length > 0) {
      console.log('⚠️ Missing QR Manager parameters:', missingParams);
    } else {
      console.log('✅ All required QR Manager parameters present');
    }

    console.log('🔄 Redirecting to QR Manager proxy URL...');

    // Return 307 redirect to QR Manager proxy as required
    // Pass all the original data in the redirect
    return new Response(null, {
      status: 307,
      headers: {
        ...corsHeaders,
        'Location': 'https://cb.boogienwoogie/webhook/qrmanager',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Return the exact response format required by QR Manager
    return new Response(
      JSON.stringify({ error: 'webhook data is invalid' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});