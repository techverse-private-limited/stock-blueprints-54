
-- Enable real-time updates for the bills table
ALTER TABLE public.bills REPLICA IDENTITY FULL;

-- Add the bills table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bills;
