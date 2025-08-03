import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Product data - keeping in sync with frontend
const products = [
  {
    id: 1,
    name: "LED лампа E27 9W",
    power: "9W",
    lightColor: "Теплый белый",
    price: 350,
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=300",
    category: "led",
    compatibleWith: [2, 3],
    description: "Энергосберегающая LED лампа с цоколем E27"
  },
  {
    id: 2,
    name: "LED лампа E14 6W",
    power: "6W",
    lightColor: "Холодный белый",
    price: 280,
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=300",
    category: "led",
    compatibleWith: [1, 3],
    description: "Компактная LED лампа для небольших светильников"
  },
  {
    id: 3,
    name: "LED лампа GU10 5W",
    power: "5W",
    lightColor: "Дневной белый",
    price: 320,
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=300",
    category: "led",
    compatibleWith: [1, 2],
    description: "Точечная LED лампа для встраиваемых светильников"
  },
  {
    id: 4,
    name: "Аварийная лампа 12W",
    power: "12W",
    lightColor: "Теплый белый",
    price: 890,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300",
    category: "emergency",
    description: "Аварийная лампа с автономным питанием"
  },
  {
    id: 5,
    name: "Декоративная лампа Edison",
    power: "40W",
    lightColor: "Теплый белый",
    price: 450,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=300",
    category: "decorative",
    description: "Винтажная декоративная лампа в стиле Edison"
  },
  {
    id: 6,
    name: "Умная лампа RGB",
    power: "10W",
    lightColor: "RGB",
    price: 1200,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300",
    category: "decorative",
    description: "Умная лампа с RGB подсветкой и управлением через приложение"
  }
];

const readySets = [
  {
    id: 1,
    name: "Стартовый набор для квартиры",
    price: 2500,
    product_ids: [1, 2, 3],
    description: "Базовый набор LED ламп для освещения квартиры"
  },
  {
    id: 2,
    name: "Комплект для офиса",
    price: 4200,
    product_ids: [2, 3, 4],
    description: "Профессиональное освещение для рабочих помещений"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Build context about products for the AI
    const productContext = `
Вы - AI консультант интернет-магазина LED ламп. У вас есть доступ к каталогу товаров:

ТОВАРЫ:
${products.map(p => 
  `ID: ${p.id}, Название: ${p.name}, Мощность: ${p.power}, Цвет: ${p.lightColor}, Цена: ${p.price}₽, Категория: ${p.category}, Описание: ${p.description}${p.compatibleWith ? `, Совместим с ID: ${p.compatibleWith.join(', ')}` : ''}`
).join('\n')}

ГОТОВЫЕ НАБОРЫ:
${readySets.map(s => 
  `ID: ${s.id}, Название: ${s.name}, Цена: ${s.price}₽, Товары: ${s.product_ids.join(', ')}, Описание: ${s.description}`
).join('\n')}

ВАШИ ВОЗМОЖНОСТИ:
1. Рекомендовать конкретные товары по ID
2. Предлагать готовые наборы
3. Учитывать совместимость товаров
4. Помогать с выбором по мощности, типу света, цене
5. Предлагать альтернативы в рамках бюджета

ИНСТРУКЦИИ:
- Всегда отвечайте на русском языке
- Будьте дружелюбны и профессиональны
- При рекомендации товара ОБЯЗАТЕЛЬНО указывайте его ID
- Предлагайте конкретные решения, а не общие советы
- Если клиент упоминает бюджет, подберите товары в его рамках
- Объясняйте преимущества рекомендуемых товаров
- При необходимости предлагайте готовые наборы как выгодную альтернативу

Формат ответа: Обычный текст с упоминанием ID товаров в формате "товар ID:X" для возможности добавления в корзину.
`;

    const messages = [
      {
        role: 'system',
        content: productContext
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Extract product IDs mentioned in response for easy cart integration
    const productIdRegex = /(?:товар\s+)?ID:(\d+)/gi;
    const mentionedProductIds = [];
    let match;
    while ((match = productIdRegex.exec(aiResponse)) !== null) {
      mentionedProductIds.push(parseInt(match[1]));
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      mentionedProducts: mentionedProductIds,
      products: products.filter(p => mentionedProductIds.includes(p.id))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-consultant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Извините, произошла ошибка. Попробуйте еще раз.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
