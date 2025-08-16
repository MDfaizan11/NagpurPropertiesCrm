// import { useState } from "react";
// import { Eye, EyeOff, Building2, Lock, Mail } from "lucide-react";
// import "./login.css";
// import axios from "axios";
// import { BASE_URL } from "../../config";
// import { useNavigate } from "react-router-dom";
// import { getFcmToken } from "../../firebase/firebase-messaging";

// const Login = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const loginData = { email, password };

//     try {
//       const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
//       console.log("Login response:", response.data);

//       const token = response.data?.jwtToken;
//       if (!token) {
//         alert("Login failed: No token received");
//         return;
//       }

//       let user = null;
//       let role = "";

//       if (response.data.admin) {
//         user = response.data.admin;
//         role = user.role?.[0]?.roleName || "Admin";
//       } else if (response.data.partner) {
//         user = response.data.partner;
//         role = user.role?.[0]?.roleName || "Partner";
//       } else if (response.data.head) {
//         user = response.data.head;
//         role = user.role?.[0]?.roleName || "Head";
//       } else if (response.data.employee) {
//         user = response.data.employee;
//         role = user.role?.[0]?.roleName || "Employee";
//       } else if (response.data.accountant) {
//         user = response.data.accountant;
//         role = user.role?.[0]?.roleName || "Accountant";
//       } else if (response.data.engineerResponse) {
//         user = response.data.engineerResponse;
//         role = user.role?.[0]?.roleName || "Engineer";
//       } else {
//         alert("Login failed: user role not supported.");
//         return;
//       }

//       const userdata = {
//         token,
//         role,
//         ...user,
//       };

//       // Only allow FCM token upload for Admin, Head, and Employee
//       if (["Admin", "Head", "Employee"].includes(role)) {
//         try {
//           const fcmToken = await getFcmToken();
//           if (fcmToken) {
//             console.log("FCM Token:", fcmToken);
//             await axios.post(
//               `${BASE_URL}/device-token`,
//               {
//                 ownerId: user?.id || user?.employeeId || user?.headId,
//                 ownerType: role,
//                 fcmToken: fcmToken,
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//           }
//         } catch (tokenError) {
//           console.error("Failed to send FCM token:", tokenError);
//         }
//       } else {
//         console.log(`${role} does not receive notifications`);
//       }

//       localStorage.setItem("NagpurProperties", JSON.stringify(userdata));
//       alert("Login successful");
//       navigate("/");
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Login failed. Check credentials.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-grid">
//         <div className="login-left">
//           <div className="brand-section">
//             <div className="brand-logo">
//               <Building2 className="brand-icon" />
//               <div className="brand-text">
//                 <h1 className="company-name">SS Group</h1>
//                 <p className="company-tagline">Construction & Real Estate</p>
//               </div>
//             </div>
//             <div className="login-welcome-content">
//               <h2 className="welcome-title">Welcome Back</h2>
//               <p className="welcome-description">
//                 Access your construction management dashboard and stay connected
//                 with your projects.
//               </p>
//               <div className="feature-list">
//                 <div className="feature-item">
//                   <div className="feature-dot"></div>
//                   <span>Project Management</span>
//                 </div>
//                 <div className="feature-item">
//                   <div className="feature-dot"></div>
//                   <span>Team Collaboration</span>
//                 </div>
//                 <div className="feature-item">
//                   <div className="feature-dot"></div>
//                   <span>Real-time Updates</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="login-right">
//           <div className="login-form-container">
//             <div className="form-header">
//               <h3 className="form-title">Log In</h3>
//               <p className="form-subtitle">
//                 Enter your credentials to continue
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="login-form">
//               <div className="form-group">
//                 <label htmlFor="email" className="form-label">
//                   Email Address
//                 </label>
//                 <div className="input-container">
//                   <Mail className="input-icon" />
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="your.email@ssgroup.com"
//                     className="form-input"
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password" className="form-label">
//                   Password
//                 </label>
//                 <div className="input-container">
//                   <Lock className="input-icon" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     className="form-input"
//                   />
//                   <button
//                     type="button"
//                     className="password-toggle"
//                     onClick={togglePasswordVisibility}
//                     title={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="form-options">
//                 <label className="remember-me">
//                   <input type="checkbox" />
//                   <span className="checkmark"></span>
//                   <span className="checkbox-text">Keep me signed in</span>
//                 </label>
//                 {/* <a href="#" className="forgot-link">
//                   Forgot password?
//                 </a> */}
//               </div>

//               <button
//                 type="submit"
//                 className="submit-button"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="button-spinner"></div>
//                     Signing in...
//                   </>
//                 ) : (
//                   "Log In to Dashboard"
//                 )}
//               </button>
//             </form>

//             {/* <div className="form-footer">
//               <p className="footer-text">
//                 Need access?{" "}
//                 <a href="#" className="contact-link">
//                   Contact Administrator
//                 </a>
//               </p>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Eye, EyeOff, Building2, Lock, Mail } from "lucide-react";
import "./login.css";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { getFcmToken } from "../../firebase/firebase-messaging";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginData = { email, password };

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
      console.log("Login response:", response.data);

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
        // console.log("user : ",user);
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

      const userdata = {
        token,
        role,
        ...user,
      };

      // FCM token generation for all roles

      try {
        const fcmToken = await getFcmToken(); // ✅ Define once, use in all roles

        if (fcmToken) {
          console.log("FCM Token:", fcmToken);

          if (["Admin", "Head", "Employee"].includes(role)) {
            await axios.post(
              `${BASE_URL}/device-token`,
              {
                ownerId: user?.id || user?.employeeId || user?.headId,
                ownerType: role,
                fcmToken: fcmToken,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else if (role === "Partner") {
            await axios.post(
              `${BASE_URL}/save-fcm-token`,
              {
                userId: user?.lands[0]?.partners[0]?.id,
                fcmToken: fcmToken,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            console.log(`${role} does not receive notifications`);
          }
        }
      } catch (tokenError) {
        console.error("Failed to send FCM token:", tokenError);
      }

      localStorage.setItem("NagpurProperties", JSON.stringify(userdata));
      alert("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-grid">
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-logo">
              <Building2 className="brand-icon" />
              <div className="brand-text">
                <h1 className="company-name">SS Group</h1>
                <p className="company-tagline">Construction & Real Estate</p>
              </div>
            </div>
            <div className="login-welcome-content">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-description">
                Access your construction management dashboard and stay connected
                with your projects.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  <span>Project Management</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  <span>Team Collaboration</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="form-header">
              <h3 className="form-title">Log In</h3>
              <p className="form-subtitle">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-container">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@ssgroup.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Keep me signed in</span>
                </label>
                {/* <a href="#" className="forgot-link">
                  Forgot password?
                </a> */}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Signing in...
                  </>
                ) : (
                  "Log In to Dashboard"
                )}
              </button>
            </form>

            {/* <div className="form-footer">
              <p className="footer-text">
                Need access?{" "}
                <a href="#" className="contact-link">
                  Contact Administrator
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
