
import { useState } from "react";
import { Plus, Package, DollarSign, Hash, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AddStock = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Electronics",
    "Accessories",
    "Office",
    "Home & Garden",
    "Sports",
    "Clothing",
    "Books",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quantity || !formData.category || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Stock Added Successfully!",
      description: `${formData.name} has been added to your inventory.`,
    });
    
    // Reset form
    setFormData({
      name: "",
      quantity: "",
      category: "",
      price: "",
    });
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Plus className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800 font-poppins">Add New Stock</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 font-poppins">Stock Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 font-poppins">
                      Product Name *
                    </Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-slate-700 font-poppins">
                      Category *
                    </Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="pl-10 border-slate-200 focus:border-blue-500 font-poppins">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm font-medium text-slate-700 font-poppins">
                      Quantity *
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-slate-700 font-poppins">
                      Price *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="pl-10 border-slate-200 focus:border-blue-500 font-poppins"
                        min="0"
                        required
                      />
                    </div>
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
                        Adding Stock...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Stock
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ name: "", quantity: "", category: "", price: "" })}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 font-poppins"
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-800 font-poppins mb-4">Preview</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-slate-500 font-poppins">Product Name</p>
                  <p className="font-semibold text-slate-800 font-poppins">{formData.name || "Not specified"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-slate-500 font-poppins">Category</p>
                  <p className="font-semibold text-slate-800 font-poppins">{formData.category || "Not selected"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-slate-500 font-poppins">Quantity</p>
                  <p className="font-semibold text-slate-800 font-poppins">{formData.quantity || "0"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-slate-500 font-poppins">Price</p>
                  <p className="font-semibold text-green-600 font-poppins">
                    ${formData.price ? parseFloat(formData.price).toFixed(2) : "0.00"}
                  </p>
                </div>
                {formData.quantity && formData.price && (
                  <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-slate-500 font-poppins">Total Value</p>
                    <p className="text-lg font-bold text-blue-600 font-poppins">
                      ${(parseFloat(formData.quantity) * parseFloat(formData.price)).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 font-poppins mb-4">Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-poppins">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  Use descriptive product names for better searchability
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  Double-check quantities before submitting
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  Select the most appropriate category for easy filtering
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  Include cents in pricing for accuracy
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
