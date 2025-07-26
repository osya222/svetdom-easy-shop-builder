import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET for health check
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ 
        message: 'Tinkoff Payment API',
        status: 'active',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  // Only POST requests allowed
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    console.log("🚀 Tinkoff Payment Function Started");

    // Parse request body
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log("📥 Raw request body:", bodyText);
      requestBody = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { amount, orderId, customerData, action = 'init', paymentId } = requestBody;

    console.log("📋 Request data:", {
      action,
      amount,
      orderId,
      hasCustomerData: !!customerData,
      paymentId
    });

    // Get environment variables
    const terminalKey = Deno.env.get('TINKOFF_TERMINAL_KEY');
    const password = Deno.env.get('TINKOFF_PASSWORD');

    console.log("🔑 Environment check:", {
      hasTerminalKey: !!terminalKey,
      hasPassword: !!password,
      terminalKeyLength: terminalKey?.length || 0,
      passwordLength: password?.length || 0,
      terminalKeyFormat: terminalKey?.substring(0, 10) + "...",
    });

    if (!terminalKey || !password) {
      console.error("❌ Missing Tinkoff credentials");
      return new Response(
        JSON.stringify({ 
          error: 'Tinkoff credentials not configured',
          details: `terminalKey: ${terminalKey ? 'OK' : 'MISSING'}, password: ${password ? 'OK' : 'MISSING'}`
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Trim credentials to remove any whitespace
    const cleanTerminalKey = terminalKey.trim();
    const cleanPassword = password.trim();
    
    console.log("🧹 Cleaned credentials:", {
      originalTerminalKeyLength: terminalKey.length,
      cleanedTerminalKeyLength: cleanTerminalKey.length,
      originalPasswordLength: password.length,
      cleanedPasswordLength: cleanPassword.length
    });

    // Token generation function
    const generateToken = async (params: Record<string, any>): Promise<string> => {
      const tokenParams: Record<string, string | number> = {};
      
      // Add parameters excluding Receipt and URLs
      Object.keys(params).forEach(key => {
        if (!['Receipt', 'NotificationURL', 'SuccessURL', 'FailURL', 'Token'].includes(key)) {
          tokenParams[key] = params[key];
        }
      });
      
      tokenParams.Password = cleanPassword;
      
      const sortedKeys = Object.keys(tokenParams).sort();
      const tokenString = sortedKeys.map(key => String(tokenParams[key])).join('');
      
      console.log("🔐 Token generation:", {
        sortedKeys,
        tokenString: tokenString.substring(0, 50) + "..."
      });
      
      const encoder = new TextEncoder();
      const data = encoder.encode(tokenString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log("✅ Generated token:", token.substring(0, 10) + "...");
      return token;
    };

    if (action === 'init') {
      if (!amount || !orderId || !customerData) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            required: ['amount', 'orderId', 'customerData']
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const tinkoffOrderId = `${orderId.substring(0, 30)}_${Date.now()}`.substring(0, 50);
      
      const baseParams = {
        TerminalKey: cleanTerminalKey,
        Amount: Math.round(amount * 100),
        OrderId: tinkoffOrderId,
        Description: `Заказ ${orderId} - СветДом`,
        CustomerKey: customerData.email || 'guest',
      };

      console.log("📊 Base params for token generation:", {
        TerminalKey: cleanTerminalKey.substring(0, 10) + "...",
        Amount: baseParams.Amount,
        OrderId: baseParams.OrderId,
        Description: baseParams.Description,
        CustomerKey: baseParams.CustomerKey
      });

      const token = await generateToken(baseParams);

      const paymentData = {
        ...baseParams,
        Token: token,
        Receipt: {
          Email: customerData.email,
          Phone: customerData.phone,
          Taxation: "usn_income",
          Items: [
            {
              Name: `Заказ ${orderId}`,
              Price: Math.round(amount * 100),
              Quantity: 1,
              Amount: Math.round(amount * 100),
              Tax: "none"
            }
          ]
        }
      };

      console.log("💳 Creating Tinkoff payment...");

      const response = await fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      console.log("📥 Tinkoff response:", { success: result.Success, hasPaymentURL: !!result.PaymentURL });

      if (result.Success === true && result.PaymentURL) {
        return new Response(
          JSON.stringify({
            success: true,
            paymentUrl: result.PaymentURL,
            paymentId: result.PaymentId,
            status: result.Status
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        console.error("❌ Tinkoff error:", result);
        return new Response(
          JSON.stringify({ 
            error: 'Payment initialization failed',
            details: result.Message || result.Details || 'Unknown error'
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

    } else if (action === 'cancel') {
      if (!paymentId) {
        return new Response(
          JSON.stringify({ error: 'PaymentId required for cancellation' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const baseParams = {
        TerminalKey: cleanTerminalKey,
        PaymentId: paymentId
      };

      const token = await generateToken(baseParams);
      const cancelData = { ...baseParams, Token: token };

      console.log("🔄 Cancelling Tinkoff payment:", paymentId);

      const response = await fetch('https://securepay.tinkoff.ru/v2/Cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelData)
      });

      const result = await response.json();
      console.log("📥 Cancel response:", { success: result.Success });

      if (result.Success === true) {
        return new Response(
          JSON.stringify({
            success: true,
            status: result.Status,
            paymentId: result.PaymentId
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        console.error("❌ Cancel error:", result);
        return new Response(
          JSON.stringify({ 
            error: 'Payment cancellation failed',
            details: result.Message || result.Details || 'Unknown error'
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown action: ${action}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error("💥 Critical error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});