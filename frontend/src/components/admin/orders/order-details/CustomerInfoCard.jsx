import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const CustomerInfoCard = ({ customer }) => {
  if (!customer) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-lg font-extrabold text-gray-900 mb-6">Customer Details</h3>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FDF9EE] text-[#4A7C59] flex items-center justify-center font-bold">
            {customer.name?.charAt(0) || 'C'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{customer.name}</p>
            <p className="text-xs text-gray-500 font-medium">Registered Patient</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span className="font-bold text-gray-700">{customer.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            <span className="font-bold text-gray-700">{customer.phone || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapPin size={16} className="text-gray-400 mt-0.5" />
            <span className="font-bold text-gray-700 leading-relaxed">{customer.shipping_address || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerInfoCard;