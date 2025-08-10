
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Package, Hash, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BillHistoryItemDetail } from "@/hooks/useBillHistory";

interface BillItemsSectionProps {
  billId: string;
  billItems: BillHistoryItemDetail[];
  loading: boolean;
  onFetchItems: (billId: string) => void;
}

const BillItemsSection: React.FC<BillItemsSectionProps> = ({
  billId,
  billItems,
  loading,
  onFetchItems
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Move useEffect to the top level - this must always be called
  useEffect(() => {
    // Only fetch items if we haven't loaded yet and there are no items
    if (!hasLoaded && billItems.length === 0) {
      onFetchItems(billId);
      setHasLoaded(true);
    }
  }, [billId, onFetchItems, hasLoaded, billItems.length]);

  const handleToggle = () => {
    if (!isExpanded && !hasLoaded) {
      onFetchItems(billId);
      setHasLoaded(true);
    }
    setIsExpanded(!isExpanded);
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  // Don't render the section if there are no items and we haven't loaded yet
  if (!hasLoaded && billItems.length === 0) {
    return null; // Don't render while loading initially
  }

  // If we've loaded and there are no items, don't render the section
  if (hasLoaded && billItems.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-purple-200 mt-4">
      <Button
        variant="ghost"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-purple-50 text-purple-700 hover:text-purple-800"
      >
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4" />
          <span className="font-medium">View Bill Items</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {billItems.length} items
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Package className="h-5 w-5 animate-spin text-purple-600 mr-2" />
              <span className="text-purple-600">Loading items...</span>
            </div>
          ) : billItems.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-900 mb-3">Bill Items:</h4>
              {billItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h5 className="font-medium text-purple-900">
                        {item.food_item_name}
                      </h5>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3 text-purple-500" />
                        <span className="text-purple-600">Qty: {item.quantity}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3 text-purple-500" />
                        <span className="text-purple-600">
                          Unit: {formatCurrency(item.unit_price)}
                        </span>
                      </div>
                      
                      <div className="font-semibold text-purple-900">
                        Total: {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-purple-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-purple-300" />
              <p>No items found for this bill</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillItemsSection;
