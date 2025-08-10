
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Low Stock', 'Out of Stock')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a store inventory system)
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access to suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to suppliers" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to suppliers" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to suppliers" ON public.suppliers FOR DELETE USING (true);

CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to products" ON public.products FOR DELETE USING (true);

-- Function to automatically update the status based on quantity
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity = 0 THEN
    NEW.status = 'Out of Stock';
  ELSIF NEW.quantity <= NEW.min_quantity THEN
    NEW.status = 'Low Stock';
  ELSE
    NEW.status = 'In Stock';
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update status and updated_at
CREATE TRIGGER update_product_status_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_status();

-- Enable real-time for all tables
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.suppliers REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- Add tables to real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Insert sample data
INSERT INTO public.categories (name) VALUES 
  ('Vegetables'),
  ('Meat'),
  ('Dairy'),
  ('Pantry'),
  ('Beverages'),
  ('Spices');

INSERT INTO public.suppliers (name, contact_info) VALUES 
  ('Fresh Farm Co.', 'contact@freshfarm.com'),
  ('Premium Meats', 'orders@premiummeats.com'),
  ('Dairy Direct', 'info@dairydirect.com'),
  ('Mediterranean Foods', 'sales@mediterraneanfoods.com');

-- Insert sample products
INSERT INTO public.products (name, category_id, supplier_id, quantity, total_quantity, min_quantity, price) VALUES 
  ('Tomatoes', (SELECT id FROM public.categories WHERE name = 'Vegetables'), (SELECT id FROM public.suppliers WHERE name = 'Fresh Farm Co.'), 50, 100, 10, 2.99),
  ('Chicken Breast', (SELECT id FROM public.categories WHERE name = 'Meat'), (SELECT id FROM public.suppliers WHERE name = 'Premium Meats'), 5, 20, 15, 12.99),
  ('Mozzarella Cheese', (SELECT id FROM public.categories WHERE name = 'Dairy'), (SELECT id FROM public.suppliers WHERE name = 'Dairy Direct'), 0, 15, 8, 8.50),
  ('Olive Oil', (SELECT id FROM public.categories WHERE name = 'Pantry'), (SELECT id FROM public.suppliers WHERE name = 'Mediterranean Foods'), 25, 30, 5, 15.99);
