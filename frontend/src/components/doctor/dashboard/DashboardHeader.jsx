import React from 'react';

const DashboardHeader = ({ appointmentsToday }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500">
                Welcome back. You have <span className="font-semibold text-gray-700">{appointmentsToday || 0} consultations</span> scheduled for today.
            </p>
        </div>
    );
};

export default DashboardHeader;