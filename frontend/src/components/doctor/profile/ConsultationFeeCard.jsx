import React from 'react';
import { Lock, Timer } from 'lucide-react';

const ConsultationFeeCard = ({ logistics }) => {
    if (!logistics) return null;

    // Helper to format availability and show ONLY active days matching the DB schema
    const formatAvailability = (schedule) => {
        if (!schedule) return <span className="text-white/70 text-sm">Schedule not set</span>;

        let parsedSchedule = schedule;
        
        // Parse if the database sent it as a stringified JSON
        if (typeof schedule === 'string') {
            try {
                parsedSchedule = JSON.parse(schedule);
            } catch (e) {
                // If it's a regular string, just display it
                return <span className="text-white text-sm block truncate max-w-[200px]">{schedule}</span>;
            }
        }

        // MUST match the exact keys stored in the database / settings form
        const dbDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Filter to keep ONLY the days that are set to true in the parsed data
        const activeDays = dbDays.filter((day) => {
            const val = parsedSchedule[day];
            return val === true || val === 'true';
        });

        // Fallback if no days are active
        if (activeDays.length === 0) {
            return <span className="text-white/70 text-sm font-semibold mt-1 block">No active days</span>;
        }

        return (
            <div className="flex flex-wrap gap-2 mt-1">
                {activeDays.map((day) => (
                    <span 
                        key={day} 
                        className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded"
                    >
                        {day}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="lg:col-span-1 bg-[#4A7C59] rounded-3xl p-8 shadow-sm text-white flex flex-col justify-between relative overflow-hidden h-64">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Lock size={120} />
            </div>
            <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center py-6">
                    <Lock size={20} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest bg-white/20 px-5 py-1 rounded-full">Consultation</span>
            </div>
            <div className="relative z-8">
                <h2 className="text-2xl font-black mb-2">₹{Number(logistics.consultation_fee || 0).toFixed(2)}</h2>
                <p className="text-white/80 text-sm mb-6 mt-2">Standard Consultation Fee</p>

                <div className="flex items-center gap-3 bg-[#4A7C59] p-3 rounded-2xl">
                    <div className="p-2 rounded-lg"><Timer size={16} /></div>
                    <div className="w-full">
                        <p className="text-sm text-white/70 font-bold uppercase tracking-wider mb-1">Availability</p>
                        {formatAvailability(logistics.availability_schedule)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationFeeCard;