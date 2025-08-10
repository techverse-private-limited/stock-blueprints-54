
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStockItems, StockItem } from '@/hooks/useStockItems';
import { useCategories } from '@/hooks/useCategories';
import { useSuppliers } from '@/hooks/useSuppliers';

interface StockItemFormProps {
  stockItem?: StockItem | null;
  onClose?: () => void;
}

export const StockItemForm: React.FC<StockItemFormProps> = ({ stockItem, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    supplier_id: '',
    default_min_quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addStockItem, updateStockItem } = useStockItems();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();

  useEffect(() => {
    if (stockItem) {
      setFormData({
        name: stockItem.name,
        category_id: stockItem.category_id || '',
        supplier_id: stockItem.supplier_id || '',
        default_min_quantity: stockItem.default_min_quantity.toString()
      });
    }
  }, [stockItem]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemData = {
        name: formData.name,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        default_min_quantity: parseInt(formData.default_min_quantity) || 0
      };

      if (stockItem) {
        await updateStockItem(stockItem.id, itemData);
      } else {
        await addStockItem(itemData);
      }

      // Reset form if adding new item
      if (!stockItem) {
        setFormData({
          name: '',
          category_id: '',
          supplier_id: '',
          default_min_quantity: ''
        });
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving stock item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
      <div>
        <Label htmlFor="name" className="text-base font-medium font-poppins">
          Item Name *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter item name"
          className="font-poppins"
          required
        />
      </div>

      <div>
        <Label className="text-base font-medium font-poppins">Category</Label>
        <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
          <SelectTrigger className="font-poppins">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id} className="font-poppins">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium font-poppins">Supplier</Label>
        <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
          <SelectTrigger className="font-poppins">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map(supplier => (
              <SelectItem key={supplier.id} value={supplier.id} className="font-poppins">
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="default_min_quantity" className="text-base font-medium font-poppins">
          Default Minimum Quantity
        </Label>
        <Input
          id="default_min_quantity"
          type="number"
          value={formData.default_min_quantity}
          onChange={(e) => handleInputChange('default_min_quantity', e.target.value)}
          placeholder="Enter default minimum quantity"
          className="font-poppins"
          min="0"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-poppins"
        >
          {isSubmitting ? (stockItem ? 'Updating...' : 'Adding...') : (stockItem ? 'Update Item' : 'Add Item')}
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
