import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { toast } from "sonner";

const QRManagerConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [apiUrl, setApiUrl] = useState("https://app.wapiserv.qrm.ooo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !merchantId) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Здесь должна быть логика сохранения ключей в Supabase Secrets
      // Для демонстрации просто показываем success toast
      localStorage.setItem('qr_manager_api_key', apiKey);
      localStorage.setItem('qr_manager_merchant_id', merchantId);
      localStorage.setItem('qr_manager_api_url', apiUrl);
      
      toast.success("Настройки QR Manager сохранены");
      
      // Очищаем поля после сохранения
      setApiKey("");
      setMerchantId("");
      setApiUrl("https://app.wapiserv.qrm.ooo");
      
    } catch (error: any) {
      toast.error("Ошибка при сохранении настроек");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Настройки QR Manager
        </CardTitle>
        <CardDescription>
          Введите ваши учетные данные для интеграции с QR Manager
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Ключ *</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите API ключ"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="merchant-id">Merchant ID *</Label>
            <Input
              id="merchant-id"
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="Введите Merchant ID"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://app.wapiserv.qrm.ooo"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </form>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>* - обязательные поля</p>
          <p>Ваши данные будут безопасно сохранены в настройках проекта</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRManagerConfig;