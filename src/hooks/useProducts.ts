
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  category_id: string | null;
  supplier_id: string | null;
  quantity: number;
  total_quantity: number;
  min_quantity: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  created_at: string;
  updated_at: string;
  created_date: string; // This matches the database column name
  categories?: { name: string };
  suppliers?: { name: string };
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedProducts = (data || []).map(product => ({
        ...product,
        status: product.status as 'In Stock' | 'Low Stock' | 'Out of Stock'
      }));
      
      setProducts(typedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'status' | 'categories' | 'suppliers' | 'created_date'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });

      // Type assertion for the returned data
      return {
        ...data,
        status: data.status as 'In Stock' | 'Low Stock' | 'Out of Stock'
      };
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
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
        description: "Product updated successfully",
      });

      // Type assertion for the returned data
      return {
        ...data,
        status: data.status as 'In Stock' | 'Low Stock' | 'Out of Stock'
      };
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts(); // Refetch when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
