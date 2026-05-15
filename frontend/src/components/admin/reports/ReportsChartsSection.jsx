import React from 'react';
import { BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const ReportsChartsSection = ({ trend = [], growth = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Revenue Growth Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-96 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <LineChartIcon size={18} className="text-green-600" /> Revenue Growth
          </h3>
        </div>
        <div className="flex-1 w-full">
          {growth.length === 0 ? <p className="text-gray-500 flex items-center justify-center h-full">No data available.</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4A7C59" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 700 }} tickFormatter={val => `₹${val / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#4A7C59', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Area type="monotone" dataKey="revenue" stroke="#4A7C59" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Order Volume Trend */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-96 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" /> Order Volume
          </h3>
        </div>
        <div className="flex-1 w-full">
          {trend.length === 0 ? <p className="text-gray-500 flex items-center justify-center h-full">No data available.</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="orders" fill="#3A6447" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReportsChartsSection;