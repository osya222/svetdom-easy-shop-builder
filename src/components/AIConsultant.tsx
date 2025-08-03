import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Plus, Bot, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useReadySets } from '@/hooks/useReadySets';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  mentionedProducts?: Product[];
  timestamp: Date;
}

const AIConsultant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { products } = useProducts();
  const { readySets } = useReadySets();

  const quickQuestions = [
    "Помогите выбрать лампы для квартиры",
    "Какие лампы лучше для офиса?",
    "Нужны энергосберегающие варианты",
    "Покажите готовые наборы"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([{
        id: '1',
        content: 'Здравствуйте! Я ваш AI консультант по LED освещению. Помогу выбрать подходящие лампы для ваших задач. О чем хотели бы узнать?',
        isAI: true,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const buildProductContext = () => {
    const productContext = `
Каталог товаров LED ламп:

ТОВАРЫ:
${products.map(p => 
  `ID: ${p.id}, Название: ${p.name}, Мощность: ${p.power}, Цвет: ${p.lightColor}, Цена: ${p.price}₽, Категория: ${p.category}${p.description ? `, Описание: ${p.description}` : ''}`
).join('\n')}

ГОТОВЫЕ НАБОРЫ:
${readySets.map(s => 
  `ID: ${s.id}, Название: ${s.name}, Цена: ${s.price}₽, Товары: ${s.product_ids.join(', ')}, Описание: ${s.description}`
).join('\n')}

Рекомендации:
- Для дома: теплый свет 2700-3000K (6-10W)
- Для офиса: нейтральный/холодный свет 4000-6500K (9-15W)
- Аварийные лампы для безопасности
- Готовые наборы экономичнее отдельных покупок
`;
    return productContext;
  };

  const processAIResponse = (response: string, userMessage: string) => {
    const productContext = buildProductContext();
    
    // Simple rule-based responses for Russian LED consultation
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('офис') || lowerMessage.includes('работ')) {
      const officeProducts = products.filter(p => 
        p.lightColor.includes('Холодный') || p.lightColor.includes('Нейтральный')
      ).filter(p => parseInt(p.power) >= 9).slice(0, 3);
      
      return {
        response: `Для офиса рекомендую нейтральный или холодный свет мощностью 9-15W. Это обеспечит комфортную рабочую атмосферу:\n\n${officeProducts.map(p => `• ${p.name} (ID:${p.id}) - ${p.price}₽`).join('\n')}\n\nТакже обратите внимание на готовый "Комплект для офиса" за 2000₽.`,
        products: officeProducts
      };
    }
    
    if (lowerMessage.includes('квартир') || lowerMessage.includes('дом')) {
      const homeProducts = products.filter(p => 
        p.lightColor.includes('Теплый')
      ).slice(0, 3);
      
      return {
        response: `Для дома лучше всего подходит теплый свет, который создает уютную атмосферу:\n\n${homeProducts.map(p => `• ${p.name} (ID:${p.id}) - ${p.price}₽`).join('\n')}\n\nРекомендую "Стартовый набор для квартиры" за 1000₽ - отличное соотношение цена/качество.`,
        products: homeProducts
      };
    }
    
    if (lowerMessage.includes('энергосбере') || lowerMessage.includes('экономи')) {
      const energyProducts = products.filter(p => 
        parseInt(p.power) <= 8
      ).sort((a, b) => a.price - b.price).slice(0, 3);
      
      return {
        response: `Самые энергосберегающие варианты - лампы малой мощности:\n\n${energyProducts.map(p => `• ${p.name} (ID:${p.id}) - ${p.price}₽, всего ${p.power}`).join('\n')}\n\nЭти лампы потребляют минимум электричества при хорошем освещении.`,
        products: energyProducts
      };
    }
    
    if (lowerMessage.includes('набор') || lowerMessage.includes('комплект')) {
      return {
        response: `У нас есть готовые наборы по выгодным ценам:\n\n${readySets.map(s => `• ${s.name} - ${s.price}₽\n  ${s.description}`).join('\n\n')}\n\nГотовые наборы экономят до 30% от покупки ламп по отдельности!`,
        products: []
      };
    }

    if (lowerMessage.includes('цен') || lowerMessage.includes('дешев') || lowerMessage.includes('бюджет')) {
      const cheapProducts = products.sort((a, b) => a.price - b.price).slice(0, 4);
      
      return {
        response: `Самые доступные по цене варианты:\n\n${cheapProducts.map(p => `• ${p.name} (ID:${p.id}) - ${p.price}₽`).join('\n')}\n\nДля экономии рекомендую готовые наборы - они выгоднее на 20-30%.`,
        products: cheapProducts
      };
    }
    
    // Default response
    const randomProducts = products.slice(0, 3);
    return {
      response: `Популярные варианты LED ламп:\n\n${randomProducts.map(p => `• ${p.name} (ID:${p.id}) - ${p.price}₽, ${p.power}, ${p.lightColor} свет`).join('\n')}\n\nМогу помочь с выбором! Укажите, для какого помещения нужны лампы?`,
      products: randomProducts
    };
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use local processing instead of AI model for now
      const { response, products: mentionedProducts } = processAIResponse('', messageText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isAI: true,
        mentionedProducts,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Извините, произошла ошибка. Попробуйте переформулировать вопрос.',
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Товар добавлен",
      description: `${product.name} добавлен в корзину`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Консультант
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Быстрые вопросы:</p>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-2 text-xs"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isAI
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {message.isAI ? (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Product Cards */}
                  {message.mentionedProducts && message.mentionedProducts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.mentionedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-background rounded-lg p-3 border"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground truncate">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {product.power}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {product.lightColor}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-sm text-foreground">
                                  {product.price}₽
                                </span>
                                <Button
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  В корзину
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Задайте вопрос о товарах..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIConsultant;