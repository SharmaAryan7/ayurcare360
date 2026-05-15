import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AddProductForm from '../../components/admin/inventory/AddProductForm';
import { adminApi } from '../../api/adminApi';

const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Passing a submit handler down to the form component so the page controls the API flow
  const handleProductSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await adminApi.addNewProduct(formData);
      if (res.success) {
        navigate('/admin/inventory');
      } else {
        setError(res.message || 'Failed to add product.');
      }
    } catch (err) {
      console.error('Submission failed', err);
      setError('An error occurred while saving the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Link to="/admin/inventory" className="hover:text-[#3A6447] transition-colors">Inventory</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900">Add Product</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Add New Product</h1>
        {error && <p className="text-sm font-bold text-red-600 mt-2 bg-red-50 p-3 rounded-xl inline-block">{error}</p>}
      </div>

      <AddProductForm onSubmit={handleProductSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AdminAddProductPage;