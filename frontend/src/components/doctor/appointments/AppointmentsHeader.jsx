import React from 'react';

const AppointmentsHeader = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Appointments</h1>
                <p className="text-gray-500 text-xs pt-3">
                    Manage and monitor your upcoming and past patient consultations.
                </p>
            </div>
        </div>
    );
};

export default AppointmentsHeader;