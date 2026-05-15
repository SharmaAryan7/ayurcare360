import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { patientApi } from '../../api/patientApi';

import ProfileOverviewCard from '../../components/patient/profile/ProfileOverviewCard';
import MedicalInfoCard from '../../components/patient/profile/MedicalInfoCard';
import PersonalDetailsCard from '../../components/patient/profile/PersonalDetailsCard';
import ContactInfoCard from '../../components/patient/profile/ContactInfoCard';
import EmergencyContactCard from '../../components/patient/profile/EmergencyContactCard';

const PatientProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({});
  const [medicalInfo, setMedicalInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [emergencyInfo, setEmergencyInfo] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [personalRes, medicalRes, contactRes, emergencyRes] = await Promise.all([
        patientApi.getProfilePersonal(),
        patientApi.getProfileMedical(),
        patientApi.getProfileContact(),
        patientApi.getProfileEmergency(),
      ]);

      setPersonalInfo(personalRes.data || personalRes);
      setMedicalInfo(medicalRes.data || medicalRes);
      setContactInfo(contactRes.data || contactRes);
      setEmergencyInfo(emergencyRes.data || emergencyRes);
    } catch (error) {
      console.error("Failed to load profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const formDataToSend = new FormData();

        let formattedPersonal = { ...personalInfo };

        // 1. Format the date safely
        if (formattedPersonal.dob) {
          const d = new Date(formattedPersonal.dob);
          if (!isNaN(d.getTime())) {
            formattedPersonal.dob = d.toISOString().split('T')[0];
          } else {
            delete formattedPersonal.dob;
          }
        }

        // 2. Convert empty strings to null so Postgres doesn't crash on numbers, and append text data
        Object.keys(formattedPersonal).forEach(key => {
          if (key !== 'avatarFile' && key !== 'avatarPreview' && key !== 'avatar') {
            const val = formattedPersonal[key] === '' ? '' : formattedPersonal[key];
            if (val !== null && val !== undefined) formDataToSend.append(key, val);
          }
        });

        // 3. Append the physical image file for AWS upload
        if (personalInfo.avatarFile) {
          formDataToSend.append('avatar', personalInfo.avatarFile);
        }

        await Promise.all([
          patientApi.updateProfilePersonal(formDataToSend),
          patientApi.updateProfileContact(contactInfo),
          patientApi.updateProfileEmergency(emergencyInfo)
        ]);

        // Refresh to get the live AWS S3 URL from DB
        fetchProfileData();
      } catch (error) {
        console.error("Failed to save profile data:", error);
        alert("Failed to save changes. Please ensure all dates and numbers are valid.");
      }
    }
    setIsEditing(!isEditing);
  };

  const handlePersonalChange = (e) => setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleContactChange = (e) => setContactInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEmergencyChange = (e) => setEmergencyInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Replaced Base64 with URL.createObjectURL + storing actual File
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPersonalInfo(prev => ({ ...prev, avatarPreview: previewUrl, avatarFile: file }));
      window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: previewUrl }));
    }
  };

  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return typeof data === 'string' ? data.split(',').map(i => i.trim()) : [];
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(74, 124, 89);
      doc.rect(0, 0, 210, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text('AyurCure360', 105, 20, null, null, 'center');
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text('Official Patient Health Profile', 105, 28, null, null, 'center');
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 35, null, null, 'center');

      let startY = 55;

      const addSectionTable = (title, dataArray) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(44, 77, 54);
        doc.text(title, 14, startY);
        autoTable(doc, {
          startY: startY + 5,
          body: dataArray,
          theme: 'grid',
          styles: { fontSize: 11, cellPadding: 6, lineColor: [239, 235, 225], lineWidth: 0.1 },
          columnStyles: { 0: { fontStyle: 'bold', fillColor: [250, 247, 242], textColor: [100, 100, 100], cellWidth: 60 }, 1: { textColor: [0, 0, 0] } },
          margin: { left: 14, right: 14 }
        });
        startY = doc.lastAutoTable.finalY + 15;
      };

      addSectionTable('Personal Details', [
        ['Full Name', personalInfo.full_name || 'N/A'],
        ['Age & Gender', `${personalInfo.age || 'N/A'} years, ${personalInfo.gender || 'N/A'}`],
        ['Date of Birth', personalInfo.dob ? new Date(personalInfo.dob).toLocaleDateString() : 'N/A'],
        ['Ayurvedic Constitution', medicalInfo.prakriti_type || 'N/A']
      ]);

      addSectionTable('Contact Information', [
        ['Email Address', contactInfo.email || 'N/A'],
        ['Phone Number', contactInfo.phone || 'N/A'],
        ['Residential Address', (contactInfo.address || 'N/A').replace('\n', ', ')]
      ]);

      addSectionTable('Emergency Contact', [
        ['Contact Name', emergencyInfo.emergency_contact_name || 'N/A'],
        ['Relationship', emergencyInfo.emergency_contact_relation || 'N/A'],
        ['Phone Number', emergencyInfo.emergency_contact_phone || 'N/A']
      ]);

      const diseasesArray = parseList(medicalInfo.health_history);
      const allergiesArray = parseList(medicalInfo.allergies);

      addSectionTable('Clinical & Medical Overview', [
        ['Diagnosed Conditions', diseasesArray.join(', ') || 'None reported'],
        ['Known Allergies', allergiesArray.join(', ') || 'None reported'],
        ['Current Medication', medicalInfo.current_medications || 'None reported']
      ]);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('This document is electronically generated and strictly confidential.', 105, 285, null, null, 'center');

      const fileName = `${(personalInfo.full_name || 'Patient').replace(/\s+/g, '_')}_AyurCure_Profile.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("There was an issue generating the PDF. Please check the console for errors.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-[#4A7C59] font-bold text-xl">Loading Profile Data...</div>;
  }

  const overviewProfile = {
    ...personalInfo,
    prakriti_type: medicalInfo.prakriti_type
  };

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-[40px] font-extrabold text-gray-900 tracking-tight">Patient Profile</h1>
        <div className="flex items-center gap-4 mt-4">
          <div className="h-[1px] w-10 bg-gray-400"></div>
          <p className="text-[10px] font-extrabold text-green-700 uppercase tracking-widest">
            MEMBER SINCE {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pass the avatarPreview down so the UI updates instantly before saving */}
        <ProfileOverviewCard
          profile={{ ...overviewProfile, avatar: personalInfo.avatarPreview || overviewProfile.avatar }}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onChange={handlePersonalChange}
          onImageUpload={handleImageUpload}
          onDownloadPDF={handleDownloadPDF}
        />
        <MedicalInfoCard medical={medicalInfo} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PersonalDetailsCard profile={personalInfo} isEditing={isEditing} onChange={handlePersonalChange} />
        <ContactInfoCard profile={contactInfo} isEditing={isEditing} onChange={handleContactChange} />
        <EmergencyContactCard emergency={emergencyInfo} isEditing={isEditing} onChange={handleEmergencyChange} />
      </div>
    </div>
  );
};

export default PatientProfilePage;