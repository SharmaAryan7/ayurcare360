import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistoryTable = ({ orders = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShoppingBag size={18} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Pharmacy Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Order ID</th>
              <th className="px-6 py-4 font-extrabold">Date</th>
              <th className="px-6 py-4 font-extrabold">Amount</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
              <th className="px-6 py-4 font-extrabold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No pharmacy orders.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.order_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.order_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-[#4A7C59]">₹{Number(order.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/orders/${order.order_id}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrderHistoryTable;