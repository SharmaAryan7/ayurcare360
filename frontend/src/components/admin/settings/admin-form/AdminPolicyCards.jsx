import React from 'react';
import { Key, Eye, ShieldCheck } from 'lucide-react';

const AdminPolicyCards = () => {
  const policies = [
    { title: "Access Logging", desc: "All administrative actions are securely logged for audit purposes.", icon: <Eye size={20} className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Role Privileges", desc: "System Administrators have full CRUD access across all domains.", icon: <Key size={20} className="text-amber-600" />, bg: "bg-amber-50" },
    { title: "Data Security", desc: "Strict adherence to HIPAA compliance and encrypted storage.", icon: <ShieldCheck size={20} className="text-green-600" />, bg: "bg-green-50" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#EFEBE1]">
      {policies.map((policy, idx) => (
        <div key={idx} className="bg-white p-6 rounded-3xl border border-[#EFEBE1] shadow-sm flex flex-col items-start gap-4">
          <div className={`p-3 rounded-xl ${policy.bg}`}>{policy.icon}</div>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900 mb-1">{policy.title}</h4>
            <p className="text-xs font-medium text-gray-500 leading-relaxed">{policy.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminPolicyCards;