-- Create table for hero section settings
CREATE TABLE public.hero_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'Освети дом правильно',
  subtitle TEXT NOT NULL DEFAULT 'Качественные LED лампы для вашего дома с удобной оплатой',
  button_text TEXT NOT NULL DEFAULT 'Собрать корзину',
  background_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
  background_alt TEXT DEFAULT 'Фоновое изображение',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT single_hero_settings CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is public content)
CREATE POLICY "Hero settings are publicly readable" 
ON public.hero_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Hero settings can be updated by anyone" 
ON public.hero_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Hero settings can be inserted by anyone" 
ON public.hero_settings 
FOR INSERT 
WITH CHECK (true);

-- Insert default values
INSERT INTO public.hero_settings (id, title, subtitle, button_text, background_image_url, background_alt)
VALUES (1, 'Освети дом правильно', 'Качественные LED лампы для вашего дома с удобной оплатой', 'Собрать корзину', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80', 'Фоновое изображение');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_hero_settings_updated_at
BEFORE UPDATE ON public.hero_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();