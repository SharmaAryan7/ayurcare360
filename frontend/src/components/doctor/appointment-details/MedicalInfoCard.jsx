import React from 'react';
import { ClipboardList } from 'lucide-react';

const MedicalInfoCard = ({ info }) => {
    if (!info) return null;

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                    <ClipboardList size={14} />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900">Patient Medical Information</h3>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start gap-4 border-b border-gray-50 pb-4">
                    <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Allergies</span>
                    <span className="text-xs bg-[#FDF9EE] px-3 py-1 font-semibold text-red-700 text-right rounded-3xl">
                        {info.allergies || 'None reported'}
                    </span>
                </div>
                <div className="flex justify-between items-start gap-4 border-b border-gray-50 pb-4">
                    <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Chronic Conditions</span>
                    <span className="text-xs font-semibold text-gray-900 text-right">
                        {info.chronic_conditions || 'None reported'}
                    </span>
                </div>
                <div className="flex justify-between items-start gap-4 border-b border-gray-50 pb-4">
                    <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Medications</span>
                    <span className="text-xs font-semibold text-gray-900 text-right">
                        {info.current_medications || 'None reported'}
                    </span>
                </div>
                <div className="flex justify-between items-start gap-4">
                    <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Past Surgeries</span>
                    <span className="text-xs font-semibold text-gray-900 text-right">
                        {info.past_surgeries || 'None reported'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MedicalInfoCard;