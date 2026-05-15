import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const ContactInfoCard = ({ contact }) => {
    if (!contact) return null;

    return (
        <div className="bg-[#FDF9EE] border border-[#EBE3D0] rounded-3xl p-8 shadow-sm flex flex-col min-h-[420px]">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Phone size={12} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">Contact Info</h3>
            </div>

            <div className="flex-1 flex flex-col gap-5">
                <div>
                    <p className="text-sm text-amber-900 font-bold uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-gray-900 font-bold text-xs">{contact.phone_number || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-amber-900 font-bold uppercase tracking-widest mb-1">Email</p>
                    <p className="text-gray-900 font-bold text-xs break-all">{contact.email || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-amber-900 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <MapPin size={12} /> Clinic Address
                    </p>
                    <p className="text-gray-900 font-bold text-xs leading-relaxed">
                        {contact.clinic_address || 'Address not provided'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoCard;