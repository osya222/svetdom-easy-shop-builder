import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Package } from "lucide-react";
import { readySets, products } from "@/data/products";

const ReadySets = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [formStep, setFormStep] = useState(1); // 1 = форма, 2 = QR-код
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handlePayment = (set: any) => {
    setSelectedSet(set);
    setShowPayment(true);
  };

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = customerData.name.trim() && 
                     customerData.phone.trim() && 
                     customerData.email.trim() && 
                     isValidEmail(customerData.email);

  const handleContinue = () => {
    if (isFormValid) {
      setFormStep(2);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setShowPayment(open);
    if (!open) {
      // Сброс состояния при закрытии
      setFormStep(1);
      setCustomerData({
        name: '',
        phone: '',
        email: ''
      });
    }
  };

  const getSetProducts = (productIds: number[]) => {
    return productIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Готовые наборы
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Подобрали для вас готовые комплекты ламп на точные суммы — просто выберите и оплачивайте
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readySets.map((set) => {
            const setProducts = getSetProducts(set.products);
            
            return (
              <Card key={set.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Package className="h-8 w-8 text-primary" />
                    <Badge variant="default" className="text-lg font-bold">
                      {set.price} ₽
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{set.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{set.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Список товаров в наборе */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">В наборе:</h4>
                    {setProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-2 bg-secondary/30 rounded text-xs">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-muted-foreground">{product.power} • {product.lightColor}</p>
                        </div>
                        <span className="font-medium">{product.price} ₽</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Экономия */}
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-primary">
                      Точная сумма {set.price} ₽
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {setProducts.length} ламп в комплекте
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => handlePayment(set)}
                    className="w-full"
                    size="lg"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Оплатить весь набор по СБП
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Диалог оплаты набора */}
      <Dialog open={showPayment} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formStep === 1 ? "Оформление заказа" : "Оплата по СБП"}
            </DialogTitle>
            <DialogDescription>
              {formStep === 1 
                ? "Заполните данные для оформления заказа" 
                : "Отсканируйте QR-код для оплаты"
              }
            </DialogDescription>
          </DialogHeader>
          
          {formStep === 1 ? (
            // Форма заказа
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+()-\s]/g, '');
                    handleCustomerChange('phone', value);
                  }}
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
                {customerData.email && !isValidEmail(customerData.email) && (
                  <p className="text-sm text-destructive">Введите корректный email</p>
                )}
              </div>
              
              <Button 
                onClick={handleContinue}
                disabled={!isFormValid}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Продолжить
              </Button>
              
              {!isFormValid && (
                <p className="text-sm text-muted-foreground text-center">
                  Заполните все обязательные поля
                </p>
              )}
            </div>
          ) : (
            // QR-код и детали набора
            selectedSet && (
              <div className="space-y-4 text-center">
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
                
                <div className="space-y-2">
                  <h4 className="font-medium">{selectedSet.name}</h4>
                  <p className="text-lg font-semibold">Сумма к оплате: {selectedSet.price} ₽</p>
                  <p className="text-sm text-muted-foreground">{getSetProducts(selectedSet.products).length} ламп в комплекте</p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Наведите камеру телефона на QR-код или откройте приложение банка
                </p>
                
                <Badge variant="secondary" className="text-xs">
                  Комиссия 0% • Мгновенное зачисление
                </Badge>
                
                <Button 
                  onClick={() => setFormStep(1)}
                  variant="outline"
                  className="w-full"
                >
                  Назад к форме
                </Button>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReadySets;