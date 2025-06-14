import Footer from "@/components/Footer";

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Политика конфиденциальности
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-muted-foreground">
            Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей сайта svetdom.shop, предоставляемых пользователями при оформлении заказа.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Какие данные мы собираем</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Имя и фамилия</li>
            <li>Телефон</li>
            <li>Адрес электронной почты</li>
            <li>Сведения о заказах</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Цель обработки данных</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Обработка и доставка заказов</li>
            <li>Контакт с клиентом</li>
            <li>Ведение бухгалтерской отчётности</li>
            <li>Маркетинговые уведомления (при согласии)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Кто обрабатывает данные</h2>
          <p>
            Обработка осуществляется ИП Швецов Павел Павлович (ИНН 772879021573).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Срок хранения данных</h2>
          <p>
            Персональные данные хранятся не дольше, чем это необходимо для целей их обработки, либо в течение сроков, установленных законодательством.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Защита данных</h2>
          <p>
            Мы используем технические и организационные меры безопасности для защиты данных от несанкционированного доступа, потери или изменения.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Контакт для связи</h2>
          <div className="space-y-2">
            <p>
              <a href="mailto:info@routesale.ru" className="text-primary hover:underline">
                info@routesale.ru
              </a>
            </p>
            <p>+7 (926) 138-83-80</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolicyPage;