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

        
        <div className="mt-auto pt-4">
          <Button 
            onClick={() => addItem(product)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="default"
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