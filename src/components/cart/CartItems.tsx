
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/types/product";

interface CartItemsProps {
  items: CartItem[];
  totalItems: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartItems = ({ items, totalItems, onUpdateQuantity, onRemoveItem }: CartItemsProps) => {
  return (
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
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="h-6 w-6 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onRemoveItem(item.product.id)}
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
  );
};

export default CartItems;
