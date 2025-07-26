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
    
    // Log all headers for debugging
    console.log('📨 Request headers:');
    for (const [key, value] of req.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
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

    // Get content type to handle different formats
    const contentType = req.headers.get('content-type') || '';
    console.log(`📋 Content-Type: ${contentType}`);

    // Parse request body based on content type
    let webhookData;
    let rawBody;
    
    try {
      rawBody = await req.text();
      console.log('📥 Raw request body (first 500 chars):', rawBody.substring(0, 500));
      console.log('📏 Body length:', rawBody.length);
      
      // Handle different content types
      if (contentType.includes('application/json')) {
        console.log('🔄 Parsing as JSON...');
        webhookData = JSON.parse(rawBody);
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        console.log('🔄 Parsing as form-urlencoded...');
        const params = new URLSearchParams(rawBody);
        webhookData = {};
        for (const [key, value] of params.entries()) {
          webhookData[key] = value;
        }
      } else {
        // Try to parse as JSON first, then as form data
        console.log('🔄 Unknown content type, trying JSON first...');
        try {
          webhookData = JSON.parse(rawBody);
          console.log('✅ Successfully parsed as JSON');
        } catch {
          console.log('🔄 JSON failed, trying form-urlencoded...');
          const params = new URLSearchParams(rawBody);
          webhookData = {};
          for (const [key, value] of params.entries()) {
            webhookData[key] = value;
          }
          console.log('✅ Successfully parsed as form-urlencoded');
        }
      }
    } catch (error) {
      console.error('❌ Body parsing error:', error);
      console.log('📄 Raw body that failed:', rawBody);
      return new Response(
        JSON.stringify({ error: 'webhook data is invalid' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📊 Parsed webhook data:', JSON.stringify(webhookData, null, 2));

    // Log expected Т-Банк parameters
    const requiredParams = ['transaction_id', 'amount', 'status'];
    const missingParams = requiredParams.filter(param => !webhookData[param]);
    
    if (missingParams.length > 0) {
      console.log('⚠️ Missing Т-Банк parameters:', missingParams);
    } else {
      console.log('✅ All required Т-Банк parameters present');
    }

    // Prepare data for forwarding
    const forwardData = {
      transaction_id: webhookData.transaction_id,
      amount: webhookData.amount,
      status: webhookData.status,
      merchant_id: webhookData.merchant_id,
      ...webhookData // Include all other fields
    };

    console.log('📤 Data to forward:', JSON.stringify(forwardData, null, 2));

    // Forward to external webhook with proper error handling
    try {
      console.log('🔄 Forwarding to external webhook...');
      
      const forwardResponse = await fetch('https://cb.boogienwoogie.com/webhook/tbank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Webhook-Forwarder'
        },
        body: JSON.stringify(forwardData)
      });

      console.log(`📨 Forward response status: ${forwardResponse.status}`);
      
      if (!forwardResponse.ok) {
        const errorText = await forwardResponse.text();
        console.error('❌ Forward failed:', errorText);
      } else {
        const responseText = await forwardResponse.text();
        console.log('✅ Forward successful:', responseText.substring(0, 200));
      }

    } catch (forwardError) {
      console.error('❌ Forward request failed:', forwardError);
    }

    // Always return success to T-Bank
    return new Response(
      JSON.stringify({ success: true, message: 'webhook processed' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    console.error('❌ Error stack:', error.stack);
    
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