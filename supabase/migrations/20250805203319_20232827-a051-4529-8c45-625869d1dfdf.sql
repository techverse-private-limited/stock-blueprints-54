
-- Create a separate table for food item categories
CREATE TABLE public.food_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS) to food_categories
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for food_categories (allowing public access like other tables)
CREATE POLICY "Allow public read access to food_categories" 
  ON public.food_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to food_categories" 
  ON public.food_categories 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to food_categories" 
  ON public.food_categories 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to food_categories" 
  ON public.food_categories 
  FOR DELETE 
  USING (true);

-- Create trigger for food_categories updated_at
CREATE TRIGGER trigger_food_categories_updated_at
    BEFORE UPDATE ON public.food_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_updated_at();

-- Add a new column to products table to reference food_categories instead of categories
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS food_category_id UUID REFERENCES public.food_categories(id);

-- Note: We'll keep the existing category_id for backward compatibility but will use food_category_id for food items
