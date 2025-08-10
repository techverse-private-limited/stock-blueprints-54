
-- Remove the default_price column from stock_items table since price should only be in Store Stocks
ALTER TABLE public.stock_items DROP COLUMN IF EXISTS default_price;
