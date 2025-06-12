import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { Product } from "@/types/product";

const ProductGrid = () => {
  const [filter, setFilter] = useState<"all" | Product["category"]>("all");
  const [showAll, setShowAll] = useState(false);

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(product => product.category === filter);

  const displayedProducts = showAll 
    ? filteredProducts 
    : filteredProducts.slice(0, 12);

  const categoryLabels = {
    all: "Все товары",
    led: "Обычные LED",
    emergency: "Аварийные", 
    decorative: "Декоративные",
    set: "Наборы"
  };

  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Каталог товаров
        </h2>
        
        {/* Фильтры */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key as "all" | Product["category"])}
            >
              {label}
            </Button>
          ))}
        </div>

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
        {!showAll && filteredProducts.length > 12 && (
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