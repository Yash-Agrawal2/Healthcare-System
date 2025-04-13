import React from "react";
import AuthorizeProvider from "../components/AuthorizeProvider/AuthorizeProvider";
import RevokeProvider from "../components/RevokeProvider/RevokeProvider";
import "./ProviderPage.css";

const ProviderPage = ({ contract, account }) => {
  return (
    <div className="provider-page">
      <h1>Healthcare Provider Portal</h1>
      <p className="wallet-info">Connected Account: {account}</p>

      <section className="authorization-section">
        <div className="authorize-card">
          <h2>Authorize Provider</h2>
          <AuthorizeProvider contract={contract} account= {account}/>
        </div>
        <div className="revoke-card">
          <h2>Revoke Provider Access</h2>
          <RevokeProvider contract={contract} account= {account} />
        </div>
      </section>

      <section className="instructions-section">
        <h2>How It Works</h2>
        <ol>
          <li>Authorize a provider to give them access to your records</li>
          <li>Providers can view but not modify your records</li>
          <li>Revoke access at any time</li>
        </ol>
      </section>
    </div>
  );
};

export default ProviderPage;