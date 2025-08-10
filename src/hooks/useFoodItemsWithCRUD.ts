
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FoodItemDB {
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

export const useFoodItemsWithCRUD = () => {
  const [foodItems, setFoodItems] = useState<FoodItemDB[]>([]);
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
        .order('created_at', { ascending: false });

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

  const addFoodItem = async (itemData: {
    name: string;
    price: number;
    description?: string;
    food_category_id?: string;
    is_available?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert([{
          ...itemData,
          is_available: itemData.is_available ?? true
        }])
        .select(`
          *,
          food_categories (name)
        `)
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Food item added successfully",
      });

      await fetchFoodItems();
      return data;
    } catch (error) {
      console.error('Error adding food item:', error);
      toast({
        title: "Error",
        description: "Failed to add food item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFoodItem = async (id: string, itemData: Partial<FoodItemDB>) => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .update(itemData)
        .eq('id', id)
        .select(`
          *,
          food_categories (name)
        `)
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Food item updated successfully",
      });

      await fetchFoodItems();
      return data;
    } catch (error) {
      console.error('Error updating food item:', error);
      toast({
        title: "Error",
        description: "Failed to update food item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFoodItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Food item deleted successfully",
      });

      await fetchFoodItems();
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        title: "Error",
        description: "Failed to delete food item",
        variant: "destructive",
      });
      throw error;
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
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    refetch: fetchFoodItems
  };
};
