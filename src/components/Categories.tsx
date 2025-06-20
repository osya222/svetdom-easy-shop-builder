import { Card } from "@/components/ui/card";
import { Lightbulb, Battery, Star, Package } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const iconMap = {
  Lightbulb,
  Battery,
  Star,
  Package
};

interface CategoriesProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

const Categories = ({ onCategorySelect, selectedCategory }: CategoriesProps) => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Категории товаров
          </h2>
          <div className="text-center">Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Категории товаров
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon_name as keyof typeof iconMap] || Lightbulb;
            const isSelected = selectedCategory === category.category_key;
            return (
              <Card 
                key={category.id} 
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onCategorySelect(isSelected ? null : category.category_key)}
              >
                <div className="relative h-48 overflow-hidden">
                  {category.image_url && (
                    <img 
                      src={category.image_url} 
                      alt={category.alt_text || category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <IconComponent className="h-8 w-8 mb-2" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{category.count_text}</p>
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