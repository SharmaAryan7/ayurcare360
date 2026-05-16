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

  const [activeTab, setActiveTab] = useState('all');
  const [isThisMonth, setIsThisMonth] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentApi.getAll();
        const dataArray = response.appointments || response.data || response || [];
        const validArray = Array.isArray(dataArray) ? dataArray : [];

        // FRONTEND TIME-CHECK LOGIC (Bullet-proof Date Parser)
        const now = new Date();
        const processedArray = validArray.map(apt => {
          
          // Check both status keys just in case
          const currentStatus = apt.status || apt.appointment_status;
          
          if (currentStatus === 'Scheduled' || currentStatus === 'Pending') {
            let aptDate = null;

            // 1. Try to parse an exact ISO timestamp if available
            if (apt.start_time || apt.scheduled_at) {
                aptDate = new Date(apt.start_time || apt.scheduled_at);
            } 
            // 2. Try to combine split Date and Time fields
            else {
                const dateStr = apt.appointment_date || apt.date;
                const timeStr = apt.appointment_time || apt.time;
                
                if (dateStr && timeStr) {
                    const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
                    // Combine date and time cleanly
                    aptDate = new Date(`${cleanDate}T${timeStr.trim()}`);
                } else if (dateStr) {
                    aptDate = new Date(dateStr);
                }
            }

            // ONLY apply the override if the Date successfully parsed
            if (aptDate && !isNaN(aptDate.getTime())) {
                // Add 35 minutes (30 min consultation + 5 min buffer)
                const completionTime = new Date(aptDate.getTime() + (35 * 60 * 1000));

                if (now > completionTime) {
                    // Override BOTH possible status keys to guarantee the UI catches it
                    return { ...apt, status: 'Completed', appointment_status: 'Completed' }; 
                }
            }
          }
          return apt;
        });

        setAppointmentsData(processedArray);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const allFilteredAppointments = useMemo(() => {
    if (!appointmentsData || appointmentsData.length === 0) return [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return appointmentsData.filter(apt => {
      // Check the overridden status
      const status = (apt.status || apt.appointment_status || '').toLowerCase();

      if (activeTab !== 'all') {
        if (activeTab === 'upcoming' && status !== 'scheduled' && status !== 'upcoming' && status !== 'pending') return false;
        if (activeTab === 'completed' && status !== 'completed') return false;
        if (activeTab === 'cancelled' && status !== 'cancelled') return false;
      }

      if (isThisMonth && (apt.appointment_date || apt.date || apt.scheduled_at || apt.start_time)) {
        const aptDate = new Date(apt.appointment_date || apt.date || apt.scheduled_at || apt.start_time);
        if (aptDate.getMonth() !== currentMonth || aptDate.getFullYear() !== currentYear) return false;
      }

      if (filterText.trim() !== '') {
        const query = filterText.toLowerCase();
        const docName = (apt.doctorName || apt.doctor_name || '').toLowerCase();
        const spec = (apt.specialty || apt.specialization || '').toLowerCase();

        if (!docName.includes(query) && !spec.includes(query)) return false;
      }

      return true;
    });
  }, [appointmentsData, activeTab, isThisMonth, filterText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, isThisMonth, filterText]);

  const totalItems = allFilteredAppointments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedAppointments = allFilteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 bg-[#FDF9EE] min-h-full">
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