import React, { useState } from 'react';
// THE FIX: Added Image as ImageIcon to your imports
import { Search, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../api/adminApi';

const InventoryTable = ({ products = [], categories = [] }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [catFilter, setCatFilter] = useState('All');

    // Make sure this matches your backend port!
    const BACKEND_URL = 'http://localhost:5000';

    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = catFilter === 'All' || p.category === catFilter;
        return matchSearch && matchCat;
    });

    const getStatusColor = (status) => {
        if (status === 'In Stock') return 'bg-green-50 text-green-700';
        if (status === 'Low Stock') return 'bg-amber-50 text-amber-700';
        return 'bg-red-50 text-red-700';
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await adminApi.deleteProduct(productId);
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete. Check your backend console.");
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text" placeholder="Search products..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3A6447]/20 transition-all outline-none"
                        />
                    </div>
                    <select
                        className="bg-gray-50 py-2.5 px-4 rounded-2xl text-sm font-bold text-gray-600 outline-none border-none"
                        value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => navigate('/admin/inventory/add')}
                    className="bg-[#3A6447] text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#2C4D36] transition-colors"
                >
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
                            <th className="px-6 py-4 font-extrabold">Product</th>
                            <th className="px-6 py-4 font-extrabold">Category</th>
                            <th className="px-6 py-4 font-extrabold">Stock</th>
                            <th className="px-6 py-4 font-extrabold">Price</th>
                            <th className="px-6 py-4 font-extrabold">Status</th>
                            <th className="px-6 py-4 font-extrabold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                {/* THE FIX: Added the Image Thumbnail layout here */}
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <ImageIcon className="text-gray-300" size={16} />
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">{product.name}</span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-500 text-sm">{product.category}</td>
                                <td className="px-6 py-4 font-bold text-gray-700 text-sm">{product.stock} Units</td>
                                <td className="px-6 py-4 font-black text-[#3A6447] text-sm">₹{Number(product.price).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(product.status)}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => navigate(`/admin/inventory/edit/${product.id}`)}
                                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;