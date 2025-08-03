-- Update the check constraint for products category to include chandeliers
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the updated constraint with all valid categories including chandeliers
ALTER TABLE public.products 
ADD CONSTRAINT products_category_check 
CHECK (category IN ('led', 'emergency', 'decorative', 'set', 'chandeliers'));