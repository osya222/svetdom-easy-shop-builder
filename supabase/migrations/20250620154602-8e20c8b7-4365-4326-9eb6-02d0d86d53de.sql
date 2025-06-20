-- Create footer_settings table
CREATE TABLE public.footer_settings (
  id INTEGER NOT NULL DEFAULT 1 PRIMARY KEY,
  business_name TEXT,
  inn TEXT,
  ogrnip TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  email TEXT,
  phone TEXT,
  payment_link TEXT DEFAULT '/payinfo',
  delivery_link TEXT DEFAULT '/delivery',
  policy_link TEXT DEFAULT '/policy',
  agreement_link TEXT DEFAULT '/agreement',
  admin_link TEXT DEFAULT '/admin',
  payment_text TEXT DEFAULT 'Порядок оплаты',
  delivery_text TEXT DEFAULT 'Условия доставки',
  policy_text TEXT DEFAULT 'Политика конфиденциальности',
  agreement_text TEXT DEFAULT 'Публичная оферта',
  admin_text TEXT DEFAULT 'Управление товарами',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default values
INSERT INTO public.footer_settings (
  business_name,
  inn,
  ogrnip,
  address_line_1,
  address_line_2,
  email,
  phone
) VALUES (
  'ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ШВЕЦОВ ПАВЕЛ ПАВЛОВИЧ',
  'ИНН 772879021573',
  'ОГРНИП 325508100251081',
  'шоссе Пригородное, д. 12, кв./оф. кв. 433,',
  'Московская область, г. Видное',
  'shangar3077@gmail.com',
  '+7 903 003-31-48'
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_footer_settings_updated_at
  BEFORE UPDATE ON public.footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();