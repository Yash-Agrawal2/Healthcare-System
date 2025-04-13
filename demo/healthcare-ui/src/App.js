import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import HealthcareSystemABI from "./contract/HealthcareSystem.json";
// import Navbar from "./components/Navbar";
// import RegisterPatient from "./components/RegisterPatient";
// import PatientDetails from "./components/PatientDetails";
// import UpdateMedicalHistory from "./components/UpdateMedicalHistory";
// import AuthorizeProvider from "./components/AuthorizeProvider";
// import RevokeProvider from "./components/RevokeProvider";
// import Footer from "./components/Footer";
// import Home from "./components/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import PatientPage from "./pages/PatientPage";
import ProviderPage from "./pages/ProviderPage";
import ContactPage from "./pages/ContactPage";
import "./App.css";

const CONTRACT_ADDRESS = "0x55c792D05262d229388A7ccaff06f722e23f489f";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  // const [patientDetails, setPatientDetails] = useState(null);
  // const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Ensure correct network
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId !== "0xaa36a7") {
          alert("Please connect to Sepolia network");
          return;
        }

        console.log("Wallet connected:", accounts[0]);
        await initContract();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
      setIsLoading(false);
    }
  }

  async function initContract() {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const healthcareContract = new Contract(
      CONTRACT_ADDRESS,
      HealthcareSystemABI.abi,
      signer
    );
    setContract(healthcareContract);
  }

  if (isLoading) {
    return <div className="loading">Loading application...</div>;
  }

  // async function fetchPatientDetails(patientAddress) {
  //   if (contract) {
  //     try {
  //       const details = await contract.getPatientDetails(patientAddress);
  //       setPatientDetails({
  //         address: patientAddress,
  //         name: details[0],
  //         age: details[1].toString(),
  //         gender: details[2],
  //         medicalHistory: details[3],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching patient details:", error);
  //     }
  //   }
  // }

  return (
    // <div className="App">
    //   <Navbar />
    //   <Home />
    //   <p>Connected Account: {account}</p>
    //   <RegisterPatient contract={contract} />

    //   <h2>Fetch Patient Details</h2>
    //   <input
    //     type="text"
    //     placeholder="Patient Address"
    //     value={address}
    //     onChange={(e) => setAddress(e.target.value)}
    //   />
    //   <button onClick={() => fetchPatientDetails(address)}>
    //     Get Details
    //   </button>
    //   <PatientDetails details={patientDetails} />

    //   <UpdateMedicalHistory
    //     contract={contract}
    //     patientAddress={patientDetails?.address}
    //   />

    //   <AuthorizeProvider />
    //   <RevokeProvider />
    //   <Footer />
    // </div>
    <Router>
      <div className="app-container">
        <Navbar account={account} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/patient"
              element={<PatientPage contract={contract} account={account} />}
            />
            <Route
              path="/provider"
              element={<ProviderPage contract={contract} account={account} />}
            />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
