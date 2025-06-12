import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Package, CreditCard } from "lucide-react";
import { readySets, products } from "@/data/products";
import { Link } from "react-router-dom";

const ReadySets = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('sbp');
  const [acceptTerms, setAcceptTerms] = useState(false);
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

  const handleDialogClose = (open: boolean) => {
    setShowPayment(open);
    if (!open) {
      // Сброс состояния при закрытии
      setPaymentMethod('sbp');
      setAcceptTerms(false);
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
            <DialogTitle>Способ оплаты</DialogTitle>
            <DialogDescription>
              Выберите удобный способ оплаты для набора
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Форма клиента */}
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
            </div>

            {/* Выбор способа оплаты */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Способ оплаты</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="sbp" id="sbp" />
                  <Label htmlFor="sbp" className="cursor-pointer">Онлайн-оплата по СБП</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="vtb" id="vtb" />
                  <Label htmlFor="vtb" className="cursor-pointer">Платёжная система ВТБ</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="alfa" id="alfa" />
                  <Label htmlFor="alfa" className="cursor-pointer">Оплата картой (Alfa Bank)</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="yukassa" id="yukassa" />
                  <Label htmlFor="yukassa" className="cursor-pointer">ЮKassa</Label>
                </div>
              </RadioGroup>
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
              </Label>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!isFormValid || !acceptTerms}
              size="lg"
            >
              Подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReadySets;