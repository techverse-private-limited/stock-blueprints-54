
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onEdit, onDelete }) => {
  const handleEdit = () => {
    console.log('Editing product:', product.id);
    onEdit(product);
  };

  const handleDelete = () => {
    console.log('Deleting product:', product.id);
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 hover:bg-blue-50"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 hover:bg-red-50"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};

export default ProductActions;
