import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

console.log('🚀 NSPK Webhook Function Started');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function validateNSPKSignature(data: Record<string, any>, signature: string, secretKey: string): Promise<boolean> {
  try {
    // Sort parameters by key (excluding signature)
    const sortedKeys = Object.keys(data).filter(key => key !== 'signature').sort();
    
    // Create signature string
    const signatureString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&') + secretKey;
    
    console.log('🔐 NSPK signature validation:', {
      sortedKeys,
      signatureString: signatureString.substring(0, 100) + '...'
    });
    
    // Generate HMAC-SHA256 hash
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const dataToSign = encoder.encode(signatureString);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('✅ Expected signature:', expectedSignature.substring(0, 16) + '...');
    console.log('📥 Received signature:', signature.substring(0, 16) + '...');
    
    return expectedSignature.toLowerCase() === signature.toLowerCase();
  } catch (error) {
    console.error('❌ Signature validation error:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  console.log(`📋 ${req.method} ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`📊 Request method: ${req.method}`);
    console.log(`📊 Request URL: ${req.url}`);
    
    // Only accept POST requests for webhooks
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

    // Get environment variables
    const nspkSecretKey = Deno.env.get('NSPK_SECRET_KEY'); // Optional for signature validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('🔑 Environment check:', {
      hasNSPKSecret: !!nspkSecretKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing required Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request data
    let webhookData: Record<string, any>;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      webhookData = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      webhookData = {};
      for (const [key, value] of formData.entries()) {
        webhookData[key] = value.toString();
      }
    } else {
      console.error('❌ Unsupported content type:', contentType);
      return new Response(
        JSON.stringify({ error: 'Unsupported content type' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📥 Webhook data received:', {
      ...webhookData,
      signature: webhookData.signature ? webhookData.signature.substring(0, 16) + '...' : 'none'
    });

    // Validate signature if present and secret key is configured
    if (webhookData.signature && nspkSecretKey) {
      const isValidSignature = await validateNSPKSignature(webhookData, webhookData.signature, nspkSecretKey);
      if (!isValidSignature) {
        console.error('❌ Invalid signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      console.log('✅ Signature validated successfully');
    } else if (webhookData.signature && !nspkSecretKey) {
      console.log('⚠️ Signature present but no secret key configured - skipping validation');
    } else {
      console.log('⚠️ No signature provided in webhook data');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract payment information from NSPK webhook data
    const paymentId = webhookData.paymentId || webhookData.payment_id || webhookData.qrId;
    const orderId = webhookData.orderId || webhookData.order_id || webhookData.merchantOrderId;
    const status = webhookData.status || webhookData.paymentStatus;
    const amount = webhookData.amount || webhookData.paymentAmount;

    console.log('💳 Payment data extracted:', {
      paymentId,
      orderId,
      status,
      amount
    });

    if (!paymentId || !orderId) {
      console.error('❌ Missing required payment data');
      return new Response(
        JSON.stringify({ error: 'Missing required payment data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Map NSPK status to our internal status
    let internalStatus = 'PENDING';
    if (status === 'CONFIRMED' || status === 'PAID' || status === 'SUCCESS') {
      internalStatus = 'COMPLETED';
    } else if (status === 'DECLINED' || status === 'FAILED' || status === 'ERROR') {
      internalStatus = 'FAILED';
    } else if (status === 'CANCELLED' || status === 'CANCELED') {
      internalStatus = 'CANCELLED';
    }

    console.log('📊 Status mapping:', { original: status, internal: internalStatus });

    // Check if payment record exists
    const { data: existingPayment, error: selectError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .maybeSingle();

    if (selectError) {
      console.error('❌ Database select error:', selectError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🔍 Existing payment:', existingPayment ? 'found' : 'not found');

    if (existingPayment) {
      // Update existing payment
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: internalStatus,
          provider_data: webhookData,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', paymentId);

      if (updateError) {
        console.error('❌ Database update error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Database update failed' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('✅ Payment updated successfully');
    } else {
      // Insert new payment record
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          payment_id: paymentId,
          order_id: orderId,
          amount: amount ? Math.round(parseFloat(amount) * 100) : 0, // Convert to kopecks
          status: internalStatus,
          provider: 'nspk',
          provider_data: webhookData,
          customer_data: {
            phone: webhookData.phone || webhookData.customerPhone,
            email: webhookData.email || webhookData.customerEmail
          }
        });

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        return new Response(
          JSON.stringify({ error: 'Database insert failed' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('✅ New payment record created');
    }

    // Return success response (NSPK typically expects 200 OK)
    console.log('🎉 Webhook processed successfully');
    return new Response(
      JSON.stringify({ result: 'OK', message: 'Webhook processed successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});