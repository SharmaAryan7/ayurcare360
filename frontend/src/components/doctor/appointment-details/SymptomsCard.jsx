import React from 'react';
import { Stethoscope } from 'lucide-react';

const SymptomsCard = ({ symptoms }) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Stethoscope size={14} />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900">Symptoms / Reason for Visit</h3>
            </div>
            <div className="bg-[#FDF9EE] p-6 rounded-2xl border border-[#F5EAD4] text-xs">
                <p className="text-gray-700 italic leading-relaxed">
                    "{symptoms || 'No symptoms or reason for visit provided by the patient.'}"
                </p>
            </div>
        </div>
    );
};

export default SymptomsCard;