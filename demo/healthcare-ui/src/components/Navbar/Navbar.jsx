import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ account }) => {
  const shortenedAccount = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : "Not connected";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Healthcare DApp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/patient">Patient</Link>
        <Link to="/provider">Provider</Link>
        <Link to="/contact">Contact</Link>
        <div className="wallet-info">{shortenedAccount}</div>
      </div>
    </nav>
  );
};

export default Navbar;