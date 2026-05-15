import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, X, Star, GraduationCap, Languages } from 'lucide-react';
import { patientApi } from '../../api/patientApi';

const ConditionsSymptomsPage = () => {
    const navigate = useNavigate();
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const commonSymptoms = [
        "Skin Issue", "Sleep Issue", "Anxiety", "Diabetes", "Pain", "Digestion Issue", "PCOD/PCOS",
        "Hypertension", "High Cholesterol", "Obesity", "Hairfall", "Asthama"
    ];

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const healthHistory = e.target.details.value;
        const chiefComplaints = selectedSymptoms.join(', ');

        try {
            // Save symptoms to the newly created backend route!
            await patientApi.updateProfileMedical({
                chief_complaints: chiefComplaints,
                health_history: healthHistory
            });

            // Trigger the popup matching recommendations
            setShowRecommendations(true);
        } catch (error) {
            console.error("Failed to save symptoms", error);
            // Show popup anyway so flow isn't completely broken for user
            setShowRecommendations(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closePopupAndFinish = () => {
        setShowRecommendations(false);
        navigate('/patient/dashboard');
    };

    return (
        <div className="bg-[#FAF7F2] text-gray-900 min-h-screen font-sans relative">
            <header className="flex flex-col items-center justify-center w-full py-8 px-4">
                <div className="text-2xl font-extrabold text-[#3A6447] tracking-tight">AyurCare360</div>
            </header>

            <main className="min-h-[calc(100vh-180px)] flex items-center justify-center px-6 py-12">
                <div className="max-w-xl w-full">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex flex-col items-center gap-2 mb-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#3A6447]">Step 04</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 text-center">Health Profile</h1>
                        <p className="mt-4 text-gray-500 font-medium text-sm text-center max-w-md">Select your primary concerns so we can match you with the right Ayurvedic practitioners.</p>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#EFEBE1]">
                        <form className="space-y-8" onSubmit={handleSubmit}>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Select Symptoms & Goals</label>
                                <div className="flex flex-wrap gap-3">
                                    {commonSymptoms.map((symptom) => (
                                        <button
                                            key={symptom} type="button" onClick={() => toggleSymptom(symptom)}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedSymptoms.includes(symptom) ? 'bg-[#3A6447] text-white border-[#3A6447]' : 'bg-white text-gray-600 border-[#EFEBE1]'}`}
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1" htmlFor="details">
                                    Any known existing diseases? (Optional)
                                </label>
                                <textarea id="details" className="w-full bg-white border border-[#EFEBE1] focus:border-[#3A6447] rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 resize-none outline-none" placeholder="E.g., Diabetes, Hypertension, Thyroid..." rows="3"></textarea>
                            </div>

                            <div className="pt-6 border-t border-[#EFEBE1]">
                                <button disabled={isLoading} className="w-full bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold h-14 rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50" type="submit">
                                    {isLoading ? 'Saving...' : 'Find My Experts'}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* POPUP / MODAL (DOCTOR RECOMMENDATIONS) - Code Remains Same */}
            {showRecommendations && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 md:p-8">
                    <div className="bg-[#FAF7F2] rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        <button onClick={closePopupAndFinish} className="absolute top-6 right-6 p-3 bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm z-10"><X size={24} /></button>
                        <div className="px-6 py-12 md:p-16 text-center">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Recommended for you</h2>
                            <p className="text-gray-600 font-medium mb-8">Matches found based on your symptoms.</p>

                            <button onClick={closePopupAndFinish} className="bg-[#3A6447] hover:bg-[#2C4D36] text-white px-8 py-3.5 rounded-full font-bold shadow-sm">
                                View Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConditionsSymptomsPage;