import Footer from "@/components/Footer";

const PaymentInfoPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Порядок оплаты
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-muted-foreground">
            Сайт svetdom.shop предлагает оплату товаров через:
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. СБП (Система быстрых платежей)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Мгновенное зачисление</li>
            <li>Отсутствие комиссии</li>
            <li>Поддержка всех банков РФ</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Порядок действий</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Сформируйте заказ на сайте</li>
            <li>Нажмите «Оплатить по СБП»</li>
            <li>Отсканируйте QR-код в приложении вашего банка</li>
            <li>Подтвердите платёж</li>
            <li>Получите подтверждение и сообщение от магазина</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Возврат средств</h2>
          <p>
            При отмене заказа возврат осуществляется в течение 5 рабочих дней тем же способом, которым производилась оплата.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentInfoPage;