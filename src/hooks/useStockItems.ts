
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StockItem {
  id: string;
  name: string;
  category_id: string | null;
  supplier_id: string | null;
  default_min_quantity: number;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  suppliers?: { name: string };
}

export const useStockItems = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStockItems = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .order('name');

      if (error) throw error;
      setStockItems(data || []);
    } catch (error) {
      console.error('Error fetching stock items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStockItem = async (itemData: Omit<StockItem, 'id' | 'created_at' | 'updated_at' | 'categories' | 'suppliers'>) => {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .insert([itemData])
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Stock item added successfully",
      });

      await fetchStockItems();
      return data;
    } catch (error) {
      console.error('Error adding stock item:', error);
      toast({
        title: "Error",
        description: "Failed to add stock item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStockItem = async (id: string, itemData: Partial<StockItem>) => {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .update(itemData)
        .eq('id', id)
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Stock item updated successfully",
      });

      await fetchStockItems();
      return data;
    } catch (error) {
      console.error('Error updating stock item:', error);
      toast({
        title: "Error",
        description: "Failed to update stock item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteStockItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Stock item deleted successfully",
      });

      await fetchStockItems();
    } catch (error) {
      console.error('Error deleting stock item:', error);
      toast({
        title: "Error",
        description: "Failed to delete stock item",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStockItems();

    // Set up real-time subscription
    const channel = supabase
      .channel('stock-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_items'
        },
        () => {
          fetchStockItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    stockItems,
    loading,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    refetch: fetchStockItems
  };
};
