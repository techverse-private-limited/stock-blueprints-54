
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockItem {
  id: string;
  name: string;
  category_id: string | null;
  supplier_id: string | null;
  default_min_quantity: number;
  categories?: {
    name: string;
  };
  suppliers?: {
    name: string;
  };
}

interface FormData {
  stock_item_id: string;
  total_quantity: string;
  min_quantity: string;
  price: string;
}

interface StockEntryFormFieldsProps {
  formData: FormData;
  stockItems: StockItem[];
  selectedStockItem: StockItem | null;
  onStockItemSelect: (stockItemId: string) => void;
  onInputChange: (field: string, value: string) => void;
}

export const StockEntryFormFields: React.FC<StockEntryFormFieldsProps> = ({
  formData,
  stockItems,
  selectedStockItem,
  onStockItemSelect,
  onInputChange
}) => {
  // Auto-populate min_quantity when a stock item is selected
  useEffect(() => {
    if (selectedStockItem && formData.min_quantity === '') {
      onInputChange('min_quantity', selectedStockItem.default_min_quantity.toString());
    }
  }, [selectedStockItem, formData.min_quantity, onInputChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="stock_item" className="text-base font-medium font-poppins">
            Select Product *
          </Label>
          <Select value={formData.stock_item_id} onValueChange={onStockItemSelect}>
            <SelectTrigger className="font-poppins">
              <SelectValue placeholder="Select product from stock items" />
            </SelectTrigger>
            <SelectContent>
              {stockItems.map(item => (
                <SelectItem key={item.id} value={item.id} className="font-poppins">
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStockItem && (
          <>
            <div>
              <Label className="text-base font-medium font-poppins">Category</Label>
              <Input 
                value={selectedStockItem.categories?.name || 'No Category'} 
                readOnly 
                className="bg-gray-100 font-poppins" 
              />
            </div>

            <div>
              <Label className="text-base font-medium font-poppins">Supplier</Label>
              <Input 
                value={selectedStockItem.suppliers?.name || 'No Supplier'} 
                readOnly 
                className="bg-gray-100 font-poppins" 
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="total_quantity" className="text-base font-medium font-poppins">
            Total Quantity *
          </Label>
          <Input 
            id="total_quantity" 
            type="number" 
            value={formData.total_quantity} 
            onChange={e => onInputChange('total_quantity', e.target.value)} 
            placeholder="Enter total quantity" 
            className="font-poppins" 
            required 
            min="0" 
          />
        </div>

        <div>
          <Label htmlFor="min_quantity" className="text-base font-medium font-poppins">
            Minimum Quantity
          </Label>
          <Input 
            id="min_quantity" 
            type="number" 
            value={formData.min_quantity} 
            onChange={e => onInputChange('min_quantity', e.target.value)} 
            placeholder="Enter minimum quantity" 
            className="font-poppins" 
            min="0" 
          />
        </div>

        <div>
          <Label htmlFor="price" className="text-base font-medium font-poppins">
            Price *
          </Label>
          <Input 
            id="price" 
            type="number" 
            step="0.01" 
            value={formData.price} 
            onChange={e => onInputChange('price', e.target.value)} 
            placeholder="Enter price" 
            className="font-poppins" 
            required 
            min="0" 
          />
        </div>
      </div>
    </div>
  );
};
