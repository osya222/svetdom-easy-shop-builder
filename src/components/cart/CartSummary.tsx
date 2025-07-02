
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Trash2 } from "lucide-react";
import { CartItem } from "@/types/product";

interface CartSummaryProps {
  items: CartItem[];
  totalPrice: number;
  isFormValid: boolean;
  onShowPayment: () => void;
  onClearCart: () => void;
}

const CartSummary = ({ items, totalPrice, isFormValid, onShowPayment, onClearCart }: CartSummaryProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Итоги заказа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
              <span className="font-medium">{item.product.price * item.quantity} ₽</span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Общая сумма:</span>
          <span>{totalPrice} ₽</span>
        </div>

        {totalPrice >= 2000 ? (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
            <p className="text-sm font-medium text-green-800">
              🎉 Бесплатная доставка включена!
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
            <p className="text-sm font-medium text-blue-800">
              Бесплатная доставка от 2000 ₽
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Добавьте ещё {2000 - totalPrice} ₽ для бесплатной доставки
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            size="lg"
            onClick={onShowPayment}
            disabled={!isFormValid}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Оплатить
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={onClearCart}
            className="w-full"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Очистить корзину
          </Button>
        </div>

        {!isFormValid && (
          <p className="text-sm text-muted-foreground text-center">
            Заполните все обязательные поля для оформления заказа
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
