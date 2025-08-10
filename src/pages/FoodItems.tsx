
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, UtensilsCrossed, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodCategoryForm } from '@/components/FoodCategoryForm';
import { FoodCategoryManager } from '@/components/FoodCategoryManager';
import { useFoodCategoriesWithCRUD } from '@/hooks/useFoodCategoriesWithCRUD';
import { useFoodItemsWithCRUD, type FoodItemDB } from '@/hooks/useFoodItemsWithCRUD';

const FoodItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFoodCategoryDialogOpen, setIsFoodCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItemDB | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    food_category_id: '',
    price: 0,
    description: '',
    is_available: true
  });

  const { foodCategories, addFoodCategory } = useFoodCategoriesWithCRUD();
  const { foodItems, loading, addFoodItem, updateFoodItem, deleteFoodItem } = useFoodItemsWithCRUD();

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.food_categories?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.food_category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateFoodItem(editingItem.id, {
          name: formData.name,
          food_category_id: formData.food_category_id || null,
          price: formData.price,
          description: formData.description || null,
          is_available: formData.is_available
        });
      } else {
        await addFoodItem({
          name: formData.name,
          food_category_id: formData.food_category_id || undefined,
          price: formData.price,
          description: formData.description || undefined,
          is_available: formData.is_available
        });
      }
      resetForm();
    } catch (error) {
      // Error handled in the hook
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      food_category_id: '',
      price: 0,
      description: '',
      is_available: true
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: FoodItemDB) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      food_category_id: item.food_category_id || '',
      price: item.price,
      description: item.description || '',
      is_available: item.is_available
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this food item?')) {
      await deleteFoodItem(id);
    }
  };

  const handleAddFoodCategory = async (categoryData: { name: string }) => {
    await addFoodCategory(categoryData);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in font-poppins">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Food Items Management</h1>
            <p className="text-gray-600 text-lg">Manage your restaurant's food menu items and categories</p>
          </div>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items" className="font-poppins">Food Items</TabsTrigger>
            <TabsTrigger value="categories" className="font-poppins">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <div className="flex gap-3">
              <Dialog open={isFoodCategoryDialogOpen} onOpenChange={setIsFoodCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Tag className="mr-2 h-5 w-5" />
                    Add Food Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Add New Food Category</DialogTitle>
                    <DialogDescription>
                      Add a new category specifically for your food items.
                    </DialogDescription>
                  </DialogHeader>
                  <FoodCategoryForm 
                    onSubmit={handleAddFoodCategory}
                    onClose={() => setIsFoodCategoryDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setEditingItem(null)}
                  >
                    <Plus className="mr-2 h-6 w-6" />
                    Add Food Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Update the food item details.' : 'Add a new item to your menu.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Food Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter food name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.food_category_id} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, food_category_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {foodCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the food item..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="available"
                        checked={formData.is_available}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="available">Available</Label>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="mr-2 h-5 w-5" />
                  <SelectValue />
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

            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg font-semibold">Name</TableHead>
                    <TableHead className="text-lg font-semibold">Category</TableHead>
                    <TableHead className="text-lg font-semibold">Price</TableHead>
                    <TableHead className="text-lg font-semibold">Status</TableHead>
                    <TableHead className="text-lg font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-100">
                      <TableCell className="font-semibold text-lg">{item.name}</TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {item.food_categories?.name || 'Uncategorized'}
                        </span>
                      </TableCell>
                      <TableCell className="text-lg font-semibold text-green-600">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {item.is_available ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Available
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            Unavailable
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No food items found</p>
                <p className="text-gray-400">Try adjusting your search or add a new food item</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <FoodCategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FoodItems;
