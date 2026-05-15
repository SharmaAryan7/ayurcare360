import React from 'react';
import { Bell } from 'lucide-react';

const NotificationPrefsCard = ({ data, isEditing, onChange }) => {
  if (!data) return null;

  const ToggleSwitch = ({ label, description, field, value }) => (
    <div className="flex items-center justify-between py-4 border-b border-[#EFEBE1] last:border-0 last:pb-0">
      <div className="pr-4">
        <h4 className="text-sm font-bold text-gray-900 mb-1">{label}</h4>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
      </div>
      <button
        // FIXED: Now correctly passes only 2 arguments: field and the new boolean value
        onClick={() => isEditing && onChange(field, !value)}
        disabled={!isEditing}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-[#4A7C59]' : 'bg-gray-200'
          } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'
            }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EFEBE1]">
        <div className="w-10 h-10 rounded-full bg-[#FFF4E5] flex items-center justify-center text-[#D9774B]">
          <Bell size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
      </div>

      <div className="flex flex-col">
        <ToggleSwitch
          label="Appointment Updates"
          description="Receive alerts about schedule changes, cancellations, or doctor notes."
          field="appointment_updates"
          value={data.appointment_updates}
        />
        <ToggleSwitch
          label="Email Alerts"
          description="Get health reports and prescription summaries delivered to your inbox."
          field="email_alerts"
          value={data.email_alerts}
        />
        <ToggleSwitch
          label="SMS Reminders"
          description="Text message reminders 24 hours before your scheduled consultation."
          field="sms_reminders"
          value={data.sms_reminders}
        />
        <ToggleSwitch
          label="Marketing & Offers"
          description="Occasional updates about pharmacy discounts and wellness camps."
          field="marketing_emails"
          value={data.marketing_emails}
        />
      </div>
    </div>
  );
};

export default NotificationPrefsCard;