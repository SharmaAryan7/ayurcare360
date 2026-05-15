import React, { useState, useEffect, useMemo } from 'react';
import AppointmentsHeader from '../../components/patient/appointments/AppointmentsHeader';
import AppointmentsTabs from '../../components/patient/appointments/AppointmentsTabs';
import AppointmentsTable from '../../components/patient/appointments/AppointmentsTable';
import AppointmentInsights from '../../components/patient/appointments/AppointmentInsights';
import { appointmentApi } from '../../api/appointmentApi';

const PatientAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [activeTab, setActiveTab] = useState('all');
  const [isThisMonth, setIsThisMonth] = useState(false);
  const [filterText, setFilterText] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // You can increase this to 10 if you prefer

  // 1. Fetch ALL appointments exactly ONCE on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentApi.getAll();

        // Safely extract the array regardless of how the backend formats the JSON response
        const dataArray = response.appointments || response.data || response || [];
        setAppointmentsData(Array.isArray(dataArray) ? dataArray : []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // 2. High-Performance Filtering using useMemo
  // This automatically recalculates ONLY when filters or data change
  const allFilteredAppointments = useMemo(() => {
    if (!appointmentsData || appointmentsData.length === 0) return [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return appointmentsData.filter(apt => {
      const status = apt.status?.toLowerCase() || '';

      // A. Tab Filter: Handle "Scheduled" vs "Upcoming"
      if (activeTab !== 'all') {
        if (activeTab === 'upcoming' && status !== 'scheduled' && status !== 'upcoming') return false;
        if (activeTab === 'completed' && status !== 'completed') return false;
        if (activeTab === 'cancelled' && status !== 'cancelled') return false;
      }

      // B. Month Filter
      if (isThisMonth && (apt.date || apt.scheduled_at || apt.start_time)) {
        const aptDate = new Date(apt.date || apt.scheduled_at || apt.start_time);
        if (aptDate.getMonth() !== currentMonth || aptDate.getFullYear() !== currentYear) return false;
      }

      // C. Search Filter (Doctor Name & Specialty)
      if (filterText.trim() !== '') {
        const query = filterText.toLowerCase();
        const docName = (apt.doctorName || apt.doctor_name || '').toLowerCase();
        const spec = (apt.specialty || apt.specialization || '').toLowerCase();

        if (!docName.includes(query) && !spec.includes(query)) return false;
      }

      return true;
    });
  }, [appointmentsData, activeTab, isThisMonth, filterText]);

  // 3. Reset to Page 1 whenever a filter is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, isThisMonth, filterText]);

  // 4. Client-Side Pagination Math
  const totalItems = allFilteredAppointments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedAppointments = allFilteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
      <AppointmentsHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-medium">
          {error}
        </div>
      )}

      <AppointmentsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isThisMonth={isThisMonth}
        setIsThisMonth={setIsThisMonth}
        filterText={filterText}
        setFilterText={setFilterText}
      />

      <AppointmentsTable
        appointments={paginatedAppointments}
        loading={loading}
        activeTab={activeTab}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      <AppointmentInsights />
    </div>
  );
};

export default PatientAppointments;