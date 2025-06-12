import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Plus, Zap, Palette, QrCode, CreditCard } from "lucide-react";
import { products } from "@/data/products";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('sbp');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  
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

  const getCompatibleProduct = () => {
    if (!product.compatibleWith || product.compatibleWith.length === 0) return null;
    const compatibleId = product.compatibleWith[0];
    return products.find(p => p.id === compatibleId);
  };

  const compatibleProduct = getCompatibleProduct();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">{product.name}</h3>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {product.price} ₽
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>{product.power}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Palette className="h-4 w-4" />
          <span>{product.lightColor}</span>
        </div>

        {compatibleProduct && (
          <div className="bg-secondary/50 p-2 rounded-md mb-4 text-xs">
            <p className="text-muted-foreground">
              Добавь к лампе №{compatibleProduct.id} — получишь {product.price + compatibleProduct.price} ₽
            </p>
          </div>
        )}
        
        <div className="mt-auto flex flex-col gap-3 pt-4">
          <Button 
            onClick={() => addItem(product)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить в корзину
          </Button>
          <Button 
            onClick={() => setShowPayment(true)}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            size="default"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Купить
          </Button>
        </div>
      </CardContent>
      
      {/* Диалог оплаты */}
      <Dialog open={showPayment} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Способ оплаты</DialogTitle>
            <DialogDescription>
              Выберите удобный способ оплаты для {product.name}
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
                  <div className="flex items-center gap-2 flex-1">
                    <QrCode className="h-5 w-5 text-primary" />
                    <Label htmlFor="sbp" className="cursor-pointer">Онлайн-оплата по СБП</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="vtb" id="vtb" />
                  <div className="flex items-center gap-2 flex-1">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="vtb" className="cursor-pointer">Платёжная система ВТБ</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="alfa" id="alfa" />
                  <div className="flex items-center gap-2 flex-1">
                    <CreditCard className="h-5 w-5 text-red-600" />
                    <Label htmlFor="alfa" className="cursor-pointer">Оплата картой (Alfa Bank)</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="yukassa" id="yukassa" />
                  <div className="flex items-center gap-2 flex-1">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <Label htmlFor="yukassa" className="cursor-pointer">ЮKassa</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Отображение платежной информации в зависимости от выбранного метода */}
            <div className="space-y-4">
              {paymentMethod === 'sbp' && (
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
                </div>
              )}

              {paymentMethod === 'vtb' && (
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <QrCode className="h-24 w-24 mx-auto mb-2 text-blue-600" />
                    <p className="text-xs text-blue-600">QR-код ВТБ</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    Безопасная оплата через ВТБ
                  </Badge>
                </div>
              )}

              {paymentMethod === 'alfa' && (
                <div className="text-center space-y-4">
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <CreditCard className="h-24 w-24 mx-auto mb-2 text-red-600" />
                    <p className="text-xs text-red-600">Оплата картой</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                    Alfa Bank • Защищённая транзакция
                  </Badge>
                </div>
              )}

              {paymentMethod === 'yukassa' && (
                <div className="text-center space-y-4">
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <CreditCard className="h-24 w-24 mx-auto mb-2 text-purple-600" />
                    <p className="text-xs text-purple-600">ЮKassa</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    Универсальная платёжная система
                  </Badge>
                </div>
              )}

              <div className="text-center">
                <p className="text-lg font-semibold">Сумма к оплате: {product.price} ₽</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {paymentMethod === 'sbp' ? 'Наведите камеру на QR-код или откройте приложение банка' : 
                   paymentMethod === 'vtb' ? 'Переход на сайт ВТБ для оплаты' :
                   paymentMethod === 'alfa' ? 'Переход на сайт Alfa Bank для оплаты' :
                   'Переход на сайт ЮKassa для оплаты'}
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

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!isFormValid || !acceptTerms}
              size="lg"
            >
              Подтвердить заказ
            </Button>
            
            {(!isFormValid || !acceptTerms) && (
              <p className="text-sm text-muted-foreground text-center">
                {!isFormValid ? 'Заполните все обязательные поля' : 'Примите условия для продолжения'}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCard;