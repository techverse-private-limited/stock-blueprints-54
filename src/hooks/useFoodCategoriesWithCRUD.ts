import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FoodCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export const useFoodCategoriesWithCRUD = () => {
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFoodCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('food_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setFoodCategories(data || []);
    } catch (error) {
      console.error('Error fetching food categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch food categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFoodCategory = async (categoryData: { name: string }) => {
    try {
      // Check if category with this name already exists
      const existingCategory = foodCategories.find(
        category => category.name.toLowerCase() === categoryData.name.toLowerCase()
      );

      if (existingCategory) {
        toast({
          title: "Error",
          description: "A category with this name already exists",
          variant: "destructive",
        });
        throw new Error("Category already exists");
      }

      const { data, error } = await supabase
        .from('food_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Food category added successfully",
      });

      await fetchFoodCategories();
      return data;
    } catch (error) {
      console.error('Error adding food category:', error);
      if (error.message !== "Category already exists") {
        toast({
          title: "Error",
          description: "Failed to add food category",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const updateFoodCategory = async (id: string, categoryData: { name: string }) => {
    try {
      // Check if another category with this name already exists (excluding the current one)
      const existingCategory = foodCategories.find(
        category => category.name.toLowerCase() === categoryData.name.toLowerCase() && category.id !== id
      );

      if (existingCategory) {
        toast({
          title: "Error",
          description: "A category with this name already exists",
          variant: "destructive",
        });
        throw new Error("Category already exists");
      }

      const { data, error } = await supabase
        .from('food_categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Food category updated successfully",
      });

      await fetchFoodCategories();
      return data;
    } catch (error) {
      console.error('Error updating food category:', error);
      if (error.message !== "Category already exists") {
        toast({
          title: "Error",
          description: "Failed to update food category",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const deleteFoodCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Food category deleted successfully",
      });

      await fetchFoodCategories();
    } catch (error) {
      console.error('Error deleting food category:', error);
      toast({
        title: "Error",
        description: "Failed to delete food category",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFoodCategories();

    // Set up real-time subscription
    const channel = supabase
      .channel('food-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_categories'
        },
        () => {
          fetchFoodCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    foodCategories,
    loading,
    addFoodCategory,
    updateFoodCategory,
    deleteFoodCategory,
    refetch: fetchFoodCategories
  };
};
