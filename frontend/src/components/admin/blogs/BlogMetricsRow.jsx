import React from 'react';
import { BookOpen, TrendingUp, AlertCircle, Users } from 'lucide-react';

const BlogMetricsRow = ({ metrics, totalBlogs }) => {
  const data = [
    { title: 'Total Articles', value: totalBlogs || 0, icon: <BookOpen size={20} />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { title: 'Top Category', value: metrics?.trendingCategory || 'N/A', icon: <TrendingUp size={20} />, bg: 'bg-green-50', color: 'text-green-600' },
    { title: 'Drafts/Reviews', value: metrics?.reviewRequired || 0, icon: <AlertCircle size={20} />, bg: 'bg-amber-50', color: 'text-amber-600' },
    { title: 'Total Readers', value: Number(metrics?.totalTraffic || 0).toLocaleString(), icon: <Users size={20} />, bg: 'bg-purple-50', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {data.map((item, index) => (
        <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">{item.title}</p>
            <h3 className="text-2xl font-black text-gray-900 truncate max-w-[120px]">{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
export default BlogMetricsRow;