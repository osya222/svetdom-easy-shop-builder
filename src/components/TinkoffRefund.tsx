import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TinkoffRefund = () => {
  const [paymentId, setPaymentId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleRefund = async () => {
    if (!paymentId.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите PaymentId для возврата",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log("=== ВОЗВРАТ ПЛАТЕЖА ТИНЬКОФФ ===");
      console.log("PaymentId:", paymentId);

      // Вызываем серверную функцию для возврата платежа
      const { data, error } = await supabase.functions.invoke('tinkoff-payment', {
        body: {
          action: 'cancel',
          paymentId: paymentId.trim()
        }
      });

      if (error) {
        console.error("❌ Ошибка при вызове функции:", error);
        throw new Error(error.message || "Ошибка при возврате платежа");
      }

      console.log("Ответ от Тинькофф на возврат:", data);

      if (data.success) {
        console.log("✅ Возврат успешно выполнен");
        console.log("Статус:", data.status);
        
        toast({
          title: "Возврат выполнен",
          description: `Платеж ${data.paymentId} успешно возвращен. Статус: ${data.status}`,
        });
        
        setPaymentId("");
        
      } else {
        console.error("❌ Неожиданный ответ от сервера:", data);
        throw new Error("Ошибка при выполнении возврата");
      }

    } catch (error) {
      console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при возврате:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      
      toast({
        title: "Ошибка возврата",
        description: `Не удалось выполнить возврат: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const useLastPaymentId = () => {
    const lastPaymentId = (window as any).lastTinkoffPaymentId;
    if (lastPaymentId) {
      setPaymentId(lastPaymentId);
      toast({
        title: "PaymentId найден",
        description: "Использован последний PaymentId из сессии",
      });
    } else {
      toast({
        title: "PaymentId не найден",
        description: "Сначала создайте платеж",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Тестирование возврата Тинькофф</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">PaymentId для возврата:</label>
        <div className="flex gap-2">
          <Input
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Введите PaymentId"
            className="flex-1"
          />
          <Button 
            onClick={useLastPaymentId}
            variant="outline"
            size="sm"
          >
            Последний
          </Button>
        </div>
      </div>

      <Button 
        onClick={handleRefund}
        disabled={isProcessing || !paymentId.trim()}
        className="w-full"
        variant="destructive"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Выполняется возврат...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Вернуть платеж
          </>
        )}
      </Button>

      <div className="text-xs text-muted-foreground">
        <p><strong>Инструкция:</strong></p>
        <p>1. Сначала создайте платеж через Тинькофф</p>
        <p>2. Скопируйте PaymentId из консоли или используйте кнопку "Последний"</p>
        <p>3. Вставьте PaymentId и нажмите "Вернуть платеж"</p>
        <p>4. Проверьте в личном кабинете Тинькофф статус операции</p>
      </div>
    </div>
  );
};

export default TinkoffRefund;