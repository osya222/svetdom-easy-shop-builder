import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import Benefits from "@/components/Benefits";
import ProductGrid from "@/components/ProductGrid";
import ReadySets from "@/components/ReadySets";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

const Index = () => {
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onScrollToProducts={scrollToProducts} />
      
      {/* Categories */}
      <Categories />
      
      {/* Benefits */}
      <Benefits />
      
      {/* Ready Sets */}
      <ReadySets />
      
      {/* Main content with products and cart */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products grid - 3 columns */}
          <div className="lg:col-span-3" ref={productsRef}>
            <ProductGrid />
          </div>
          
          {/* Cart sidebar - 1 column */}
          <div className="lg:col-span-1">
            <Cart />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;