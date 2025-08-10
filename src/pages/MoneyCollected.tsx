
import { useState } from "react";
import { DollarSign, Search, Calendar, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MoneyRecord {
  id: number;
  orderId: string;
  stockItem: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  time: string;
  paymentMethod: string;
}

const mockMoneyRecords: MoneyRecord[] = [
  {
    id: 1,
    orderId: "ORD-001",
    stockItem: "Wireless Headphones",
    quantity: 2,
    unitPrice: 89.99,
    totalAmount: 179.98,
    date: "2024-01-15",
    time: "14:30",
    paymentMethod: "Credit Card"
  },
  {
    id: 2,
    orderId: "ORD-002",
    stockItem: "Smartphone Case",
    quantity: 5,
    unitPrice: 24.99,
    totalAmount: 124.95,
    date: "2024-01-15",
    time: "11:20",
    paymentMethod: "Cash"
  },
  {
    id: 3,
    orderId: "ORD-003",
    stockItem: "Gaming Mouse",
    quantity: 1,
    unitPrice: 55.00,
    totalAmount: 55.00,
    date: "2024-01-14",
    time: "16:45",
    paymentMethod: "Digital Wallet"
  },
  {
    id: 4,
    orderId: "ORD-004",
    stockItem: "Bluetooth Speaker",
    quantity: 3,
    unitPrice: 129.99,
    totalAmount: 389.97,
    date: "2024-01-14",
    time: "09:15",
    paymentMethod: "Credit Card"
  },
  {
    id: 5,
    orderId: "ORD-005",
    stockItem: "Phone Charger",
    quantity: 10,
    unitPrice: 19.99,
    totalAmount: 199.90,
    date: "2024-01-13",
    time: "13:25",
    paymentMethod: "Cash"
  },
];

const MoneyCollected = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredRecords = mockMoneyRecords.filter(record => {
    const matchesSearch = record.stockItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || record.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const totalAmount = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  const totalOrders = filteredRecords.length;
  const todaysRecords = filteredRecords.filter(record => record.date === "2024-01-15");
  const todaysAmount = todaysRecords.reduce((sum, record) => sum + record.totalAmount, 0);

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "Credit Card": return "bg-blue-100 text-blue-700";
      case "Cash": return "bg-green-100 text-green-700";
      case "Digital Wallet": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-slate-800 font-poppins">Money Collected</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-poppins">
          <TrendingUp className="h-4 w-4" />
          Financial Overview
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-poppins">Today's Collection</p>
                <p className="text-2xl font-bold font-poppins">${todaysAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-poppins">Total Collection</p>
                <p className="text-2xl font-bold font-poppins">${totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-poppins">Total Orders</p>
                <p className="text-2xl font-bold font-poppins">{totalOrders}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-poppins">Avg. Order Value</p>
                <p className="text-2xl font-bold font-poppins">
                  ${totalOrders > 0 ? (totalAmount / totalOrders).toFixed(2) : "0.00"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by stock item or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-slate-200 focus:border-blue-500 font-poppins"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 font-poppins">{record.stockItem}</h3>
                      <p className="text-sm text-slate-500 font-poppins">Order #{record.orderId}</p>
                    </div>
                    <Badge className={`${getPaymentMethodColor(record.paymentMethod)} font-poppins`}>
                      {record.paymentMethod}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 font-poppins">Quantity</p>
                      <p className="font-semibold text-slate-800 font-poppins">{record.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-poppins">Unit Price</p>
                      <p className="font-semibold text-slate-800 font-poppins">${record.unitPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-poppins">Date & Time</p>
                      <p className="font-semibold text-slate-800 font-poppins">
                        {record.date} at {record.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-poppins">Total Amount</p>
                      <p className="text-xl font-bold text-green-600 font-poppins">
                        ${record.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 font-poppins mb-2">No records found</h3>
            <p className="text-slate-500 font-poppins">Try adjusting your search terms or date filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoneyCollected;
