import React from 'react';
import { CheckCircle, Clock, XCircle, Printer } from 'lucide-react';
import { adminApi } from '../../../../api/adminApi';

const OrderSummaryHeader = ({ order, orderId }) => {
  if (!order) return null;

  const handlePrint = async () => {
    try {
      const blob = await adminApi.printInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      window.open(url, '_blank');
    } catch (e) {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 
          ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
            order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
          {order.status === 'Delivered' ? <CheckCircle size={24} /> :
            order.status === 'Cancelled' ? <XCircle size={24} /> : <Clock size={24} />}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-400 mb-1">Status</p>
          <h2 className="text-2xl font-black text-gray-900">{order.status}</h2>
        </div>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-colors print:hidden">
          <Printer size={16} /> Print Invoice
        </button>
      </div>
    </div>
  );
};
export default OrderSummaryHeader;