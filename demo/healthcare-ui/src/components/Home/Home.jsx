import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-component">
      <section className="hero">
        <h1>Welcome to HealthChain</h1>
        <p>Your decentralized healthcare records management system</p>
        <div className="cta-buttons">
          <Link to="/patient" className="btn primary">
            Patient Portal
          </Link>
          <Link to="/provider" className="btn secondary">
            Provider Portal
          </Link>
        </div>
      </section>
      
      <section className="features">
        <div className="feature-card">
          <h3>Secure Records</h3>
          <p>Your medical data is stored securely on the blockchain with encryption.</p>
        </div>
        <div className="feature-card">
          <h3>Complete Control</h3>
          <p>You decide who can access your medical information.</p>
        </div>
        <div className="feature-card">
          <h3>Transparent Access</h3>
          <p>Track every access to your records with blockchain transparency.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;