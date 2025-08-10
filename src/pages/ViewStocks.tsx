
import React, { useState, useEffect, useCallback } from 'react';
import { Package, Search, Filter, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StockAnalyticsCards from '@/components/StockAnalyticsCards';
import { useProducts, Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';

// Consolidated product type for aggregated display
interface ConsolidatedProduct {
  id: string; // Use the most recent product's ID for reference
  name: string;
  category_name: string;
  category_id: string | null;
  supplier_name: string;
  supplier_id: string | null;
  total_quantity: number;
  used_quantity: number;
  remaining_quantity: number;
  min_quantity: number;
  price: number; // Most recent price
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  latest_date: string;
  latest_updated_at: string;
  product_ids: string[]; // All product IDs for this consolidated entry
}

const ViewStocks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { products, loading: productsLoading, refetch } = useProducts();

  // Fetch all products for consolidation
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          suppliers (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedProducts = (data || []).map(product => ({
        ...product,
        status: product.status as 'In Stock' | 'Low Stock' | 'Out of Stock'
      }));
      
      setAllProducts(typedProducts);
    } catch (error) {
      console.error('Error fetching all products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Consolidate products by name and category
  const consolidateProducts = useCallback((products: Product[]): ConsolidatedProduct[] => {
    const consolidated = new Map<string, ConsolidatedProduct>();

    products.forEach(product => {
      const key = `${product.name}-${product.category_id || 'no-category'}`;
      
      if (consolidated.has(key)) {
        const existing = consolidated.get(key)!;
        // Add quantities
        existing.total_quantity += product.total_quantity;
        existing.used_quantity += (product.total_quantity - product.quantity);
        existing.remaining_quantity += product.quantity;
        
        // Use most recent price and date
        if (new Date(product.updated_at) > new Date(existing.latest_updated_at)) {
          existing.price = product.price;
          existing.latest_date = product.created_date;
          existing.latest_updated_at = product.updated_at;
          existing.id = product.id; // Use most recent product ID
        }
        
        // Add to product IDs array
        existing.product_ids.push(product.id);
        
        // Recalculate status based on consolidated quantities
        if (existing.remaining_quantity === 0) {
          existing.status = 'Out of Stock';
        } else if (existing.remaining_quantity <= existing.min_quantity) {
          existing.status = 'Low Stock';
        } else {
          existing.status = 'In Stock';
        }
      } else {
        // Create new consolidated entry
        const usedQuantity = product.total_quantity - product.quantity;
        consolidated.set(key, {
          id: product.id,
          name: product.name,
          category_name: product.categories?.name || 'No Category',
          category_id: product.category_id,
          supplier_name: product.suppliers?.name || 'No Supplier',
          supplier_id: product.supplier_id,
          total_quantity: product.total_quantity,
          used_quantity: usedQuantity,
          remaining_quantity: product.quantity,
          min_quantity: product.min_quantity,
          price: product.price,
          status: product.status,
          latest_date: product.created_date,
          latest_updated_at: product.updated_at,
          product_ids: [product.id]
        });
      }
    });

    return Array.from(consolidated.values());
  }, []);

  // Get consolidated products
  const displayProducts = consolidateProducts(allProducts);
  
  // Get unique categories for filter from consolidated products
  const categories = [...new Set(displayProducts.map(p => p.category_name).filter(Boolean))];

  // Filter products based on search and filters
  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate total price of all filtered products
  const totalPrice = filteredProducts.reduce((sum, product) => sum + product.price, 0);

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const getStatusBadge = (status: ConsolidatedProduct['status']) => {
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

  // Set up real-time subscription for immediate updates
  useEffect(() => {
    const channel = supabase
      .channel('total-stocks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchAllProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllProducts]);

  return (
    <div className="space-y-6 font-poppins p-4 md:p-6">
      {/* Dashboard-style Analytics Cards */}
      <StockAnalyticsCards />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Total Stocks</h1>
          <p className="text-gray-600 text-lg">Consolidated view of your inventory - totals across all dates</p>
        </div>
      </div>

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

      {/* Consolidated Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading || productsLoading ? (
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
                  <TableHead className="font-bold text-gray-900 font-poppins">Latest Date</TableHead>
                  <TableHead className="font-bold text-gray-900 font-poppins">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  return (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="font-bold text-gray-900 font-poppins">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-poppins">
                          {product.category_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600 font-poppins">{product.total_quantity}</TableCell>
                      <TableCell className="font-semibold text-orange-600 font-poppins">{product.used_quantity}</TableCell>
                      <TableCell className="font-semibold text-green-600 font-poppins">{product.remaining_quantity}</TableCell>
                      <TableCell className="text-gray-600 font-poppins">{product.min_quantity}</TableCell>
                      <TableCell className="font-bold text-green-600 font-poppins">{formatPrice(product.price)}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-gray-600 font-poppins">{product.supplier_name}</TableCell>
                      <TableCell className="text-gray-500 font-poppins">{product.latest_date || 'N/A'}</TableCell>
                      <TableCell className="text-gray-500 font-poppins">{formatDate(product.latest_updated_at)}</TableCell>
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
            <h3 className="text-xl font-semibold text-gray-500 mb-2 font-poppins">No stock entries found</h3>
            <p className="text-gray-400 font-poppins">No products match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStocks;
