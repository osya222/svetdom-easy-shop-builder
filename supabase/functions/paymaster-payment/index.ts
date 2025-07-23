import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface PaymentRequest {
  action: string;
  amount: number;
  orderId: string;
  customerData: CustomerData;
}

serve(async (req) => {
  console.log("🚀 Paymaster Payment Function Started");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestBody = await req.text();
    console.log("📥 Raw request body:", requestBody);
    
    const { action, amount, orderId, customerData }: PaymentRequest = JSON.parse(requestBody);
    
    console.log("📋 Request data:", {
      action,
      amount,
      orderId,
      hasCustomerData: !!customerData
    });

    // Get environment variables
    const merchantId = Deno.env.get('PAYMASTER_MERCHANT_ID');
    const secretKey = Deno.env.get('PAYMASTER_SECRET_KEY');
    
    console.log("🔑 Environment check:", {
      hasMerchantId: !!merchantId,
      hasSecretKey: !!secretKey
    });

    if (!merchantId || !secretKey) {
      console.error("❌ Missing Paymaster credentials");
      throw new Error('Отсутствуют учетные данные Paymaster');
    }

    if (action === 'init') {
      console.log("💳 Creating Paymaster payment...");
      
      // Create unique payment ID
      const paymentId = `PM_${orderId}_${Date.now()}`;
      
      // Paymaster expects amount in rubles, not kopecks
      const amountInRubles = amount;
      
      console.log("💰 Amount:", {
        originalAmount: amount,
        amountForPaymaster: amountInRubles
      });

      // Generate signature for Paymaster
      const generateSignature = async (params: Record<string, any>, secretKey: string): Promise<string> => {
        // Sort parameters by key
        const sortedKeys = Object.keys(params).sort();
        const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join(';') + `;${secretKey}`;
        
        console.log("🔐 Signature generation:", {
          sortedKeys,
          signatureString: signatureString.substring(0, 100) + "..."
        });
        
        // Create SHA-256 hash (MD5 not supported in Deno)
        const encoder = new TextEncoder();
        const data = encoder.encode(signatureString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      // Prepare payment parameters
      const paymentParams = {
        LMI_MERCHANT_ID: merchantId,
        LMI_PAYMENT_AMOUNT: amountInRubles.toString(),
        LMI_CURRENCY: 'RUB',
        LMI_PAYMENT_NO: paymentId,
        LMI_PAYMENT_DESC: `Заказ ${orderId} - Светодиодные светильники`,
        LMI_PAYER_EMAIL: customerData.email,
        LMI_PAYER_PHONE: customerData.phone.replace(/[^\d+]/g, ''), // Clean phone number
        LMI_SUCCESS_URL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paymaster-payment?action=success&orderId=${orderId}`,
        LMI_FAILURE_URL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paymaster-payment?action=failure&orderId=${orderId}`,
        LMI_SUCCESS_METHOD: '1',
        LMI_FAILURE_METHOD: '1'
      };

      console.log("📦 Payment parameters:", {
        ...paymentParams,
        LMI_PAYER_EMAIL: customerData.email,
        LMI_PAYER_PHONE: paymentParams.LMI_PAYER_PHONE
      });

      // Generate signature
      const signature = await generateSignature(paymentParams, secretKey);
      
      console.log("✅ Generated signature:", signature.substring(0, 10) + "...");

      // Create payment URL with form data
      const formParams = new URLSearchParams({
        ...paymentParams,
        LMI_HASH: signature
      });

      const paymentUrl = `https://paymaster.ru/Payment/Init?${formParams.toString()}`;
      
      console.log("🔗 Payment URL created");

      const response = {
        success: true,
        paymentUrl,
        paymentId,
        message: "Платеж успешно создан"
      };

      console.log("📥 Paymaster response:", { 
        success: response.success, 
        hasPaymentURL: !!response.paymentUrl,
        paymentId: response.paymentId
      });

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else if (action === 'success') {
      console.log("✅ Payment success callback");
      
      // Here you would typically verify the payment with Paymaster
      // and update your database accordingly
      
      return new Response(JSON.stringify({
        success: true,
        message: "Платеж успешно завершен"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else if (action === 'failure') {
      console.log("❌ Payment failure callback");
      
      return new Response(JSON.stringify({
        success: false,
        message: "Платеж не был завершен"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else {
      console.error("❌ Unknown action:", action);
      throw new Error(`Неизвестное действие: ${action}`);
    }

  } catch (error) {
    console.error("❌ CRITICAL ERROR in Paymaster function:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});