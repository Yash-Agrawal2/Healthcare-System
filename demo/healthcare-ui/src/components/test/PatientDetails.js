import React from "react";

function PatientDetails({ details }) {
  return (
    <div>
      {details ? (
        <div>
          <p>Name: {details.name}</p>
          <p>Age: {details.age}</p>
          <p>Gender: {details.gender}</p>
          <p>Medical History: {details.medicalHistory}</p>
        </div>
      ) : (
        <p>No details available</p>
      )}
    </div>
  );
}

export default PatientDetails;