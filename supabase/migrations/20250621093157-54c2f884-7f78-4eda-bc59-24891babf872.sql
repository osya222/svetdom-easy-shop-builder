-- Add UPDATE and INSERT policies for categories table
CREATE POLICY "Anyone can update categories" 
ON public.categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);