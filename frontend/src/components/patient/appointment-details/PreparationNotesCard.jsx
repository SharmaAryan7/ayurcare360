import React from 'react';
import { ClipboardList, AlertCircle } from 'lucide-react';

const PreparationNotesCard = ({ notes, instructions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-full">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="h-20 bg-gray-100 rounded-2xl mb-6"></div>
      </div>
    );
  }

  // Convert the string from the DB into an array so we can list it nicely!
  const safeInstructions = instructions ? instructions.split('.').filter(i => i.trim() !== '') : [];

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#E7F3EB] p-2.5 rounded-xl text-[#4A7C59]">
          <ClipboardList size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Your Symptoms & Notes</h3>
      </div>

      <div className="bg-[#FDF9EE] border border-[#F5E6CC] rounded-2xl p-5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#EBCB8B]"></div>
        <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
          "{notes || 'No symptoms or notes provided during booking.'}"
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#FEF5D3] p-2 rounded-xl text-[#A67C00]">
          <AlertCircle size={16} />
        </div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Pre-Visit Instructions</h4>
      </div>

      {safeInstructions.length > 0 ? (
        <ul className="space-y-3">
          {safeInstructions.map((instruction, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#EBCB8B] rounded-full mt-2 shrink-0"></span>
              <span className="text-sm text-gray-600 font-medium">{instruction.trim()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No specific instructions provided for this visit.</p>
      )}
    </div>
  );
};

export default PreparationNotesCard;