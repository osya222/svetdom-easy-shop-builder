import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, ShoppingBag, ExternalLink } from "lucide-react";
import { targetSums } from "@/data/products";
import { Link } from "react-router-dom";

const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalPrice, 
    totalItems,
    getSuggestionToRoundSum 
  } = useCart();

  if (items.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Корзина пуста</p>
          <p className="text-sm text-muted-foreground mt-2">
            Добавьте товары для оформления заказа
          </p>
        </CardContent>
      </Card>
    );
  }

  // Находим ближайшие целевые суммы
  const nextTargetSums = targetSums.filter(sum => sum > totalPrice).slice(0, 3);

  return (
    <>
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Корзина ({totalItems})</span>
            <Button variant="ghost" size="sm" onClick={clearCart}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Товары в корзине */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">{item.product.price} ₽</p>
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
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Сумма */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Итого:</span>
              <span className="text-lg font-bold">{totalPrice} ₽</span>
            </div>

          </div>

          <div className="space-y-2">
            <Button 
              asChild
              className="w-full" 
              size="lg"
            >
              <Link to="/cart">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Перейти к оформлению
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="w-full"
              size="sm"
            >
              <Link to="/cart">
                <ExternalLink className="h-4 w-4 mr-2" />
                Смотреть корзину
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Cart;