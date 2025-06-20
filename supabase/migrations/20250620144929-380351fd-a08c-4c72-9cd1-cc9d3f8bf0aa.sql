-- Create a table for categories settings
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  alt_text TEXT,
  category_key TEXT NOT NULL UNIQUE,
  count_text TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories data
INSERT INTO public.categories (title, description, image_url, alt_text, category_key, count_text, icon_name) VALUES
  ('Обычные LED', '3–12 Вт для дома', 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'Обычные LED лампы', 'led', '20+ товаров', 'Lightbulb'),
  ('Аварийные', 'С аккумулятором', 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'Аварийные лампы с аккумулятором', 'emergency', '8+ товаров', 'Battery'),
  ('Декоративные', 'Свечи, шары', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'Декоративные лампы', 'decorative', '15+ товаров', 'Star'),
  ('Готовые наборы', '1000, 2000, 3000 ₽', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80', 'Готовые наборы ламп', 'set', '3 набора', 'Package');

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (categories are public)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();