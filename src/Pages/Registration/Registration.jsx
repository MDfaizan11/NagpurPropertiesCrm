import React from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
function Registration() {
  const navigate = useNavigate();

  return (
    <>
      <p>Registration Section</p>

      <button
        onClick={() => navigate("/engineer")}
        className="registration_button"
      >
        Engineer Registration
      </button>
      <button
        onClick={() => navigate("/Vendor")}
        className="registration_button"
      >
        Vendor Registration
      </button>
      <button
        onClick={() => navigate("/Accountant")}
        className="registration_button"
      >
        Accountant Registration
      </button>
      <button
        className="registration_button"
        onClick={() => navigate("/materialRegistration")}
      >
        Matrial Registration
      </button>
      <button
        onClick={() => navigate("/DriverRegistration")}
        className="registration_button"
      >
        Driver Registration
      </button>
    </>
  );
}

export default Registration;
