import { useState, useEffect } from "react";
import { DollarSign, Package, ShoppingCart, Calendar, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesData, SalesPeriod } from "@/hooks/useSalesData";
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  prefix?: string;
  color: string;
  loading?: boolean;
}
const StatCard = ({
  title,
  value,
  icon: Icon,
  prefix = "",
  color,
  loading = false
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (loading) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, loading]);
  if (loading) {
    return <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-lg">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`}></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 font-poppins">{title}</CardTitle>
          <Icon className={`h-6 w-6 ${color.replace('from-', 'text-').replace('-500', '-600').split(' ')[0]}`} />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-lg">
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 font-poppins">{title}</CardTitle>
        <Icon className={`h-6 w-6 ${color.replace('from-', 'text-').replace('-500', '-600').split(' ')[0]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color.replace('from-', 'text-').replace('-500', '-600').split(' ')[0]} font-poppins`}>
          {prefix}{displayValue.toLocaleString()}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {title.includes('Today') ? 'Updated in real-time' : 'Total accumulated'}
        </p>
      </CardContent>
    </Card>;
};
interface TotalMoneyCardProps {
  value: number;
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  loading: boolean;
}
const TotalMoneyCard = ({
  value,
  period,
  onPeriodChange,
  loading
}: TotalMoneyCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (loading) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, loading]);
  const getCardTitle = () => {
    switch (period) {
      case 'weekly':
        return 'Weekly Sales';
      case 'monthly':
        return 'Monthly Sales';
      case 'yearly':
        return 'Yearly Sales';
      case 'overall':
      default:
        return 'Total Money Collected';
    }
  };
  const getPeriodLabel = () => {
    switch (period) {
      case 'weekly':
        return 'This week';
      case 'monthly':
        return 'This month';
      case 'yearly':
        return 'This year';
      case 'overall':
      default:
        return 'All time';
    }
  };
  if (loading) {
    return <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 font-poppins">{getCardTitle()}</CardTitle>
          <DollarSign className="h-6 w-6 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-slate-600 font-poppins">{getCardTitle()}</CardTitle>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-auto h-6 px-2 text-xs border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DollarSign className="h-6 w-6 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-blue-600 font-poppins">
          ₹{displayValue.toLocaleString()}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {getPeriodLabel()}
        </p>
      </CardContent>
    </Card>;
};
interface TotalOrdersCardProps {
  value: number;
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  loading: boolean;
}
const TotalOrdersCard = ({
  value,
  period,
  onPeriodChange,
  loading
}: TotalOrdersCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (loading) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, loading]);
  const getCardTitle = () => {
    switch (period) {
      case 'weekly':
        return 'Weekly Orders';
      case 'monthly':
        return 'Monthly Orders';
      case 'yearly':
        return 'Yearly Orders';
      case 'overall':
      default:
        return 'Total Orders';
    }
  };
  const getPeriodLabel = () => {
    switch (period) {
      case 'weekly':
        return 'This week';
      case 'monthly':
        return 'This month';
      case 'yearly':
        return 'This year';
      case 'overall':
      default:
        return 'All time';
    }
  };
  if (loading) {
    return <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-5"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 font-poppins">{getCardTitle()}</CardTitle>
          <Package className="h-6 w-6 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-5"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-slate-600 font-poppins">{getCardTitle()}</CardTitle>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-auto h-6 px-2 text-xs border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Package className="h-6 w-6 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-purple-600 font-poppins">
          {displayValue.toLocaleString()}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {getPeriodLabel()}
        </p>
      </CardContent>
    </Card>;
};
const Dashboard = () => {
  const {
    salesData,
    loading,
    fetchSalesByPeriod,
    fetchOrdersByPeriod
  } = useSalesData();
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalMoneyPeriod, setTotalMoneyPeriod] = useState<SalesPeriod>('overall');
  const [totalMoneyLoading, setTotalMoneyLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalOrdersPeriod, setTotalOrdersPeriod] = useState<SalesPeriod>('overall');
  const [totalOrdersLoading, setTotalOrdersLoading] = useState(false);

  // Initialize total money with overall sales
  useEffect(() => {
    if (!loading && salesData.totalSales) {
      setTotalMoney(salesData.totalSales);
    }
  }, [loading, salesData.totalSales]);

  // Initialize total orders with overall orders count
  useEffect(() => {
    const fetchTotalOrders = async () => {
      if (!loading) {
        const totalOrdersCount = await fetchOrdersByPeriod('overall');
        setTotalOrders(totalOrdersCount);
      }
    };
    fetchTotalOrders();
  }, [loading, fetchOrdersByPeriod]);
  const handleMoneyPeriodChange = async (period: SalesPeriod) => {
    setTotalMoneyPeriod(period);
    setTotalMoneyLoading(true);
    try {
      const periodSales = await fetchSalesByPeriod(period);
      setTotalMoney(periodSales);
    } catch (error) {
      console.error('Error fetching period sales:', error);
    } finally {
      setTotalMoneyLoading(false);
    }
  };
  const handleOrdersPeriodChange = async (period: SalesPeriod) => {
    setTotalOrdersPeriod(period);
    setTotalOrdersLoading(true);
    try {
      const periodOrders = await fetchOrdersByPeriod(period);
      setTotalOrders(periodOrders);
    } catch (error) {
      console.error('Error fetching period orders:', error);
    } finally {
      setTotalOrdersLoading(false);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 font-poppins">Dashboard Overview</h1>
        <div className="text-sm text-slate-500 font-poppins">
          {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Money" value={salesData.todaysSales} icon={DollarSign} prefix="₹" color="from-green-500 to-green-600" loading={loading} />
        <TotalMoneyCard value={totalMoney} period={totalMoneyPeriod} onPeriodChange={handleMoneyPeriodChange} loading={loading || totalMoneyLoading} />
        <StatCard title="Today's Orders" value={salesData.todaysOrders} icon={ShoppingCart} color="from-orange-500 to-orange-600" loading={loading} />
        <TotalOrdersCard value={totalOrders} period={totalOrdersPeriod} onPeriodChange={handleOrdersPeriodChange} loading={loading || totalOrdersLoading} />
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 font-poppins">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{
              action: "Added new stock",
              item: "Wireless Headphones",
              time: "2 minutes ago",
              color: "text-green-600"
            }, {
              action: "Updated quantity",
              item: "Smartphone Cases",
              time: "15 minutes ago",
              color: "text-blue-600"
            }, {
              action: "Order completed",
              item: "₹125 collected",
              time: "1 hour ago",
              color: "text-purple-600"
            }, {
              action: "Stock alert",
              item: "Low inventory - Tablets",
              time: "3 hours ago",
              color: "text-orange-600"
            }].map((activity, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800 font-poppins">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.item}</p>
                  </div>
                  <span className={`text-xs font-medium ${activity.color}`}>{activity.time}</span>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 font-poppins">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[{
              title: "Add New Stock",
              description: "Register new inventory items",
              color: "bg-blue-50 hover:bg-blue-100 text-blue-700"
            }, {
              title: "Update Inventory",
              description: "Modify existing stock levels",
              color: "bg-green-50 hover:bg-green-100 text-green-700"
            }, {
              title: "View Reports",
              description: "Check sales and inventory reports",
              color: "bg-purple-50 hover:bg-purple-100 text-purple-700"
            }, {
              title: "Manage Orders",
              description: "Process pending orders",
              color: "bg-orange-50 hover:bg-orange-100 text-orange-700"
            }].map((action, index) => <button key={index} className={`w-full p-4 rounded-lg ${action.color} transition-all duration-200 hover:shadow-md text-left`}>
                  <h4 className="font-semibold font-poppins">{action.title}</h4>
                  <p className="text-sm opacity-80">{action.description}</p>
                </button>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Dashboard;