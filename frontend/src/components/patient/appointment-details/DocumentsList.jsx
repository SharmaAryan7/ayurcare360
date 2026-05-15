import React from 'react';
import { FileText, Download } from 'lucide-react';

const DocumentsList = ({ documents, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-20 bg-gray-100 rounded-2xl"></div>
          <div className="h-20 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const safeDocs = Array.isArray(documents) ? documents : [];

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Related Documents</h3>
        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
          {safeDocs.length} Files
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeDocs.length > 0 ? (
          safeDocs.map((doc, idx) => {
            const docDate = doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '--';
            
            return (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-[#EFEBE1] hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FDF9EE] rounded-xl flex items-center justify-center text-[#8B6A47] shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5 truncate max-w-[200px]">{doc.document_name || 'Document.pdf'}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                    <span>{docDate}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{doc.document_type || 'PDF'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => doc.file_url && window.open(`http://localhost:5000${doc.file_url}`, '_blank')}
                className="w-10 h-10 rounded-full bg-white border border-[#EFEBE1] flex items-center justify-center text-gray-400 hover:text-[#4A7C59] hover:border-[#4A7C59] transition-colors shadow-sm shrink-0"
              >
                <Download size={16} />
              </button>
            </div>
          )})
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-6 text-gray-500 text-sm font-medium border border-dashed border-gray-300 rounded-2xl">
            No documents attached to this appointment.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsList;