
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import BillerSidebar from "@/components/BillerSidebar";
import BillingForm from "@/components/BillingForm";
import Footer from "@/components/Footer";

const BillerDashboard: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-red-50 to-amber-50">
        <BillerSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-red-200/50 flex items-center px-4 md:px-6 shadow-sm">
            <SidebarTrigger className="mr-4 text-red-700 hover:text-red-800 h-8 w-8 md:hidden" />
            <h1 className="text-xl md:text-2xl font-semibold text-red-900 font-poppins tracking-wide">
              Billing Dashboard
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <BillingForm />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BillerDashboard;
