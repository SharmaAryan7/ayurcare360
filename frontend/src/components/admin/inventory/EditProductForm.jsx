import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Edit2, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';

const EditProductForm = ({ productId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '', category: '', sku: '', price: '', stock: '', status: '', imageFile: null
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Ensure getProductDetails(id) is in adminApi.js
                const res = await adminApi.getProductDetails(productId);
                if (res && res.data) {
                    setFormData({
                        name: res.data.name || '',
                        category: res.data.category || 'Supplements',
                        sku: res.data.sku || `SKU-${productId}`,
                        price: res.data.price || '',
                        stock: res.data.stock_quantity || '',
                        status: res.data.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
                        imageFile: null
                    });
                    setImagePreview(res.data.image_url || null);
                }
            } catch (err) {
                console.error("Failed to load product", err);
                setError("Failed to load product data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imageFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // --- THE FIX: We must use FormData to send physical files ---
            const formDataToSend = new FormData();
            
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('sku', formData.sku);
            formDataToSend.append('price', parseFloat(formData.price) || 0);
            formDataToSend.append('stock_quantity', parseInt(formData.stock, 10) || 0);
            formDataToSend.append('status', formData.status);
            
            // If the user selected an image, attach the actual file!
            if (formData.imageFile) {
                formDataToSend.append('imageFile', formData.imageFile);
            }

            // Send the FormData instead of the JSON payload
            await adminApi.addNewProduct(formDataToSend); // (Use updateProduct in the Edit form)

            window.location.href = '/admin/inventory';
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Database Error. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#3A6447]" size={32} /></div>;

    return (
        <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#EFEBE1]">
                <div className="w-12 h-12 rounded-xl bg-[#FDF9EE] text-[#D9774B] flex items-center justify-center">
                    <Edit2 size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {productId}</p>
                </div>
            </div>

            {error && <p className="text-sm font-bold text-red-600 mb-6 bg-red-50 p-3 rounded-xl inline-block w-full">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Product Image</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl border border-[#EFEBE1] overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center shadow-inner">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Product Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-400" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            <input type="file" id="productImage" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <label htmlFor="productImage" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EFEBE1] hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-full transition-colors cursor-pointer shadow-sm">
                                <UploadCloud size={16} /> Choose New Image
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all cursor-pointer">
                            <option value="Supplements">Supplements</option>
                            <option value="Skincare">Skincare</option>
                            <option value="Digestive">Digestive</option>
                            <option value="Beverage">Beverage</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">SKU</label>
                        <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price (₹)</label>
                        <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Available Stock</label>
                        <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all cursor-pointer">
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#EFEBE1]">
                    <button type="button" onClick={() => navigate('/admin/inventory')} className="px-6 py-3 bg-white border border-[#EFEBE1] text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                        <X size={16} /> Cancel
                    </button>
                    <button type="submit" disabled={isSaving} className="min-w-[160px] px-8 py-3 bg-[#3A6447] text-white hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 text-sm font-bold rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;