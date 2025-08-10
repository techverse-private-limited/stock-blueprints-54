import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalesData {
  todaysSales: number;
  totalSales: number;
  weeklySales: number;
  todaysOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
}

export type SalesPeriod = 'overall' | 'weekly' | 'monthly' | 'yearly';

export const useSalesData = () => {
  const [salesData, setSalesData] = useState<SalesData>({
    todaysSales: 0,
    totalSales: 0,
    weeklySales: 0,
    todaysOrders: 0,
    weeklyOrders: 0,
    monthlyOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Get today's date range
      const today = new Date();
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      // Get week start (Monday)
      const weekStart = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weekStart.setDate(today.getDate() - daysToMonday);
      weekStart.setHours(0, 0, 0, 0);

      // Get month start
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);

      // Fetch today's sales and orders
      const { data: todaysBills, error: todaysError } = await supabase
        .from('bills')
        .select('total_amount')
        .gte('created_at', todayStart.toISOString())
        .lte('created_at', todayEnd.toISOString());

      if (todaysError) throw todaysError;

      // Fetch all-time sales
      const { data: allBills, error: allError } = await supabase
        .from('bills')
        .select('total_amount');

      if (allError) throw allError;

      // Fetch weekly sales and orders
      const { data: weeklyBills, error: weeklyError } = await supabase
        .from('bills')
        .select('total_amount')
        .gte('created_at', weekStart.toISOString());

      if (weeklyError) throw weeklyError;

      // Fetch monthly orders
      const { data: monthlyBills, error: monthlyError } = await supabase
        .from('bills')
        .select('total_amount')
        .gte('created_at', monthStart.toISOString());

      if (monthlyError) throw monthlyError;

      // Calculate totals
      const todaysSales = todaysBills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;
      const totalSales = allBills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;
      const weeklySales = weeklyBills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;

      // Calculate order counts
      const todaysOrders = todaysBills?.length || 0;
      const weeklyOrders = weeklyBills?.length || 0;
      const monthlyOrders = monthlyBills?.length || 0;

      setSalesData({
        todaysSales,
        totalSales,
        weeklySales,
        todaysOrders,
        weeklyOrders,
        monthlyOrders,
      });

    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByPeriod = async (period: SalesPeriod, selectedDate?: Date): Promise<number> => {
    try {
      const today = selectedDate || new Date();
      let startDate: Date;
      let query = supabase.from('bills').select('id');

      switch (period) {
        case 'weekly':
          // Get week start (Monday)
          startDate = new Date(today);
          const dayOfWeek = today.getDay();
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startDate.setDate(today.getDate() - daysToMonday);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          break;
          
        case 'monthly':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          
          // End of month
          const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          query = query.lte('created_at', endDate.toISOString());
          break;
          
        case 'yearly':
          startDate = new Date(today.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          
          const yearEnd = new Date(today.getFullYear(), 11, 31);
          yearEnd.setHours(23, 59, 59, 999);
          query = query.lte('created_at', yearEnd.toISOString());
          break;
          
        case 'overall':
        default:
          // No date filter for overall
          break;
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.length || 0;
    } catch (error) {
      console.error('Error fetching orders by period:', error);
      return 0;
    }
  };

  const fetchSalesByPeriod = async (period: SalesPeriod, selectedDate?: Date): Promise<number> => {
    try {
      const today = selectedDate || new Date();
      let startDate: Date;
      let query = supabase.from('bills').select('total_amount');

      switch (period) {
        case 'weekly':
          // Get week start (Monday)
          startDate = new Date(today);
          const dayOfWeek = today.getDay();
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startDate.setDate(today.getDate() - daysToMonday);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          break;
          
        case 'monthly':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          
          // End of month
          const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          query = query.lte('created_at', endDate.toISOString());
          break;
          
        case 'yearly':
          startDate = new Date(today.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          
          const yearEnd = new Date(today.getFullYear(), 11, 31);
          yearEnd.setHours(23, 59, 59, 999);
          query = query.lte('created_at', yearEnd.toISOString());
          break;
          
        case 'overall':
        default:
          // No date filter for overall
          break;
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;
    } catch (error) {
      console.error('Error fetching sales by period:', error);
      return 0;
    }
  };

  useEffect(() => {
    fetchSalesData();

    // Set up real-time subscription for bill updates
    const channel = supabase
      .channel('bills-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bills'
        },
        () => {
          console.log('Bills updated, refetching sales data');
          fetchSalesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    salesData,
    loading,
    refetch: fetchSalesData,
    fetchSalesByPeriod,
    fetchOrdersByPeriod
  };
};
