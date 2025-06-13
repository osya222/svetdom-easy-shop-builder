import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";
import { readySets, products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ReadySets = () => {
  const { addItem } = useCart();

  const addSetToCart = (set: any) => {
    const setProducts = getSetProducts(set.products);
    setProducts.forEach(product => {
      if (product) {
        addItem(product);
      }
    });
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
                    onClick={() => addSetToCart(set)}
                    className="w-full"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить набор в корзину
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReadySets;