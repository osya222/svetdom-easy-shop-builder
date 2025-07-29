import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QRManagerPaymentProps {
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

const QRManagerPayment = ({
  amount,
  orderId,
  customerData,
  onSuccess,
  onError
}: QRManagerPaymentProps) => {
  const [loading, setLoading] = useState(false);

  const initPayment = async () => {
    try {
      setLoading(true);
      console.log("🚀 Инициализация платежа QR Manager:", {
        amount,
        orderId,
        customerData
      });

      const { data, error } = await supabase.functions.invoke('qr-manager-payment', {
        body: {
          action: 'init',
          amount,
          orderId,
          customerData
        }
      });

      if (error) {
        console.error("❌ Ошибка при создании платежа QR Manager:", error);
        onError(error.message || "Ошибка при создании платежа");
        return;
      }

      console.log("✅ Ответ от QR Manager:", data);

      if (data.success && data.qrData) {
        // Сохраняем ID платежа для webhook
        (window as any).currentQRManagerPaymentId = data.paymentId;
        
        // Показываем QR код или редиректим на страницу оплаты
        if (data.paymentUrl) {
          // Открываем страницу оплаты в новой вкладке
          window.open(data.paymentUrl, '_blank');
        }
        
        toast.success("QR код для оплаты создан");
        onSuccess();
      } else {
        console.error("❌ Неудачный ответ от QR Manager:", data);
        onError(data.error || "Не удалось создать платеж");
      }
    } catch (error: any) {
      console.error("❌ Исключение при создании платежа QR Manager:", error);
      onError(error.message || "Ошибка при обращении к сервису");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={initPayment}
      disabled={loading}
      className="w-full"
      variant="outline"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <QrCode className="mr-2 h-4 w-4" />
      )}
      {loading ? "Создание QR кода..." : "Оплатить через QR Manager"}
    </Button>
  );
};

export default QRManagerPayment;