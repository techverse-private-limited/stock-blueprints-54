
import React, { useState } from 'react';
import { Edit, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FoodCategoryForm } from '@/components/FoodCategoryForm';
import { useFoodCategoriesWithCRUD, type FoodCategory } from '@/hooks/useFoodCategoriesWithCRUD';

export const FoodCategoryManager: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FoodCategory | null>(null);
  const { foodCategories, loading, addFoodCategory, updateFoodCategory, deleteFoodCategory } = useFoodCategoriesWithCRUD();

  const handleAddCategory = async (categoryData: { name: string }) => {
    await addFoodCategory(categoryData);
  };

  const handleUpdateCategory = async (categoryData: { name: string }) => {
    if (editingCategory) {
      await updateFoodCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteFoodCategory(id);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Food Categories</h2>
          <p className="text-gray-600">Manage your food item categories</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2">
              <Tag className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Food Category</DialogTitle>
            </DialogHeader>
            <FoodCategoryForm 
              onSubmit={handleAddCategory}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-gray-50 rounded-xl overflow-hidden">
        {foodCategories.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-semibold">Category Name</TableHead>
                <TableHead className="text-lg font-semibold">Created</TableHead>
                <TableHead className="text-lg font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-100">
                  <TableCell className="font-semibold text-lg">{category.name}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(category.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit Food Category</DialogTitle>
                          </DialogHeader>
                          <FoodCategoryForm 
                            category={editingCategory}
                            onSubmit={handleUpdateCategory}
                            onClose={() => setEditingCategory(null)}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Food Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No food categories found</p>
            <p className="text-gray-400">Add your first food category to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
