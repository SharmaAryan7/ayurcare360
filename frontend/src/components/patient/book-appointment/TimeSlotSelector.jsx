import React from 'react';

const TimeSlotSelector = ({ selectedDate, onDateChange, minDate, maxDate, slots, selectedTime, onSelectTime, isLoading }) => {
  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Available Slots</h3>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[1, 2, 3, 4].map((i) => <div key={i} className="py-6 rounded-xl bg-gray-100 animate-pulse"></div>)}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Available Slots</h3>
        {/* THE FIX: Fully functional 7-Day Date Picker! */}
        <input 
            type="date" 
            min={minDate} 
            max={maxDate} 
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-sm font-bold text-[#3A6447] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3A6447] cursor-pointer"
        />
      </div>

      {slots && slots.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mb-10">
          {slots.map((slot, index) => {
            // SAFE PARSING
            let isBooked = false;
            let timeLabel = "Invalid Time";

            if (typeof slot === 'string') {
                timeLabel = slot;
            } else if (slot && typeof slot === 'object') {
                isBooked = slot.isBooked === true || slot.is_booked === true;
                if (slot.timeStr) timeLabel = slot.timeStr;
                else if (slot.time) timeLabel = slot.time;
                else if (slot.start_time) {
                    const dateObj = new Date(slot.start_time);
                    if (!isNaN(dateObj.getTime())) timeLabel = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }
            }

            const isSelected = selectedTime === timeLabel;

            return (
              <button
                key={index}
                disabled={isBooked}
                onClick={() => onSelectTime(timeLabel)}
                className={`py-3 rounded-xl text-sm font-bold transition-all border flex flex-col items-center justify-center ${
                    isBooked 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70' 
                      : isSelected
                      ? 'bg-[#3A6447] text-white border-[#3A6447] shadow-md'
                      : 'bg-[#FDF9EE] text-gray-700 border-transparent hover:bg-[#F4F1EB]'
                  }`}
              >
                <span>{timeLabel}</span>
                {isBooked && <span className="text-[10px] font-normal mt-0.5">(Booked)</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mb-10 text-sm font-medium text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
          No available slots for this date.
        </div>
      )}
    </>
  );
};

export default TimeSlotSelector;