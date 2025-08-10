
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Product } from '@/hooks/useProducts';

interface StockWarningsProps {
  products: Product[];
  selectedDate?: Date;
}

const StockWarnings: React.FC<StockWarningsProps> = ({ products, selectedDate }) => {
  // Filter products based on selected date if provided
  const filteredProducts = selectedDate 
    ? products.filter(p => {
        const productDate = p.created_date;
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        return productDate === selectedDateString;
      })
    : products;

  // Calculate stock warnings for the filtered products
  const lowStockCount = filteredProducts.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = filteredProducts.filter(p => p.status === 'Out of Stock').length;

  if (lowStockCount === 0 && outOfStockCount === 0) {
    return null;
  }

  const dateText = selectedDate 
    ? `on ${selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}` 
    : 'in inventory';

  return (
    <div className="flex gap-4">
      {lowStockCount > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 font-medium">
            {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low on stock {dateText}
          </AlertDescription>
        </Alert>
      )}
      {outOfStockCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            {outOfStockCount} item{outOfStockCount > 1 ? 's' : ''} out of stock {dateText}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StockWarnings;
