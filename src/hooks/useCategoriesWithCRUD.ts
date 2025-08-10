import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export const useCategoriesWithCRUD = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: { name: string }) => {
    try {
      // Check if category with this name already exists
      const existingCategory = categories.find(
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
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });

      await fetchCategories();
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      if (error.message !== "Category already exists") {
        toast({
          title: "Error",
          description: "Failed to add category",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: { name: string }) => {
    try {
      // Check if another category with this name already exists (excluding the current one)
      const existingCategory = categories.find(
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
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      await fetchCategories();
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.message !== "Category already exists") {
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();

    // Set up real-time subscription
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
