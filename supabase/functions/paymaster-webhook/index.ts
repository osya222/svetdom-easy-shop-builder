import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("🚀 Paymaster Webhook Function Started");
  console.log(`📊 Request method: ${req.method}`);
  console.log(`📊 Request URL: ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests for webhook
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

  try {
    // Parse form data from Paymaster
    const formData = await req.formData();
    const webhookData: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString();
    }

    console.log("📥 Webhook data received:", Object.keys(webhookData));

    // Get environment variables
    const secretKey = Deno.env.get('PAYMASTER_SECRET_KEY');
    
    if (!secretKey) {
      console.error("❌ Missing Paymaster secret key");
      return new Response('NO_SECRET', { status: 500 });
    }

    // Verify signature
    const receivedHash = webhookData.LMI_HASH;
    if (!receivedHash) {
      console.error("❌ Missing signature in webhook data");
      return new Response('NO_HASH', { status: 400 });
    }

    // Generate expected signature
    const generateSignature = async (params: Record<string, string>, secretKey: string): Promise<string> => {
      // Remove hash from params for signature generation
      const { LMI_HASH, ...paramsWithoutHash } = params;
      
      // Sort parameters by key
      const sortedKeys = Object.keys(paramsWithoutHash).sort();
      const signatureString = sortedKeys.map(key => `${key}=${paramsWithoutHash[key]}`).join(';') + `;${secretKey}`;
      
      console.log("🔐 Signature generation for verification:", {
        sortedKeys,
        signatureString: signatureString.substring(0, 100) + "..."
      });
      
      // Create SHA-256 hash
      const encoder = new TextEncoder();
      const data = encoder.encode(signatureString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const expectedHash = await generateSignature(webhookData, secretKey);
    
    console.log("🔍 Signature verification:", {
      received: receivedHash.substring(0, 10) + "...",
      expected: expectedHash.substring(0, 10) + "...",
      match: receivedHash === expectedHash
    });

    if (receivedHash !== expectedHash) {
      console.error("❌ Invalid signature");
      return new Response('INVALID_HASH', { status: 400 });
    }

    // Extract payment information
    const paymentId = webhookData.LMI_PAYMENT_NO;
    const paymentStatus = webhookData.LMI_PAYMENT_STATUS;
    const orderId = paymentId?.replace(/^PM_/, '').replace(/_\d+$/, ''); // Extract order ID from payment ID

    console.log("💳 Payment notification:", {
      paymentId,
      paymentStatus,
      orderId,
      amount: webhookData.LMI_PAYMENT_AMOUNT
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine payment status
    let status = 'PENDING';
    if (paymentStatus === '1') {
      status = 'COMPLETED';
    } else if (paymentStatus === '0') {
      status = 'FAILED';
    }

    // Update or insert payment record
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('payment_id', paymentId)
      .single();

    if (existingPayment) {
      // Update existing payment
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status,
          provider_data: webhookData,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', paymentId);

      if (updateError) {
        console.error("❌ Error updating payment:", updateError);
        return new Response('DATABASE_ERROR', { status: 500 });
      }

      console.log("✅ Payment updated successfully");
    } else {
      // Insert new payment record
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          payment_id: paymentId,
          order_id: orderId || paymentId,
          amount: parseInt(webhookData.LMI_PAYMENT_AMOUNT || '0') * 100, // Convert rubles to kopecks
          status,
          provider: 'paymaster',
          provider_data: webhookData,
          customer_data: {
            email: webhookData.LMI_PAYER_EMAIL,
            phone: webhookData.LMI_PAYER_PHONE
          }
        });

      if (insertError) {
        console.error("❌ Error inserting payment:", insertError);
        return new Response('DATABASE_ERROR', { status: 500 });
      }

      console.log("✅ Payment inserted successfully");
    }

    // Return success response to Paymaster
    return new Response('OK', { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error("❌ CRITICAL ERROR in Paymaster webhook:", error);
    
    return new Response('ERROR', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});