import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";

interface YookassaPaymentProps {
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

const YookassaPayment = ({ 
  amount, 
  orderId, 
  customerData, 
  onSuccess, 
  onError 
}: YookassaPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const initPayment = async () => {
    setIsProcessing(true);
    
    try {
      console.log("=== ИНИЦИАЛИЗАЦИЯ ОПЛАТЫ ЮКАССА ===");
      console.log("Сумма:", amount);
      console.log("ID заказа:", orderId);
      console.log("Данные клиента:", customerData);

      // API ключ ЮКассы
      const shopId = "live_SNIlr1WeN16M5mNJoK-s51uI2NdClNA6GuYu6X2hxxc";
      
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
          return_url: window.location.href
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
      const authHeader = btoa(`${shopId}:`);

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

      if (result.status && ['pending', 'waiting_for_capture'].includes(result.status)) {
        console.log("✅ Платеж успешно создан");
        
        // Проверяем наличие URL для перенаправления
        if (result.confirmation && result.confirmation.confirmation_url) {
          console.log("URL для оплаты:", result.confirmation.confirmation_url);
          
          // Перенаправляем пользователя на страницу оплаты в новой вкладке
          window.open(result.confirmation.confirmation_url, '_blank');
          
          toast({
            title: "Переход к оплате",
            description: "Открываем страницу оплаты ЮКассы в новой вкладке...",
          });
          
          // Вызываем onSuccess для закрытия диалога
          onSuccess();
          
        } else {
          console.error("❌ URL для оплаты не найден в ответе:", result);
          throw new Error("URL для оплаты не получен от ЮКассы");
        }
        
      } else {
        console.error("❌ Неожиданный статус платежа:", result.status);
        throw new Error(`Неожиданный статус платежа: ${result.status || 'неизвестен'}`);
      }

    } catch (error) {
      console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при создании платежа ЮКасса:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      
      onError(errorMessage);
      
      toast({
        title: "Ошибка оплаты",
        description: `Не удалось создать платеж ЮКасса: ${errorMessage}`,
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
      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
          ЮКасса
        </>
      )}
    </Button>
  );
};

export default YookassaPayment;