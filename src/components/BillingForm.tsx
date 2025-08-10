
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import FoodItemSelector from './FoodItemSelector';
import { useBills, type BillItem } from '@/hooks/useBills';
import { printBill, type PrintBillData } from '@/utils/printGenerator';

const BillingForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<BillItem[]>([]);
  const [billNumber, setBillNumber] = useState(() => `BILL-${Date.now().toString().slice(-6)}`);
  const { saveBill, generateBillNumber, loading } = useBills();

  const addItem = (selectedItem: { id: string; name: string; price: number; quantity: number }) => {
    // Check if item already exists
    const existingItemIndex = items.findIndex(item => item.food_item_id === selectedItem.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      setItems(items.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + selectedItem.quantity;
          return {
            ...item,
            quantity: newQuantity,
            total_price: newQuantity * item.unit_price
          };
        }
        return item;
      }));
    } else {
      // Add new item
      const newItem: BillItem = {
        food_item_id: selectedItem.id,
        food_item_name: selectedItem.name,
        quantity: selectedItem.quantity,
        unit_price: selectedItem.price,
        total_price: selectedItem.quantity * selectedItem.price
      };
      setItems([...items, newItem]);
    }
    
    toast.success('Item added to bill');
  };

  const removeItem = (foodItemId: string) => {
    setItems(items.filter(item => item.food_item_id !== foodItemId));
  };

  const updateQuantity = (foodItemId: string, change: number) => {
    setItems(items.map(item => {
      if (item.food_item_id === foodItemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total_price: newQuantity * item.unit_price
        };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const generateBill = async () => {
    if (!customerName || items.length === 0) {
      toast.error('Please enter customer details and add items');
      return;
    }

    try {
      console.log('Starting bill generation process...');
      
      // First, save the bill data to Supabase
      const billData = {
        bill_number: billNumber,
        customer_name: customerName,
        customer_phone: customerPhone || undefined,
        subtotal,
        tax_amount: tax,
        total_amount: total,
        items
      };

      console.log('Saving bill to database...', billData);
      const savedBill = await saveBill(billData);
      console.log('Bill saved successfully:', savedBill);
      
      // Then, print the bill
      const currentDate = new Date().toLocaleDateString('en-GB');
      
      const printData: PrintBillData = {
        billNumber,
        date: currentDate,
        customerName,
        customerPhone,
        items: items.map(item => ({
          name: item.food_item_name,
          quantity: item.quantity,
          price: item.unit_price,
          total: item.total_price
        })),
        subtotal,
        taxAmount: tax,
        totalAmount: total
      };

      printBill(printData);
      toast.success('Bill generated and printed successfully!');
      
      // Reset form and generate new bill number
      setCustomerName('');
      setCustomerPhone('');
      setItems([]);
      setBillNumber(`BILL-${Date.now().toString().slice(-6)}`);
      
      console.log('Form reset completed');
    } catch (error) {
      console.error('Error in generateBill:', error);
      toast.error('Failed to generate bill. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Create New Bill</h1>
          <p className="text-slate-600">Generate bills for your customers</p>
        </div>
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          Bill #{billNumber.split('-')[1]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>Customer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Items</CardTitle>
            </CardHeader>
            <CardContent>
              <FoodItemSelector onItemSelect={addItem} />
            </CardContent>
          </Card>

          {/* Items List */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bill Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.food_item_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{item.food_item_name}</h4>
                        <p className="text-sm text-slate-600">₹{item.unit_price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.food_item_id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.food_item_id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">₹{item.total_price.toFixed(2)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.food_item_id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Bill Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Bill Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (10%):</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={generateBill} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={items.length === 0 || !customerName || loading}
                >
                  {loading ? 'Generating...' : 'Generate Bill'}
                </Button>
              </div>

              {items.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">No items added yet</p>
                  <p className="text-slate-400 text-xs">Add items to see the total</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingForm;
