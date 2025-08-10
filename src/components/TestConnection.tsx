
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TestConnection: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [tableCount, setTableCount] = useState<number>(0);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        
        // Test basic connection
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .limit(1);

        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(1);

        const { data: suppliers, error: suppliersError } = await supabase
          .from('suppliers')
          .select('*')
          .limit(1);

        const { data: stockItems, error: stockItemsError } = await supabase
          .from('stock_items')
          .select('*')
          .limit(1);

        let workingTables = 0;
        if (!categoriesError) workingTables++;
        if (!productsError) workingTables++;
        if (!suppliersError) workingTables++;
        if (!stockItemsError) workingTables++;

        setTableCount(workingTables);

        if (workingTables === 4) {
          setConnectionStatus('✅ All tables connected successfully');
        } else {
          setConnectionStatus(`⚠️ ${workingTables}/4 tables accessible`);
        }

        console.log('Connection test results:', {
          categories: categoriesError ? 'Error' : 'OK',
          products: productsError ? 'Error' : 'OK',
          suppliers: suppliersError ? 'Error' : 'OK',
          stockItems: stockItemsError ? 'Error' : 'OK'
        });

      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus('❌ Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">Status: {connectionStatus}</p>
        <p className="text-sm text-gray-600">Working Tables: {tableCount}/4</p>
      </CardContent>
    </Card>
  );
};

export default TestConnection;
