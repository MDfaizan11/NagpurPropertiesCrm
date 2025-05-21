import { useState } from "react";
import {
  Search,
  Settings,
  Bell,
  Menu,
  X,
  FileText,
  CheckSquare,
  Users,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";
import "../Header/header.css";
import MaleLogo from "../../Assets/Images/man.png";
import FemaleLogo from "../../Assets/Images/woman.png";
export default function Header({
  searchQuery,
  setSearchQuery,
  toggleSidebar,
  showMenuButton,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user_name = JSON.parse(
    localStorage.getItem("NagpurProperties")
  )?.userName;
  const role = JSON.parse(localStorage.getItem("NagpurProperties"))?.role;
  const email = JSON.parse(localStorage.getItem("NagpurProperties"))?.email;
  const gender = JSON.parse(localStorage.getItem("NagpurProperties"))?.gender;
  function handleLogOut() {
    localStorage.removeItem("NagpurProperties");
    window.location.href = "/login";
  }
  return (
    <header className="dashboard-header">
      {showMenuButton && (
        <button className="menu-button" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      )}

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search modules, projects, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="header-actions">
        {/* <button
          className={`theme-toggle ${isDarkMode ? "dark" : ""}`}
          onClick={toggleTheme}
        >
          <Sun size={18} className="sun-icon" />
          <Moon size={18} className="moon-icon" />
        </button> */}
        <button className="header-button">
          <span>Admin Panel</span>
        </button>
        {/* <button className="icon-button">
          <Settings size={20} />
        </button> */}
        {/* <button className="icon-button">
          <Share2 size={20} />
        </button> */}
        {/* <button className="icon-button">
          <Plus size={20} />
        </button> */}
        {/* <button className="icon-button">
          <Layout size={20} />
        </button> */}

        <div className="notification-wrapper">
          <button
            className="icon-button notification-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showUserMenu) setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            <span className="notification-badge">3</span>
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
                <div className="notification-item unread">
                  <div className="notification-icon blue">
                    <FileText size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-text">
                      New project proposal received
                    </p>
                    <p className="notification-time">2 minutes ago</p>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-icon green">
                    <CheckSquare size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-text">
                      Task "Update inventory" completed
                    </p>
                    <p className="notification-time">1 hour ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon amber">
                    <Users size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-text">
                      New employee onboarding pending
                    </p>
                    <p className="notification-time">3 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="notifications-footer">
                <button className="view-all">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-wrapper">
          <div
            className="user-profile"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              if (showNotifications) setShowNotifications(false);
            }}
          >
            <div className="user-avatar">
              {gender === "Male" ? (
                <img src={MaleLogo} alt="User" className="user-avatar-image" />
              ) : (
                <img
                  src={FemaleLogo}
                  alt="User"
                  className="user-avatar-image"
                />
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user_name}</span>
              <span className="user-role">{role}</span>
            </div>
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-avatar">
                  {gender === "Male" ? (
                    <img
                      src={MaleLogo}
                      alt="User"
                      className="user-avatar-image"
                    />
                  ) : (
                    <img
                      src={FemaleLogo}
                      alt="User"
                      className="user-avatar-image"
                    />
                  )}
                </div>
                <div>
                  <h4 className="user-dropdown-name">{user_name}</h4>
                  <p className="user-dropdown-email">{email}</p>
                </div>
              </div>
              {/* <div className="user-dropdown-menu">
                <a href="#" className="user-dropdown-item">
                  <Users size={16} />
                  <span>My Profile</span>
                </a>
                <a href="#" className="user-dropdown-item">
                  <Settings size={16} />
                  <span>Account Settings</span>
                </a>
                <a href="#" className="user-dropdown-item">
                  <MessageSquare size={16} />
                  <span>Messages</span>
                </a>
                <a href="#" className="user-dropdown-item">
                  <HelpCircle size={16} />
                  <span>Help Center</span>
                </a>
              </div> */}
              <div className="user-dropdown-footer">
                <a href="#" className="user-dropdown-item logout">
                  <LogOut size={16} />
                  <span onClick={() => handleLogOut}>Logout</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
