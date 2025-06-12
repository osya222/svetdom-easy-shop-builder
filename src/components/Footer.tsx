import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageCircle, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Контакты */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>Telegram: @svetdom_support</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>info@svetdom.ru</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* О компании */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">О компании</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>ИП Петров Андрей Викторович</p>
                <p>ОГРНИП: 123456789012345</p>
                <p>ИНН: 123456789012</p>
                <p>Работаем с 2020 года</p>
              </div>
            </CardContent>
          </Card>

          {/* Соцсети */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Подписывайтесь на нас для получения акций и новинок!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 СветДом. Все права защищены.</p>
          <p className="mt-2">
            Доставка по всей России • Гарантия качества • Поддержка 24/7
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;