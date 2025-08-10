
-- Add foreign key relationship between bill_items and food_items
ALTER TABLE public.bill_items 
ADD CONSTRAINT bill_items_food_item_id_fkey 
FOREIGN KEY (food_item_id) REFERENCES public.food_items(id) ON DELETE CASCADE;

-- Create an index for better performance when querying bill items by food item
CREATE INDEX IF NOT EXISTS idx_bill_items_food_item_id ON public.bill_items(food_item_id);
