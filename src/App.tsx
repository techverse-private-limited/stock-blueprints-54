
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Footer from "@/components/Footer";
import Dashboard from "./pages/Dashboard";
import ViewStocks from "./pages/ViewStocks";
import AddStock from "./pages/AddStock";
import UpdateStock from "./pages/UpdateStock";
import MoneyCollected from "./pages/MoneyCollected";
import FoodItems from "./pages/FoodItems";
import StoreStocks from "./pages/StoreStocks";
import StockItems from "./pages/StockItems";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import BillerDashboard from "./pages/BillerDashboard";
import BillHistory from "./pages/BillHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Biller Routes */}
            <Route path="/biller/*" element={
              <ProtectedRoute requiredRole="biller">
                <Routes>
                  <Route path="/" element={<BillerDashboard />} />
                  <Route path="/bill-history" element={<BillHistory />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Stock Manager Routes */}
            <Route path="/*" element={
              <ProtectedRoute requiredRole="stock">
                <SidebarProvider defaultOpen={true}>
                  <div className="min-h-screen flex w-full bg-slate-50">
                    <AppSidebar />
                    <SidebarInset className="flex-1 flex flex-col">
                      <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 shadow-sm">
                        <SidebarTrigger className="mr-4 text-blue-600 hover:text-blue-700 h-8 w-8" />
                        <h1 className="text-xl md:text-2xl font-semibold text-slate-800 font-poppins">Stock Management Dashboard</h1>
                      </header>
                      <main className="flex-1 p-4 md:p-6 lg:p-8">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/total-stocks" element={<ViewStocks />} />
                          <Route path="/view-stocks" element={<ViewStocks />} />
                          <Route path="/add-stock" element={<AddStock />} />
                          <Route path="/update-stock" element={<UpdateStock />} />
                          <Route path="/money-collected" element={<MoneyCollected />} />
                          <Route path="/food-items" element={<FoodItems />} />
                          <Route path="/store-stocks" element={<StoreStocks />} />
                          <Route path="/stock-items" element={<StockItems />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </SidebarInset>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
