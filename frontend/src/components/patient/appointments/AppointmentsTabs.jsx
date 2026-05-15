import React, { useState } from 'react';
import { Filter, Calendar as CalendarIcon, X } from 'lucide-react';

const AppointmentsTabs = ({
  activeTab,
  setActiveTab,
  isThisMonth,
  setIsThisMonth,
  filterText,
  setFilterText
}) => {
  const [showFilterInput, setShowFilterInput] = useState(false);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-2 rounded-3xl shadow-sm border border-[#EFEBE1] mb-8 gap-3 lg:gap-0">

      {/* Left Side: Status Tabs with Mobile Scroll */}
      <div className="flex space-x-1 w-full overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 lg:px-8 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-[#4A7C59] text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-3 pr-2 w-full lg:w-auto justify-start lg:justify-end">

        {/* Toggleable Filter Button / Input */}
        {showFilterInput || filterText ? (
          <div className="relative flex items-center animate-fade-in w-full sm:w-auto mb-2 sm:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Filter doctors..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-8 py-2 text-sm font-semibold text-gray-700 bg-[#FDF9EE] rounded-xl border border-[#EFEBE1] focus:outline-none focus:ring-1 focus:ring-[#4A7C59] transition-all placeholder-gray-400 shadow-inner"
            />
            <button
              onClick={() => {
                setShowFilterInput(false);
                setFilterText(''); // Clears the filter and reverts to button
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowFilterInput(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-[#FDF9EE] rounded-xl hover:bg-[#EAE5D9] transition-colors border border-transparent hover:border-[#EFEBE1] whitespace-nowrap mb-2 sm:mb-0"
          >
            <Filter size={16} /> Filter
          </button>
        )}

        {/* This Month Button */}
        <button
          onClick={() => setIsThisMonth(!isThisMonth)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors border whitespace-nowrap mb-2 sm:mb-0 ${isThisMonth
            ? 'bg-[#4A7C59] text-white border-[#4A7C59] shadow-sm'
            : 'text-gray-600 bg-[#FDF9EE] hover:bg-[#EAE5D9] border-transparent hover:border-[#EFEBE1]'
            }`}
        >
          <CalendarIcon size={16} /> {isThisMonth ? 'Showing This Month' : 'This Month'}
        </button>

      </div>
    </div>
  );
};

export default AppointmentsTabs;