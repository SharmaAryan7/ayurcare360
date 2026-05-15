import React from 'react';

const StatCard = ({ title, value, icon, iconBgColor, iconTextColor, bottomContent }) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between h-48 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${iconBgColor} ${iconTextColor}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold tracking-wide uppercase mb-2">{title}</p>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-2xl font-extrabold text-gray-900">{value}</h2>
                    {bottomContent && (
                        <span className="text-sm font-semibold flex items-center">
                            {bottomContent}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;