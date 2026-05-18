import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { doctorApi } from '../../api/doctorApi'; // Uncomment when your API is ready

const DoctorPrescriptionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state: One empty row
    const [medicines, setMedicines] = useState([
        { medicineName: '', tablets: '', morning: '', noon: '', evening: '', night: '' }
    ]);

    const handleAddRow = () => {
        setMedicines([...medicines, { medicineName: '', tablets: '', morning: '', noon: '', evening: '', night: '' }]);
    };

    const handleRemoveRow = (index) => {
        const updated = [...medicines];
        updated.splice(index, 1);
        setMedicines(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const validMedicines = medicines.filter(m => m.medicineName.trim() !== '');
            // Actually call the API!
            await doctorApi.submitPrescription(id, { medicines: validMedicines });
            
            alert("Prescription submitted successfully!");
            navigate('/doctor/appointments');
        } catch (error) {
            console.error("Failed to submit prescription", error);
            alert("Failed to submit prescription.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto p-6 md:p-10 bg-[#FDF9EE] min-h-full">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Write Prescription</h1>
            
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                <th className="py-4 px-3 font-bold w-1/3">Medicine Name</th>
                                <th className="py-4 px-3 font-bold w-24">Tablets</th>
                                <th className="py-4 px-2 font-bold text-center w-20">Morning</th>
                                <th className="py-4 px-2 font-bold text-center w-20">Noon</th>
                                <th className="py-4 px-2 font-bold text-center w-20">Evening</th>
                                <th className="py-4 px-2 font-bold text-center w-20">Night</th>
                                <th className="py-4 px-3 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {medicines.map((med, index) => (
                                <tr key={index} className="group">
                                    <td className="py-3 px-2">
                                        <input
                                            type="text"
                                            value={med.medicineName}
                                            onChange={(e) => handleChange(index, 'medicineName', e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:bg-white transition-all text-sm font-medium"
                                            placeholder="e.g. Paracetamol 500mg"
                                        />
                                    </td>
                                    <td className="py-3 px-2">
                                        <input
                                            type="text"
                                            value={med.tablets}
                                            onChange={(e) => handleChange(index, 'tablets', e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:bg-white transition-all text-sm font-medium text-center"
                                            placeholder="Qty"
                                        />
                                    </td>
                                    <td className="py-3 px-1 text-center">
                                        <input
                                            type="text"
                                            value={med.morning}
                                            onChange={(e) => handleChange(index, 'morning', e.target.value)}
                                            className="w-14 p-2.5 mx-auto bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:bg-white transition-all text-sm font-bold text-center uppercase"
                                            placeholder="Y/N"
                                        />
                                    </td>
                                    <td className="py-3 px-1 text-center">
                                        <input
                                            type="text"
                                            value={med.noon}
                                            onChange={(e) => handleChange(index, 'noon', e.target.value)}
                                            className="w-14 p-2.5 mx-auto bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:bg-white transition-all text-sm font-bold text-center uppercase"
                                            placeholder="Y/N"
                                        />
                                    </td>
                                    <td className="py-3 px-1 text-center">
                                        <input
                                            type="text"
                                            value={med.evening}
                                            onChange={(e) => handleChange(index, 'evening', e.target.value)}
                                            className="w-14 p-2.5 mx-auto bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:bg-white transition-all text-sm font-bold text-center uppercase"
                                            placeholder="Y/N"
                                        />
                                    </td>
                                    <td className="py-3 px-1 text-center">
                                        <input
                                            type="text"
                                            value={med.night}
                                            onChange={(e) => handleChange(index, 'night', e.target.value)}
                                            className="w-14 p-2.5 mx-auto bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:bg-white transition-all text-sm font-bold text-center uppercase"
                                            placeholder="Y/N"
                                        />
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <button
                                            onClick={() => handleRemoveRow(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove Row"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={handleAddRow}
                        className="flex items-center gap-2 text-[#4A7C59] font-bold hover:text-[#3a6146] transition-colors py-2 px-4 rounded-xl hover:bg-[#FDF9EE]"
                    >
                        <Plus size={18} /> Add Another Medicine
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A7C59] hover:bg-[#3a6146] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-sm disabled:opacity-50"
                    >
                        <CheckCircle size={18} /> {isSubmitting ? 'Saving...' : 'Submit Prescription'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorPrescriptionPage;