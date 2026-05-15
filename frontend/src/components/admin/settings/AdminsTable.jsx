import React from 'react';
import { Shield, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminsTable = ({ admins = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-gray-900">Platform Administrators</h3>
        <Link to="/admin/settings/add-admin" className="bg-[#3A6447] text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-[#2C4D36] transition-colors">
          Add New Admin
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Administrator</th>
              <th className="px-6 py-4 font-extrabold">Role Level</th>
              <th className="px-6 py-4 font-extrabold">Email Access</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
              <th className="px-6 py-4 font-extrabold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                  No administrators found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold text-sm uppercase">
                        {admin.name ? admin.name.substring(0, 2) : <Shield size={16} />}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {admin.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${admin.role === 'super_admin' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'}`}>
                      {admin.role === 'admin' ? 'Administrator' : admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${admin.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      {admin.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end">
                    <Link to={`/admin/settings/edit-admin/${admin.id}`} className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-xl hover:bg-gray-100">
                      <MoreVertical size={16} />
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

export default AdminsTable;