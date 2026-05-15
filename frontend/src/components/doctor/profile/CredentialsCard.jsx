import React from 'react';
import { Star } from 'lucide-react';

const CredentialsCard = ({ credentials }) => {
    if (!credentials) return null;

    return (
        <div className="bg-[#EBE3D0] border border-[#DFD5BE] rounded-3xl p-8 shadow-sm flex flex-col min-h-[420px]">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center">
                    <Star size={12} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">Credentials</h3>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                <div className="flex items-start gap-5">
                    <span className="text-xl font-black text-[#c0cdc4] leading-none">01</span>
                    <div>
                        <p className="text-sm text-[#7ca689] font-black uppercase tracking-widest mb-2">Qualifications</p>
                        <p className="text-gray-900 font-bold text-xs">{credentials.qualifications || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-5">
                    <span className="text-xl font-black text-[#c0cdc4] leading-none">02</span>
                    <div>
                        <p className="text-sm text-[#7ca689] font-black uppercase tracking-widest mb-2">License Number</p>
                        <p className="text-gray-900 font-bold text-xs">{credentials.medical_license_number || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-5">
                    <span className="text-xl font-black text-[#c0cdc4] leading-none">03</span>
                    <div>
                        <p className="text-sm text-[#7ca689] font-black uppercase tracking-widest mb-2">Achievements</p>
                        <p className="text-gray-900 font-bold text-xs">{credentials.achievements || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CredentialsCard;