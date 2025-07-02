import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, orderId, customerData } = await req.json();

    console.log("=== СОЗДАНИЕ ПЛАТЕЖА ЮКАССА ===");
    console.log("Сумма:", amount);
    console.log("ID заказа:", orderId);
    console.log("Данные клиента:", customerData);

    // Получаем секретные ключи из переменных окружения
    const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const apiKey = Deno.env.get('YOOKASSA_API_KEY');

    if (!shopId || !apiKey) {
      throw new Error('Не настроены ключи ЮКассы');
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
        return_url: req.headers.get('referer') || 'https://preview-svetdom-easy-shop-builder.lovable.app'
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

    console.log("Данные для отправки в ЮКассу:", paymentData);

    // Создаем Basic Auth заголовок
    const authHeader = btoa(`${shopId}:${apiKey}`);

    // Генерируем Idempotence-Key для безопасности
    const idempotenceKey = `${paymentId}_${Math.random().toString(36).substr(2, 9)}`;

    console.log("Idempotence-Key:", idempotenceKey);

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

    console.log("Статус ответа ЮКассы:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Ошибка HTTP от ЮКассы:", response.status, errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Ответ от ЮКассы:", result);

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
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при создании платежа ЮКасса:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Неизвестная ошибка',
        details: error.toString()
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