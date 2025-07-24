import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { createHash } from 'https://deno.land/std@0.208.0/crypto/mod.ts';

console.log('🚀 Tinkoff Webhook Function Started');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get Tinkoff credentials
const terminalKey = Deno.env.get('TINKOFF_TERMINAL_KEY');
const password = Deno.env.get('TINKOFF_PASSWORD');

function verifySignature(data: any, receivedToken: string): boolean {
  console.log('🔐 Verifying signature...');
  
  if (!password) {
    console.error('❌ TINKOFF_PASSWORD not found in environment');
    return false;
  }

  try {
    // Remove Token from data for signature calculation
    const { Token, ...dataForToken } = data;
    
    // Add Password to data
    const dataWithPassword = { ...dataForToken, Password: password };
    
    // Sort keys alphabetically
    const sortedKeys = Object.keys(dataWithPassword).sort();
    console.log('🔑 Sorted keys for token:', sortedKeys);
    
    // Create token string
    const tokenString = sortedKeys.map(key => dataWithPassword[key]).join('');
    console.log('📝 Token string length:', tokenString.length);
    
    // Generate SHA-256 hash
    const hash = createHash('sha256');
    hash.update(tokenString);
    const calculatedToken = hash.toString('hex');
    
    console.log('✅ Calculated token:', calculatedToken.substring(0, 10) + '...');
    console.log('📥 Received token:', receivedToken.substring(0, 10) + '...');
    
    const isValid = calculatedToken.toLowerCase() === receivedToken.toLowerCase();
    console.log('🎯 Signature valid:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('❌ Error verifying signature:', error);
    return false;
  }
}

async function updatePaymentStatus(paymentId: string, status: string, webhookData: any) {
  console.log(`💾 Updating payment ${paymentId} to status: ${status}`);
  
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: status,
        provider_data: webhookData,
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', paymentId);

    if (error) {
      console.error('❌ Error updating payment:', error);
      return false;
    }

    console.log('✅ Payment status updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Exception updating payment:', error);
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
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse webhook data
    const webhookData = await req.json();
    console.log('📥 Webhook data received:', JSON.stringify(webhookData, null, 2));

    // Extract required fields
    const { PaymentId, Status, Token } = webhookData;

    if (!PaymentId || !Status || !Token) {
      console.error('❌ Missing required fields:', { PaymentId, Status, Token: !!Token });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: PaymentId, Status, Token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify signature
    if (!verifySignature(webhookData, Token)) {
      console.error('❌ Invalid signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Signature verified successfully');

    // Map Tinkoff status to our internal status
    let internalStatus: string;
    switch (Status) {
      case 'CONFIRMED':
        internalStatus = 'CONFIRMED';
        break;
      case 'REJECTED':
      case 'CANCELED':
        internalStatus = 'FAILED';
        break;
      case 'REFUNDED':
        internalStatus = 'REFUNDED';
        break;
      default:
        internalStatus = 'PENDING';
        console.log(`⚠️ Unknown status: ${Status}, setting to PENDING`);
    }

    // Update payment status in database
    const updateSuccess = await updatePaymentStatus(PaymentId, internalStatus, webhookData);

    if (!updateSuccess) {
      return new Response(
        JSON.stringify({ error: 'Failed to update payment status' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log final status
    console.log(`🎉 Payment ${PaymentId} processed successfully with status: ${internalStatus}`);

    // Return success response that Tinkoff expects
    return new Response('OK', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });

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