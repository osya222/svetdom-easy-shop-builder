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
              to="/delivery" 
              className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
            >
              Условия доставки
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
            <Link 
              to="/admin" 
              className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
            >
              Управление товарами
            </Link>
          </div>

          {/* Правый столбец - реквизиты ИП */}
          <div className="text-right space-y-1 text-sm md:text-left md:ml-auto md:max-w-xs">
            <p className="font-semibold">ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ</p>
            <p className="font-semibold">ШВЕЦОВ ПАВЕЛ ПАВЛОВИЧ</p>
            <p>ИНН 772879021573</p>
            <p>ОГРНИП 325508100251081</p>
            <p>шоссе Пригородное, д. 12, кв./оф. кв. 433,</p>
            <p>Московская область, г. Видное</p>
            <p>
              <a href="mailto:shangar3077@gmail.com" className="hover:underline">
                shangar3077@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+79030033148" className="hover:underline">
                +7 903 003-31-48
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;