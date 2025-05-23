// import { useState, useEffect } from "react";
// import {
//   LayoutGrid,
//   Calendar,
//   FileText,
//   Building,
//   ChevronRight,
//   ChevronLeft,
//   LogOut,
// } from "lucide-react";
// import {
//   MapPin,
//   Phone,
//   HardHat,
//   Map,
//   CheckSquare,
//   PenToolIcon as Tool,
//   Users,
//   Handshake,
//   Package,
//   DollarSign,
//   Settings,
//   Mail,
//   Pen,
// } from "lucide-react";
// import "../Sidebar/sidebar.css";
// import { useNavigate } from "react-router-dom";

// export default function Sidebar({ isOpen, setIsOpen }) {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeSection, setActiveSection] = useState("Dashboard");
//   const [favorites, setFavorites] = useState(["Dashboard", "Calendar"]);

//   useEffect(() => {
//     if (isOpen !== undefined && setIsOpen) {
//       if (window.innerWidth < 768) {
//         setCollapsed(!isOpen);
//       }
//     }
//   }, [isOpen, setIsOpen]);

//   const toggleCollapsed = () => {
//     const newCollapsedState = !collapsed;
//     setCollapsed(newCollapsedState);

//     if (setIsOpen) {
//       setIsOpen(!newCollapsedState);
//     }
//   };

//   const toggleFavorite = (name, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (favorites.includes(name)) {
//       setFavorites(favorites.filter((item) => item !== name));
//     } else {
//       setFavorites([...favorites, name]);
//     }
//   };

//   const sections = [
//     {
//       name: "Land Management",
//       icon: <Map size={22} />,
//       color: "blue",
//       count: 22,
//       path: "/land",
//     },
//     {
//       name: "Lead Management",
//       icon: <Phone size={22} />,
//       color: "purple",
//       count: 18,
//       path: "/leadProject",
//     },
//     {
//       name: "Labour Management",
//       icon: <HardHat size={22} />,
//       color: "orange",
//       count: 32,
//     },
//     {
//       name: "Plot Management",
//       icon: <MapPin size={22} />,
//       color: "red",
//       count: 15,
//     },
//     {
//       name: "Task Management",
//       icon: <CheckSquare size={22} />,
//       color: "green",
//       count: 47,
//     },
//     {
//       name: "Material Management",
//       icon: <Tool size={22} />,
//       color: "teal",
//       count: 29,
//     },
//     {
//       name: "Employee Management",
//       icon: <Users size={22} />,
//       color: "indigo",
//       count: 36,
//     },
//     {
//       name: "Contractor Management",
//       icon: <Handshake size={22} />,
//       color: "yellow",
//       count: 12,
//     },
//     {
//       name: "Stock Management",
//       icon: <Package size={22} />,
//       color: "brown",
//       count: 21,
//     },
//     {
//       name: "Finance Management",
//       icon: <DollarSign size={22} />,
//       color: "emerald",
//       count: 19,
//     },
//     {
//       name: "Machine Management",
//       icon: <Settings size={22} />,
//       color: "gray",
//       count: 8,
//     },
//     {
//       name: "Project Management",
//       icon: <Calendar size={22} />,
//       color: "cyan",
//       count: 27,
//     },
//     {
//       name: "Quotation",
//       icon: <FileText size={22} />,
//       color: "amber",
//       count: 14,
//     },
//     { name: "Letter Head", icon: <Mail size={22} />, color: "lime", count: 6 },
//     {
//       name: "Office Expense",
//       icon: <Building size={22} />,
//       color: "pink",
//       count: 11,
//     },
//     {
//       name: "Stationary Management",
//       icon: <Pen size={22} />,
//       color: "violet",
//       count: 9,
//     },
//   ];
//   const mainNavItems = [
//     { name: "Dashboard", icon: <LayoutGrid size={20} />, path: "/" },
//   ];

//   const bottomNavItems = [
//     // { name: "Settings", icon: <Settings size={20} /> },
//     // { name: "Help", icon: <HelpCircle size={20} /> },
//     // { name: "Profile", icon: <User size={20} /> },
//     { name: "Logout", icon: <LogOut size={20} /> },
//   ];

//   function handleLogOut() {
//     const logOut = window.confirm("Are You Sure To LogOut ?");
//     if (!logOut) return;

//     localStorage.removeItem("NagpurProperties");
//     navigate("/login");
//   }
//   return (
//     <aside
//       className={`sidebar ${collapsed ? "collapsed" : ""} ${
//         isOpen ? "open" : ""
//       }`}
//     >
//       <div className="sidebar-header">
//         <div className="logo">
//           <div className="logo-icon">SS</div>
//           {!collapsed && <span className="logo-text">Group</span>}
//         </div>
//         <button className="collapse-button" onClick={toggleCollapsed}>
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* <div className="sidebar-search">
//         {!collapsed && (
//           <div className="quick-actions">
//             <button className="quick-action">
//               <Zap size={16} />
//               <span>Quick Add</span>
//             </button>
//             <button className="quick-action">
//               <Clock size={16} />
//               <span>Recent</span>
//             </button>
//           </div>
//         )}
//       </div> */}

//       <nav className="sidebar-nav">
//         {favorites.length > 0 && (
//           <div className="nav-section">
//             <span className="nav-section-title">Favorites</span>
//             <ul className="nav-items">
//               {mainNavItems
//                 .filter((item) => favorites.includes(item.name))
//                 .map((item) => (
//                   <li
//                     key={`fav-${item.name}`}
//                     className={activeSection === item.name ? "active" : ""}
//                     onClick={() => {
//                       setActiveSection(item.name);
//                       if (item.path) navigate(item.path);
//                     }}
//                   >
//                     <div className="nav-item">
//                       <span className="nav-icon">{item.icon}</span>
//                       {!collapsed && (
//                         <span className="nav-text">{item.name}</span>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         )}

//         {/* <div className="nav-section">
//           <span className="nav-section-title">Main</span>
//           <ul className="nav-items">
//             {mainNavItems
//               .filter((item) => !favorites.includes(item.name))
//               .map((item) => (
//                 <li
//                   key={item.name}
//                   className={activeSection === item.name ? "active" : ""}
//                   onClick={() => setActiveSection(item.name)}
//                 >
//                   <a href="#" className="nav-item">
//                     <span className="nav-icon">{item.icon}</span>
//                     {!collapsed && (
//                       <span className="nav-text">{item.name}</span>
//                     )}
//                     {!collapsed && (
//                       <button
//                         className="favorite-button"
//                         onClick={(e) => toggleFavorite(item.name, e)}
//                       >
//                         <Star size={16} />
//                       </button>
//                     )}
//                   </a>
//                 </li>
//               ))}
//           </ul>
//         </div> */}

//         <div className="nav-section">
//           <span className="nav-section-title">Modules</span>
//           <ul className="nav-items">
//             {sections?.map((section) => (
//               <li
//                 key={section.name}
//                 className={activeSection === section.name ? "active" : ""}
//                 onClick={() => {
//                   setActiveSection(section.name);
//                   if (section.path) {
//                     navigate(section.path);
//                   }
//                 }}
//               >
//                 <div className="nav-item">
//                   <span className={`nav-icon module-icon ${section.color}`}>
//                     {section.icon}
//                   </span>
//                   {!collapsed && (
//                     <span className="nav-text">{section.name}</span>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </nav>

//       <div className="sidebar-footer">
//         <ul className="nav-items">
//           {bottomNavItems.map((item) => (
//             <li key={item.name}>
//               <a href="#" className="nav-item">
//                 <span className="nav-icon">{item.icon}</span>
//                 {!collapsed && (
//                   <span className="nav-text" onClick={handleLogOut}>
//                     {item.name}
//                   </span>
//                 )}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </aside>
//   );
// }

import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Calendar,
  FileText,
  Building,
  ChevronRight,
  ChevronLeft,
  LogOut,
  MapPin,
  Phone,
  HardHat,
  Map,
  CheckSquare,
  PenToolIcon as Tool,
  Users,
  Handshake,
  Package,
  DollarSign,
  Settings,
  Mail,
  Pen,
} from "lucide-react";
import "../Sidebar/sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [favorites, setFavorites] = useState(["Dashboard", "Calendar"]);

  // Load activeSection from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("NagpurProperties");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.activeSection) {
          setActiveSection(data.activeSection);
        }
      } catch (e) {
        console.error("Error parsing NagpurProperties:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen !== undefined && setIsOpen) {
      if (window.innerWidth < 768) {
        setCollapsed(!isOpen);
      }
    }
  }, [isOpen, setIsOpen]);

  const toggleCollapsed = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (setIsOpen) {
      setIsOpen(!newCollapsedState);
    }
  };

  const toggleFavorite = (name, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.includes(name)) {
      setFavorites(favorites.filter((item) => item !== name));
    } else {
      setFavorites([...favorites, name]);
    }
  };

  const updateLocalStorageActiveSection = (sectionName) => {
    const saved = localStorage.getItem("NagpurProperties");
    let data = {};
    try {
      data = saved ? JSON.parse(saved) : {};
    } catch {
      data = {};
    }
    data.activeSection = sectionName;
    localStorage.setItem("NagpurProperties", JSON.stringify(data));
  };

  const sections = [
    {
      name: "Land Management",
      icon: <Map size={22} />,
      color: "blue",
      count: 22,
      path: "/land",
    },
    {
      name: "Lead Management",
      icon: <Phone size={22} />,
      color: "purple",
      count: 18,
      path: "/leadProject",
    },
    {
      name: "Labour Management",
      icon: <HardHat size={22} />,
      color: "orange",
      count: 32,
    },
    {
      name: "Plot Management",
      icon: <MapPin size={22} />,
      color: "red",
      count: 15,
    },
    {
      name: "Task Management",
      icon: <CheckSquare size={22} />,
      color: "green",
      count: 47,
    },
    {
      name: "Material Management",
      icon: <Tool size={22} />,
      color: "teal",
      count: 29,
    },
    {
      name: "Employee Management",
      icon: <Users size={22} />,
      color: "indigo",
      count: 36,
    },
    {
      name: "Contractor Management",
      icon: <Handshake size={22} />,
      color: "yellow",
      count: 12,
    },
    {
      name: "Stock Management",
      icon: <Package size={22} />,
      color: "brown",
      count: 21,
    },
    {
      name: "Finance Management",
      icon: <DollarSign size={22} />,
      color: "emerald",
      count: 19,
    },
    {
      name: "Machine Management",
      icon: <Settings size={22} />,
      color: "gray",
      count: 8,
    },
    {
      name: "Project Management",
      icon: <Calendar size={22} />,
      color: "cyan",
      count: 27,
    },
    {
      name: "Quotation",
      icon: <FileText size={22} />,
      color: "amber",
      count: 14,
    },
    { name: "Letter Head", icon: <Mail size={22} />, color: "lime", count: 6 },
    {
      name: "Office Expense",
      icon: <Building size={22} />,
      color: "pink",
      count: 11,
      path: "/office",
    },
    {
      name: "Stationary Management",
      icon: <Pen size={22} />,
      color: "violet",
      count: 9,
      path: "/stationary",
    },
  ];

  const mainNavItems = [
    { name: "Dashboard", icon: <LayoutGrid size={20} />, path: "/" },
  ];

  const bottomNavItems = [{ name: "Logout", icon: <LogOut size={20} /> }];

  function handleLogOut() {
    const logOut = window.confirm("Are You Sure To LogOut ?");
    if (!logOut) return;
    localStorage.removeItem("NagpurProperties");
    navigate("/login");
  }

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">SS</div>
          {!collapsed && <span className="logo-text">Group</span>}
        </div>
        <button className="collapse-button" onClick={toggleCollapsed}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {favorites.length > 0 && (
          <div className="nav-section">
            <span className="nav-section-title">Favorites</span>
            <ul className="nav-items">
              {mainNavItems
                .filter((item) => favorites.includes(item.name))
                .map((item) => (
                  <li
                    key={`fav-${item.name}`}
                    className={activeSection === item.name ? "active" : ""}
                    onClick={() => {
                      setActiveSection(item.name);
                      updateLocalStorageActiveSection(item.name);
                      if (item.path) navigate(item.path);
                    }}
                  >
                    <div className="nav-item">
                      <span className="nav-icon">{item.icon}</span>
                      {!collapsed && (
                        <span className="nav-text">{item.name}</span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="nav-section">
          <span className="nav-section-title">Modules</span>
          <ul className="nav-items">
            {sections.map((section) => (
              <li
                key={section.name}
                className={activeSection === section.name ? "active" : ""}
                onClick={() => {
                  setActiveSection(section.name);
                  updateLocalStorageActiveSection(section.name);
                  if (section.path) {
                    navigate(section.path);
                  }
                }}
              >
                <div className="nav-item">
                  <span className={`nav-icon module-icon ${section.color}`}>
                    {section.icon}
                  </span>
                  {!collapsed && (
                    <span className="nav-text">{section.name}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <ul className="nav-items">
          {bottomNavItems.map((item) => (
            <li key={item.name}>
              <a href="#" className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && (
                  <span className="nav-text" onClick={handleLogOut}>
                    {item.name}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
