
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
      const terminalKey = "1751034706837DEMO";
      const password = "5slp&Zf6ZHWd9dC"; // Правильный пароль для демо терминала
      
      // Создаем уникальный OrderId для каждого платежа (максимум 50 символов)
      const tinkoffOrderId = `${orderId.substring(0, 30)}_${Date.now()}`.substring(0, 50);
      
      // Функция для вычисления токена согласно документации Тинькофф
      const generateToken = async (params: Record<string, any>, password: string) => {
        // Создаем объект со всеми параметрами кроме Receipt и других исключаемых
        const tokenParams: Record<string, any> = {};
        
        // Добавляем только нужные параметры для токена
        Object.keys(params).forEach(key => {
          if (!['Receipt', 'NotificationURL', 'SuccessURL', 'FailURL'].includes(key)) {
            tokenParams[key] = params[key];
          }
        });
        
        // Добавляем пароль
        tokenParams.Password = password;
        
        // Сортируем по ключам и создаем строку
        const sortedKeys = Object.keys(tokenParams).sort();
        const tokenString = sortedKeys.map(key => String(tokenParams[key])).join('');
        
        console.log("Строка для токена:", tokenString);
        
        // Вычисляем SHA-256
        const msgBuffer = new TextEncoder().encode(tokenString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log("Сгенерированный токен:", hashHex);
        return hashHex;
      };

      const baseParams = {
        TerminalKey: terminalKey,
        Amount: amount * 100, // Сумма в копейках
        OrderId: tinkoffOrderId,
        Description: `Оплата заказа ${orderId} - СветДом`,
        CustomerKey: customerData.email,
      };

      // Генерируем токен
      const token = await generateToken(baseParams, password);

      const paymentData = {
        ...baseParams,
        Token: token,
        NotificationURL: `${window.location.origin}/api/tinkoff-notification`,
        SuccessURL: `${window.location.origin}/?payment=success`,
        FailURL: `${window.location.origin}/?payment=fail`,
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

      console.log("Данные для отправки в Тинькофф:", paymentData);

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
        
        // Перенаправляем пользователя на страницу оплаты
        window.location.href = result.PaymentURL;
        
        toast({
          title: "Переход к оплате",
          description: "Перенаправляем вас на страницу оплаты Тинькофф...",
        });
        
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
