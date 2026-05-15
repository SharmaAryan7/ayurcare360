import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';

import EarningsHeader from '../../components/doctor/earnings/EarningsHeader';
import EarningsSummary from '../../components/doctor/earnings/EarningsSummary';
import EarningsHistoryTable from '../../components/doctor/earnings/EarningsHistoryTable';

const DoctorEarnings = () => {
    // Grab the global search query from DoctorLayout
    const { searchQuery = '' } = useOutletContext() || {};

    const [isLoading, setIsLoading] = useState(true);
    const [earningsData, setEarningsData] = useState({
        stats: { totalEarnings: 0, monthlyEarnings: 0 },
        history: []
    });

    useEffect(() => {
        const fetchEarnings = async () => {
            setIsLoading(true);
            try {
                const [totalRes, monthlyRes, historyRes] = await Promise.all([
                    doctorApi.getTotalEarnings(),
                    doctorApi.getMonthlyEarning(),
                    doctorApi.getEarningHistory()
                ]);

                setEarningsData({
                    stats: {
                        totalEarnings: totalRes.success ? totalRes.total : 0,
                        monthlyEarnings: monthlyRes.success ? monthlyRes.monthly : 0
                    },
                    history: historyRes.success ? historyRes.history : []
                });
            } catch (error) {
                console.error("Failed to load earnings data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    // Filter history based on search query (Transaction ID or Patient Name)
    const filteredHistory = earningsData.history.filter(trx =>
        (trx.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trx.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#FDF9EE]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
            <EarningsHeader stats={earningsData.stats} history={filteredHistory} />
            <EarningsSummary stats={earningsData.stats} />
            <EarningsHistoryTable history={filteredHistory} />
        </div>
    );
};

export default DoctorEarnings;