
import { useState } from "react";
import { Edit, Search, Package, Hash, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Stock {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

const mockStocks: Stock[] = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", quantity: 45, price: 89.99 },
  { id: 2, name: "Smartphone Case", category: "Accessories", quantity: 120, price: 24.99 },
  { id: 3, name: "Gaming Mouse", category: "Electronics", quantity: 78, price: 55.00 },
  { id: 4, name: "Bluetooth Speaker", category: "Electronics", quantity: 32, price: 129.99 },
  { id: 5, name: "Phone Charger", category: "Accessories", quantity: 200, price: 19.99 },
];

const UpdateStock = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    quantity: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredStocks = mockStocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setFormData({
      quantity: stock.quantity.toString(),
      price: stock.price.toString(),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStock) {
      toast({
        title: "Selection Required",
        description: "Please select a stock item to update.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.quantity || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in both quantity and price fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Stock Updated Successfully!",
      description: `${selectedStock.name} has been updated in your inventory.`,
    });
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Edit className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800 font-poppins">Update Stock</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Selection */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 font-poppins">Select Stock to Update</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search stock by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
                  />
                </div>

                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.id}
                      onClick={() => handleStockSelect(stock)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedStock?.id === stock.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-800 font-poppins">{stock.name}</h4>
                          <p className="text-sm text-slate-500 font-poppins">{stock.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-700 font-poppins">Qty: {stock.quantity}</p>
                          <p className="text-sm font-medium text-green-600 font-poppins">₹{stock.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStocks.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-poppins">No stocks found matching your search.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Update Form */}
          {selectedStock && (
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 font-poppins">
                  Update: {selectedStock.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium text-slate-700 font-poppins">
                        New Quantity *
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Enter new quantity"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange("quantity", e.target.value)}
                          className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
                          min="0"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-poppins">
                        Current: {selectedStock.quantity}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium text-slate-700 font-poppins">
                        New Price *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="Enter new price"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
                          min="0"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-poppins">
                        Current: ₹{selectedStock.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-poppins flex-1 md:flex-none"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating Stock...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Update Stock
                        </div>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedStock(null);
                        setFormData({ quantity: "", price: "" });
                      }}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 font-poppins"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {selectedStock && (
            <>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-800 font-poppins mb-4">Changes Preview</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-slate-500 font-poppins">Product</p>
                      <p className="font-semibold text-slate-800 font-poppins">{selectedStock.name}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-slate-500 font-poppins">Quantity Change</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-poppins">{selectedStock.quantity}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-semibold text-slate-800 font-poppins">
                          {formData.quantity || selectedStock.quantity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-slate-500 font-poppins">Price Change</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-poppins">₹{selectedStock.price}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-semibold text-green-600 font-poppins">
                          ₹{formData.price ? parseFloat(formData.price).toFixed(2) : selectedStock.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {formData.quantity && formData.price && (
                      <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
                        <p className="text-sm text-slate-500 font-poppins">New Total Value</p>
                        <p className="text-lg font-bold text-blue-600 font-poppins">
                          ₹{(parseFloat(formData.quantity) * parseFloat(formData.price)).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 font-poppins mb-4">Update Tips</h3>
                  <ul className="space-y-2 text-sm text-slate-600 font-poppins">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      Review changes carefully before submitting
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      Consider market prices when updating
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      Update quantities after stock counts
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {!selectedStock && (
            <Card className="bg-slate-50 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 font-poppins mb-2">Select a Stock Item</h3>
                <p className="text-slate-500 font-poppins">Choose a stock item from the list above to update its quantity and price.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStock;
