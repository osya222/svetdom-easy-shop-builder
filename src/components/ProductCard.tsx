import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
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
              <p className="text-lg font-semibold">Сумма к оплате: {product.price} ₽</p>
              <p className="text-sm text-muted-foreground mt-2">
                {product.name}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Наведите камеру телефона на QR-код или откройте приложение банка
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Комиссия 0% • Мгновенное зачисление
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCard;