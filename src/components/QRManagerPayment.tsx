import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QRManagerPaymentProps {
  amount: number;
  orderId: string;
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    comment?: string;
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
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);

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

      if (data.success && data.qr_img) {
        // Показываем QR код в диалоге
        setQrImage(data.qr_img);
        setShowQRDialog(true);
        
        toast.success("QR код для оплаты создан");
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

  const handleQRDialogClose = () => {
    setShowQRDialog(false);
    setQrImage(null);
  };

  return (
    <>
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
        {loading ? "Создание QR кода..." : "Оплатить через СБП"}
      </Button>

      <Dialog open={showQRDialog} onOpenChange={handleQRDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Оплата через СБП</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            {qrImage && (
              <div className="bg-white p-4 rounded-lg border">
                <img 
                  src={qrImage} 
                  alt="QR код для оплаты" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            )}
            <div className="text-center space-y-2">
              <p className="font-semibold">Сумма к оплате: {amount} ₽</p>
              <p className="text-sm text-muted-foreground">
                Отсканируйте QR код в приложении банка для оплаты через СБП
              </p>
              <p className="text-xs text-muted-foreground">
                После оплаты страница автоматически обновится
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRManagerPayment;