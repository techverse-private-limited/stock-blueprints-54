
import React, { useState } from 'react';
import { Package, Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StockItemForm } from '@/components/StockItemForm';
import { CategoryManager } from '@/components/CategoryManager';
import { SupplierManager } from '@/components/SupplierManager';
import { useStockItems, StockItem } from '@/hooks/useStockItems';
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

const StockItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const { stockItems, loading, deleteStockItem } = useStockItems();

  // Filter items based on search
  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categories?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteStockItem(id);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-6 font-poppins p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stock Items</h1>
          <p className="text-gray-600 text-lg">Manage your stock item templates</p>
        </div>
      </div>

      <Tabs defaultValue="stock-items" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stock-items">Stock Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="stock-items" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Stock Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-poppins">Add New Stock Item</DialogTitle>
                </DialogHeader>
                <StockItemForm onClose={() => setIsAddItemOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stock items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-poppins"
              />
            </div>
          </div>

          {/* Stock Items Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Package className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-lg font-poppins">Loading...</span>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold text-gray-900 font-poppins">Item Name</TableHead>
                      <TableHead className="font-bold text-gray-900 font-poppins">Category</TableHead>
                      <TableHead className="font-bold text-gray-900 font-poppins">Supplier</TableHead>
                      <TableHead className="font-bold text-gray-900 font-poppins">Default Min. Qty</TableHead>
                      <TableHead className="font-bold text-gray-900 font-poppins">Created</TableHead>
                      <TableHead className="font-bold text-gray-900 font-poppins">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-bold text-gray-900 font-poppins">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-poppins">
                            {item.categories?.name || 'No Category'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 font-poppins">{item.suppliers?.name || 'No Supplier'}</TableCell>
                        <TableCell className="text-gray-600 font-poppins">{item.default_min_quantity}</TableCell>
                        <TableCell className="text-gray-500 font-poppins">{formatDate(item.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingItem(item)}>
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="font-poppins">Edit Stock Item</DialogTitle>
                                </DialogHeader>
                                <StockItemForm 
                                  stockItem={editingItem} 
                                  onClose={() => setEditingItem(null)} 
                                />
                              </DialogContent>
                            </Dialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Stock Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2 font-poppins">No stock items found</h3>
                <p className="text-gray-400 font-poppins">Add your first stock item to get started</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="suppliers">
          <SupplierManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockItems;
