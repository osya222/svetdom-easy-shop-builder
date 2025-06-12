import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface HeroSectionProps {
  onScrollToProducts: () => void;
}

const HeroSection = ({ onScrollToProducts }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-secondary to-background flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Lightbulb className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Освети дом правильно
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            50 видов LED ламп E27, которые легко сложить в ровные суммы 100₽, 1000₽, 2000₽, 3000₽ и 4000₽
          </p>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={onScrollToProducts}
          >
            Собрать корзину
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;