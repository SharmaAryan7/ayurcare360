import React from 'react';
import { ShieldAlert } from 'lucide-react';

const CancellationPolicyCard = () => {
  return (
    <div className="bg-[#FDFBF7] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white p-2 rounded-xl text-[#8B6A47] shadow-sm">
          <ShieldAlert size={18} />
        </div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Cancellation Policy</h4>
      </div>
      <p className="text-xs text-gray-500 font-medium leading-relaxed">
        Cancellations made within 24 hours of the appointment time may be subject to a nominal fee.
        Refunds for prepaid consultations are processed within 3-5 business days.
        For emergencies, please contact our help desk directly.
      </p>
    </div>
  );
};

export default CancellationPolicyCard;