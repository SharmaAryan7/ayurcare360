import React from 'react';
import { FileText, Download } from 'lucide-react';
import { doctorApi } from '../../../api/doctorApi';

const ReportsList = ({ reports = [], appointmentId }) => {
    const handleDownload = async (reportId, filename) => {
        try {
            const blob = await doctorApi.downloadApptReport(appointmentId, reportId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || `report-${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Failed to download report", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-[#FDF9EE] rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8 ml-2">
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" /> Patient Reports & Documents
                </h3>
                <span className="text-xs text-gray-500 font-bold tracking-widest uppercase bg-white px-4 py-1.5 rounded-full shadow-sm">
                    {reports.length} DOCUMENTS
                </span>
            </div>

            {reports.length === 0 ? (
                <div className="p-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                    No reports uploaded for this patient yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#4A7C59]/40 transition-colors">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate" title={report.document_name}>
                                        {report.document_name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">
                                        {formatDate(report.uploaded_at)} • {report.document_type || 'Document'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(report.id, report.document_name)}
                                className="text-gray-400 group-hover:text-[#4A7C59] group-hover:bg-green-50 p-2.5 rounded-full transition-colors"
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportsList;