import { Button } from "@/components/ui/button";
import { Lightbulb, Loader } from "lucide-react";
import { useHeroSettings } from "@/hooks/useHeroSettings";

interface HeroSectionProps {
  onScrollToProducts: () => void;
}

const HeroSection = ({ onScrollToProducts }: HeroSectionProps) => {
  const { settings, loading } = useHeroSettings();

  if (loading) {
    return (
      <section className="relative min-h-[70vh] bg-gradient-to-br from-secondary to-background flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center items-center py-8">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  const backgroundStyle = settings?.background_image_url
    ? { backgroundImage: `url(${settings.background_image_url})` }
    : {};

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-secondary to-background flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={backgroundStyle}
        aria-label={settings?.background_alt || "Фоновое изображение"}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Lightbulb className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            {settings?.title || "Освети дом правильно"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            {settings?.subtitle || "Качественные LED лампы для вашего дома с удобной оплатой"}
          </p>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={onScrollToProducts}
          >
            {settings?.button_text || "Собрать корзину"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;