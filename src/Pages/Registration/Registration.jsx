import React from "react";
import { useState } from "react";
import { BASE_URL } from "../../config";
import axiosInstance from "../../utils/axiosInstance";

function Registration() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [engineerRegistrationFrom, setEngineerRegistrationForm] =
    useState(false);
  const [engineerName, setEngineerName] = useState("");
  const [engineerEmail, setEngineerEmail] = useState("");
  const [engineerPhone, setEngineerPhone] = useState("");
  const [engineerPassword, setEngineerPassword] = useState("");

  async function handleAddEngineer(e) {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    const enggBody = {
      name: engineerName,
      email: engineerEmail,
      phoneNo: engineerPhone,
      password: engineerPassword,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/registerEngineer`,
        enggBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Engineer registered successfully");
        setEngineerName("");
        setEngineerEmail("");
        setEngineerPhone("");
        setEngineerPassword("");
        setEngineerRegistrationForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <p>Registration</p>

      <button onClick={() => setEngineerRegistrationForm(true)}>
        Engineer Registration
      </button>

      {engineerRegistrationFrom && (
        <div>
          <h2>Engineer Registration Form</h2>
          {/* Here you can add the form fields for engineer registration */}
          <form onSubmit={handleAddEngineer}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                required
                value={engineerName}
                onChange={(e) => setEngineerName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                required
                value={engineerEmail}
                onChange={(e) => setEngineerEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                required
                value={engineerPhone}
                onChange={(e) => setEngineerPhone(e.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                name="password"
                required
                value={engineerPassword}
                onChange={(e) => setEngineerPassword(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Registration;
