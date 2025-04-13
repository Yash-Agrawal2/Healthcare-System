import React, { useState } from "react";
import { isAddress } from "ethers";
import "./RegisterPatient.css"; // We'll create this CSS file

function RegisterPatient({ contract }) {
  const [patient, setPatient] = useState({
    address: "",
    name: "",
    age: "",
    gender: "Male", 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!patient.address.trim()) {
      newErrors.address = "Address is required";
    } else if (!isAddress(patient.address)) {
      newErrors.address = "Invalid Ethereum address";
    }
    
    if (!patient.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!patient.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(patient.age) || parseInt(patient.age) <= 0) {
      newErrors.age = "Age must be a positive number";
    }
    
    if (!patient.gender) {
      newErrors.gender = "Gender is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!contract) {
      alert("Contract is not connected.");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.registerPatient(
        patient.address,
        patient.name,
        parseInt(patient.age),
        patient.gender,
        { gasLimit: 3000000 }
      );
      
      console.log("Transaction submitted. Hash:", tx.hash);
      await tx.wait();
      
      setSuccessMessage("Patient registered successfully!");
      // Reset form on success
      setPatient({
        address: "",
        name: "",
        age: "",
        gender: "Male",
      });
      
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error registering patient:", error);
      setErrors({
        submit: error.message || "Transaction failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="register-patient-container">
      <h2 className="register-patient-title">Register New Patient</h2>
      
      <form onSubmit={handleRegister} className="register-patient-form">
        <div className="form-group">
          <label htmlFor="address">Patient Wallet Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="0x..."
            value={patient.address}
            onChange={handleChange}
            className={errors.address ? "input-error" : ""}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            value={patient.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="30"
            value={patient.age}
            onChange={handleChange}
            min="1"
            className={errors.age ? "input-error" : ""}
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            className={errors.gender ? "input-error" : ""}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Registering...
            </>
          ) : (
            "Register Patient"
          )}
        </button>
        
        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        </form>
      </div>
    );
  }
  
  export default RegisterPatient;