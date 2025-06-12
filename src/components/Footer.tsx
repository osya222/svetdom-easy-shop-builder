import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Левый столбец - ссылки */}
          <div className="space-y-3">
            <Link 
              to="/payinfo" 
              className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
            >
              Порядок оплаты
            </Link>
            <Link 
              to="/policy" 
              className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link 
              to="/agreement" 
              className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
            >
              Публичная оферта
            </Link>
          </div>

          {/* Правый столбец - реквизиты ИП */}
          <div className="text-right space-y-1 text-sm md:text-left md:ml-auto md:max-w-xs">
            <p className="font-semibold">ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ</p>
            <p className="font-semibold">АНДРИАНОВ ИЛЬЯ ОЛЕГОВИЧ</p>
            <p>ИНН 771507425528</p>
            <p>ОГРН 325774600045387</p>
            <p>МОСКВА, УЛ. БЕРЕЗОВАЯ АЛЛЕЯ, Д. 5, К. 400</p>
            <p>info@routesale.ru</p>
            <p>+7 (926) 138-83-80</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;