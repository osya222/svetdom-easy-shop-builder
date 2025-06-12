import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { Product } from "@/types/product";

const ProductGrid = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedProducts = showAll 
    ? products 
    : products.slice(0, 20);

  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Каталог LED ламп E27
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          50 различных LED ламп с мощностью от 5 до 15 Вт. Цены подобраны так, чтобы легко складывать в ровные суммы.
        </p>

        {/* Счетчик товаров */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="text-sm">
            Показано {displayedProducts.length} из {products.length} ламп
          </Badge>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Кнопка "Показать еще" */}
        {!showAll && products.length > 20 && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowAll(true)}
            >
              Показать все {products.length} ламп
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;