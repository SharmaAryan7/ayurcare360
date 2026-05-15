import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import InventoryTable from '../../components/admin/inventory/InventoryTable';
import { Loader2 } from 'lucide-react';

const AdminInventoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          adminApi.getAllProductsPagination(1),
          adminApi.getAllCategories()
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Inventory Management
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Manage your apothecary products, track stock levels, and update pricing.
        </p>
      </div>

      <InventoryTable products={products} categories={categories} />
    </div>
  );
};

export default AdminInventoryPage;