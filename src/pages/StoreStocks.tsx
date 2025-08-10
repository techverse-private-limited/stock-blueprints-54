
import React, { useState, useEffect, useCallback } from 'react';
import { Package, Search, Filter, Plus, CalendarIcon } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import StockEntryForm from '@/components/StockEntryForm';
import StockWarnings from '@/components/StockWarnings';
import ProductActions from '@/components/ProductActions';
import ProductEditForm from '@/components/ProductEditForm';
import QuantityControls from '@/components/QuantityControls';
import { useProductsByDate } from '@/hooks/useProductsByDate';
import { useProducts, Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getIndiaTodayDate, formatIndiaDateLong } from '@/utils/dateUtils';

const StoreStocks = () => {
  // Initialize with India's current date
  const [selectedDate, setSelectedDate] = useState<Date>(getIndiaTodayDate());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  
  const { refetch, updateProduct } = useProducts();
  const { products: dateProducts, loading: dateLoading, fetchProductsByDate } = useProductsByDate();
  const { toast } = useToast();

  // Get unique categories for filter from date-specific products
  const categories = [...new Set(dateProducts.map(p => p.categories?.name).filter(Boolean))];

  // Filter products based on search and filters for the selected date
  const filteredProducts = dateProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.categories?.name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate total price of all filtered products
  const totalPrice = filteredProducts.reduce((sum, product) => sum + product.price, 0);

  // Fetch products when date changes
  useEffect(() => {
    fetchProductsByDate(selectedDate);
  }, [selectedDate, fetchProductsByDate]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      console.log('Date selected:', date);
      setSelectedDate(date);
    }
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
    fetchProductsByDate(selectedDate); // Refresh date-specific products
    refetch(); // Also refresh general products for other components
  }, [fetchProductsByDate, selectedDate, refetch]);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  }, []);

  const handleDeleteProduct = useCallback(async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProductsByDate(selectedDate); // Refresh date-specific products
      refetch(); // Also refresh general products for other components
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  }, [toast, fetchProductsByDate, selectedDate, refetch]);

  const handleQuantitySave = useCallback(async (productId: string, newUsedQuantity: number) => {
    try {
      const product = dateProducts.find(p => p.id === productId);
      if (!product) return;

      const newRemainingQuantity = product.total_quantity - newUsedQuantity;
      
      // Determine new status
      const determineStatus = (quantity: number, minQuantity: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
        if (quantity === 0) return 'Out of Stock';
        if (quantity <= minQuantity) return 'Low Stock';
        return 'In Stock';
      };

      const newStatus = determineStatus(newRemainingQuantity, product.min_quantity);

      await updateProduct(productId, {
        quantity: newRemainingQuantity,
        status: newStatus
      });

      toast({
        title: "Success",
        description: "Used quantity updated successfully",
      });

      fetchProductsByDate(selectedDate); // Refresh date-specific products
      refetch(); // Also refresh general products for other components
      setEditingQuantityId(null);
    } catch (error) {
      console.error('Error updating used quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update used quantity",
        variant: "destructive",
      });
    }
  }, [dateProducts, updateProduct, toast, fetchProductsByDate, selectedDate, refetch]);

  const handleQuantityCancel = useCallback(() => {
    setEditingQuantityId(null);
  }, []);

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-100 text-green-800 font-medium">In Stock</Badge>;
      case 'Low Stock':
        return <Badge className="bg-yellow-100 text-yellow-800 font-medium">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge className="bg-red-100 text-red-800 font-medium">Out of Stock</Badge>;
    }
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Handle successful product addition to close dialog and refresh data immediately
  const handleProductAdded = useCallback(() => {
    setIsAddProductOpen(false);
    fetchProductsByDate(selectedDate); // Refresh date-specific products
    refetch(); // Also refresh general products for other components
  }, [fetchProductsByDate, selectedDate, refetch]);

  return (
    <div className="space-y-6 font-poppins p-4 md:p-6">
      {/* Stock Warnings */}
      <StockWarnings products={filteredProducts} selectedDate={selectedDate} />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Store Stocks</h1>
          <p className="text-gray-600 text-lg">Manage inventory by date - view and add products for specific dates</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Calendar Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal font-poppins"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatIndiaDateLong(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                defaultMonth={getIndiaTodayDate()}
              />
            </PopoverContent>
          </Popover>

          {/* Add Product Button */}
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-poppins">Add New Product for {formatIndiaDateLong(selectedDate)}</DialogTitle>
              </DialogHeader>
              <StockEntryForm 
                selectedDate={selectedDate}
                onClose={handleProductAdded}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-poppins">Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductEditForm 
              product={editingProduct}
              onClose={handleCloseEditDialog}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-poppins"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 font-poppins">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category!}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 font-poppins">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {dateLoading ? (
          <div className="flex items-center justify-center h-64">
            <Package className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg font-poppins">Loading...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-gray-900 font-poppins">Product Name</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Category</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Total Quantity</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Used Quantity</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Remaining Quantity</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Min. Qty</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Price</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Supplier</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Created Date</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Last Updated</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const usedQuantity = product.total_quantity - product.quantity;
                  const remainingQuantity = product.quantity;
                  
                  return (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="font-bold text-gray-900 font-poppins">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-poppins">
                          {product.categories?.name || 'No Category'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600 font-poppins">{product.total_quantity}</TableCell>
                      <TableCell>
                        <QuantityControls
                          initialUsedQuantity={usedQuantity}
                          totalQuantity={product.total_quantity}
                          onSave={(newUsedQuantity) => handleQuantitySave(product.id, newUsedQuantity)}
                          onCancel={handleQuantityCancel}
                          isEditing={editingQuantityId === product.id}
                          onStartEditing={() => setEditingQuantityId(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 font-poppins">{remainingQuantity}</TableCell>
                      <TableCell className="text-gray-600 font-poppins">{product.min_quantity}</TableCell>
                      <TableCell className="font-bold text-green-600 font-poppins">{formatPrice(product.price)}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-gray-600 font-poppins">{product.suppliers?.name || 'No Supplier'}</TableCell>
                      <TableCell className="text-gray-500 font-poppins">{product.created_date || 'N/A'}</TableCell>
                      <TableCell className="text-gray-500 font-poppins">{formatDate(product.updated_at)}</TableCell>
                      <TableCell>
                        <ProductActions
                          product={product}
                          onEdit={() => handleEditProduct(product)}
                          onDelete={() => handleDeleteProduct(product)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Total Price Section */}
            <div className="flex justify-end p-4 bg-gray-50 border-t">
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-700 font-poppins mr-2">Total Price:</span>
                <span className="text-xl font-bold text-green-600 font-poppins">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2 font-poppins">
              No stock entries found for {formatIndiaDateLong(selectedDate)}
            </h3>
            <p className="text-gray-400 font-poppins">
              Use the Add Product button to add stock entries for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreStocks;
