
-- Add a date column to track stock entry dates
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE;

-- Create an index on entry_date for better query performance
CREATE INDEX IF NOT EXISTS idx_products_entry_date ON public.products(entry_date);
