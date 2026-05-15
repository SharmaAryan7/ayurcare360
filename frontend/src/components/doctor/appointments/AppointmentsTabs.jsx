import React from 'react';

const AppointmentsTabs = ({ tabs = [], activeTab, onTabChange }) => {
    if (!tabs || tabs.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 mb-8">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${activeTab === tab
                        ? 'bg-[#4A7C59] text-white shadow-md'
                        : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-gray-200 shadow-sm'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default AppointmentsTabs;