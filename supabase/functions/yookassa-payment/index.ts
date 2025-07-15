import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ 
        message: 'YooKassa Payment API',
        status: 'active',
        methods: ['POST']
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ 
        error: 'Method not allowed',
        message: 'Только POST запросы поддерживаются'
      }),
      { 
        status: 405,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  try {
    console.log("=== YOOKASSA PAYMENT FUNCTION STARTED ===");
    
    const { amount, orderId, customerData } = await req.json();

    console.log("Входные данные:");
    console.log("- Сумма:", amount);
    console.log("- ID заказа:", orderId);
    console.log("- Данные клиента:", customerData);

    // Получаем секретные ключи из переменных окружения
    const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const apiKey = Deno.env.get('YOOKASSA_API_KEY');

    console.log("Проверка секретов:");
    console.log("- YOOKASSA_SHOP_ID:", shopId ? "✅ установлен" : "❌ НЕ установлен");
    console.log("- YOOKASSA_API_KEY:", apiKey ? "✅ установлен" : "❌ НЕ установлен");

    if (!shopId || !apiKey) {
      const errorMsg = 'Не настроены ключи ЮКассы в Supabase secrets';
      console.error("❌ ОШИБКА:", errorMsg);
      return new Response(
        JSON.stringify({ 
          error: errorMsg,
          details: `shopId: ${shopId ? 'OK' : 'MISSING'}, apiKey: ${apiKey ? 'OK' : 'MISSING'}`
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Создаем уникальный идентификатор платежа
    const paymentId = `${orderId}_${Date.now()}_YK`;
    
    // Подготавливаем данные для создания платежа
    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: "RUB"
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: req.headers.get('referer') || 'https://c606826b-0d64-4a30-876d-0bbd1379bf6f.lovableproject.com'
      },
      description: `Оплата заказа ${orderId} - СветДом`,
      metadata: {
        order_id: orderId,
        customer_email: customerData.email,
        customer_phone: customerData.phone
      },
      receipt: {
        customer: {
          full_name: `${customerData.firstName} ${customerData.lastName}`,
          email: customerData.email,
          phone: customerData.phone
        },
        items: [
          {
            description: `Заказ ${orderId}`,
            quantity: "1.00",
            amount: {
              value: amount.toFixed(2),
              currency: "RUB"
            },
            vat_code: 1,
            payment_mode: "full_payment",
            payment_subject: "commodity"
          }
        ]
      }
    };

    console.log("Данные для отправки в ЮКассу:", JSON.stringify(paymentData, null, 2));

    // Создаем Basic Auth заголовок
    const authHeader = btoa(`${shopId}:${apiKey}`);

    // Генерируем Idempotence-Key для безопасности
    const idempotenceKey = `${paymentId}_${Math.random().toString(36).substr(2, 9)}`;

    console.log("Отправляем запрос в ЮКассу...");
    console.log("- Idempotence-Key:", idempotenceKey);

    // Отправляем запрос на создание платежа
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
        'Idempotence-Key': idempotenceKey
      },
      body: JSON.stringify(paymentData)
    });

    console.log("Ответ от ЮКассы:");
    console.log("- Статус:", response.status);
    console.log("- Статус текст:", response.statusText);

    const responseText = await response.text();
    console.log("- Тело ответа:", responseText);

    if (!response.ok) {
      console.error("❌ Ошибка HTTP от ЮКассы:", response.status, responseText);
      return new Response(
        JSON.stringify({ 
          error: `ЮКасса вернула ошибку ${response.status}`,
          details: responseText
        }),
        { 
          status: response.status,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const result = JSON.parse(responseText);
    console.log("✅ Успешный ответ от ЮКассы:", JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА в Edge Function:", error);
    console.error("Стек ошибки:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});