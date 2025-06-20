-- Create ready_sets table
CREATE TABLE public.ready_sets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  product_ids INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ready_sets ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for viewing, no authentication required)
CREATE POLICY "Ready sets are viewable by everyone" 
ON public.ready_sets 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ready_sets_updated_at
BEFORE UPDATE ON public.ready_sets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for ready sets
INSERT INTO public.ready_sets (name, price, description, product_ids) VALUES
('Базовый набор 1000₽', 1000, '3 лампы для основного освещения', ARRAY[19, 20, 21]),
('Комплект 2000₽', 2000, '4 лампы разной мощности', ARRAY[27, 28, 29, 30]),
('Полный набор 3000₽', 3000, '4 мощные лампы премиум класса', ARRAY[33, 34, 35, 36]);