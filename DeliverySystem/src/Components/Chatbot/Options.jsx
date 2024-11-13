import React from "react";
import './Options.css'; // Import the Options component

const Options = ({ actionProvider }) => {
  return (
    <div className="options-container">
      <button
        className="option-button"
        onClick={() => actionProvider.handleTrackPackageRequest()}
      >
        Track Package
      </button>
      <button
        className="option-button"
        onClick={() => actionProvider.handleTrackingEstimate()}
      >
        Delivery Estimate
      </button>
      <button
        className="option-button"
        onClick={() => actionProvider.handleAmount()}
      >
        Get Amount
      </button>
    </div>
  );
};

export default Options;
