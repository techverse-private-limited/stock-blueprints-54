
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Save, X } from 'lucide-react';

interface QuantityControlsProps {
  initialUsedQuantity: number;
  totalQuantity: number;
  onSave: (newUsedQuantity: number) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  onStartEditing: () => void;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  initialUsedQuantity,
  totalQuantity,
  onSave,
  onCancel,
  isEditing,
  onStartEditing,
}) => {
  const [usedQuantity, setUsedQuantity] = useState(initialUsedQuantity);
  const [isSaving, setIsSaving] = useState(false);

  const handleIncrease = () => {
    if (usedQuantity < totalQuantity) {
      setUsedQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (usedQuantity > 0) {
      setUsedQuantity(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(usedQuantity);
    } catch (error) {
      console.error('Error saving quantity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUsedQuantity(initialUsedQuantity);
    onCancel();
  };

  const remainingQuantity = totalQuantity - usedQuantity;

  if (!isEditing) {
    return (
      <div className="space-y-1">
        <div 
          className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded border"
          onClick={onStartEditing}
        >
          <span className="font-semibold font-poppins">{initialUsedQuantity}</span>
        </div>
        <div className="text-xs text-gray-500 text-center font-poppins">
          Remaining: {totalQuantity - initialUsedQuantity}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2 p-2 bg-gray-50 rounded border">
      <div className="flex items-center space-x-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={usedQuantity <= 0}
          className="h-6 w-6 p-0"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        
        <div className="flex flex-col items-center mx-2">
          <span className="font-semibold text-lg font-poppins">{usedQuantity}</span>
          <span className="text-xs text-gray-500 font-poppins">Used</span>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={usedQuantity >= totalQuantity}
          className="h-6 w-6 p-0"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-xs text-center font-poppins">
        <div className="text-gray-600">Remaining: <span className="font-semibold text-blue-600">{remainingQuantity}</span></div>
      </div>

      <div className="flex space-x-2">
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="h-3 w-3 mr-1" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="h-6 px-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default QuantityControls;
