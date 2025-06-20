import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useHeroSettings } from "@/hooks/useHeroSettings";
import ImageUpload from "./ImageUpload";
import { Loader, Save } from "lucide-react";

const HeroManager = () => {
  const { settings, loading, updateSettings } = useHeroSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    button_text: "",
    background_image_url: "",
    background_alt: ""
  });

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        title: settings.title,
        subtitle: settings.subtitle,
        button_text: settings.button_text,
        background_image_url: settings.background_image_url,
        background_alt: settings.background_alt
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(formData);
      toast({
        title: "Настройки Hero обновлены",
        description: "Изменения успешно сохранены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки Hero блока</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Заголовок</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Освети дом правильно"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Подзаголовок</Label>
          <Textarea
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            placeholder="Качественные LED лампы для вашего дома с удобной оплатой"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button_text">Текст кнопки</Label>
          <Input
            id="button_text"
            value={formData.button_text}
            onChange={(e) => handleInputChange('button_text', e.target.value)}
            placeholder="Собрать корзину"
          />
        </div>

        <div className="space-y-2">
          <Label>Фоновое изображение</Label>
          <ImageUpload
            currentImage={formData.background_image_url}
            onImageUpload={(url) => handleInputChange('background_image_url', url)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="background_alt">Alt-текст для фонового изображения</Label>
          <Input
            id="background_alt"
            value={formData.background_alt}
            onChange={(e) => handleInputChange('background_alt', e.target.value)}
            placeholder="Фоновое изображение"
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Сохранить настройки
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroManager;