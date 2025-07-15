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
        message: 'Tinkoff Payment API',
        status: 'active',
        methods: ['POST'],
        actions: ['init', 'cancel']
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
    console.log("=== TINKOFF PAYMENT FUNCTION STARTED ===");
    
    const requestBody = await req.json();
    const { amount, orderId, customerData, action = 'init', paymentId } = requestBody;

    console.log("Входные данные:");
    console.log("- Действие:", action);
    console.log("- Сумма:", amount);
    console.log("- ID заказа:", orderId);
    console.log("- Данные клиента:", customerData);

    // Получаем секретные ключи из переменных окружения
    const terminalKey = Deno.env.get('TINKOFF_TERMINAL_KEY');
    const password = Deno.env.get('TINKOFF_PASSWORD');

    console.log("Проверка секретов:");
    console.log("- TINKOFF_TERMINAL_KEY:", terminalKey ? "✅ установлен" : "❌ НЕ установлен");
    console.log("- TINKOFF_PASSWORD:", password ? "✅ установлен" : "❌ НЕ установлен");

    if (!terminalKey || !password) {
      const errorMsg = 'Не настроены ключи Тинькофф в Supabase secrets';
      console.error("❌ ОШИБКА:", errorMsg);
      return new Response(
        JSON.stringify({ 
          error: errorMsg,
          details: `terminalKey: ${terminalKey ? 'OK' : 'MISSING'}, password: ${password ? 'OK' : 'MISSING'}`
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

    // Функция для вычисления токена согласно официальной документации Тинькофф
    const generateToken = async (params: Record<string, any>) => {
      // Создаем объект для токена, исключая определенные поля
      const tokenParams: Record<string, string | number> = {};
      
      // Добавляем параметры в правильном порядке согласно документации
      Object.keys(params).forEach(key => {
        // Исключаем поля, которые не участвуют в подписи
        if (!['Receipt', 'NotificationURL', 'SuccessURL', 'FailURL', 'Token'].includes(key)) {
          tokenParams[key] = params[key];
        }
      });
      
      // Добавляем пароль
      tokenParams.Password = password;
      
      // Сортируем ключи по алфавиту
      const sortedKeys = Object.keys(tokenParams).sort();
      
      // Создаем строку конкатенацией значений
      const tokenString = sortedKeys.map(key => String(tokenParams[key])).join('');
      
      console.log("Параметры для токена:", tokenParams);
      console.log("Отсортированные ключи:", sortedKeys);
      console.log("Строка для хеширования:", tokenString);
      
      // Вычисляем SHA-256 хеш
      const encoder = new TextEncoder();
      const data = encoder.encode(tokenString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log("Сгенерированный токен SHA-256:", hashHex);
      return hashHex;
    };

    if (action === 'init') {
      // Создаем уникальный OrderId для каждого платежа (максимум 50 символов)
      const tinkoffOrderId = `${orderId.substring(0, 30)}_${Date.now()}`.substring(0, 50);
      
      // Базовые параметры
      const baseParams = {
        TerminalKey: terminalKey,
        Amount: amount * 100, // Сумма в копейках
        OrderId: tinkoffOrderId,
        Description: `Оплата заказа ${orderId} - СветДом`,
        CustomerKey: customerData.email,
      };

      // Генерируем токен
      const token = await generateToken(baseParams);

      // Полные данные для отправки с чеком (Receipt)
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
              Price: amount * 100,
              Quantity: 1,
              Amount: amount * 100,
              Tax: "none"
            }
          ]
        }
      };

      console.log("Финальные данные для отправки:", paymentData);

      // Отправляем запрос на создание платежа
      const response = await fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      console.log("Ответ от Тинькофф:", result);

      if (result.Success === true && result.PaymentURL) {
        console.log("✅ Платеж успешно инициализирован");
        console.log("URL для оплаты:", result.PaymentURL);
        console.log("PaymentId:", result.PaymentId);
        
        return new Response(
          JSON.stringify({
            success: true,
            paymentUrl: result.PaymentURL,
            paymentId: result.PaymentId,
            status: result.Status
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
        
      } else {
        console.error("❌ Ошибка инициализации платежа:", result);
        throw new Error(result.Message || result.Details || "Ошибка инициализации платежа");
      }

    } else if (action === 'cancel') {
      // Возврат платежа
      
      if (!paymentId) {
        throw new Error("PaymentId обязателен для возврата");
      }

      console.log("Возврат платежа PaymentId:", paymentId);

      const baseParams = {
        TerminalKey: terminalKey,
        PaymentId: paymentId
      };

      const token = await generateToken(baseParams);
      
      const cancelData = {
        ...baseParams,
        Token: token
      };

      console.log("Данные для возврата:", cancelData);

      const response = await fetch('https://securepay.tinkoff.ru/v2/Cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancelData)
      });

      const result = await response.json();
      console.log("Ответ от Тинькофф на возврат:", result);

      if (result.Success === true) {
        console.log("✅ Возврат успешно выполнен");
        
        return new Response(
          JSON.stringify({
            success: true,
            status: result.Status,
            paymentId: result.PaymentId
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
        
      } else {
        console.error("❌ Ошибка возврата платежа:", result);
        throw new Error(result.Message || result.Details || "Ошибка возврата платежа");
      }
    } else {
      throw new Error(`Неизвестное действие: ${action}`);
    }

  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА в Tinkoff Edge Function:", error);
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