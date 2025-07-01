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
    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
      console.log(response.data);

      const token = response.data?.jwtToken;

      // Determine user type
      const isAdmin = response.data?.admin !== null;
      const isPartner = response.data?.partner !== null;

      let user = null;
      let role = "";

      if (isAdmin) {
        user = response.data.admin;
        role = user.role?.[0]?.roleName || "Admin";
      } else if (isPartner) {
        user = response.data.partner;
        role = user.role?.[0]?.roleName || "Partner";
      }

      if (user && token) {
        const userdata = {
          token: token,
          role: role,
          ...user, // Spread full user object: includes lands, transactions, etc.
        };

        localStorage.setItem("NagpurProperties", JSON.stringify(userdata));
        alert("Login successful");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
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
