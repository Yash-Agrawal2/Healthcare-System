import React, { useState, useEffect } from "react";
import RegisterPatient from "../components/RegisterPatient/RegisterPatient";
import PatientDetails from "../components/PatientDetails/PatientDetails";
import UpdateMedicalHistory from "../components/UpdateMedicalHistory/UpdateMedicalHistory";
import "./PatientPage.css";

const PatientPage = ({ contract, account }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [owner, setOwner] = useState("");

  // Get contract owner once
  useEffect(() => {
    if (contract) {
      contract.owner()
        .then(ownerAddress => setOwner(ownerAddress))
        .catch(console.error);
    }
  }, [contract]);

  async function fetchPatientDetails(patientAddress) {
    if (!contract || !account) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError("");
    setPatientDetails(null);

    try {
      // Debug: Log addresses for verification
      console.log("Current account:", account);
      console.log("Patient address:", patientAddress);
      console.log("Contract owner:", owner);

      // Check authorization in the same way as Solidity contract
      const isPatient = account.toLowerCase() === patientAddress.toLowerCase();
      const isOwner = account.toLowerCase() === owner.toLowerCase();
      
      let isAuthorizedProvider = false;
      if (!isPatient && !isOwner) {
        try {
          // Directly attempt to get details - will fail if not authorized
          await contract.getPatientDetails(patientAddress);
          isAuthorizedProvider = true;
        } catch (err) {
          console.log("Provider authorization check failed:", err.reason);
          isAuthorizedProvider = false;
        }
      }

      if (!isPatient && !isOwner && !isAuthorizedProvider) {
        throw new Error(`Address ${account} is not authorized to access ${patientAddress}'s records`);
      }

      // If authorized, fetch details
      const details = await contract.getPatientDetails(patientAddress);
      
      setPatientDetails({
        address: patientAddress,
        name: details[0],
        age: details[1].toString(),
        gender: details[2],
        medicalHistory: details[3],
      });

    } catch (error) {
      console.error("Error:", error);
      setError(error.reason || error.message || "Authorization check failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="patient-page">
      <h1>Patient Portal</h1>
      <p className="wallet-info">Connected Account: {account}</p>

      <section className="register-section">
        <h2>Register as Patient</h2>
        <RegisterPatient contract={contract} />
      </section>

      <section className="details-section">
        <h2>Fetch Patient Details</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Patient Address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => fetchPatientDetails(address)}
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? "Checking Access..." : "Get Details"}
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error.includes("not authorized") ? (
              <>
                <p>{error}</p>
                <p>To grant access, the patient must authorize your provider address.</p>
              </>
            ) : (
              error
            )}
          </div>
        )}
        <PatientDetails details={patientDetails} />
      </section>

      {patientDetails && (
        <section className="update-section">
          <h2>Update Medical History</h2>
          <UpdateMedicalHistory
            contract={contract}
            patientAddress={patientDetails.address}
            currentAccount={account}
          />
        </section>
      )}
    </div>
  );
};

export default PatientPage;