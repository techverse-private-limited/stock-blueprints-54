
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BillHistoryItem {
  id: string;
  bill_number: string;
  customer_name: string;
  customer_phone?: string;
  created_by?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  items?: BillHistoryItemDetail[];
}

export interface BillHistoryItemDetail {
  id: string;
  food_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const useBillHistory = () => {
  const [bills, setBills] = useState<BillHistoryItem[]>([]);
  const [billItems, setBillItems] = useState<{ [billId: string]: BillHistoryItemDetail[] }>({});
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState<{ [billId: string]: boolean }>({});
  const { toast } = useToast();

  const fetchBills = useCallback(async (selectedDate?: Date) => {
    setLoading(true);
    try {
      let query = supabase
        .from('bills')
        .select(`
          id,
          bill_number,
          customer_name,
          customer_phone,
          created_by,
          subtotal,
          tax_amount,
          total_amount,
          created_at
        `)
        .order('created_at', { ascending: false });

      // If date is selected, filter by that date
      if (selectedDate) {
        const dateStart = new Date(selectedDate);
        dateStart.setHours(0, 0, 0, 0);
        
        const dateEnd = new Date(selectedDate);
        dateEnd.setHours(23, 59, 59, 999);

        query = query
          .gte('created_at', dateStart.toISOString())
          .lte('created_at', dateEnd.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setBills(data || []);
      
      if (selectedDate) {
        const dateStr = selectedDate.toLocaleDateString('en-IN');
        if (data && data.length === 0) {
          toast({
            title: "No bills found",
            description: `No bills found for ${dateStr}`,
          });
        } else {
          toast({
            title: "Bills filtered",
            description: `Found ${data?.length || 0} bills for ${dateStr}`,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bill history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchBillDetails = useCallback(async (billId: string) => {
    setItemsLoading(prev => ({ ...prev, [billId]: true }));
    try {
      const { data, error } = await supabase
        .from('bill_items')
        .select('*')
        .eq('bill_id', billId)
        .order('food_item_name');

      if (error) throw error;
      
      setBillItems(prev => ({ ...prev, [billId]: data || [] }));
      return data || [];
    } catch (error) {
      console.error('Error fetching bill details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bill items",
        variant: "destructive",
      });
      return [];
    } finally {
      setItemsLoading(prev => ({ ...prev, [billId]: false }));
    }
  }, [toast]);

  return {
    bills,
    billItems,
    loading,
    itemsLoading,
    fetchBills,
    fetchBillDetails
  };
};
