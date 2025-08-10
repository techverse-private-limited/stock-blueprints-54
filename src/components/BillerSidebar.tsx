import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, LogOut, User, History, ChefHat } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const BillerSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateBill = () => {
    navigate('/biller');
  };

  const handleBillHistory = () => {
    navigate('/biller/bill-history');
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 bg-slate-800 border-r border-slate-700 shadow-xl`}>
      <SidebarContent className="bg-slate-800 h-full flex flex-col">
        {/* Header Section */}
        <div className={`${collapsed ? "p-3" : "p-5"} border-b border-slate-600 transition-all duration-300 bg-slate-900`}>
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-orange-400/20">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-poppins">RestaurantPOS</h2>
                <p className="text-xs text-slate-300 font-medium">Billing System</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-orange-400/20">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 bg-slate-800">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Operations
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent className="px-3">
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleCreateBill}
                    isActive={true}
                    className={`group ${
                      collapsed 
                        ? "h-11 w-11 p-0 mx-auto rounded-xl" 
                        : "h-11 px-4 rounded-xl w-full"
                    } bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white font-poppins font-semibold transition-all duration-200 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105 shadow-lg ring-1 ring-emerald-400/30`}
                    title={collapsed ? "Create Bill" : undefined}
                  >
                    <Receipt className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="ml-3">Create New Bill</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleBillHistory}
                    className={`group ${
                      collapsed 
                        ? "h-11 w-11 p-0 mx-auto rounded-xl" 
                        : "h-11 px-4 rounded-xl w-full"
                    } bg-slate-700 text-slate-200 font-poppins font-medium transition-all duration-200 hover:bg-slate-600 hover:text-white hover:shadow-lg hover:shadow-slate-500/20 border border-slate-600 hover:border-slate-500`}
                    title={collapsed ? "Bill History" : undefined}
                  >
                    <History className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="ml-3">Bill History</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Info & Logout Section */}
        <SidebarFooter className="border-t border-slate-600 p-4 bg-slate-900">
          {!collapsed && (
            <div className="flex items-center space-x-3 mb-3 p-3 bg-slate-700 rounded-lg border border-slate-600 backdrop-blur-sm">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center ring-2 ring-blue-400/30">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate font-poppins">
                  {user?.email}
                </p>
                <p className="text-xs text-slate-300 font-medium">Cashier</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`${
              collapsed 
                ? "w-9 h-9 p-0 mx-auto" 
                : "w-full h-10"
            } bg-red-600 text-white hover:bg-red-500 border border-red-500 hover:border-red-400 font-poppins font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-red-500/20 rounded-lg`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className={`w-4 h-4 ${collapsed ? "" : "mr-2"} flex-shrink-0`} />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default BillerSidebar;
