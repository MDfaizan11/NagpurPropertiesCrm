import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import "../login/login.css";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
      console.log("✅ Login API response: ", response.data);

      const token = response.data?.jwtToken;
      if (!token) {
        alert("Login failed: No token received");
        return;
      }

      let user = null;
      let role = "";

      if (response.data.admin) {
        user = response.data.admin;
        role = user.role?.[0]?.roleName || "Admin";
      } else if (response.data.partner) {
        user = response.data.partner;
        role = user.role?.[0]?.roleName || "Partner";
      } else if (response.data.head) {
        user = response.data.head;
        role = user.role?.[0]?.roleName || "Head";
      } else if (response.data.employee) {
        user = response.data.employee;
        role = user.role?.[0]?.roleName || "Employee";
      } else if (response.data.accountant) {
        user = response.data.accountant;
        role = user.role?.[0]?.roleName || "Accountant";
      } else if (response.data.engineerResponse) {
        user = response.data.engineerResponse;
        role = user.role?.[0]?.roleName || "Engineer";
      } else {
        alert("Login failed: user role not supported.");
        return;
      }

      // Save data in localStorage
      const userdata = {
        token,
        role,
        ...user,
      };

      localStorage.setItem("NagpurProperties", JSON.stringify(userdata));
      console.log("📦 Saved to localStorage:", userdata);

      alert("Login successful");
      navigate("/"); // or navigate based on role
    } catch (error) {
      console.error(" Login error:", error);
      alert("Login failed. Check credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="login_main_wrapper">
        <div className="login-box">
          <p>Login</p>
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="text"
                name="loginName"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="user-box password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <span
                className="eye-icon"
                onClick={togglePasswordVisibility}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            <button type="submit" className="animated-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </button>
          </form>

          <p>
            Don't have an account?{" "}
            <a href="#" className="a2">
              Sign up!
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
