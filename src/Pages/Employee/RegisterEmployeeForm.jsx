import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RegisterEmployeeForm.css";
import { BASE_URL } from "../../config";

const RegisterEmployeeForm = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const { id } = useParams();

  const initialFormState = {
    employeeCode: "",
    employeeName: "",
    emailId: "",
    phoneNumber: "",
    address: "",
    gender: "",
    designation: "",
    dateOfJoining: "",
    dateOfBirth: "",
    salaryPerMonth: "",
    emergencyContact: "",
    aadharNumber: "",
    panNumber: "",
    bloodGroup: "",
    password: "", // Added password field
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/register-employee?departmentId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      await response.json();
      alert("Employee registered successfully");
      navigate("/getDepartment");
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error registering employee:", error);
      alert("Error registering employee");
    }
  };

  return (
    <div className="registeremployeeform-container">
      <h2 className="registeremployeeform-title">Register New Employee</h2>
      <form onSubmit={handleSubmit} className="registeremployeeform-form">
        <div className="registeremployeeform-grid">
          {Object.entries({
            employeeCode: "Employee Code",
            employeeName: "Employee Name",
            emailId: "Email ID",
            password: "Password",
            phoneNumber: "Phone Number",
            address: "Address",
            designation: "Designation",
            dateOfJoining: "Date of Joining",
            dateOfBirth: "Date of Birth",
            salaryPerMonth: "Salary Per Month",
            emergencyContact: "Emergency Contact",
            aadharNumber: "Aadhar Number",
            panNumber: "PAN Number",
            bloodGroup: "Blood Group",
          }).map(([key, label]) => (
            <div key={key} className="registeremployeeform-form-group">
              <label className="registeremployeeform-label" htmlFor={key}>
                {label}
              </label>
              <input
                className="registeremployeeform-input"
                type={
                  key === "emailId"
                    ? "email"
                    : key === "phoneNumber" || key === "emergencyContact"
                    ? "tel"
                    : key.includes("date")
                    ? "date"
                    : key === "salaryPerMonth"
                    ? "number"
                    : key === "password"
                    ? "password"
                    : "text"
                }
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                placeholder={`Enter ${label}`}
              />
            </div>
          ))}

          <div className="registeremployeeform-form-group">
            <label className="registeremployeeform-label" htmlFor="gender">
              Gender
            </label>
            <select
              className="registeremployeeform-select"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <button type="submit" className="registeremployeeform-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterEmployeeForm;
