
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Supplier {
  id: string;
  name: string;
  contact_info: string | null;
}

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSubmit: (data: { name: string; contact_info?: string }) => Promise<void>;
  onClose?: () => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_info: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact_info: supplier.contact_info || ''
      });
    }
  }, [supplier]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const submitData: { name: string; contact_info?: string } = {
        name: formData.name.trim()
      };
      
      if (formData.contact_info.trim()) {
        submitData.contact_info = formData.contact_info.trim();
      }

      await onSubmit(submitData);
      
      if (!supplier) {
        setFormData({ name: '', contact_info: '' });
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting supplier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
      <div>
        <Label htmlFor="supplier_name" className="text-base font-medium font-poppins">
          Supplier Name *
        </Label>
        <Input
          id="supplier_name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter supplier name"
          className="font-poppins"
          required
        />
      </div>

      <div>
        <Label htmlFor="contact_info" className="text-base font-medium font-poppins">
          Contact Information
        </Label>
        <Input
          id="contact_info"
          value={formData.contact_info}
          onChange={(e) => handleInputChange('contact_info', e.target.value)}
          placeholder="Enter contact information (optional)"
          className="font-poppins"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          disabled={isSubmitting || !formData.name.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-poppins"
        >
          {isSubmitting ? (supplier ? 'Updating...' : 'Adding...') : (supplier ? 'Update Supplier' : 'Add Supplier')}
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
