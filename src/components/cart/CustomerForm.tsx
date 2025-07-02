
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  comment: string;
}

interface CustomerFormProps {
  customerData: CustomerData;
  onCustomerChange: (field: string, value: string) => void;
}

const CustomerForm = ({ customerData, onCustomerChange }: CustomerFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Данные покупателя</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Имя *</Label>
            <Input
              id="firstName"
              value={customerData.firstName}
              onChange={(e) => onCustomerChange('firstName', e.target.value)}
              placeholder="Введите имя"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Фамилия *</Label>
            <Input
              id="lastName"
              value={customerData.lastName}
              onChange={(e) => onCustomerChange('lastName', e.target.value)}
              placeholder="Введите фамилию"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={customerData.phone}
              onChange={(e) => onCustomerChange('phone', e.target.value)}
              placeholder="+7 (999) 999-99-99"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => onCustomerChange('email', e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="comment">Комментарий к заказу</Label>
            <Textarea
              id="comment"
              value={customerData.comment}
              onChange={(e) => onCustomerChange('comment', e.target.value)}
              placeholder="Оставьте комментарий (например: пожелания по упаковке, доставка, другое)"
              className="min-h-[100px] resize-none md:resize-y"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
export type { CustomerData };
