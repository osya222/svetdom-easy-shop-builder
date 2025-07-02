import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

      // Вызываем серверную функцию для создания платежа
      const { data, error } = await supabase.functions.invoke('yookassa-payment', {
        body: {
          amount,
          orderId,
          customerData
        }
      });

      if (error) {
        console.error("❌ Ошибка при вызове функции:", error);
        throw new Error(error.message || "Ошибка при создании платежа");
      }

      console.log("Ответ от ЮКассы через сервер:", data);

      if (data.status && ['pending', 'waiting_for_capture'].includes(data.status)) {
        console.log("✅ Платеж успешно создан");
        
        // Проверяем наличие URL для перенаправления
        if (data.confirmation && data.confirmation.confirmation_url) {
          console.log("URL для оплаты:", data.confirmation.confirmation_url);
          
          // Перенаправляем пользователя на страницу оплаты в новой вкладке
          window.open(data.confirmation.confirmation_url, '_blank');
          
          toast({
            title: "Переход к оплате",
            description: "Открываем страницу оплаты ЮКассы в новой вкладке...",
          });
          
          // Вызываем onSuccess для закрытия диалога
          onSuccess();
          
        } else {
          console.error("❌ URL для оплаты не найден в ответе:", data);
          throw new Error("URL для оплаты не получен от ЮКассы");
        }
        
      } else {
        console.error("❌ Неожиданный статус платежа:", data.status);
        throw new Error(`Неожиданный статус платежа: ${data.status || 'неизвестен'}`);
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