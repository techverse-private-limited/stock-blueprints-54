
import React, { useState } from 'react';
import { Edit, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SupplierForm } from '@/components/SupplierForm';
import { useSuppliersWithCRUD, type Supplier } from '@/hooks/useSuppliersWithCRUD';

export const SupplierManager: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliersWithCRUD();

  const handleAddSupplier = async (supplierData: { name: string; contact_info?: string }) => {
    await addSupplier(supplierData);
  };

  const handleUpdateSupplier = async (supplierData: { name: string; contact_info?: string }) => {
    if (editingSupplier) {
      await updateSupplier(editingSupplier.id, supplierData);
      setEditingSupplier(null);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    await deleteSupplier(id);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-gray-600">Manage your stock item suppliers</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2">
              <Truck className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Supplier</DialogTitle>
            </DialogHeader>
            <SupplierForm 
              onSubmit={handleAddSupplier}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-gray-50 rounded-xl overflow-hidden">
        {suppliers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-semibold">Supplier Name</TableHead>
                <TableHead className="text-lg font-semibold">Contact Info</TableHead>
                <TableHead className="text-lg font-semibold">Created</TableHead>
                <TableHead className="text-lg font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-gray-100">
                  <TableCell className="font-semibold text-lg">{supplier.name}</TableCell>
                  <TableCell className="text-gray-600">{supplier.contact_info || 'No contact info'}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(supplier.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={editingSupplier?.id === supplier.id} onOpenChange={(open) => !open && setEditingSupplier(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSupplier(supplier)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit Supplier</DialogTitle>
                          </DialogHeader>
                          <SupplierForm 
                            supplier={editingSupplier}
                            onSubmit={handleUpdateSupplier}
                            onClose={() => setEditingSupplier(null)}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{supplier.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No suppliers found</p>
            <p className="text-gray-400">Add your first supplier to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
