
import { BarChart3, Package, UtensilsCrossed, ShoppingCart, Database, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Overview & notifications"
  },
  {
    title: "Total Stocks",
    url: "/total-stocks",
    icon: Package,
    description: "View total inventory summary"
  },
  {
    title: "Food Items Menu",
    url: "/food-items",
    icon: UtensilsCrossed,
    description: "Manage food-related items"
  },
  {
    title: "Store Stocks",
    url: "/store-stocks",
    icon: ShoppingCart,
    description: "View store inventory"
  },
  {
    title: "Stock Items",
    url: "/stock-items",
    icon: Database,
    description: "Manage stock item templates"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { logout, user } = useAuth();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };
  
  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-56"} transition-all duration-300 bg-blue-600 border-r border-blue-500`}>
      <SidebarContent className="bg-blue-600 h-full flex flex-col">
        {/* Header Section */}
        <div className={`${collapsed ? "p-4" : "p-6"} border-b border-blue-500/30 transition-all duration-300`}>
          {!collapsed && (
            <div className="text-center">
              <h2 className="text-white font-bold text-2xl font-poppins tracking-wide">Stock Manager</h2>
              <p className="text-blue-100 text-sm font-poppins mt-1 opacity-90">Hotel Inventory System</p>
              {user && (
                <p className="text-blue-200 text-xs font-poppins mt-2 opacity-75">
                  {user.email}
                </p>
              )}
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          )}
        </div>
        
        {/* Navigation Section */}
        <SidebarGroup className="mt-6 flex-1">
          <SidebarGroupLabel className={`text-blue-200 font-poppins text-sm font-medium uppercase tracking-wider ${collapsed ? "px-4" : "px-6"} mb-4 transition-all duration-300`}>
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent className={`${collapsed ? "px-2" : "px-2"} transition-all duration-300 flex-1`}>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center ${
                          collapsed 
                            ? "px-3 py-3 justify-center rounded-lg w-10 h-10 mx-auto" 
                            : "pl-4 pr-3 py-3 rounded-lg w-full justify-start"
                        } text-white font-poppins transition-all duration-200 ${
                          isActive 
                            ? 'bg-white/25 shadow-lg backdrop-blur-sm border border-white/40' 
                            : 'hover:bg-white/15 hover:shadow-md hover:border hover:border-white/20 hover:text-black'
                        }`
                      } 
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
                      {!collapsed && (
                        <span className="ml-3 font-poppins font-medium truncate text-left flex-1">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className={`${collapsed ? "p-2" : "p-4"} border-t border-blue-500/30`}>
          <SidebarMenuButton asChild className="group">
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                collapsed 
                  ? "px-3 py-3 justify-center rounded-lg w-10 h-10 mx-auto" 
                  : "pl-4 pr-3 py-3 rounded-lg w-full justify-start"
              } text-white font-poppins transition-all duration-200 bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl`}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
              {!collapsed && (
                <span className="ml-3 font-poppins font-medium truncate text-left flex-1">
                  Logout
                </span>
              )}
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
