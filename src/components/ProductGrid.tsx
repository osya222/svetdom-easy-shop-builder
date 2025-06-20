import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Loader } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string | null;
}

const ProductGrid = ({ selectedCategory }: ProductGridProps) => {
  const [showAll, setShowAll] = useState(false);
  const { products, loading } = useProducts();

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const displayedProducts = showAll 
    ? filteredProducts 
    : filteredProducts.slice(0, 20);

  const getCategoryTitle = () => {
    if (!selectedCategory) return "Каталог LED ламп E27";
    switch (selectedCategory) {
      case "led":
        return "Обычные LED лампы";
      case "emergency":
        return "Аварийные лампы";
      case "decorative":
        return "Декоративные лампы";
      case "set":
        return "Готовые наборы";
      default:
        return "Каталог LED ламп E27";
    }
  };

  if (loading) {
    return (
      <section id="products" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-8">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {getCategoryTitle()}
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          {selectedCategory 
            ? `Фильтр по категории. Найдено ${filteredProducts.length} товаров.`
            : "50 различных LED ламп с мощностью от 5 до 15 Вт. Цены подобраны так, чтобы легко складывать в ровные суммы."
          }
        </p>

        {/* Счетчик товаров */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="text-sm">
            Показано {displayedProducts.length} из {filteredProducts.length} товаров
          </Badge>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Кнопка "Показать еще" */}
        {!showAll && filteredProducts.length > 20 && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowAll(true)}
            >
              Показать все {filteredProducts.length} товаров
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;