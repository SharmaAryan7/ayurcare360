import React from 'react';
import { Package } from 'lucide-react';

const ItemsOrderedTable = ({ items = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={16} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Items Ordered</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Product Name</th>
              <th className="px-6 py-4 font-extrabold">Quantity</th>
              <th className="px-6 py-4 font-extrabold">Price</th>
              <th className="px-6 py-4 font-extrabold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.product_name}</td>
                <td className="px-6 py-4 font-medium text-gray-500 text-sm">x{item.quantity}</td>
                <td className="px-6 py-4 font-medium text-gray-500 text-sm">₹{Number(item.price).toLocaleString()}</td>
                <td className="px-6 py-4 font-black text-gray-900 text-sm text-right">
                  ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ItemsOrderedTable;