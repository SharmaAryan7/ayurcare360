import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import StrictFlowRoute from './components/common/StrictFlowRoute';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import StickyLogo from './components/common/StickyLogo';

// Public Pages
import LandingPage from './pages/website/LandingPage';
import AboutPage from './pages/website/AboutPage';
import ContactPage from './pages/website/ContactPage';
import BlogsPage from './pages/website/BlogsPage';
import BlogDetailsPage from './pages/website/BlogDetailsPage';
import HelpDeskPage from './pages/website/HelpDeskPage';
import PrivacyPolicyPage from './pages/website/PrivacyPolicyPage';
import TermsConditionsPage from './pages/website/TermsConditionsPage';

// Authentication Pages
import SignInPage from './pages/auth/SignInPage';
import LogInPage from './pages/auth/LoginPage';
import VerifyAccountPage from './pages/auth/VerifyAccountPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfileCompletionPage from './pages/auth/ProfileCompletionPage';
import ConditionsSymptomsPage from './pages/auth/ConditionsSymptomsPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminAddDoctorPage from './pages/admin/AdminAddDoctorPage';
import AdminEditDoctorPage from './pages/admin/AdminEditDoctorPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import AdminPatientDetailsPage from './pages/admin/AdminPatientDetailsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminBlogsPage from './pages/admin/AdminBlogsPage';
import AdminAddBlogPage from './pages/admin/AdminAddBlogPage';
import AdminEditBlogPage from './pages/admin/AdminEditBlogPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAddAdminPage from './pages/admin/AdminAddAdminPage';
import AdminEditAdminPage from './pages/admin/AdminEditAdminPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminAddProductPage from './pages/admin/AdminAddProductPage';
import AdminEditProductPage from './pages/admin/AdminEditProductPage';

// Doctor Pages
import DoctorLayout from './components/doctor/layout/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAppointmentDetails from './pages/doctor/DoctorAppointmentDetails';
import DoctorEarnings from './pages/doctor/DoctorEarnings';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorSettings from './pages/doctor/DoctorSettings';

// Patient Pages
import PatientLayout from './components/patient/layout/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientAppointmentDetails from './pages/patient/PatientAppointmentDetails';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import PatientPrescriptionsPage from './pages/patient/PatientPrescriptionsPage';
import PatientHealthReportsPage from './pages/patient/PatientHealthReportsPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PatientSettingsPage from './pages/patient/PatientSettingsPage';
import PatientOrderDetailsPage from './pages/patient/PatientOrderDetailsPage';
import DoctorRecommendationsPage from './pages/patient/DoctorRecommendationsPage';
import ConsultationPaymentPage from './pages/patient/ConsultationPaymentPage';

// Pharmacy Pages
import PharmacyStore from './pages/patient/PharmacyStore';
import ProductDetails from './pages/patient/ProductDetails';
import CartSummary from './pages/patient/CartSummary';
import CheckoutPage from './pages/patient/CheckoutPage';
import PharmacyOrdersPage from './pages/patient/PharmacyOrdersPage';

// Consultation
import VideoConsultationRoom from './pages/patient/VideoConsultationRoom';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage isLoggedIn={false} userRole="patient" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetailsPage />} />
          <Route path="/help" element={<HelpDeskPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />

          {/* --- AUTHENTICATION ROUTES --- */}
          <Route path="/signup" element={<SignInPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/verify" element={<VerifyAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile-completion" element={<ProfileCompletionPage />} />
          <Route path="/symptoms" element={<ConditionsSymptomsPage />} />

          {/* --- ADMIN SECURE ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="doctors" element={<AdminDoctorsPage />} />
              <Route path="doctors/add" element={<AdminAddDoctorPage />} />
              <Route path="doctors/edit/:id" element={<AdminEditDoctorPage />} />
              <Route path="patients" element={<AdminPatientsPage />} />
              <Route path="patients/:id" element={<AdminPatientDetailsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="blogs" element={<AdminBlogsPage />} />
              <Route path="blogs/add" element={<AdminAddBlogPage />} />
              <Route path="blogs/edit/:id" element={<AdminEditBlogPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="settings/add-admin" element={<AdminAddAdminPage />} />
              <Route path="settings/edit-admin/:id" element={<AdminEditAdminPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="inventory/add" element={<AdminAddProductPage />} />
              <Route path="inventory/edit/:id" element={<AdminEditProductPage />} />
            </Route>
          </Route>

          {/* --- DOCTOR SECURE ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="appointments/:id" element={<DoctorAppointmentDetails />} />
              <Route path="earnings" element={<DoctorEarnings />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="settings" element={<DoctorSettings />} />
            </Route>
            <Route path="/doctor/consultation/room/:appointmentId" element={<VideoConsultationRoom />} />
          </Route>

          {/* --- PATIENT SECURE ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient" element={<PatientLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="recommendations" element={<DoctorRecommendationsPage />} />
              <Route path="book-appointment" element={<BookAppointmentPage />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="appointments/:id" element={<PatientAppointmentDetails />} />
              <Route path="pharmacy-store" element={<PharmacyStore />} />
              <Route path="pharmacy-store/:id" element={<ProductDetails />} />
              <Route path="cart" element={<CartSummary />} />
              <Route element={<StrictFlowRoute requiredStateKey="fromCart" fallbackRoute="/patient/cart" />}>
                <Route path="checkout" element={<CheckoutPage />} />
              </Route>
              <Route path="pharmacy-orders" element={<PharmacyOrdersPage />} />
              <Route path="pharmacy-orders/:id" element={<PatientOrderDetailsPage />} />
              <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
              <Route path="health-records" element={<PatientHealthReportsPage />} />
              <Route path="profile" element={<PatientProfilePage />} />
              <Route path="settings" element={<PatientSettingsPage />} />
              <Route element={<StrictFlowRoute requiredStateKey="fromAppointmentSetup" fallbackRoute="/patient/dashboard" />}>
                <Route path="consultation/payment" element={<ConsultationPaymentPage />} />
              </Route>
            </Route>
            <Route path="/patient/consultation/room/:appointmentId" element={<VideoConsultationRoom />} />
          </Route>

          {/* --- FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <StickyLogo />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;