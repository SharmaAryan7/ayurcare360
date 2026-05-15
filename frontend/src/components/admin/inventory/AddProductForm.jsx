import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import imageCompression from 'browser-image-compression'; // 🚨 IMPORT ADDED

const AddProductForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false); // Track compression state
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '', category: 'Supplements', sku: '', price: '', stock: '', status: 'In Stock', imageFile: null
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 🚨 THE FIX: Compress the image instantly on the frontend
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsCompressing(true);
            try {
                // Compression settings: Max 200KB, Max 1080p resolution
                const options = {
                    maxSizeMB: 0.2,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);

                setFormData({ ...formData, imageFile: compressedFile });
                setImagePreview(URL.createObjectURL(compressedFile));
            } catch (error) {
                console.error("Compression Error:", error);
                alert("Failed to process image. Try a different file.");
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // We must use FormData to package physical files alongside text
            const formDataToSend = new FormData();

            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('sku', formData.sku);
            formDataToSend.append('brand', 'Ayurcure');
            formDataToSend.append('price', parseFloat(formData.price) || 0);
            formDataToSend.append('stock_quantity', parseInt(formData.stock, 10) || 0);
            formDataToSend.append('status', formData.status);

            // These satisfy your database requirements
            formDataToSend.append('ingredients', '');
            formDataToSend.append('benefits', '');
            formDataToSend.append('usage_instructions', '');

            // The compressed image is attached here
            if (formData.imageFile) {
                formDataToSend.append('image', formData.imageFile);
            }

            // Send the FormData
            const res = await adminApi.addNewProduct(formDataToSend);

            if (res) {
                // Adding a random timestamp forces the browser to destroy its cache 
                // and fetch a completely fresh, updated table from the database!
                window.location.href = `/admin/inventory?refresh=${Date.now()}`;
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Database Error: Check your backend server console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total loading state
    const isLoading = isSubmitting || isCompressing;

    return (
        <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Product Image</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl border border-[#EFEBE1] overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center shadow-inner relative">
                            {isCompressing ? (
                                <Loader2 className="animate-spin text-[#3A6447]" size={24} />
                            ) : imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-400" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            <input type="file" id="productImage" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isLoading} />
                            <label htmlFor="productImage" className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EFEBE1] hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-full transition-colors cursor-pointer shadow-sm ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <UploadCloud size={16} /> {isCompressing ? 'Processing...' : 'Choose Image'}
                            </label>
                            <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG, or WEBP. Max size 2MB (Auto-compressed).</p>
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
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Initial Stock</label>
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
                    <button type="button" disabled={isLoading} onClick={() => navigate('/admin/inventory')} className="px-6 py-3 bg-white border border-[#EFEBE1] text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm font-bold rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                        <X size={16} /> Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="min-w-[160px] px-8 py-3 bg-[#3A6447] text-white hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 text-sm font-bold rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isLoading ? 'Saving...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;