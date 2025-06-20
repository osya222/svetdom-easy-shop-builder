-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images');

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  power TEXT NOT NULL,
  light_color TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('led', 'emergency', 'decorative', 'set')),
  compatible_with INTEGER[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policy for insert/update/delete (for admin functionality)
CREATE POLICY "Anyone can manage products" 
ON public.products 
FOR ALL
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing products data
INSERT INTO public.products (id, name, power, light_color, price, image_url, category, compatible_with, description) VALUES
(1, 'Лампа LED E27 9W', '9W', 'Теплый', 48, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[2], null),
(2, 'Лампа LED E27 7W', '7W', 'Холодный', 52, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[1], null),
(3, 'Лампа LED E27 11W', '11W', 'Нейтральный', 37, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[4], null),
(4, 'Лампа LED E27 6W', '6W', 'Теплый', 63, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[3], null),
(5, 'Лампа LED E27 8W', '8W', 'Холодный', 29, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[6], null),
(6, 'Лампа LED E27 12W', '12W', 'Нейтральный', 71, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[5], null),
(7, 'Лампа LED E27 10W', '10W', 'Теплый', 73, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[8], null),
(8, 'Лампа LED E27 9W', '9W', 'Холодный', 127, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[7], null),
(9, 'Лампа LED E27 13W', '13W', 'Нейтральный', 89, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[10], null),
(10, 'Лампа LED E27 5W', '5W', 'Теплый', 111, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[9], null),
(11, 'Лампа LED E27 14W', '14W', 'Холодный', 134, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[12], null),
(12, 'Лампа LED E27 7W', '7W', 'Нейтральный', 166, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[11], null),
(13, 'Лампа LED E27 11W', '11W', 'Теплый', 143, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[14], null),
(14, 'Лампа LED E27 8W', '8W', 'Холодный', 157, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[13], null),
(15, 'Лампа LED E27 15W', '15W', 'Нейтральный', 119, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[16], null),
(16, 'Лампа LED E27 6W', '6W', 'Теплый', 181, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[15], null),
(17, 'Лампа LED E27 12W', '12W', 'Холодный', 97, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'led', ARRAY[18], null),
(18, 'Лампа LED E27 9W', '9W', 'Нейтральный', 203, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'led', ARRAY[17], null),
(19, 'Лампа LED E27 10W', '10W', 'Теплый', 289, 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80', 'set', ARRAY[20], null),
(20, 'Лампа LED E27 7W', '7W', 'Холодный', 711, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'set', ARRAY[19], null),
(21, 'Аварийная лампа E27 9W', '9W', 'Нейтральный', 347, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'set', ARRAY[22], null),
(22, 'Аварийная лампа E27 12W', '12W', 'Теплый', 653, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'emergency', ARRAY[21], null),
(23, 'Аварийная лампа E27 8W', '8W', 'Холодный', 423, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'emergency', ARRAY[24], null),
(24, 'Аварийная лампа E27 14W', '14W', 'Нейтральный', 577, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'emergency', ARRAY[23], null),
(25, 'Аварийная лампа E27 6W', '6W', 'Теплый', 379, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'emergency', ARRAY[26], null),
(26, 'Аварийная лампа E27 15W', '15W', 'Холодный', 621, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'emergency', ARRAY[25], null),
(27, 'Аварийная лампа E27 9W', '9W', 'Нейтральный', 743, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'set', ARRAY[28], null),
(28, 'Аварийная лампа E27 12W', '12W', 'Теплый', 1257, 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', 'set', ARRAY[27], null),
(29, 'Декоративная свеча E27 5W', '5W', 'Теплый', 891, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'set', ARRAY[30], null),
(30, 'Декоративный шар E27 10W', '10W', 'Нейтральный', 1109, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'set', ARRAY[29], null),
(31, 'Декоративная свеча E27 7W', '7W', 'Теплый', 567, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[32], null),
(32, 'Декоративный шар E27 11W', '11W', 'Холодный', 1433, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[31], null),
(33, 'Декоративная свеча E27 13W', '13W', 'Нейтральный', 1347, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'set', ARRAY[34], null),
(34, 'Декоративный шар E27 8W', '8W', 'Теплый', 1653, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'set', ARRAY[33], null),
(35, 'Декоративная свеча E27 14W', '14W', 'Холодный', 1289, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'set', ARRAY[36], null),
(36, 'Декоративный шар E27 6W', '6W', 'Нейтральный', 1711, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'set', ARRAY[35], null),
(37, 'Декоративная свеча E27 15W', '15W', 'Теплый', 59, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[38], null),
(38, 'Декоративный шар E27 9W', '9W', 'Холодный', 41, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[37], null),
(39, 'Декоративная свеча E27 12W', '12W', 'Нейтральный', 67, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[40], null),
(40, 'Декоративный шар E27 5W', '5W', 'Теплый', 133, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[39], null),
(41, 'Декоративная свеча E27 10W', '10W', 'Холодный', 83, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[42], null),
(42, 'Декоративный шар E27 7W', '7W', 'Нейтральный', 117, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[41], null),
(43, 'Декоративная свеча E27 11W', '11W', 'Теплый', 91, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[44], null),
(44, 'Декоративный шар E27 13W', '13W', 'Холодный', 209, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[43], null),
(45, 'Декоративная свеча E27 8W', '8W', 'Нейтральный', 149, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[46], null),
(46, 'Декоративный шар E27 14W', '14W', 'Теплый', 151, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[45], null),
(47, 'Декоративная свеча E27 6W', '6W', 'Холодный', 193, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[48], null),
(48, 'Декоративный шар E27 15W', '15W', 'Нейтральный', 107, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[47], null),
(49, 'Декоративная свеча E27 9W', '9W', 'Теплый', 173, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[50], null),
(50, 'Декоративный шар E27 12W', '12W', 'Холодный', 127, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', 'decorative', ARRAY[49], null);

-- Update sequence to continue from existing IDs
SELECT setval('products_id_seq', 50, true);