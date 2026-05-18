import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Activity, HeartPulse, Stethoscope, SlidersHorizontal, Download, X } from 'lucide-react';
import { patientApi } from '../../../api/patientApi';

const ITEMS_PER_PAGE = 4;

const RecentReportsList = ({ reportsData = [], isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null); // Tracks active downloads

  const [filters, setFilters] = useState({
    name: '',
    doctor: '',
    date: ''
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm h-full flex flex-col animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
        </div>
        <div className="border-b border-gray-100 pb-4 mb-4">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl shrink-0"></div>
              <div className="h-10 bg-gray-50 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Helper Function: Safely extract and format values across database schemas
  const getReportMeta = (report) => {
    const name = report.name || report.document_name || 'Unnamed Report';
    const type = report.desc || report.document_type || 'General Report';
    const doctor = report.doctor || 'Self Uploaded';
    
    // Safely transform dates whether string text, raw timestamp, or object
    const rawDate = report.date || report.uploaded_at;
    let dateStr = 'N/A';
    let timeStr = '';
    
    if (rawDate) {
      const dObj = new Date(rawDate);
      if (!isNaN(dObj.getTime())) {
        dateStr = dObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        timeStr = dObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (typeof rawDate === 'string') {
        if (rawDate.includes(',')) {
          const parts = rawDate.split(', ');
          dateStr = parts[0] || 'N/A';
          timeStr = parts[1] || '';
        } else {
          dateStr = rawDate;
        }
      }
    }

    return { name, type, doctor, dateStr, timeStr, fullDateMatchString: `${dateStr} ${timeStr}` };
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ name: '', doctor: '', date: '' });
    setCurrentPage(1);
  };

  // Pure Frontend Download Handler (No Backend API needed)
  const handleDownload = async (report) => {
    const meta = getReportMeta(report);
    setDownloadingId(report.id);

    try {
      if (!report.file_url) {
        throw new Error("No file URL found in database record.");
      }

      // 1. Fetch the file directly from the URL as a binary Blob
      const response = await fetch(report.file_url);
      if (!response.ok) throw new Error("Could not fetch the file directly.");
      
      const blob = await response.blob();
      
      // 2. Create a local URL for the downloaded Blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 3. Determine file extension and force download
      const extension = report.file_url.split('.').pop().toLowerCase();
      const cleanExtension = ['pdf', 'png', 'jpg', 'jpeg'].includes(extension) ? extension : 'pdf';
      
      link.setAttribute('download', `${meta.name.replace(/\s+/g, '_')}.${cleanExtension}`);
      document.body.appendChild(link);
      link.click();
      
      // 4. Clean up the DOM
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Frontend Blob Fetch Failed. Opening in new tab instead:", error);
      
      // Fallback: If the browser blocks the direct fetch (due to strict CORS rules on external buckets),
      // just open the file directly in a new browser tab so the patient can still see/save it.
      if (report.file_url) {
        window.open(report.file_url, '_blank');
      } else {
        alert("The file link is missing. Please re-upload the document.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredReports = (reportsData || []).filter(report => {
    const meta = getReportMeta(report);
    const matchName = meta.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchDoctor = meta.doctor.toLowerCase().includes(filters.doctor.toLowerCase());
    const matchDate = meta.fullDateMatchString.toLowerCase().includes(filters.date.toLowerCase());
    return matchName && matchDoctor && matchDate;
  });

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const activeFiltersCount = Object.values(filters).filter(val => val !== '').length;

  const getStyling = (typeString) => {
    const d = (typeString || '').toLowerCase();
    if (d.includes('blood') || d.includes('panel')) return { icon: Activity, color: 'text-red-500 bg-red-50' };
    if (d.includes('cardiac') || d.includes('heart')) return { icon: HeartPulse, color: 'text-blue-600 bg-blue-50' };
    if (d.includes('physical') || d.includes('wellness')) return { icon: Stethoscope, color: 'text-orange-600 bg-orange-50' };
    if (d.includes('nutrition') || d.includes('diet')) return { icon: FileText, color: 'text-green-600 bg-green-50' };
    return { icon: FileText, color: 'text-amber-600 bg-amber-50' };
  };

  return (
    <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            Recent Reports
            {activeFiltersCount > 0 && (
              <span className="bg-[#4A7C59] text-white text-[10px] px-2 py-0.5 rounded-full">
                {activeFiltersCount} Active Filters
              </span>
            )}
          </h3>
          <p className="text-xs font-medium text-gray-400 mt-1">Showing last 12 months of clinical data</p>
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2.5 rounded-full transition-colors flex items-center gap-2 ${isFilterOpen ? 'bg-[#EAE5D9] text-[#4A7C59]' : 'hover:bg-[#EFEBE1] text-gray-600'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {isFilterOpen && (
        <div className="mb-6 p-5 bg-[#FAF7F2] rounded-2xl border border-[#EFEBE1] flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Report Name</label>
            <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="e.g. Blood Test" className="w-full bg-white border border-[#EFEBE1] rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#4A7C59] transition-colors" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Doctor Name</label>
            <input type="text" name="doctor" value={filters.doctor} onChange={handleFilterChange} placeholder="e.g. Sharma" className="w-full bg-white border border-[#EFEBE1] rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#4A7C59] transition-colors" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Date Filter</label>
            <input type="text" name="date" value={filters.date} onChange={handleFilterChange} placeholder="e.g. May 2026" className="w-full bg-white border border-[#EFEBE1] rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#4A7C59] transition-colors" />
          </div>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="h-[38px] px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      )}

      <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 border-b border-[#EFEBE1]">
        <div className="w-[45%] pl-2">Report Name</div>
        <div className="w-[25%]">Doctor / Issuer</div>
        <div className="w-[15%]">Uploaded On</div>
        <div className="w-[15%] text-right pr-2">Action</div>
      </div>

      <div className="flex-1 space-y-2 mt-4 min-h-[280px]">
        {currentItems.length > 0 ? (
          currentItems.map((report) => {
            const meta = getReportMeta(report);
            const { icon: Icon, color } = getStyling(meta.type);
            const isDownloading = downloadingId === report.id;

            return (
              <div key={report.id} className="flex items-center py-3 group border-b border-transparent hover:border-[#EFEBE1] transition-all">
                <div className="w-[45%] flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="pr-2 truncate">
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-0.5 group-hover:text-[#4A7C59] transition-colors truncate">{meta.name}</p>
                    <p className="text-[11px] font-medium text-gray-500 truncate">{meta.type}</p>
                  </div>
                </div>
                <div className="w-[25%] text-xs font-semibold text-amber-800">
                  {meta.doctor.split(' ').map((n, i) => i === 0 ? <React.Fragment key={i}>{n} </React.Fragment> : <span key={i}><br />{n}</span>)}
                </div>
                <div className="w-[15%] text-xs font-semibold text-gray-600">
                  {meta.dateStr}{meta.timeStr && <><br /><span className="text-[10px] text-gray-400 font-medium">{meta.timeStr}</span></>}
                </div>
                <div className="w-[15%] text-right">
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={isDownloading}
                    className="bg-[#3A6447] hover:bg-[#2C4D36] text-white text-xs font-bold py-2 px-4 rounded-full flex items-center justify-center gap-1.5 ml-auto transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Download size={14} />
                    )}
                    <span className="hidden xl:inline">{isDownloading ? 'Fetching...' : 'Download'}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full pt-10 text-center">
            <FileText size={32} className="text-gray-300 mb-3" />
            <p className="text-sm font-bold text-gray-900">No reports found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or upload a new document.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#EFEBE1]">
        <p className="text-xs font-semibold text-gray-500">
          Showing {filteredReports.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length} reports
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || filteredReports.length === 0} className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentReportsList;