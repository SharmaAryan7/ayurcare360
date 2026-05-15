import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RecentOrdersTable = ({ orders = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-gray-900">Recent Orders</h3>
        <Link to="/admin/orders" className="text-sm font-bold text-[#3A6447] hover:text-[#2C4D36] flex items-center gap-1 transition-colors">
          View All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Order ID</th>
              <th className="px-6 py-4 font-extrabold">Customer</th>
              <th className="px-6 py-4 font-extrabold">Amount</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No recent orders</td></tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.order_id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-black text-[#3A6447]">₹{Number(order.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
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
export default RecentOrdersTable;