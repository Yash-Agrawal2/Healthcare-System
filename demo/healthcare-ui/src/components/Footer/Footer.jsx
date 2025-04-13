import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>HealthChain</h3>
          <p>Decentralized Healthcare Records</p>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <a href="/patient">Patient Portal</a>
          <a href="/provider">Provider Portal</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} HealthChain. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;