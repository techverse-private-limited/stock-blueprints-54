
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BillItem {
  id?: string;
  food_item_id: string;
  food_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Bill {
  id?: string;
  bill_number: string;
  customer_name: string;
  customer_phone?: string;
  created_by?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  items: BillItem[];
}

export const useBills = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateBillNumber = () => {
    return `BILL-${Date.now().toString().slice(-6)}`;
  };

  const saveBill = async (billData: Bill) => {
    setLoading(true);
    try {
      console.log('Starting bill save process...', billData);
      
      const billNumber = billData.bill_number || generateBillNumber();
      
      // Insert the bill with explicit field mapping
      const billInsertData = {
        bill_number: billNumber,
        customer_name: billData.customer_name,
        customer_phone: billData.customer_phone || null,
        created_by: billData.created_by || null,
        subtotal: Number(billData.subtotal),
        tax_amount: Number(billData.tax_amount),
        total_amount: Number(billData.total_amount),
      };

      console.log('Inserting bill data:', billInsertData);

      const { data: billResult, error: billError } = await supabase
        .from('bills')
        .insert(billInsertData)
        .select()
        .single();

      if (billError) {
        console.error('Bill insert error:', billError);
        throw billError;
      }

      console.log('Bill inserted successfully:', billResult);

      // Insert bill items
      const billItemsData = billData.items.map(item => ({
        bill_id: billResult.id,
        food_item_id: item.food_item_id,
        food_item_name: item.food_item_name,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price),
      }));

      console.log('Inserting bill items:', billItemsData);

      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItemsData);

      if (itemsError) {
        console.error('Bill items insert error:', itemsError);
        throw itemsError;
      }

      console.log('Bill items inserted successfully');

      toast({
        title: "Success",
        description: `Bill ${billNumber} generated successfully!`,
      });

      return billResult;
    } catch (error) {
      console.error('Error saving bill:', error);
      toast({
        title: "Error",
        description: "Failed to generate bill. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveBill,
    generateBillNumber,
    loading
  };
};
