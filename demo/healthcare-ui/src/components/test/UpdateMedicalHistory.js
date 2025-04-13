import React, { useState, useEffect } from "react";
import { uploadToIPFS } from "../UpdateMedicalHistory/utils/ipfs";

function UpdateMedicalHistory({ contract, patientAddress }) {
    const [ipfsHash, setIpfsHash] = useState("");
    const [file, setFile] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        checkPatientRegistration();
    }, [patientAddress]);

    async function checkPatientRegistration() {
        if (contract && patientAddress) {
            try {
                const details = await contract.getPatientDetails(patientAddress);
                if (details && details[0]) {
                    setIsRegistered(true);
                    setIpfsHash(details[3]); // Load existing IPFS hash
                } else {
                    setIsRegistered(false);
                }
            } catch (error) {
                console.error("Error checking registration:", error);
                setIsRegistered(false);
            }
        }
    }

    async function handleUpload() {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        const hash = await uploadToIPFS(file);
        if (hash) {
            setIpfsHash(hash);
            alert("File uploaded successfully! IPFS Hash: " + hash);
        } else {
            alert("Failed to upload file.");
        }
    }

    async function handleUpdate() {
        if (!isRegistered) {
            alert("Patient is not registered. Register the patient first.");
            return;
        }
        if (!contract || !patientAddress || !ipfsHash) {
            alert("Missing data for update.");
            return;
        }
        try {
            const tx = await contract.updateMedicalHistory(patientAddress, ipfsHash);
            await tx.wait();
            alert("Medical history updated successfully!");
        } catch (error) {
            console.error("Error updating medical history:", error);
            alert("Failed to update history.");
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#f4f4f4",
            fontFamily: "Arial, sans-serif",
        }}>
            <div style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                width: "300px",
                textAlign: "center",
            }}>
                <h2 style={{ color: "#333" }}>Update Medical History</h2>

                {isRegistered ? (
                    <>
                        <p>Current IPFS Hash: {ipfsHash || "No record found"}</p>

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <button onClick={handleUpload}
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                padding: "10px 15px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                width: "100%",
                                marginTop: "10px",
                            }}>
                            Upload to IPFS
                        </button>

                        <input
                            type="text"
                            placeholder="IPFS Hash"
                            value={ipfsHash}
                            onChange={(e) => setIpfsHash(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />

                        <button onClick={handleUpdate}
                            style={{
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "10px 15px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                width: "100%",
                                marginTop: "10px",
                            }}>
                            Update Medical History
                        </button>
                    </>
                ) : (
                    <p style={{ color: "red" }}>Patient not registered!</p>
                )}
            </div>
        </div>
    );
}

export default UpdateMedicalHistory;
