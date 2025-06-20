import { Link } from "react-router-dom";
import { useFooterSettings } from "@/hooks/useFooterSettings";

const Footer = () => {
  const { settings, loading } = useFooterSettings();

  if (loading) {
    return null;
  }

  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Левый столбец - ссылки */}
          <div className="space-y-3">
            {settings?.payment_text && settings?.payment_link && (
              <Link 
                to={settings.payment_link} 
                className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
              >
                {settings.payment_text}
              </Link>
            )}
            {settings?.delivery_text && settings?.delivery_link && (
              <Link 
                to={settings.delivery_link} 
                className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
              >
                {settings.delivery_text}
              </Link>
            )}
            {settings?.policy_text && settings?.policy_link && (
              <Link 
                to={settings.policy_link} 
                className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
              >
                {settings.policy_text}
              </Link>
            )}
            {settings?.agreement_text && settings?.agreement_link && (
              <Link 
                to={settings.agreement_link} 
                className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
              >
                {settings.agreement_text}
              </Link>
            )}
            {settings?.admin_text && settings?.admin_link && (
              <Link 
                to={settings.admin_link} 
                className="block text-primary-foreground hover:text-primary-foreground/80 underline transition-colors"
              >
                {settings.admin_text}
              </Link>
            )}
          </div>

          {/* Правый столбец - реквизиты ИП */}
          <div className="text-right space-y-1 text-sm md:text-left md:ml-auto md:max-w-xs">
            {settings?.business_name && (
              <p className="font-semibold">{settings.business_name}</p>
            )}
            {settings?.inn && (
              <p>{settings.inn}</p>
            )}
            {settings?.ogrnip && (
              <p>{settings.ogrnip}</p>
            )}
            {settings?.address_line_1 && (
              <p>{settings.address_line_1}</p>
            )}
            {settings?.address_line_2 && (
              <p>{settings.address_line_2}</p>
            )}
            {settings?.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </p>
            )}
            {settings?.phone && (
              <p>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:underline">
                  {settings.phone}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;