
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: { name: string }) => Promise<void>;
  onClose?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim() });
      if (!category) {
        setName('');
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
      <div>
        <Label htmlFor="category_name" className="text-base font-medium font-poppins">
          Category Name *
        </Label>
        <Input
          id="category_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="font-poppins"
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-poppins"
        >
          {isSubmitting ? (category ? 'Updating...' : 'Adding...') : (category ? 'Update Category' : 'Add Category')}
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
