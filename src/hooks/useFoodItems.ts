
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  food_category_id: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  food_categories?: { name: string };
}

export const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          food_categories (name)
        `)
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setFoodItems(data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch food items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();

    // Set up real-time subscription
    const channel = supabase
      .channel('food-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_items'
        },
        () => {
          fetchFoodItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    foodItems,
    loading,
    refetch: fetchFoodItems
  };
};
