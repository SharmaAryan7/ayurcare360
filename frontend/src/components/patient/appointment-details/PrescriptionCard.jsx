import React, { useEffect, useState } from 'react';
import { Pill, AlertCircle, Download, FileText } from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PrescriptionCard = ({ appointmentId, status, appointmentDate, doctorName = "Your Doctor" }) => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchPrescription = async () => {
            if (status !== 'Completed') {
                setLoading(false);
                return;
            }
            try {
                const res = await appointmentApi.getPrescription(appointmentId);
                
                // ==========================================
                // DEBUG LOGS - CHECK YOUR CONSOLE!
                // ==========================================
                console.log("=== RAW BACKEND RESPONSE ===", res);
                
                // Safely extract the payload
                const payload = res?.data ? res.data : res;
                console.log("=== EXTRACTED PAYLOAD ===", payload);

                if (payload && payload.lifestyle_advice) {
                    try {
                        let parsedData = typeof payload.lifestyle_advice === 'string' 
                            ? JSON.parse(payload.lifestyle_advice) 
                            : payload.lifestyle_advice;
                        
                        if (typeof parsedData === 'string') {
                            parsedData = JSON.parse(parsedData);
                        }

                        let finalArray = [];
                        if (Array.isArray(parsedData)) {
                            finalArray = parsedData;
                        } else if (parsedData && Array.isArray(parsedData.medicines)) {
                            finalArray = parsedData.medicines;
                        }

                        console.log("=== FINAL MEDICINES ARRAY ===", finalArray);
                        setMedicines(finalArray);

                    } catch (e) {
                        console.error("=== JSON PARSE ERROR ===", e);
                    }
                } else {
                    console.log("=== NO LIFESTYLE_ADVICE FOUND IN PAYLOAD ===");
                }
            } catch (err) {
                console.error("=== API FETCH ERROR ===", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescription();
    }, [appointmentId, status]);

    const evaluateTiming = (val) => {
        if (!val) return false;
        const normalized = String(val).trim().toUpperCase();
        return normalized === 'Y' || normalized === 'YES' || normalized === 'TRUE';
    };

    const handleDownloadPDF = () => {
        if (medicines.length === 0) return;
        setIsDownloading(true);

        try {
            const doc = new jsPDF();
            
            doc.setFillColor(74, 124, 89);
            doc.rect(0, 0, 210, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("AyurCure", 14, 20);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Digital Prescription Recipient", 145, 20);

            doc.setTextColor(50, 50, 50);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Doctor: Dr. ${doctorName}`, 14, 45);
            
            doc.setFont("helvetica", "normal");
            const formattedDate = appointmentDate ? new Date(appointmentDate).toLocaleDateString() : new Date().toLocaleDateString();
            doc.text(`Date of Assessment: ${formattedDate}`, 14, 52);
            doc.text(`Reference Identifier ID: ${appointmentId.substring(0, 8).toUpperCase()}`, 14, 59);

            const tableColumn = ["Medicine Name", "Tablets / Dosage", "Morning", "Noon", "Evening", "Night"];
            const tableRows = [];

            medicines.forEach(med => {
                const medData = [
                    med.medicineName || med.medicine_name || med.name || '-',
                    med.tablets || med.dosage || med.dose || '-',
                    evaluateTiming(med.morning) ? 'Yes' : '-',
                    evaluateTiming(med.noon) ? 'Yes' : '-',
                    evaluateTiming(med.evening) ? 'Yes' : '-',
                    evaluateTiming(med.night) ? 'Yes' : '-'
                ];
                tableRows.push(medData);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 70,
                theme: 'striped',
                headStyles: { fillColor: [74, 124, 89], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 5 },
                alternateRowStyles: { fillColor: [253, 249, 238] },
                margin: { top: 10, left: 14, right: 14 }
            });

            const finalY = doc.lastAutoTable.finalY || 70;
            doc.setFontSize(10);
            doc.setTextColor(140, 140, 140);
            doc.text("Thank you for using our telehealth portal. Wishing you a continuous path to holistic health.", 14, finalY + 20);
            
            doc.save(`Prescription_${appointmentId.substring(0, 8).toUpperCase()}.pdf`);
        } catch (error) {
            console.error("Error building PDF artifact asset:", error);
            alert("Failed to build PDF generation process. Please check layout structures.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[250px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A7C59]"></div>
            </div>
        );
    }

    if (status !== 'Completed') {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[250px]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="text-blue-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Prescription Sync Pending</h3>
                <p className="text-gray-500 text-sm">Your medical directives will be loaded here automatically once processing runs complete.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-[#FDF9EE] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <FileText className="text-[#4A7C59]" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900">Digital Prescription</h3>
                        <p className="text-xs font-bold text-gray-500 tracking-wide uppercase mt-0.5">Verified Record</p>
                    </div>
                </div>
                
                {medicines.length > 0 && (
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A7C59] hover:bg-[#3a6146] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                    >
                        <Download size={16} />
                        {isDownloading ? 'Generating Print File...' : 'Download PDF Document'}
                    </button>
                )}
            </div>
            
            <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="border-b-2 border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 bg-gray-50/50">
                            <th className="py-4 px-4 font-extrabold w-1/3 rounded-tl-xl">Medicine Name</th>
                            <th className="py-4 px-3 font-extrabold text-center">Dosage Quantity</th>
                            <th className="py-4 px-3 font-extrabold text-center">Morning</th>
                            <th className="py-4 px-3 font-extrabold text-center">Noon</th>
                            <th className="py-4 px-3 font-extrabold text-center">Evening</th>
                            <th className="py-4 px-3 font-extrabold text-center rounded-tr-xl">Night</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {medicines.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-gray-500 font-medium">
                                    <Pill className="mx-auto mb-3 text-gray-300" size={32} />
                                    No medicines found tied to this consultation ledger entry.
                                </td>
                            </tr>
                        ) : (
                            medicines.map((med, idx) => {
                                const calculatedName = med.medicineName || med.medicine_name || med.name || '-';
                                const calculatedDose = med.tablets || med.dosage || med.dose || '-';

                                return (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-4 font-bold text-gray-900">
                                            {calculatedName}
                                        </td>
                                        <td className="py-4 px-3">
                                            <div className="bg-gray-100 text-gray-700 text-xs font-bold py-1 px-3 rounded-full text-center inline-block w-full">
                                                {calculatedDose}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-center">
                                            <span className={`text-sm font-extrabold ${evaluateTiming(med.morning) ? 'text-[#4A7C59]' : 'text-gray-300'}`}>
                                                {evaluateTiming(med.morning) ? 'YES' : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-center">
                                            <span className={`text-sm font-extrabold ${evaluateTiming(med.noon) ? 'text-[#4A7C59]' : 'text-gray-300'}`}>
                                                {evaluateTiming(med.noon) ? 'YES' : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-center">
                                            <span className={`text-sm font-extrabold ${evaluateTiming(med.evening) ? 'text-[#4A7C59]' : 'text-gray-300'}`}>
                                                {evaluateTiming(med.evening) ? 'YES' : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-center">
                                            <span className={`text-sm font-extrabold ${evaluateTiming(med.night) ? 'text-[#4A7C59]' : 'text-gray-300'}`}>
                                                {evaluateTiming(med.night) ? 'YES' : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrescriptionCard;