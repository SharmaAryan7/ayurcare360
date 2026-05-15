import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';

const OrdersTable = ({ orders = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o =>
    (o.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.order_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search orders by ID or customer..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3A6447]/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Order ID</th>
              <th className="px-6 py-4 font-extrabold">Date</th>
              <th className="px-6 py-4 font-extrabold">Customer</th>
              <th className="px-6 py-4 font-extrabold">Amount</th>
              <th className="px-6 py-4 font-extrabold">Payment</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
              <th className="px-6 py-4 font-extrabold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-gray-500">No orders found.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.order_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-4 text-sm font-black text-[#3A6447]">₹{Number(order.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${order.payment_status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order.order_id}`} className="p-2 bg-gray-50 hover:bg-[#3A6447] hover:text-white text-gray-400 rounded-xl transition-colors flex items-center justify-center w-8 h-8">
                      <Eye size={16} />
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
export default OrdersTable;