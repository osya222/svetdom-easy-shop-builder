import Footer from "@/components/Footer";

const AgreementPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Публичная оферта
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-muted-foreground">
            Настоящий документ является официальным предложением (офертой) о заключении договора купли-продажи между ИП Швецов Павел Павлович и любым посетителем сайта svetdom.shop.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Предмет оферты</h2>
          <p>
            Поставка светодиодной продукции, размещённой на сайте, на условиях настоящей оферты.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Оформление и оплата заказа</h2>
          <p>
            Покупатель самостоятельно формирует заказ на сайте и производит 100% оплату через СБП или иные способы.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Доставка</h2>
          <p>
            Доставка осуществляется по адресу, указанному Покупателем. Условия, сроки и стоимость доставки уточняются при оформлении заказа.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Возврат и обмен</h2>
          <p>
            Покупатель имеет право вернуть товар надлежащего качества в течение 7 дней. Возврат осуществляется в полном объёме, если товар не был в употреблении и сохранён товарный вид.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Заключение договора</h2>
          <p>
            Договор считается заключённым с момента оплаты. Совершая заказ, пользователь соглашается с условиями оферты.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgreementPage;