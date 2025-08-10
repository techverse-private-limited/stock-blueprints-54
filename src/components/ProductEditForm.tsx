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
import { useProducts, Product } from '@/hooks/useProducts';
import { useStockItems } from '@/hooks/useStockItems';
import { useToast } from '@/hooks/use-toast';

interface ProductEditFormProps {
  product: Product;
  onClose?: () => void;
  onSuccess?: () => void;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    total_quantity: '',
    min_quantity: '',
    price: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateProduct } = useProducts();
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        quantity: product.quantity.toString(),
        total_quantity: product.total_quantity.toString(),
        min_quantity: product.min_quantity.toString(),
        price: product.price.toString()
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.quantity || !formData.total_quantity || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    const quantity = parseInt(formData.quantity);
    const totalQuantity = parseInt(formData.total_quantity);

    if (quantity > totalQuantity) {
      toast({
        title: "Error",
        description: "Current quantity cannot be greater than total quantity",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const determineStatus = (quantity: number, minQuantity: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minQuantity) return 'Low Stock';
    return 'In Stock';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const quantity = parseInt(formData.quantity);
      const minQuantity = parseInt(formData.min_quantity) || 0;
      const status = determineStatus(quantity, minQuantity);

      const updateData = {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        total_quantity: parseInt(formData.total_quantity),
        min_quantity: parseInt(formData.min_quantity) || 0,
        price: parseFloat(formData.price),
        status
      };

      await updateProduct(product.id, updateData);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
      
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-poppins">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium font-poppins">
            Product Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            className="font-poppins"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity" className="text-base font-medium font-poppins">
              Current Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter current quantity"
              className="font-poppins"
              min="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="total_quantity" className="text-base font-medium font-poppins">
              Total Quantity *
            </Label>
            <Input
              id="total_quantity"
              type="number"
              value={formData.total_quantity}
              onChange={(e) => handleInputChange('total_quantity', e.target.value)}
              placeholder="Enter total quantity"
              className="font-poppins"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min_quantity" className="text-base font-medium font-poppins">
              Minimum Quantity
            </Label>
            <Input
              id="min_quantity"
              type="number"
              value={formData.min_quantity}
              onChange={(e) => handleInputChange('min_quantity', e.target.value)}
              placeholder="Enter minimum quantity"
              className="font-poppins"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-base font-medium font-poppins">
              Price (₹) *
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price"
              className="font-poppins"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-poppins"
        >
          {isSubmitting ? 'Updating Product...' : 'Update Product'}
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

export default ProductEditForm;
