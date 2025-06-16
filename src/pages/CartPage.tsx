import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, QrCode, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalPrice, 
    totalItems
  } = useCart();
  const { toast } = useToast();
  
  const [showPayment, setShowPayment] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    comment: ''
  });

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = customerData.firstName && customerData.lastName && customerData.phone && customerData.email;

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
        <Footer />
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

          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Левая колонка - Товары и форма клиента */}
              <div className="space-y-6">
                {/* Товары в заказе */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ваш заказ ({totalItems} товара)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4 p-3 bg-secondary/10 rounded-lg">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.product.power}, {item.product.lightColor}</p>
                            <p className="text-sm font-medium mt-1">
                              {item.quantity} × {item.product.price} ₽ = {item.product.price * item.quantity} ₽
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => removeItem(item.product.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive ml-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Форма клиента */}
                <Card>
                  <CardHeader>
                    <CardTitle>Данные покупателя</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя *</Label>
                        <Input
                          id="firstName"
                          value={customerData.firstName}
                          onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                          placeholder="Введите имя"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия *</Label>
                        <Input
                          id="lastName"
                          value={customerData.lastName}
                          onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                          placeholder="Введите фамилию"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerData.phone}
                          onChange={(e) => handleCustomerChange('phone', e.target.value)}
                          placeholder="+7 (999) 999-99-99"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerData.email}
                          onChange={(e) => handleCustomerChange('email', e.target.value)}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="comment">Комментарий к заказу</Label>
                        <Textarea
                          id="comment"
                          value={customerData.comment}
                          onChange={(e) => handleCustomerChange('comment', e.target.value)}
                          placeholder="Оставьте комментарий (например: пожелания по упаковке, доставка, другое)"
                          className="min-h-[100px] resize-none md:resize-y"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Правая колонка - Итоги заказа */}
              <div>
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
                        onClick={() => setShowPayment(true)}
                        disabled={!isFormValid}
                      >
                        <QrCode className="h-5 w-5 mr-2" />
                        Оплатить по СБП
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={clearCart}
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
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Диалог оплаты */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Оплата по СБП</DialogTitle>
            <DialogDescription>
              Быстрая и безопасная оплата через Систему быстрых платежей
            </DialogDescription>
          </DialogHeader>
          
          {!orderSent ? (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Прокручиваемое содержимое */}
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

                {/* QR-код СБП */}
                <div className="text-center space-y-4">
                  <div className="bg-muted p-6 rounded-lg">
                    <img 
                      src="/images/sbp_qr_stub.png" 
                      alt="QR-код СБП" 
                      className="w-24 h-24 mx-auto mb-2"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'block';
                      }}
                    />
                    <div className="hidden">
                      <QrCode className="h-24 w-24 mx-auto mb-2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">QR-код СБП</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Комиссия 0% • Мгновенное зачисление
                  </Badge>
                  
                  <div className="text-center">
                    <p className="text-lg font-semibold">Сумма к оплате: {totalPrice} ₽</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Наведите камеру на QR-код или откройте приложение банка
                    </p>
                  </div>
                </div>

                {/* Чекбокс согласия */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
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

              {/* Фиксированная кнопка снизу */}
              <div className="mt-4 pt-4 border-t">
                <form 
                  action="https://formsubmit.co/pavel220585gpt@gmail.com" 
                  method="POST"
                  onSubmit={() => {
                    setOrderSent(true);
                    setTimeout(() => {
                      setShowPayment(false);
                      setOrderSent(false);
                      clearCart();
                      setCustomerData({
                        firstName: '',
                        lastName: '',
                        phone: '',
                        email: '',
                        comment: ''
                      });
                      toast({
                        title: "Спасибо! Заявка отправлена",
                        description: "Мы свяжемся с вами в ближайшее время",
                      });
                    }, 2000);
                  }}
                >
                  {/* Скрытые поля настройки FormSubmit */}
                  <input type="hidden" name="_subject" value="Новая заявка с сайта СветДом" />
                  <input type="hidden" name="_captcha" value="false" />
                  
                  {/* Скрытые поля с данными заказа */}
                  <input type="hidden" name="Имя" value={`${customerData.firstName} ${customerData.lastName}`} />
                  <input type="hidden" name="Телефон" value={customerData.phone} />
                  <input type="hidden" name="Email" value={customerData.email} />
                  <input type="hidden" name="Комментарий" value={customerData.comment} />
                  <input type="hidden" name="Способ оплаты" value="Онлайн по СБП" />
                  <input type="hidden" name="Сумма заказа" value={`${totalPrice} ₽`} />
                  <input type="hidden" name="Товары" value={items.map(item => 
                    `${item.product.name} × ${item.quantity} = ${item.product.price * item.quantity} ₽`
                  ).join('; ')} />
                  
                  <Button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!acceptTerms}
                    size="lg"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Оплатить через СБП
                  </Button>
                  
                  {!acceptTerms && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Примите условия для продолжения
                    </p>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Спасибо!</h3>
                <p className="text-muted-foreground">
                  Ваш заказ принят. Ожидаем оплату через СБП.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPage;