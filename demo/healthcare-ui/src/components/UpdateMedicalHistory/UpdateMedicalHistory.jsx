import React, { useState, useEffect } from "react";
import { uploadToIPFS } from "./utils/ipfs";
import "./UpdateMedicalHistory.css"; 

function UpdateMedicalHistory({ contract, patientAddress }) {
  const [ipfsHash, setIpfsHash] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkPatientRegistration();
  }, [patientAddress, contract]);

  async function checkPatientRegistration() {
    if (!contract || !patientAddress) return;
    
    try {
      setIsLoading(true);
      const details = await contract.getPatientDetails(patientAddress);
      setIsRegistered(details && details[0]);
      setIpfsHash(details[3] || "");
    } catch (err) {
      console.error("Error checking registration:", err);
      setError("Failed to check patient registration");
      setIsRegistered(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  async function handleUpload() {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setIsLoading(true);
      const hash = await uploadToIPFS(file);
      if (hash) {
        setIpfsHash(hash);
        setSuccess(`File uploaded successfully! IPFS Hash: ${hash}`);
        setError("");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        throw new Error("Upload failed - no hash returned");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file to IPFS");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate() {
    if (!isRegistered) {
      setError("Patient is not registered");
      return;
    }
    if (!ipfsHash) {
      setError("No IPFS hash to update");
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contract.updateMedicalHistory(patientAddress, ipfsHash);
      await tx.wait();
      setSuccess("Medical history updated on blockchain!");
      setError("");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update medical history");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="update-medical-container">
      <div className="update-medical-card">
        <h2 className="update-medical-title">Update Medical History</h2>
        
        {isLoading && <div className="loading-spinner"></div>}

        {!isRegistered ? (
          <div className="error-message">Patient not registered!</div>
        ) : (
          <>
            <div className="current-hash">
              <label>Current IPFS Hash:</label>
              <div className="hash-value">{ipfsHash || "No record found"}</div>
            </div>

            <div className="file-upload-section">
              <label className="file-input-label">
                Choose Medical Record
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
              </label>
              {fileName && <div className="file-name">{fileName}</div>}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="upload-button"
            >
              {isLoading ? "Uploading..." : "Upload to IPFS"}
            </button>

            <div className="hash-input">
              <label>Or enter IPFS Hash manually:</label>
              <input
                type="text"
                placeholder="Qm..."
                value={ipfsHash}
                onChange={(e) => setIpfsHash(e.target.value)}
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={!ipfsHash || isLoading}
              className="update-button"
            >
              {isLoading ? "Updating..." : "Update Medical History"}
            </button>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default UpdateMedicalHistory;