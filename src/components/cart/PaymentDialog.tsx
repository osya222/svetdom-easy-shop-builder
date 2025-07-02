
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import TinkoffPayment from "@/components/TinkoffPayment";
import { CustomerData } from "./CustomerForm";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderSent: boolean;
  customerData: CustomerData;
  totalPrice: number;
  acceptTerms: boolean;
  onAcceptTermsChange: (checked: boolean) => void;
  onOrderSubmit: (e: React.FormEvent) => void;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentDialog = ({
  isOpen,
  onOpenChange,
  orderSent,
  customerData,
  totalPrice,
  acceptTerms,
  onAcceptTermsChange,
  onOrderSubmit,
  onPaymentSuccess,
  onPaymentError
}: PaymentDialogProps) => {
  const handleCheckboxChange = (checked: boolean | string) => {
    // Convert any truthy value to boolean, handle "indeterminate" as false
    const booleanValue = checked === true || checked === "true";
    onAcceptTermsChange(booleanValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Выберите способ оплаты</DialogTitle>
          <DialogDescription>
            Быстрая и безопасная оплата
          </DialogDescription>
        </DialogHeader>
        
        {!orderSent ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Резюме заказа */}
              <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Данные покупателя:</h4>
                <p className="text-sm">{customerData.firstName} {customerData.lastName}</p>
                <p className="text-sm">{customerData.phone}</p>
                <p className="text-sm">{customerData.email}</p>
                {customerData.comment && (
                  <p className="text-sm text-muted-foreground">Комментарий: {customerData.comment}</p>
                )}
              </div>

              {/* Сумма заказа */}
              <div className="text-center">
                <p className="text-lg font-semibold">Сумма к оплате: {totalPrice} ₽</p>
              </div>

              {/* Варианты оплаты */}
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Оплата банковской картой</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Безопасная оплата через Тинькофф
                  </p>
                  <TinkoffPayment
                    amount={totalPrice}
                    orderId={(window as any).currentOrderId || `ORDER_${Date.now()}`}
                    customerData={customerData}
                    onSuccess={onPaymentSuccess}
                    onError={onPaymentError}
                  />
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Оплата по СБП</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    QR-код для быстрых платежей
                  </p>
                  <Button 
                    onClick={onOrderSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!acceptTerms}
                    size="lg"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Оплатить через СБП
                  </Button>
                </div>
              </div>

              {/* Чекбокс согласия */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accept-terms"
                  checked={acceptTerms}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="accept-terms" className="text-sm cursor-pointer">
                  Я принимаю{" "}
                  <Link to="/agreement" className="text-primary hover:underline" target="_blank">
                    условия использования
                  </Link>
                  {" "}и{" "}
                  <Link to="/policy" className="text-primary hover:underline" target="_blank">
                    политику конфиденциальности
                  </Link>
                </Label>
              </div>
            </div>

            {!acceptTerms && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Примите условия для продолжения
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Спасибо!</h3>
              <p className="text-muted-foreground">
                Ваш заказ принят. Переходим к оплате.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
