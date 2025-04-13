import React, { useState } from "react";

function AuthorizeProvider() {
  const [hashAddress, setHashAddress] = useState("");
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAuthorize = () => {
    if (hashAddress && name) {
      setIsAuthorized(true);
      alert(`Provider ${name} with hash ${hashAddress} is authorized.`);
    } else {
      alert("Please enter both hash address and name.");
    }
  };

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
        <h2 style={{ color: "#333" }}>Authorize Provider</h2>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Hash Address:
          <input
            type="text"
            value={hashAddress}
            onChange={(e) => setHashAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <button
          onClick={handleAuthorize}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
          }}
        >
          Authorize
        </button>
        {isAuthorized && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Provider {name} is successfully authorized!
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthorizeProvider;
