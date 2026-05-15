import React, { useState, useEffect } from 'react';
import { FileText, ChevronLeft, ChevronRight, Video, User } from 'lucide-react';

const EarningsHistoryTable = ({ history = [] }) => {
    // --- Pagination Logic ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setCurrentPage(1);
    }, [history.length]);

    const safeHistory = Array.isArray(history) ? history : [];
    const totalItems = safeHistory.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedHistory = safeHistory.slice(startIndex, endIndex);

    // Format date string safely
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-extrabold text-gray-900 px-4">Earnings History</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#FDF9EE]/50 text-xs uppercase tracking-widest text-amber-700 rounded-2xl">
                            <th className="px-8 py-3 font-bold">Transaction ID</th>
                            <th className="px-8 py-3 font-bold">Date</th>
                            <th className="px-8 py-3 font-bold">Patient / Type</th>
                            <th className="px-8 py-3 font-bold">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-transparent">
                        <tr><td colSpan="4" className="h-4"></td></tr>

                        {paginatedHistory.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-16 text-center">
                                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 text-lg font-medium">No transaction history found.</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedHistory.map((trx, index) => (
                                <tr key={trx.id || index} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-3 rounded-l-2xl">
                                        <span className="font-bold text-gray-900 text-xs">TRX-{trx.id}</span>
                                    </td>
                                    <td className="px-8 py-3">
                                        <span className="text-gray-900 text-xs font-bold block">
                                            {formatDate(trx.payment_date)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-3">
                                        <div>
                                            <p className="font-bold text-gray-900 text-xs">{trx.patient_name || 'N/A'}</p>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5 font-medium">
                                                {trx.consultation_type === 'Video' ? <Video size={14} /> : <User size={14} />}
                                                {trx.consultation_type || 'General'} Consultation
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-3 rounded-r-2xl">
                                        <span className="font-extrabold text-black text-xs">₹{Number(trx.amount).toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalItems > 0 && (
                <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FDF9EE]/30">
                    <p className="text-sm font-medium text-gray-500">
                        Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{endIndex}</span> of <span className="font-bold text-gray-900">{totalItems}</span> transactions
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                                    if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors shadow-sm ${currentPage === pageNum
                                            ? 'bg-[#4A7C59] text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarningsHistoryTable;