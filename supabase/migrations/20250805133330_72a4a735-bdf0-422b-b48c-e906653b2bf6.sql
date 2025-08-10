
-- Create stock_items table for managing stock item templates
CREATE TABLE public.stock_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  default_min_quantity INTEGER DEFAULT 0,
  default_price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for stock_items
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Create policies for stock_items
CREATE POLICY "Allow public read access to stock_items" 
  ON public.stock_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to stock_items" 
  ON public.stock_items 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to stock_items" 
  ON public.stock_items 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to stock_items" 
  ON public.stock_items 
  FOR DELETE 
  USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_items_updated_at 
  BEFORE UPDATE ON public.stock_items 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Clear existing products table for fresh start (optional)
-- TRUNCATE TABLE public.products;

-- Remove entry_date column from products as it's no longer needed
ALTER TABLE public.products DROP COLUMN IF EXISTS entry_date;
