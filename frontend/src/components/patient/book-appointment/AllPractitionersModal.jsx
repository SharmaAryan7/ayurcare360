import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import PractitionerModalCard from './PractitionerModalCard';

const AllPractitionersModal = ({ isOpen, onClose, onSelectDoctor, doctors = [], isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  if (!isOpen) return null;

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty || d.specialization).filter(Boolean))];

  const filteredDoctors = doctors.filter(doc => {
    const docName = doc.name || doc.full_name || '';
    const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase());
    const docSpec = doc.specialty || doc.specialization;
    const matchesFilter = activeFilter === 'All' || docSpec === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="p-6 md:p-8 border-b border-[#EFEBE1] flex justify-between items-center bg-[#FDF9EE]">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Select Practitioner</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Choose from our verified clinical experts</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 shadow-sm border border-[#EFEBE1] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-[#EFEBE1] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full pb-2 sm:pb-0 hide-scrollbar">
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setActiveFilter(spec)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === spec ? 'bg-[#3A6447] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto bg-gray-50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] h-[220px] animate-pulse flex flex-col justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                </div>
              ))
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map(doctor => {
                // THE FIX: Intercept the select function so it strictly passes the DB doctor_id
                const docId = doctor.doctor_id || doctor.id || doctor._id;
                return (
                  <PractitionerModalCard 
                    key={docId} 
                    doctor={doctor} 
                    onSelect={() => onSelectDoctor(docId)} // Enforce the correct ID here!
                  />
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12 text-gray-500 font-medium">
                No practitioners found matching your criteria.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllPractitionersModal;