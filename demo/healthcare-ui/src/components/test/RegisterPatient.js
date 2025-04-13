import React, { useState } from "react";
import { isAddress } from "ethers";
 
function RegisterPatient({ contract }) {
  const [patient, setPatient] = useState({
    address: "",
    name: "",
    age: "",
    gender: "",
  });

  const handleRegister = async () => {
    const { address, name, age, gender } = patient;

    if (!contract) {
      alert("Contract is not connected.");
      return;
    }

    if (!isAddress(address)) {
      alert("Please enter a valid patient address.");
      return;
    }

    try {
      const tx = await contract.registerPatient(
        address,
        name,
        parseInt(age),
        gender,
        { gasLimit: 3000000 }
      );
      console.log("Transaction submitted. Hash:", tx.hash);
      await tx.wait();
      alert("Patient registered successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error registering patient:", errorMessage);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register Patient</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Patient Address"
          value={patient.address}
          onChange={(e) =>
            setPatient({ ...patient, address: e.target.value })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
        />
        <input
          type="text"
          placeholder="Name"
          value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
        />
        <input
          type="number"
          placeholder="Age"
          value={patient.age}
          onChange={(e) => setPatient({ ...patient, age: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
        />
        <input
          type="text"
          placeholder="Gender"
          value={patient.gender}
          onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
        />
      </div>
      <button
        onClick={handleRegister}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Register Patient
      </button>
    </div>
  );
}

export default RegisterPatient;
