import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EarningsHeader = ({ stats, history }) => {
    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Add Header/Title
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('Earnings & Transactions Report', 14, 22);

        // Add Summary Stats
        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Total Earnings: INR ${stats?.totalEarnings?.toLocaleString() || 0}`, 14, 40);
        doc.text(`Monthly Earnings: INR ${stats?.monthlyEarnings?.toLocaleString() || 0}`, 14, 48);

        // Prepare Table Columns and Rows
        const tableColumn = ["Transaction ID", "Date", "Time", "Patient", "Consultation", "Amount"];
        const tableRows = [];

        // Populate Rows with database history data
        if (history && history.length > 0) {
            history.forEach(trx => {
                const dateObj = trx.payment_date ? new Date(trx.payment_date) : null;
                const rowData = [
                    `TRX-${trx.id}`,
                    dateObj ? dateObj.toLocaleDateString() : 'N/A',
                    dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                    trx.patient_name || 'N/A',
                    trx.consultation_type || 'General',
                    `INR ${trx.amount}`
                ];
                tableRows.push(rowData);
            });
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 58,
            styles: { fontSize: 10, cellPadding: 4 },
            headStyles: { fillColor: [74, 124, 89] },
            alternateRowStyles: { fillColor: [253, 249, 238] }
        });

        doc.save(`Doctor_Earnings_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
            <div>
                <p className='text-amber-800 font-bold text-sm pb-3 uppercase'> Financial Overview</p>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Earnings</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleExportPDF}
                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-gray-200 border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-3xl font-bold transition-all shadow-sm"
                >
                    <Download size={15} />
                    <span className='text-xs'>Export PDF</span>
                </button>
            </div>
        </div>
    );
};

export default EarningsHeader;