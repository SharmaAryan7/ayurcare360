import React from 'react';
import { Clock } from 'lucide-react';

const OrderTimeline = ({ timeline = [] }) => {
  return (
    <div className="bg-[#FDF9EE] rounded-3xl shadow-sm border border-[#EAE5D9] p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Clock size={16} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Order Timeline</h3>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-200 before:to-transparent">
        {timeline.map((event, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#FDF9EE] bg-[#3A6447] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="font-bold text-gray-900 text-sm">{event.status}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {new Date(event.date).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderTimeline;