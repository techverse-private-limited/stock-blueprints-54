
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';

// Helper function to format date consistently
const formatDateForDB = (date: Date): string => {
  // Create a new date object to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useProductsByDate = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const fetchProductsByDate = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const dateString = formatDateForDB(date);
      console.log('Fetching products for date:', dateString);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .eq('created_date', dateString)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedProducts = (data || []).map(product => ({
        ...product,
        status: product.status as 'In Stock' | 'Low Stock' | 'Out of Stock'
      }));
      
      console.log(`Found ${typedProducts.length} products for date ${dateString}`);
      
      if (typedProducts.length === 0) {
        // Let's also check what dates are actually available
        const { data: availableDates } = await supabase
          .from('products')
          .select('created_date')
          .order('created_date', { ascending: false });
        
        console.log('Available dates in database:', availableDates?.map(item => item.created_date));
        
        toast({
          title: "No data found",
          description: `No products found for ${dateString}. Please check available dates or add new products.`,
          variant: "destructive",
        });
      }
      
      setProducts(typedProducts);
    } catch (error) {
      console.error('Error fetching products by date:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products for selected date",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    products,
    loading,
    fetchProductsByDate
  };
};
