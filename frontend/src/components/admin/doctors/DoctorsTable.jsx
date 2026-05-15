import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Trash2, Plus, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteDoctorModal from './DeleteDoctorModal';

const DoctorsTable = ({ doctors = [], onDelete }) => {
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // States for Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');

  // Dynamically get unique specializations from the data for the dropdown
  const uniqueSpecs = ['All', ...new Set(doctors.map(doc => doc.specialization).filter(Boolean))];

  // Derived state to get the currently filtered and searched doctors
  const displayedDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const nameMatch = (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = (doc.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || emailMatch;
      const matchesSpec = filterSpec === 'All' || doc.specialization === filterSpec;

      return matchesSearch && matchesSpec;
    });
  }, [doctors, searchQuery, filterSpec]);

  const handleSelectAll = (e) => {
    // Only select currently visible doctors when searching/filtering
    if (e.target.checked) setSelectedIds(displayedDoctors.map(d => d.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleConfirmDelete = async () => {
    // Loop through selected IDs and trigger the onDelete API prop
    for (const id of selectedIds) {
      if (onDelete) await onDelete(id);
    }
    setSelectedIds([]);
    setIsDeleteModalOpen(false);
  };

  const selectedDoctorName = selectedIds.length === 1 ? doctors.find(d => d.id === selectedIds[0])?.name : '';

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 border border-[#EFEBE1] shadow-sm flex flex-col h-full relative">

      <DeleteDoctorModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedIds.length}
        doctorName={selectedDoctorName}
      />

      {/* Header Actions - Flex row on large screens, stack on mobile */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row flex-1 gap-4">
          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-full py-3 pl-10 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all"
            />
          </div>
          {/* Made filter visible on all sizes since it's useful */}
          <div className="relative w-full sm:w-48">
            <select
              value={filterSpec}
              onChange={(e) => setFilterSpec(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-full py-3 pl-5 pr-10 text-sm font-bold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 cursor-pointer truncate"
            >
              {uniqueSpecs.map(spec => (
                <option key={spec} value={spec}>{spec === 'All' ? 'All Specializations' : spec}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button disabled={selectedIds.length === 0} onClick={() => setIsDeleteModalOpen(true)} className="bg-[#D92D20] hover:bg-[#B42318] disabled:bg-red-200 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors text-sm w-full sm:w-auto cursor-pointer whitespace-nowrap">
            <Trash2 size={16} /> Delete Selected
          </button>
          <button onClick={() => navigate('/admin/doctors/add')} className="bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors text-sm w-full sm:w-auto shrink-0 cursor-pointer whitespace-nowrap">
            <Plus size={16} /> Add Doctor
          </button>
        </div>
      </div>

      {/* HORIZONTAL OVERFLOW WRAPPER FOR TABLE */}
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 border-b border-[#EFEBE1]">
            <div className="w-12 pl-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#3A6447] focus:ring-[#3A6447] cursor-pointer"
                checked={selectedIds.length === displayedDoctors.length && displayedDoctors.length > 0}
                onChange={handleSelectAll}
              />
            </div>
            <div className="w-[25%]">Name</div>
            <div className="w-[25%]">Specialization</div>
            <div className="w-[15%]">Experience</div>
            <div className="w-[15%]">Fees</div>
            <div className="w-[15%]">Status</div>
            <div className="w-[10%] text-right pr-2">Action</div>
          </div>

          {/* Table Body */}
          <div className="mt-2 space-y-1 min-h-[300px]">
            {displayedDoctors.length === 0 ? (
              <div className="text-center py-10 text-sm font-bold text-gray-400">No doctors match your search.</div>
            ) : (
              displayedDoctors.map((doc) => {
                // FIX: Safely detects whichever fee property the backend returns
                const finalFee = doc.consultation_fee || doc.consultation_fees || doc.fees || doc.fee;
                
                return (
                  <div key={doc.id} className="flex items-center py-4 border-b border-transparent hover:border-[#EFEBE1] hover:bg-[#FDF9EE]/50 rounded-2xl transition-colors px-2 -mx-2">

                    <div className="w-12 shrink-0">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#3A6447] focus:ring-[#3A6447] cursor-pointer"
                        checked={selectedIds.includes(doc.id)}
                        onChange={(e) => handleSelectOne(e, doc.id)}
                      />
                    </div>

                    <div className="w-[25%] flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/admin/doctors/edit/${doc.id}`)}>
                      {/* FIX: Displays Database Avatar if exists, otherwise uses UI initials */}
                      <img
                        src={doc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'Doc')}&background=FDF9EE&color=3A6447`}
                        alt={doc.name}
                        className="w-10 h-10 rounded-full border border-[#EFEBE1] shadow-sm object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 hover:text-[#3A6447] transition-colors truncate pr-2">{doc.name}</p>
                        <p className="text-[11px] font-medium text-gray-500 truncate pr-2">{doc.email}</p>
                      </div>
                    </div>

                    <div className="w-[25%] text-sm font-medium text-gray-600 truncate pr-2">{doc.specialization || 'N/A'}</div>
                    <div className="w-[15%] text-sm font-medium text-gray-600 truncate pr-2">{doc.experience ? `${doc.experience} Years` : 'N/A'}</div>
                    
                    {/* FIX: Renders the dynamically mapped fee */}
                    <div className="w-[15%] text-sm font-bold text-gray-900 truncate pr-2">{finalFee ? `₹${finalFee}` : 'N/A'}</div>

                    <div className="w-[15%]">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap ${doc.status === 'Verified' ? 'bg-[#E7F3EB] text-[#3A6447]' : 'bg-[#FDF1E8] text-[#D9774B]'}`}>
                        {doc.status === 'Verified' ? 'ACTIVE' : 'PENDING'}
                      </span>
                    </div>

                    <div className="w-[10%] text-right pr-4 flex justify-end">
                      <div className="relative group">
                        <button
                          onClick={() => navigate(`/admin/doctors/edit/${doc.id}`)}
                          className="text-gray-400 hover:text-[#3A6447] transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Edit2 size={16} />
                        </button>

                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-sm">
                          Edit Doctor
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-[#EFEBE1] gap-4">
        <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center sm:text-left">
          Showing {displayedDoctors.length > 0 ? 1 : 0} to {displayedDoctors.length} of {displayedDoctors.length} Doctors
        </p>
        <div className="flex items-center gap-1 text-sm font-bold">
          <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"><ChevronLeft size={16} /></button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[#3A6447] text-white shadow-sm">1</button>
          <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>

    </div>
  );
};

export default DoctorsTable;