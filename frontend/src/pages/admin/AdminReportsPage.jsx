import React, { useState, useEffect } from 'react';
import { Download, Calendar, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import ReportsMetricsRow from '../../components/admin/reports/ReportsMetricsRow';
import ReportsChartsSection from '../../components/admin/reports/ReportsChartsSection';
import RevenueStreamCard from '../../components/admin/reports/RevenueStreamCard';
import TopPerformersSection from '../../components/admin/reports/TopPerformersSection';

const AdminReportsPage = () => {
  const [timeFilter, setTimeFilter] = useState('overall');
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    overall: null, last30: null, trend: [], growth: [], stream: [], products: [], consultations: []
  });

  const toggleFilter = () => setTimeFilter(prev => prev === 'overall' ? 'last30' : 'overall');

  const handleExportPDF = async () => {
    try {
      const blob = await adminApi.exportReportsPdf();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ayurcure_Report_${new Date().toISOString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      console.error("PDF Export failed", e);
      window.print(); // Fallback to browser print
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const [overall, last30, trend, growth, stream, prods, cons] = await Promise.all([
          adminApi.getOverallReportDetails(),
          adminApi.getLast30DaysDetails(),
          adminApi.getOrderTrend(),
          adminApi.getRevenueGrowth(),
          adminApi.getRevenueStreamAnalysis(),
          adminApi.getTopPerformingProducts(),
          adminApi.getTopConsultations()
        ]);
        setReportData({
          overall: overall.data, last30: last30.data, trend: trend.trend,
          growth: growth.growth, stream: stream.stream, products: prods.products, consultations: cons.consultations
        });
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  // Determine which metric data to show based on filter
  const currentMetrics = timeFilter === 'overall' ? reportData.overall : reportData.last30;

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300 h-full flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
            Reports
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Analytics overview for the current fiscal period.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div onClick={toggleFilter} className="bg-white border border-[#EFEBE1] px-4 py-3.5 rounded-full flex items-center gap-2 text-sm font-bold text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <Calendar size={16} className="text-gray-400" />
            {timeFilter === 'overall' ? 'Overall' : 'Last 30 Days'}
          </div>
          <button onClick={handleExportPDF} className="bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-3.5 px-6 rounded-full flex items-center gap-2 transition-colors shadow-sm text-sm print:hidden">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <ReportsMetricsRow metrics={currentMetrics} />
      <ReportsChartsSection trend={reportData.trend} growth={reportData.growth} />
      <RevenueStreamCard stream={reportData.stream} />
      <TopPerformersSection products={reportData.products} consultations={reportData.consultations} />
      <div className="h-10"></div>
    </div>
  );
};

export default AdminReportsPage;