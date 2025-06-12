import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Plus, Zap, Palette, QrCode } from "lucide-react";
import { products } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1 = форма, 2 = QR-код
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

  const getCompatibleProduct = () => {
    if (!product.compatibleWith || product.compatibleWith.length === 0) return null;
    const compatibleId = product.compatibleWith[0];
    return products.find(p => p.id === compatibleId);
  };

  const compatibleProduct = getCompatibleProduct();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {product.price} ₽
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        
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
            // QR-код и детали товара
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
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-lg font-semibold">Сумма к оплате: {product.price} ₽</p>
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
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCard;