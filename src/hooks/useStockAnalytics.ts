
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';

export interface StockAnalytics {
  monthlyStock: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
  monthlyUsage: {
    totalUsedQuantity: number;
    totalUsedValue: number;
    usageInKg: number;
  };
  weeklySpending: {
    currentWeek: number;
    previousWeek: number;
    change: number;
  };
  dailyTrends: {
    date: string;
    totalValue: number;
    itemCount: number;
  }[];
}

export const useStockAnalytics = () => {
  const [analytics, setAnalytics] = useState<StockAnalytics>({
    monthlyStock: { totalProducts: 0, totalValue: 0, lowStockItems: 0, outOfStockItems: 0 },
    monthlyUsage: { totalUsedQuantity: 0, totalUsedValue: 0, usageInKg: 0 },
    weeklySpending: { currentWeek: 0, previousWeek: 0, change: 0 },
    dailyTrends: []
  });
  const [loading, setLoading] = useState(true);

  const calculateAnalytics = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Get current week dates
      const currentWeekStart = new Date(currentDate);
      currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
      
      // Get previous week dates
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7);
      const previousWeekEnd = new Date(currentWeekEnd);
      previousWeekEnd.setDate(currentWeekEnd.getDate() - 7);

      // Fetch all products for analytics
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);

      if (error) throw error;

      // Calculate monthly stock metrics
      const monthlyStock = {
        totalProducts: products?.length || 0,
        totalValue: products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
        lowStockItems: products?.filter(p => p.status === 'Low Stock').length || 0,
        outOfStockItems: products?.filter(p => p.status === 'Out of Stock').length || 0
      };

      // Calculate monthly usage - using total_quantity instead of used quantity
      const monthlyUsage = {
        totalUsedQuantity: products?.reduce((sum, p) => sum + p.total_quantity, 0) || 0,
        totalUsedValue: products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
        usageInKg: products?.reduce((sum, p) => {
          // Assuming 1 unit = 0.1 kg (this can be made configurable)
          return sum + (p.total_quantity * 0.1);
        }, 0) || 0
      };

      // Calculate weekly spending
      const currentWeekProducts = products?.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= currentWeekStart && createdDate <= currentWeekEnd;
      }) || [];

      const previousWeekProducts = products?.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= previousWeekStart && createdDate <= previousWeekEnd;
      }) || [];

      const currentWeekSpending = currentWeekProducts.reduce((sum, p) => sum + p.price, 0);
      const previousWeekSpending = previousWeekProducts.reduce((sum, p) => sum + p.price, 0);

      const weeklySpending = {
        currentWeek: currentWeekSpending,
        previousWeek: previousWeekSpending,
        change: previousWeekSpending > 0 ? ((currentWeekSpending - previousWeekSpending) / previousWeekSpending) * 100 : 0
      };

      // Calculate daily trends (last 7 days)
      const dailyTrends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayProducts = products?.filter(p => p.created_date === dateString) || [];
        dailyTrends.push({
          date: dateString,
          totalValue: dayProducts.reduce((sum, p) => sum + p.price, 0),
          itemCount: dayProducts.length
        });
      }

      setAnalytics({
        monthlyStock,
        monthlyUsage,
        weeklySpending,
        dailyTrends
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateAnalytics();

    // Set up real-time subscription for analytics updates
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          calculateAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    analytics,
    loading,
    refetch: calculateAnalytics
  };
};
