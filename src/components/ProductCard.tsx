import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Plus, Zap, Palette } from "lucide-react";
import { products } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const getCompatibleProduct = () => {
    if (!product.compatibleWith || product.compatibleWith.length === 0) return null;
    const compatibleId = product.compatibleWith[0];
    return products.find(p => p.id === compatibleId);
  };

  const compatibleProduct = getCompatibleProduct();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
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
      
      <CardContent className="p-4 flex flex-col h-full">
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
              Совместим с <span className="font-medium">{compatibleProduct.name}</span> 
              <br />
              для суммы {product.price + compatibleProduct.price} ₽
            </p>
          </div>
        )}
        
        <div className="mt-auto">
          <Button 
            onClick={() => addItem(product)}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить в корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;