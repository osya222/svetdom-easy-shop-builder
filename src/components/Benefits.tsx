import { Card, CardContent } from "@/components/ui/card";
import { Home, Lightbulb, Truck, List } from "lucide-react";

const benefits = [
  {
    icon: Home,
    title: "Готовые подборки",
    description: "«На кухню», «в спальню», «для дачи» — мы собрали удобные комплекты с учётом назначения и выгодной цены."
  },
  {
    icon: Lightbulb,
    title: "Цены от прямых поставщиков",
    description: "Работаем напрямую с заводами и складами, без наценок и посредников. Это позволяет держать цены ниже среднерыночных."
  },
  {
    icon: Truck,
    title: "Доставка по всей России",
    description: "Отправка в течение 1–2 дней после оплаты. Доставляем Почтой России и ТК в любой регион страны."
  },
  {
    icon: List,
    title: "Ассортимент на любой вкус",
    description: "50+ моделей в каталоге: мощность от 5 до 15 Вт, теплый и холодный свет, аварийные и декоративные лампы. Вы точно найдёте нужную."
  }
];

const Benefits = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Почему нам доверяют покупатели
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;