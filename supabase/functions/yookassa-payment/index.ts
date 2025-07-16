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
        message: 'YooKassa Payment API',
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
    console.log("🚀 YooKassa Payment Function Started");

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

    const { amount, orderId, customerData } = requestBody;

    console.log("📋 Request data:", {
      amount,
      orderId,
      hasCustomerData: !!customerData
    });

    // Validate required fields
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

    // Get environment variables
    const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const apiKey = Deno.env.get('YOOKASSA_API_KEY');

    console.log("🔑 Environment check:", {
      hasShopId: !!shopId,
      hasApiKey: !!apiKey
    });

    if (!shopId || !apiKey) {
      console.error("❌ Missing YooKassa credentials");
      return new Response(
        JSON.stringify({ 
          error: 'YooKassa credentials not configured',
          details: `shopId: ${shopId ? 'OK' : 'MISSING'}, apiKey: ${apiKey ? 'OK' : 'MISSING'}`
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create unique payment ID
    const paymentId = `${orderId}_${Date.now()}_YK`;
    
    // Clean phone number for YooKassa format (remove spaces, brackets, dashes)
    const cleanPhone = (phone: string) => {
      return phone.replace(/[\s\(\)\-]/g, '');
    };
    
    const cleanedPhone = cleanPhone(customerData.phone);
    
    // Prepare payment data
    const paymentData = {
      amount: {
        value: Number(amount).toFixed(2),
        currency: "RUB"
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: req.headers.get('referer') || 'https://c606826b-0d64-4a30-876d-0bbd1379bf6f.lovableproject.com'
      },
      description: `Заказ ${orderId} - СветДом`,
      metadata: {
        order_id: orderId,
        customer_email: customerData.email,
        customer_phone: cleanedPhone
      },
      receipt: {
        customer: {
          full_name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: cleanedPhone
        },
        items: [
          {
            description: `Заказ ${orderId}`,
            quantity: "1.00",
            amount: {
              value: Number(amount).toFixed(2),
              currency: "RUB"
            },
            vat_code: 1,
            payment_mode: "full_payment",
            payment_subject: "commodity"
          }
        ]
      }
    };

    console.log("💳 Creating YooKassa payment with amount:", amount);

    // Create Basic Auth header
    const authHeader = btoa(`${shopId}:${apiKey}`);

    // Generate Idempotence-Key for safety
    const idempotenceKey = `${paymentId}_${Math.random().toString(36).substr(2, 9)}`;

    console.log("📤 Sending request to YooKassa...");

    // Send request to create payment
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
        'Idempotence-Key': idempotenceKey
      },
      body: JSON.stringify(paymentData)
    });

    console.log("📥 YooKassa response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ YooKassa HTTP error:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `YooKassa returned error ${response.status}`,
          details: errorText
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await response.json();
    console.log("✅ YooKassa success:", { 
      id: result.id, 
      status: result.status, 
      hasConfirmation: !!result.confirmation?.confirmation_url 
    });

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

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