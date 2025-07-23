import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PaymasterPaymentProps {
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

const PaymasterPayment = ({ 
  amount, 
  orderId, 
  customerData, 
  onSuccess, 
  onError 
}: PaymasterPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const initPayment = async () => {
    setIsProcessing(true);
    
    try {
      console.log("=== ИНИЦИАЛИЗАЦИЯ ОПЛАТЫ PAYMASTER ===");
      console.log("Сумма:", amount);
      console.log("ID заказа:", orderId);
      console.log("Данные клиента:", customerData);

      // Вызываем серверную функцию для создания платежа
      const { data, error } = await supabase.functions.invoke('paymaster-payment', {
        body: {
          action: 'init',
          amount,
          orderId,
          customerData
        }
      });

      if (error) {
        console.error("❌ Ошибка при вызове функции:", error);
        throw new Error(error.message || "Ошибка при создании платежа");
      }

      console.log("Ответ от Paymaster через сервер:", data);

      if (data.success && data.paymentUrl) {
        console.log("✅ Платеж успешно создан");
        console.log("URL для оплаты:", data.paymentUrl);
        console.log("PaymentId:", data.paymentId);
        
        // Сохраняем PaymentId для возможного возврата
        (window as any).lastPaymasterPaymentId = data.paymentId;
        
        // Перенаправляем пользователя на страницу оплаты в новой вкладке
        window.open(data.paymentUrl, '_blank');
        
        toast({
          title: "Переход к оплате",
          description: "Открываем страницу оплаты Paymaster в новой вкладке...",
        });
        
        // Вызываем onSuccess для закрытия диалога
        onSuccess();
        
      } else {
        console.error("❌ Неожиданный ответ от сервера:", data);
        throw new Error("Не получен URL для оплаты от Paymaster");
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
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
          Paymaster
        </>
      )}
    </Button>
  );
};

export default PaymasterPayment;