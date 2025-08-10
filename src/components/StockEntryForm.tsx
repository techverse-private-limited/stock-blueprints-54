
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useStockItems } from '@/hooks/useStockItems';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StockEntryFormFields } from './StockEntryFormFields';
import { getDateString } from '@/utils/dateUtils';

interface StockEntryFormProps {
  selectedDate: Date | undefined;
  onClose?: () => void;
}

const StockEntryForm: React.FC<StockEntryFormProps> = ({ selectedDate, onClose }) => {
  const [formData, setFormData] = useState({
    stock_item_id: '',
    total_quantity: '',
    min_quantity: '',
    price: ''
  });
  const [selectedStockItem, setSelectedStockItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetch } = useProducts();
  const { stockItems } = useStockItems();
  const { toast } = useToast();

  const handleStockItemSelect = (stockItemId: string) => {
    const stockItem = stockItems.find(item => item.id === stockItemId);
    if (stockItem) {
      setSelectedStockItem(stockItem);
      setFormData(prev => ({
        ...prev,
        stock_item_id: stockItemId,
        min_quantity: stockItem.default_min_quantity.toString(),
        price: ''
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.stock_item_id || !formData.total_quantity || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const determineStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minQuantity) return 'Low Stock';
    return 'In Stock';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const totalQuantity = parseInt(formData.total_quantity);
      const minQuantity = parseInt(formData.min_quantity) || 0;
      // Initially, quantity (remaining) equals total_quantity since nothing is used yet
      const initialQuantity = totalQuantity;
      const status = determineStatus(initialQuantity, minQuantity);

      const productData = {
        name: selectedStockItem.name,
        category_id: selectedStockItem.category_id || null,
        supplier_id: selectedStockItem.supplier_id || null,
        quantity: initialQuantity, // This represents remaining quantity
        total_quantity: totalQuantity,
        min_quantity: minQuantity,
        price: parseFloat(formData.price),
        status,
        created_date: getDateString(selectedDate!)
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      // Reset form
      setFormData({
        stock_item_id: '',
        total_quantity: '',
        min_quantity: '',
        price: ''
      });
      setSelectedStockItem(null);

      refetch();
      
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-poppins">
      <StockEntryFormFields
        formData={formData}
        stockItems={stockItems}
        selectedStockItem={selectedStockItem}
        onStockItemSelect={handleStockItemSelect}
        onInputChange={handleInputChange}
      />

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          disabled={isSubmitting || !selectedStockItem}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-poppins"
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </Button>
        {onClose && (
          <Button 
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6 font-poppins"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default StockEntryForm;
