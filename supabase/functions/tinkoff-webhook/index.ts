console.log('🚀 Т-Банк Webhook Function Started');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log(`📋 ${req.method} ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`📊 Request method: ${req.method}`);
    console.log(`📊 Request URL: ${req.url}`);
    
    // Only accept POST requests for Т-Банк webhooks
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

    console.log('📊 Т-Банк webhook data:', {
      transaction_id: webhookData.transaction_id,
      amount: webhookData.amount,
      status: webhookData.status,
      merchant_id: webhookData.merchant_id || 'not provided'
    });

    // Log expected Т-Банк parameters
    const requiredParams = ['transaction_id', 'amount', 'status'];
    const missingParams = requiredParams.filter(param => !webhookData[param]);
    
    if (missingParams.length > 0) {
      console.log('⚠️ Missing Т-Банк parameters:', missingParams);
    } else {
      console.log('✅ All required Т-Банк parameters present');
    }

    console.log('🔄 Redirecting to Т-Банк proxy URL...');

    // Return 307 redirect to Т-Банк proxy as required
    return new Response(null, {
      status: 307,
      headers: {
        ...corsHeaders,
        'Location': 'https://cb.boogienwoogie.com/webhook/tbank'
      }
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    // Return the exact response format required by Т-Банк
    return new Response(
      JSON.stringify({ error: 'webhook data is invalid' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});