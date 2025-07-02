
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import CartItems from "@/components/cart/CartItems";
import CustomerForm, { CustomerData } from "@/components/cart/CustomerForm";
import CartSummary from "@/components/cart/CartSummary";
import PaymentDialog from "@/components/cart/PaymentDialog";
import EmptyCart from "@/components/cart/EmptyCart";

const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalPrice, 
    totalItems
  } = useCart();
  const { toast } = useToast();
  
  const [showPayment, setShowPayment] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    comment: ''
  });

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = customerData.firstName && customerData.lastName && customerData.phone && customerData.email;

  const handlePaymentSuccess = () => {
    console.log("✅ Платеж успешно завершен");
    
    setShowPayment(false);
    setOrderSent(false);
    clearCart();
    setCustomerData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      comment: ''
    });
    setAcceptTerms(false);
    
    toast({
      title: "Спасибо! Оплата прошла успешно",
      description: "Ваш заказ оплачен и принят в обработку. Мы скоро свяжемся с вами.",
    });
  };

  const handlePaymentError = (error: string) => {
    console.error("❌ Ошибка при оплате:", error);
    
    toast({
      title: "Ошибка оплаты",
      description: `Не удалось обработать платеж: ${error}. Попробуйте еще раз или свяжитесь с нами.`,
      variant: "destructive",
    });
  };

  const handleAcceptTermsChange = (checked: boolean | string) => {
    // Convert to boolean: true if checked is true or "true", false otherwise
    const booleanValue = checked === true || checked === "true";
    setAcceptTerms(booleanValue);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== НАЧАЛО ОТПРАВКИ ЗАКАЗА ===");
    console.log("Данные клиента:", customerData);
    console.log("Товары:", items);
    console.log("Общая сумма:", totalPrice);
    
    setOrderSent(true);
    
    try {
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log("ID заказа:", orderId);
      
      const itemsList = items.map((item, index) => 
        `${index + 1}. ${item.product.name} - ${item.quantity} шт. × ${item.product.price} ₽ = ${item.product.price * item.quantity} ₽`
      ).join('\n');
      
      console.log("Список товаров для отправки:", itemsList);
      
      const orderMessage = `
НОВЫЙ ЗАКАЗ ${orderId}

Дата и время: ${new Date().toLocaleString('ru-RU')}

КЛИЕНТ:
Имя: ${customerData.firstName} ${customerData.lastName}
Телефон: ${customerData.phone}
Email: ${customerData.email}
${customerData.comment ? `Комментарий: ${customerData.comment}` : ''}

ЗАКАЗ:
Количество товаров: ${totalItems} шт.
Общая сумма: ${totalPrice} ₽
Способ оплаты: Банковская карта (Тинькофф)
Бесплатная доставка: ${totalPrice >= 2000 ? 'Да' : 'Нет'}

ТОВАРЫ:
${itemsList}

Отправлено с сайта СветДом
      `.trim();
      
      console.log("🚀 Отправка через Web3Forms...");
      console.log("Access Key:", 'bf3362d5-6685-4f10-b7e7-7ee842098073');
      console.log("Подготовленное сообщение:", orderMessage);
      
      const formData = new FormData();
      formData.append('access_key', 'bf3362d5-6685-4f10-b7e7-7ee842098073');
      formData.append('name', `${customerData.firstName} ${customerData.lastName}`);
      formData.append('email', customerData.email);
      formData.append('phone', customerData.phone);
      formData.append('subject', `Новый заказ ${orderId} с сайта СветДом`);
      formData.append('message', orderMessage);
      formData.append('from_name', 'СветДом - Интернет магазин');
      formData.append('to_name', 'Администратор СветДом');
      formData.append('replyto', customerData.email);
      formData.append('cc', 'pavel220585gpt@gmail.com');
      
      console.log("FormData подготовлена. Отправляем запрос...");
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      console.log("Статус ответа:", response.status);
      console.log("Headers ответа:", Object.fromEntries(response.headers.entries()));
      
      const result = await response.json();
      console.log("Полный ответ от Web3Forms:", result);
      
      if (response.ok && result.success) {
        console.log("✅ Заказ успешно отправлен через Web3Forms!");
        console.log("ID сообщения от Web3Forms:", result.message_id || 'Не предоставлен');
        
        setOrderSent(false);
        
        toast({
          title: "Заказ принят",
          description: `Номер заказа: ${orderId}. Переходим к оплате...`,
        });
        
        (window as any).currentOrderId = orderId;
        
      } else {
        console.error("❌ Ошибка Web3Forms:", result);
        throw new Error(result.message || 'Неизвестная ошибка Web3Forms');
      }
      
    } catch (error) {
      console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при отправке заказа:", error);
      
      setOrderSent(false);
      
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      toast({
        title: "Проблема с отправкой заказа",
        description: `Технические неполадки. Пожалуйста, позвоните: +7 903 003-31-48 или напишите: pavel220585gpt@gmail.com. Заказ: ${orderId}`,
        variant: "destructive",
      });
    }
    
    console.log("=== КОНЕЦ ОБРАБОТКИ ЗАКАЗА ===");
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в каталог
            </Link>
          </div>

          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <CartItems
                  items={items}
                  totalItems={totalItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
                
                <CustomerForm
                  customerData={customerData}
                  onCustomerChange={handleCustomerChange}
                />
              </div>

              <div>
                <CartSummary
                  items={items}
                  totalPrice={totalPrice}
                  isFormValid={isFormValid}
                  onShowPayment={() => setShowPayment(true)}
                  onClearCart={clearCart}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <PaymentDialog
        isOpen={showPayment}
        onOpenChange={setShowPayment}
        orderSent={orderSent}
        customerData={customerData}
        totalPrice={totalPrice}
        acceptTerms={acceptTerms}
        onAcceptTermsChange={handleAcceptTermsChange}
        onOrderSubmit={handleOrderSubmit}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};

export default CartPage;
