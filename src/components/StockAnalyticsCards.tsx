
import React from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStockAnalytics } from '@/hooks/useStockAnalytics';

const StockAnalyticsCards: React.FC = () => {
  const { analytics, loading } = useStockAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-100 rounded-t"></CardHeader>
            <CardContent className="h-16 bg-gray-50"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;
  const formatWeight = (weight: number) => `${weight.toFixed(1)} kg`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Monthly Stock Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Monthly Stock</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 font-poppins">
            {analytics.monthlyStock.totalProducts}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Value: {formatPrice(analytics.monthlyStock.totalValue)}
          </div>
          <div className="flex gap-1 mt-2">
            {analytics.monthlyStock.lowStockItems > 0 && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                {analytics.monthlyStock.lowStockItems} Low
              </Badge>
            )}
            {analytics.monthlyStock.outOfStockItems > 0 && (
              <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                {analytics.monthlyStock.outOfStockItems} Out
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Usage - Now shows total quantity */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Total Quantity</CardTitle>
          <Scale className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 font-poppins">
            {analytics.monthlyUsage.totalUsedQuantity}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Weight: {formatWeight(analytics.monthlyUsage.usageInKg)}
          </div>
          <div className="text-xs text-green-600">
            Value: {formatPrice(analytics.monthlyUsage.totalUsedValue)}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Spending */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Weekly Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 font-poppins">
            {formatPrice(analytics.weeklySpending.currentWeek)}
          </div>
          <div className="flex items-center text-xs mt-1">
            {analytics.weeklySpending.change > 0 ? (
              <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
            )}
            <span className={analytics.weeklySpending.change > 0 ? "text-red-600" : "text-green-600"}>
              {Math.abs(analytics.weeklySpending.change).toFixed(1)}% vs last week
            </span>
          </div>
          <div className="text-xs text-purple-600">
            Previous: {formatPrice(analytics.weeklySpending.previousWeek)}
          </div>
        </CardContent>
      </Card>

      {/* Total Amount Spent */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Total Investment</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 font-poppins">
            {formatPrice(analytics.monthlyStock.totalValue)}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Current month total
          </div>
          <div className="text-xs text-orange-600">
            Avg per item: {formatPrice(analytics.monthlyStock.totalValue / (analytics.monthlyStock.totalProducts || 1))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAnalyticsCards;
