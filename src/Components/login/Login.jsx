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
      const email = response.data?.admin?.email;
      const gender = response.data?.admin?.gender;
      const id = response.data?.admin?.id;
      const userName = response.data?.admin?.name;
      const role = response.data?.admin?.role?.[0]?.roleName;

      const userdata = {
        token: token,
        email: email,
        id: id,
        userName: userName,
        role: role,
        gender: gender,
      };

      if (response.status === 200) {
        alert("Login successful");
        localStorage.setItem("NagpurProperties", JSON.stringify(userdata));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
