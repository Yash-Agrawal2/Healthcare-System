import React, { useState } from "react";

function RevokeProvider({ contract, account }) {
  const [providerAddress, setProviderAddress] = useState("");
  const [name, setName] = useState("");
  const [isRevoked, setIsRevoked] = useState(false);

  const handleRevoke = async () => {
    if (!contract) {
      alert("Smart contract not loaded.");
      return;
    }

    if (!providerAddress || !name) {
      alert("Please enter both provider address and name.");
      return;
    }

    try {
      const tx = await contract.revokeProvider(account, providerAddress);
      await tx.wait();

      setIsRevoked(true);
      alert(`Provider ${name} with address ${providerAddress} has been revoked.`);
    } catch (error) {
      console.error("Revocation failed:", error);
      alert("Revocation failed. Make sure you're the registered patient.");
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
        <h2 style={{ color: "#333" }}>Revoke Provider</h2>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Provider Address:
          <input
            type="text"
            value={providerAddress}
            onChange={(e) => setProviderAddress(e.target.value)}
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
          Provider Name:
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
          onClick={handleRevoke}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
          }}
        >
          Revoke
        </button>
        {isRevoked && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Provider {name} has been revoked!
          </p>
        )}
      </div>
    </div>
  );
}

export default RevokeProvider;
