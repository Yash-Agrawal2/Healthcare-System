import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Decentralized Healthcare System</h1>
        <p>Secure, transparent, and patient-controlled medical records</p>
        <div className="cta-buttons">
          <Link to="/patient" className="btn primary">
            Patient Portal
          </Link>
          <Link to="/provider" className="btn secondary">
            Provider Portal
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Patient Control</h3>
          <p>You own your medical records and decide who can access them.</p>
        </div>
        <div className="feature-card">
          <h3>Secure Storage</h3>
          <p>Data stored on the blockchain is tamper-proof and permanent.</p>
        </div>
        <div className="feature-card">
          <h3>Easy Sharing</h3>
          <p>Authorize healthcare providers with just a few clicks.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;