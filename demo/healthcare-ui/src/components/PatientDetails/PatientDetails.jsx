import React from 'react';
import './PatientDetails.css';

const PatientDetails = ({ details }) => {
  if (!details) {
    return <div className="patient-details empty">No patient data available. Search for a patient address.</div>;
  }

  return (
    <div className="patient-details">
      <h3>Patient Information</h3>
      <div className="detail-row">
        <span className="detail-label">Address:</span>
        <span className="detail-value">{details.address}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Name:</span>
        <span className="detail-value">{details.name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Age:</span>
        <span className="detail-value">{details.age}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Gender:</span>
        <span className="detail-value">{details.gender}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Medical History:</span>
        <span className="detail-value">{details.medicalHistory || 'No medical history recorded'}</span>
      </div>
    </div>
  );
};

export default PatientDetails;