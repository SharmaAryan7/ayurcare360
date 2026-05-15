import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopPerformersSection = ({ products = [], consultants = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Top Performing Products */}
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Top Performing Products</h3>
          <button
            onClick={() => navigate('/admin/inventory')}
            className="text-xs font-bold text-[#3A6447] hover:text-[#2C4D36] transition-colors cursor-pointer"
          >
            View Inventory
          </button>
        </div>

        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-gray-500 text-sm">No product data available.</p>
          ) : (
            products.map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#EFEBE1]">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-400 w-6">0{i + 1}</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{prod.name}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                      {prod.category || 'Product'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#3A6447]">
                    ₹{Number(prod.revenue || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 mt-0.5">
                    {prod.total_sold || 0} units sold
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Consultants */}
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Top Consultants</h3>
          <button
            onClick={() => navigate('/admin/doctors')}
            className="text-xs font-bold text-[#3A6447] hover:text-[#2C4D36] transition-colors cursor-pointer"
          >
            Manage Doctors
          </button>
        </div>

        <div className="space-y-4">
          {consultants.length === 0 ? (
            <p className="text-gray-500 text-sm">No consultant data available.</p>
          ) : (
            consultants.map((doc, i) => {
              // Safely extract initials from the doctor's name
              const nameParts = (doc.name || 'Unknown').split(' ');
              const initials = nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[1][0]}`
                : nameParts[0][0];

              return (
                <div key={i} className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#EFEBE1]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E7F3EB] flex items-center justify-center text-[#3A6447] font-bold text-sm shrink-0">
                      {initials.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{doc.name}</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                        {doc.specialization || 'General'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {doc.total_consults || 0} Consultations
                    </p>
                    <p className="text-[10px] font-medium text-[#D49A44] mt-0.5">
                      {doc.rating || 'N/A'} Rating
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default TopPerformersSection;