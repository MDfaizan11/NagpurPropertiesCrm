// import { useState, useEffect } from "react";
// import { Bell, Menu, X, FileText, LogOut } from "lucide-react";
// import "../Header/header.css";
// import MaleLogo from "../../Assets/Images/man.png";
// import FemaleLogo from "../../Assets/Images/woman.png";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";

// export default function Header({
//   searchQuery,
//   setSearchQuery,
//   toggleSidebar,
//   showMenuButton,
// }) {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);

//   const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
//   const user_name =
//     userData?.userName || userData?.name || userData?.employeeName || "User";
//   const email = userData?.email || userData?.emailId;
//   const gender = userData?.gender || "Male";
//   const userId = userData?.id || userData?.headId || userData?.employeeId;
//   const roleName = userData.role?.[0]?.roleName;
//   const userType = roleName.toUpperCase();
//   const token = userData?.token || userData?.jwtToken;

//   const fetchNotificationCount = async () => {
//     if (!userId || !userType || !token) return;
//     try {
//       const response = await axiosInstance.get(
//         `${BASE_URL}/get/count/unread/notification?userId=${userId}&userType=${userType}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const count =
//         typeof response.data === "number"
//           ? response.data
//           : response.data?.count ?? 0;

//       setNotificationCount(count);
//       console.log("Updated notification count:", count);
//     } catch (error) {
//       console.error("Error fetching notification count:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("NagpurProperties");
//         window.location.href = "/login";
//       }
//       setNotificationCount(0);
//     }
//   };

//   useEffect(() => {
//     fetchNotificationCount();
//   }, [userId, userType, token]);

//   // Poll every 60 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchNotificationCount();
//     }, 60000);
//     return () => clearInterval(interval);
//   }, [userId, userType, token]);

//   const fetchNotifications = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `${BASE_URL}/all-notification?userId=${userId}&userType=${userType}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const uniqueNotifications = Array.from(
//         new Map(
//           response.data.map((item) => [item.notificationId, item])
//         ).values()
//       );

//       setNotifications(uniqueNotifications);

//       // Refresh notification count
//       fetchNotificationCount();
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("NagpurProperties");
//         window.location.href = "/login";
//       }
//       setNotifications([]);
//     }
//   };

//   const isPastDue = (scheduledTime) => {
//     const now = new Date();
//     const [datePart, timePart] = scheduledTime.split(" at ");
//     const [day, month, year] = datePart.split(" ");
//     const [hours, minutes] = timePart.split(":");
//     const scheduled = new Date(
//       `${year}-${month.slice(0, 3)}-${day}T${hours}:${minutes}:00+05:30`
//     );
//     return scheduled < now;
//   };

//   const handleLogOut = () => {
//     const confirmation = window.confirm("Are you sure you want to log out?");
//     if (!confirmation) return;
//     localStorage.removeItem("NagpurProperties");
//     window.location.href = "/login";
//   };

//   return (
//     <header className="dashboard-header">
//       {showMenuButton && (
//         <button className="menu-button" onClick={toggleSidebar}>
//           <Menu size={24} />
//         </button>
//       )}

//       <div className="header-actions">
//         {["Admin", "Head", "Employee"].includes(roleName) && (
//           <>
//             <button className="header-button">
//               <span>{roleName} Panel</span>
//             </button>

//             <div className="notification-wrapper">
//               <button
//                 className="icon-button notification-button"
//                 onClick={() => {
//                   setShowNotifications(!showNotifications);
//                   if (showNotifications) {
//                     setNotifications([]);
//                   } else {
//                     fetchNotifications();
//                   }
//                   if (showUserMenu) setShowUserMenu(false);
//                 }}
//               >
//                 <Bell size={20} />
//                 {notificationCount > 0 && (
//                   <span className="notification-badge">
//                     {notificationCount}
//                   </span>
//                 )}
//               </button>
//               {showNotifications && (
//                 <div className="notifications-dropdown">
//                   <div className="notifications-header">
//                     <h3>Notifications</h3>
//                     <button
//                       className="close-button"
//                       onClick={() => setShowNotifications(false)}
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                   <div className="notifications-list">
//                     {notifications.length > 0 ? (
//                       notifications.map((notif) => {
//                         const isPast = isPastDue(
//                           notif.body.match(/scheduled for (.*)/)?.[1] || ""
//                         );
//                         return (
//                           <div
//                             key={notif.notificationId}
//                             className={`notification-item ${
//                               isPast ? "past-due" : "unread"
//                             }`}
//                           >
//                             <div
//                               className={`notification-icon ${
//                                 isPast ? "red" : "blue"
//                               }`}
//                             >
//                               <FileText size={16} />
//                             </div>
//                             <div className="notification-content">
//                               <p className="notification-text">{notif.body}</p>
//                               <p className="notification-time">
//                                 {notif.sentAgo} ago
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <div className="notification-item">
//                         No notifications available
//                       </div>
//                     )}
//                   </div>
//                   <div className="notifications-footer">
//                     <button className="view-all">View all notifications</button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         <div className="user-profile-wrapper">
//           <div
//             className="user-profile"
//             onClick={() => {
//               setShowUserMenu(!showUserMenu);
//               if (showNotifications) setShowNotifications(false);
//             }}
//           >
//             <div className="user-avatar">
//               <img
//                 src={gender === "Male" ? MaleLogo : FemaleLogo}
//                 alt="User"
//                 className="user-avatar-image"
//               />
//             </div>
//             <div className="user-info">
//               <span className="user-name">{user_name}</span>
//               <span className="user-role">{roleName}</span>
//             </div>
//           </div>

//           {showUserMenu && (
//             <div className="user-dropdown">
//               <div className="user-dropdown-header">
//                 <div className="user-dropdown-avatar">
//                   <img
//                     src={gender === "Male" ? MaleLogo : FemaleLogo}
//                     alt="User"
//                     className="user-avatar-image"
//                   />
//                 </div>
//                 <div>
//                   <h4 className="user-dropdown-name">{user_name}</h4>
//                   <p className="user-dropdown-email">{email}</p>
//                 </div>
//               </div>
//               <div className="user-dropdown-footer">
//                 <a href="#" className="user-dropdown-item logout">
//                   <LogOut size={16} />
//                   <span onClick={handleLogOut}>Logout</span>
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

import { useState, useEffect } from "react";
import { Bell, Menu, X, FileText, LogOut } from "lucide-react";
import "../Header/header.css";
import MaleLogo from "../../Assets/Images/man.png";
import FemaleLogo from "../../Assets/Images/woman.png";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";

export default function Header({
  searchQuery,
  setSearchQuery,
  toggleSidebar,
  showMenuButton,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};

  // Extract Role
  const roleName = userData.role?.[0]?.roleName || "Guest";

  // Extract User Info by Role
  let userId = null;
  let user_name = "User";
  let email = "No email";
  let gender = userData?.gender || "Male";

  if (roleName === "Admin") {
    userId = userData.id;
    user_name = userData.name;
    email = userData.email;
  } else if (roleName === "Head") {
    userId = userData.headId;
    user_name = userData.name;
    email = userData.emailId;
  } else if (roleName === "Employee") {
    userId = userData.employeeId;
    user_name = userData.employeeName;
    email = userData.emailId;
  } else if (roleName === "Partner") {
    const partner = userData.lands?.[0]?.partners?.[0];
    if (partner) {
      userId = partner.id;
      user_name = partner.name;
      email = partner.email;
      gender = partner.gender || "Male";
    }
  }

  const token = userData?.token || userData?.jwtToken;
  const userType = roleName?.toUpperCase();

  // Fetch unread notification count
  const fetchNotificationCount = async () => {
    if (!userId || !userType || !token) return;

    try {
      const url =
        roleName === "Partner"
          ? `${BASE_URL}/partner/${userId}/count/unread-notification`
          : `${BASE_URL}/get/count/unread/notification?userId=${userId}&userType=${userType}`;

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("🔔 Notification count response:", response.data);

      const count =
        typeof response.data === "number"
          ? response.data
          : response.data?.count ?? 0;
      setNotificationCount(count);
    } catch (error) {
      console.error("❌ Error fetching notification count:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("NagpurProperties");
        window.location.href = "/login";
      }
      setNotificationCount(0);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId || !userType || !token) return;

    try {
      const url =
        roleName === "Partner"
          ? `${BASE_URL}/partner/${userId}/get/all/notification`
          : `${BASE_URL}/all-notification?userId=${userId}&userType=${userType}`;

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📨 Notifications response:", response.data);

      const uniqueNotifications = Array.from(
        new Map(
          response.data.map((item) => [item.notificationId, item])
        ).values()
      );

      setNotifications(uniqueNotifications);
      fetchNotificationCount(); // Refresh count
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("NagpurProperties");
        window.location.href = "/login";
      }
      setNotifications([]);
    }
  };

  const isPastDue = (scheduledTime) => {
    const now = new Date();
    const [datePart, timePart] = scheduledTime.split(" at ");
    if (!datePart || !timePart) return false;

    const [day, month, year] = datePart.split(" ");
    const [hours, minutes] = timePart.split(":");
    const scheduled = new Date(
      `${year}-${month.slice(0, 3)}-${day}T${hours}:${minutes}:00+05:30`
    );
    return scheduled < now;
  };

  const handleLogOut = () => {
    const confirmation = window.confirm("Are you sure you want to log out?");
    if (!confirmation) return;
    localStorage.removeItem("NagpurProperties");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 60000);
    return () => clearInterval(interval);
  }, [userId, userType, token]);

  return (
    <header className="dashboard-header">
      {showMenuButton && (
        <button className="menu-button" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      )}

      <div className="header-actions">
        {["Admin", "Head", "Employee", "Partner"].includes(roleName) && (
          <>
            <button className="header-button">
              <span>{roleName} Panel</span>
            </button>

            <div className="notification-wrapper">
              <button
                className="icon-button notification-button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (showNotifications) {
                    setNotifications([]);
                  } else {
                    fetchNotifications();
                  }
                  if (showUserMenu) setShowUserMenu(false);
                }}
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button
                      className="close-button"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => {
                        const isPast = isPastDue(
                          notif.body.match(/scheduled for (.*)/)?.[1] || ""
                        );
                        return (
                          <div
                            key={notif.notificationId}
                            className={`notification-item ${
                              isPast ? "past-due" : "unread"
                            }`}
                          >
                            <div
                              className={`notification-icon ${
                                isPast ? "red" : "blue"
                              }`}
                            >
                              <FileText size={16} />
                            </div>
                            <div className="notification-content">
                              <p className="notification-text">{notif.body}</p>
                              <p className="notification-time">
                                {notif.sentAgo} ago
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="notification-item">
                        No notifications available
                      </div>
                    )}
                  </div>
                  <div className="notifications-footer">
                    <button className="view-all">View all notifications</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="user-profile-wrapper">
          <div
            className="user-profile"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              if (showNotifications) setShowNotifications(false);
            }}
          >
            <div className="user-avatar">
              <img
                src={gender === "Male" ? MaleLogo : FemaleLogo}
                alt="User"
                className="user-avatar-image"
              />
            </div>
            <div className="user-info">
              <span className="user-name">{user_name}</span>
              <span className="user-role">{roleName}</span>
            </div>
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-avatar">
                  <img
                    src={gender === "Male" ? MaleLogo : FemaleLogo}
                    alt="User"
                    className="user-avatar-image"
                  />
                </div>
                <div>
                  <h4 className="user-dropdown-name">{user_name}</h4>
                  <p className="user-dropdown-email">{email}</p>
                </div>
              </div>
              <div className="user-dropdown-footer">
                <a href="#" className="user-dropdown-item logout">
                  <LogOut size={16} />
                  <span onClick={handleLogOut}>Logout</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
