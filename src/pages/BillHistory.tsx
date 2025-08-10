import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Receipt, User, Phone, Calendar, IndianRupee, Clock, FileText } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BillerSidebar from "@/components/BillerSidebar";
import BillItemsSection from "@/components/BillItemsSection";
import Footer from "@/components/Footer";
import { useBillHistory } from "@/hooks/useBillHistory";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const BillHistory: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showAllBills, setShowAllBills] = useState(true);
  const { bills, billItems, loading, itemsLoading, fetchBills, fetchBillDetails } = useBillHistory();

  // Fetch all bills on component mount
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Set up real-time subscription for new bills
  useEffect(() => {
    const channel = supabase
      .channel('bill-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bills'
        },
        () => {
          // Refresh bills when a new bill is inserted
          if (selectedDate) {
            fetchBills(selectedDate);
          } else {
            fetchBills();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBills, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowAllBills(false);
    if (date) {
      fetchBills(date);
    }
  };

  const handleShowAllBills = () => {
    setSelectedDate(undefined);
    setShowAllBills(true);
    fetchBills();
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-red-50 to-amber-50">
        <BillerSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-red-200/50 flex items-center px-4 md:px-6 shadow-sm">
            <SidebarTrigger className="mr-4 text-red-700 hover:text-red-800 h-8 w-8 md:hidden" />
            <h1 className="text-xl md:text-2xl font-semibold text-red-900 font-poppins tracking-wide">
              Bill History
            </h1>
          </header>
          
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-lg border border-red-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <h2 className="text-lg font-semibold text-red-900">Filter Bills</h2>
                  
                  {/* Date Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal border-red-200 hover:border-red-300",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>

                  <Button
                    onClick={handleShowAllBills}
                    variant={showAllBills ? "default" : "outline"}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                  >
                    Show All Bills
                  </Button>
                </div>

                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {bills.length} Bills Found
                </Badge>
              </div>
            </div>

            {/* Bills Display */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-lg border border-red-100">
                  <div className="flex items-center space-x-2">
                    <Receipt className="h-6 w-6 animate-spin text-red-600" />
                    <span className="text-lg font-poppins text-red-700">Loading bills...</span>
                  </div>
                </div>
              ) : bills.length > 0 ? (
                bills.map((bill) => (
                  <Card key={bill.id} className="border border-red-100 hover:border-red-200 transition-colors shadow-sm hover:shadow-md">
                    <CardHeader className="bg-red-50 border-b border-red-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-red-600" />
                          <span className="font-poppins text-red-900">{bill.bill_number}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-red-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(bill.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(bill.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="font-medium text-gray-900">{bill.customer_name}</p>
                          </div>
                        </div>
                        
                        {bill.customer_phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium text-gray-900">{bill.customer_phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {bill.created_by && (
                          <div className="flex items-center space-x-2">
                            <Receipt className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-sm text-gray-600">Created By</p>
                              <p className="font-medium text-gray-900">{bill.created_by}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Bill Amounts */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(bill.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium">{formatCurrency(bill.tax_amount)}</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-red-900">Total Amount:</span>
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="h-4 w-4 text-red-600" />
                            <span className="font-bold text-lg text-red-900">
                              {formatCurrency(bill.total_amount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bill Items Section */}
                      <BillItemsSection
                        billId={bill.id}
                        billItems={billItems[bill.id] || []}
                        loading={itemsLoading[bill.id] || false}
                        onFetchItems={fetchBillDetails}
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-lg border border-red-100">
                  <Receipt className="h-16 w-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-700 mb-2 font-poppins">
                    {selectedDate ? 'No bills found for selected date' : 'No bills found'}
                  </h3>
                  <p className="text-red-500 font-poppins">
                    {selectedDate 
                      ? `No bills were generated on ${format(selectedDate, "PPP")}` 
                      : 'No bills have been generated yet. Start by creating your first bill!'
                    }
                  </p>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BillHistory;
