import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, QrCode, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalPrice, 
    totalItems
  } = useCart();
  
  const [showPayment, setShowPayment] = useState(false);

  const handlePaymentComplete = () => {
    setShowPayment(false);
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в каталог
            </Link>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
              <p className="text-muted-foreground mb-6">
                Добавьте товары для оформления заказа
              </p>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link to="/">Перейти в каталог</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в каталог
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Корзина ({totalItems})</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Товары в корзине</CardTitle>
              </CardHeader>
              
              <CardContent>
                {/* Заголовки таблицы - только для больших экранов */}
                <div className="hidden md:grid md:grid-cols-6 gap-4 mb-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                  <div className="col-span-2">Товар</div>
                  <div className="text-center">Цена</div>
                  <div className="text-center">Количество</div>
                  <div className="text-center">Сумма</div>
                  <div className="text-center">Действие</div>
                </div>

                {/* Список товаров */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-secondary/10 rounded-lg">
                      {/* Товар */}
                      <div className="md:col-span-2 flex items-center gap-4">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.product.power}, {item.product.lightColor}</p>
                        </div>
                      </div>

                      {/* Цена */}
                      <div className="flex items-center justify-center">
                        <span className="font-medium">{item.product.price} ₽</span>
                      </div>

                      {/* Количество */}
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Общая сумма */}
                      <div className="flex items-center justify-center">
                        <span className="font-bold">{item.product.price * item.quantity} ₽</span>
                      </div>

                      {/* Действие */}
                      <div className="flex items-center justify-center">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeItem(item.product.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Итоговая сумма и кнопки */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Итого:</span>
                    <span>{totalPrice} ₽</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                      size="lg"
                      onClick={() => setShowPayment(true)}
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      Оплатить по СБП
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={clearCart}
                      className="sm:w-auto"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Очистить корзину
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Диалог оплаты */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Оплата по СБП</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-muted p-8 rounded-lg">
              <img 
                src="/images/sbp_qr_stub.png" 
                alt="QR-код СБП" 
                className="w-32 h-32 mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
              <div className="hidden">
                <QrCode className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">QR-код СБП</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Сумма к оплате: {totalPrice} ₽</p>
              <p className="text-sm text-muted-foreground mt-2">
                Наведите камеру телефона на QR-код или откройте приложение банка
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Комиссия 0% • Мгновенное зачисление
            </Badge>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePaymentComplete}
            >
              Оплата произведена
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPage;