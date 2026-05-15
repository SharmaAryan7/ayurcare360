import React from 'react';

const BillingForm = ({ formData, handleInputChange, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i}>
                            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-12 bg-gray-100 rounded-2xl w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const safeFormData = formData || {};

    return (
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping & Billing Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                {/* READ-ONLY FIELDS */}
                <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={safeFormData.fullName || ''}
                        readOnly
                        className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-medium text-gray-500 cursor-not-allowed focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={safeFormData.email || ''}
                        readOnly
                        className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-medium text-gray-500 cursor-not-allowed focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        name="mobile"
                        value={safeFormData.mobile || ''}
                        readOnly
                        className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-medium text-gray-500 cursor-not-allowed focus:outline-none"
                    />
                </div>

                {/* EDITABLE ADDRESS FIELDS */}
                <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Street Address <span className="text-red-500 text-sm">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        required
                        value={safeFormData.address || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition-all"
                        placeholder="House/Flat No., Street, Landmark"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        City / District <span className="text-red-500 text-sm">*</span>
                    </label>
                    <input
                        type="text"
                        name="city"
                        required
                        value={safeFormData.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition-all"
                        placeholder="e.g. Mumbai"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Postal Code <span className="text-red-500 text-sm">*</span>
                    </label>
                    <input
                        type="text"
                        name="postalCode"
                        required
                        value={safeFormData.postalCode || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition-all"
                        placeholder="e.g. 400001"
                    />
                </div>
            </div>
        </div>
    );
};

export default BillingForm;