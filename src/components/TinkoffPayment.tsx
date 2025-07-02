
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";

interface TinkoffPaymentProps {
  amount: number;
  orderId: string;
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

const TinkoffPayment = ({ 
  amount, 
  orderId, 
  customerData, 
  onSuccess, 
  onError 
}: TinkoffPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const initPayment = async () => {
    setIsProcessing(true);
    
    try {
      console.log("=== ИНИЦИАЛИЗАЦИЯ ОПЛАТЫ ТИНЬКОФФ ===");
      console.log("Сумма:", amount);
      console.log("ID заказа:", orderId);
      console.log("Данные клиента:", customerData);

      // Параметры для Тинькофф API
      const terminalKey = "1751034706876";
      const password = "^uJsdGqXM2^^*Bs4";
      
      // Создаем уникальный OrderId для каждого платежа (максимум 50 символов)
      const tinkoffOrderId = `${orderId.substring(0, 30)}_${Date.now()}`.substring(0, 50);
      
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

      // Полные данные для отправки
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
        
        // Перенаправляем пользователя на страницу оплаты в новой вкладке
        window.open(result.PaymentURL, '_blank');
        
        toast({
          title: "Переход к оплате",
          description: "Открываем страницу оплаты Тинькофф в новой вкладке...",
        });
        
        // Вызываем onSuccess для закрытия диалога
        onSuccess();
        
      } else {
        console.error("❌ Ошибка инициализации платежа:", result);
        throw new Error(result.Message || result.Details || "Ошибка инициализации платежа");
      }

    } catch (error) {
      console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при инициализации оплаты:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      
      onError(errorMessage);
      
      toast({
        title: "Ошибка оплаты",
        description: `Не удалось инициализировать оплату: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={initPayment}
      disabled={isProcessing}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
      size="lg"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Обработка...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5 mr-2" />
          Оплатить картой
        </>
      )}
    </Button>
  );
};

export default TinkoffPayment;
