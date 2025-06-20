import { useState, useEffect } from "react";
import { useFooterSettings } from "@/hooks/useFooterSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FooterManager = () => {
  const { settings, loading, updateSettings } = useFooterSettings();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState(() => ({
    business_name: settings?.business_name || '',
    inn: settings?.inn || '',
    ogrnip: settings?.ogrnip || '',
    address_line_1: settings?.address_line_1 || '',
    address_line_2: settings?.address_line_2 || '',
    email: settings?.email || '',
    phone: settings?.phone || '',
    payment_text: settings?.payment_text || 'Порядок оплаты',
    delivery_text: settings?.delivery_text || 'Условия доставки',
    policy_text: settings?.policy_text || 'Политика конфиденциальности',
    agreement_text: settings?.agreement_text || 'Публичная оферта',
    admin_text: settings?.admin_text || 'Управление товарами',
    payment_link: settings?.payment_link || '/payinfo',
    delivery_link: settings?.delivery_link || '/delivery',
    policy_link: settings?.policy_link || '/policy',
    agreement_link: settings?.agreement_link || '/agreement',
    admin_link: settings?.admin_link || '/admin'
  }));

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || '',
        inn: settings.inn || '',
        ogrnip: settings.ogrnip || '',
        address_line_1: settings.address_line_1 || '',
        address_line_2: settings.address_line_2 || '',
        email: settings.email || '',
        phone: settings.phone || '',
        payment_text: settings.payment_text || 'Порядок оплаты',
        delivery_text: settings.delivery_text || 'Условия доставки',
        policy_text: settings.policy_text || 'Политика конфиденциальности',
        agreement_text: settings.agreement_text || 'Публичная оферта',
        admin_text: settings.admin_text || 'Управление товарами',
        payment_link: settings.payment_link || '/payinfo',
        delivery_link: settings.delivery_link || '/delivery',
        policy_link: settings.policy_link || '/policy',
        agreement_link: settings.agreement_link || '/agreement',
        admin_link: settings.admin_link || '/admin'
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateSettings(formData);
      toast({
        title: "Успешно",
        description: "Настройки футера обновлены"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка сохранения",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки футера</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Информация о бизнесе */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Информация о бизнесе</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="business_name">Название бизнеса</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                    placeholder="ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ШВЕЦОВ ПАВЕЛ ПАВЛОВИЧ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inn">ИНН</Label>
                    <Input
                      id="inn"
                      value={formData.inn}
                      onChange={(e) => setFormData(prev => ({ ...prev, inn: e.target.value }))}
                      placeholder="ИНН 772879021573"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ogrnip">ОГРНИП</Label>
                    <Input
                      id="ogrnip"
                      value={formData.ogrnip}
                      onChange={(e) => setFormData(prev => ({ ...prev, ogrnip: e.target.value }))}
                      placeholder="ОГРНИП 325508100251081"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Адрес */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Адрес</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="address_line_1">Адрес (строка 1)</Label>
                  <Input
                    id="address_line_1"
                    value={formData.address_line_1}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_line_1: e.target.value }))}
                    placeholder="шоссе Пригородное, д. 12, кв./оф. кв. 433,"
                  />
                </div>
                <div>
                  <Label htmlFor="address_line_2">Адрес (строка 2)</Label>
                  <Input
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_line_2: e.target.value }))}
                    placeholder="Московская область, г. Видное"
                  />
                </div>
              </div>
            </div>

            {/* Контакты */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Контакты</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="shangar3077@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 903 003-31-48"
                  />
                </div>
              </div>
            </div>

            {/* Ссылки и их названия */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ссылки меню</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_text">Текст ссылки "Порядок оплаты"</Label>
                  <Input
                    id="payment_text"
                    value={formData.payment_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_text: e.target.value }))}
                    placeholder="Порядок оплаты"
                  />
                </div>
                <div>
                  <Label htmlFor="payment_link">Ссылка "Порядок оплаты"</Label>
                  <Input
                    id="payment_link"
                    value={formData.payment_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_link: e.target.value }))}
                    placeholder="/payinfo"
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_text">Текст ссылки "Условия доставки"</Label>
                  <Input
                    id="delivery_text"
                    value={formData.delivery_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_text: e.target.value }))}
                    placeholder="Условия доставки"
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_link">Ссылка "Условия доставки"</Label>
                  <Input
                    id="delivery_link"
                    value={formData.delivery_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_link: e.target.value }))}
                    placeholder="/delivery"
                  />
                </div>
                <div>
                  <Label htmlFor="policy_text">Текст ссылки "Политика конфиденциальности"</Label>
                  <Input
                    id="policy_text"
                    value={formData.policy_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, policy_text: e.target.value }))}
                    placeholder="Политика конфиденциальности"
                  />
                </div>
                <div>
                  <Label htmlFor="policy_link">Ссылка "Политика конфиденциальности"</Label>
                  <Input
                    id="policy_link"
                    value={formData.policy_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, policy_link: e.target.value }))}
                    placeholder="/policy"
                  />
                </div>
                <div>
                  <Label htmlFor="agreement_text">Текст ссылки "Публичная оферта"</Label>
                  <Input
                    id="agreement_text"
                    value={formData.agreement_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreement_text: e.target.value }))}
                    placeholder="Публичная оферта"
                  />
                </div>
                <div>
                  <Label htmlFor="agreement_link">Ссылка "Публичная оферта"</Label>
                  <Input
                    id="agreement_link"
                    value={formData.agreement_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreement_link: e.target.value }))}
                    placeholder="/agreement"
                  />
                </div>
                <div>
                  <Label htmlFor="admin_text">Текст ссылки "Управление товарами"</Label>
                  <Input
                    id="admin_text"
                    value={formData.admin_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_text: e.target.value }))}
                    placeholder="Управление товарами"
                  />
                </div>
                <div>
                  <Label htmlFor="admin_link">Ссылка "Управление товарами"</Label>
                  <Input
                    id="admin_link"
                    value={formData.admin_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_link: e.target.value }))}
                    placeholder="/admin"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Сохранить настройки
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterManager;