import { Card } from "@/components/ui/card";
import { Lightbulb, Battery, Star, Package } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Обычные LED",
    description: "3–12 Вт для дома",
    icon: Lightbulb,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80",
    count: "20+ товаров"
  },
  {
    id: 2,
    title: "Аварийные",
    description: "С аккумулятором",
    icon: Battery,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
    count: "8+ товаров"
  },
  {
    id: 3,
    title: "Декоративные",
    description: "Свечи, шары",
    icon: Star,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
    count: "15+ товаров"
  },
  {
    id: 4,
    title: "Готовые наборы",
    description: "1000, 2000, 3000 ₽",
    icon: Package,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
    count: "3 набора"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Категории товаров
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <IconComponent className="h-8 w-8 mb-2" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;