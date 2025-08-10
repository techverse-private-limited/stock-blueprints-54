import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from 'lucide-react';
import { useFoodItems } from '@/hooks/useFoodItems';
import { useFoodCategoriesWithCRUD } from '@/hooks/useFoodCategoriesWithCRUD';

interface FoodItemSelectorProps {
  onItemSelect: (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }) => void;
}

const FoodItemSelector: React.FC<FoodItemSelectorProps> = ({ onItemSelect }) => {
  const { foodItems, loading } = useFoodItems();
  const { foodCategories } = useFoodCategoriesWithCRUD();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.food_category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    const item = foodItems.find(item => item.id === selectedItem);
    if (item && quantity > 0) {
      onItemSelect({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity
      });
      // Reset form fields but keep dialog open
      setSelectedItem('');
      setQuantity(1);
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedItem('');
    setQuantity(1);
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Food Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Food Item</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {foodCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Food Item Selection */}
          <div>
            <Label htmlFor="foodItem">Select Food Item</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a food item" />
              </SelectTrigger>
              <SelectContent>
                {filteredItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{item.name}</span>
                      <span className="text-green-600 font-medium">₹{item.price.toFixed(2)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="mt-1"
            />
          </div>

          {/* Selected Item Preview */}
          {selectedItem && (
            <div className="bg-slate-50 p-4 rounded-lg">
              {(() => {
                const item = foodItems.find(i => i.id === selectedItem);
                if (!item) return null;
                return (
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex justify-between mt-2">
                      <span>Unit Price: ₹{item.price.toFixed(2)}</span>
                      <span className="font-medium">Total: ₹{(item.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleAddItem} 
              disabled={!selectedItem || quantity <= 0}
              className="flex-1"
            >
              Add Item
            </Button>
            <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodItemSelector;
