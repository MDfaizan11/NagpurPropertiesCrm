// // import { useState, useEffect } from "react";
// // import {
// //   LayoutGrid,
// //   FileText,
// //   Building,
// //   ChevronRight,
// //   ChevronLeft,
// //   ChevronDown,
// //   LogOut,
// //   MapPin,
// //   Phone,
// //   HardHat,
// //   Map,
// //   CheckSquare,
// //   PenToolIcon as Tool,
// //   Users,
// //   Handshake,
// //   Package,
// //   DollarSign,
// //   Settings,
// //   Mail,
// //   Pen,
// //   Wrench,
// //   Hammer,
// //   Truck,
// // } from "lucide-react";
// // import "./sidebar.css";
// // import { useNavigate } from "react-router-dom";

// // export default function Sidebar({ isOpen, setIsOpen }) {
// //   const navigate = useNavigate();
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [activeSection, setActiveSection] = useState("Dashboard");
// //   const [favorites, setFavorites] = useState(["Dashboard", "Calendar"]);
// //   const [expandedMenus, setExpandedMenus] = useState({});

// //   // Extract user role from localStorage
// //   const storedData = JSON.parse(
// //     localStorage.getItem("NagpurProperties") || "{}"
// //   );
// //   const actualRole = Array.isArray(storedData?.role)
// //     ? storedData.role[0]?.roleName
// //     : storedData?.role;

// //   useEffect(() => {
// //     const saved = localStorage.getItem("NagpurProperties");
// //     if (saved) {
// //       try {
// //         const data = JSON.parse(saved);
// //         if (data.activeSection) {
// //           setActiveSection(data.activeSection);
// //         }
// //       } catch (e) {
// //         console.error("Error parsing NagpurProperties:", e);
// //       }
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (isOpen !== undefined && setIsOpen) {
// //       if (window.innerWidth < 768) {
// //         setCollapsed(!isOpen);
// //       }
// //     }
// //   }, [isOpen, setIsOpen]);

// //   const toggleCollapsed = () => {
// //     const newCollapsedState = !collapsed;
// //     setCollapsed(newCollapsedState);
// //     if (setIsOpen) {
// //       setIsOpen(!newCollapsedState);
// //     }
// //   };

// //   const toggleFavorite = (name, e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (favorites.includes(name)) {
// //       setFavorites(favorites.filter((item) => item !== name));
// //     } else {
// //       setFavorites([...favorites, name]);
// //     }
// //   };

// //   const toggleSubmenu = (sectionName, e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     setExpandedMenus((prev) => ({
// //       ...prev,
// //       [sectionName]: !prev[sectionName],
// //     }));
// //   };

// //   const updateLocalStorageActiveSection = (sectionName) => {
// //     const saved = localStorage.getItem("NagpurProperties");
// //     let data = {};
// //     try {
// //       data = saved ? JSON.parse(saved) : {};
// //     } catch {
// //       data = {};
// //     }
// //     data.activeSection = sectionName;
// //     localStorage.setItem("NagpurProperties", JSON.stringify(data));
// //   };

// //   const sections = [
// //     {
// //       name: "Land Management",
// //       icon: <Map size={22} />,
// //       color: "blue",
// //       count: 22,
// //       path: "/land",
// //     },
// //     {
// //       name: "Lead Management",
// //       icon: <Phone size={22} />,
// //       color: "purple",
// //       count: 18,
// //       path: "/leadProject",
// //     },
// //     {
// //       name: "Partner Management",
// //       icon: <HardHat size={22} />,
// //       color: "orange",
// //       count: 32,
// //       path: "/labour",
// //     },
// //     {
// //       name: "Plot Management",
// //       icon: <MapPin size={22} />,
// //       color: "red",
// //       count: 15,
// //       path: "/plot",
// //     },
// //     {
// //       name: "Task Management",
// //       icon: <CheckSquare size={22} />,
// //       color: "green",
// //       count: 47,
// //       path: "/task",
// //     },
// //     {
// //       name: "Material Management",
// //       icon: <Tool size={22} />,
// //       color: "teal",
// //       count: 29,
// //       path: "/material",
// //       hasSubmenu: true,
// //       subItems: [
// //         {
// //           name: "All Sites",
// //           icon: <Package size={18} />,
// //           path: "/material",
// //         },
// //         {
// //           name: "Purchase Orders",
// //           icon: <Wrench size={18} />,
// //           path: "/purchesOrder",
// //         },
// //         {
// //           name: "Vehicle Entry",
// //           icon: <Hammer size={18} />,
// //           path: "/vehicleMaterial",
// //         },
// //         {
// //           name: "Material Requests",
// //           icon: <FileText size={18} />,
// //           // path: "/material/requests",
// //         },
// //         {
// //           name: "Supplier Management",
// //           icon: <Truck size={18} />,
// //           // path: "/material/suppliers",
// //         },
// //       ],
// //     },
// //     {
// //       name: "Employee Management",
// //       icon: <Users size={22} />,
// //       color: "indigo",
// //       count: 36,
// //       path: "/getDepartment",
// //     },
// //     {
// //       name: "Attendance Management",
// //       icon: <FileText size={22} />,
// //       color: "amber",
// //       count: 14,
// //       path: "/empList",
// //     },
// //     {
// //       name: "Contractor Management",
// //       icon: <Handshake size={22} />,
// //       color: "yellow",
// //       count: 12,
// //       path: "/contractor",
// //     },
// //     {
// //       name: "Finance Management",
// //       icon: <DollarSign size={22} />,
// //       color: "emerald",
// //       count: 19,
// //       path: "/finance",
// //     },
// //     {
// //       name: "Machine Management",
// //       icon: <Settings size={22} />,
// //       color: "gray",
// //       count: 8,
// //       path: "/machine",
// //     },
// //     {
// //       name: "Letter Head",
// //       icon: <Mail size={22} />,
// //       color: "lime",
// //       count: 6,
// //       path: "/letter",
// //     },
// //     {
// //       name: "Office Expense",
// //       icon: <Building size={22} />,
// //       color: "pink",
// //       count: 11,
// //       path: "/office",
// //     },
// //     {
// //       name: "Stationary Management",
// //       icon: <Pen size={22} />,
// //       color: "violet",
// //       count: 9,
// //       path: "/stationary",
// //     },
// //   ];

// //   const mainNavItems = [
// //     { name: "Dashboard", icon: <LayoutGrid size={20} />, path: "/" },
// //   ];

// //   const bottomNavItems = [{ name: "Logout", icon: <LogOut size={20} /> }];

// //   function handleLogOut() {
// //     const logOut = window.confirm("Are You Sure To LogOut ?");
// //     if (!logOut) return;
// //     localStorage.removeItem("NagpurProperties");
// //     navigate("/login");
// //   }

// //   const handleSectionClick = (section) => {
// //     if (section.hasSubmenu && !collapsed) {
// //       toggleSubmenu(section.name, {
// //         preventDefault: () => {},
// //         stopPropagation: () => {},
// //       });
// //     } else {
// //       setActiveSection(section.name);
// //       updateLocalStorageActiveSection(section.name);
// //       if (section.path) {
// //         navigate(section.path);
// //       }
// //     }
// //   };

// //   const handleSubItemClick = (subItem) => {
// //     setActiveSection(subItem.name);
// //     updateLocalStorageActiveSection(subItem.name);
// //     if (subItem.path) {
// //       navigate(subItem.path);
// //     }
// //   };

// //   return (
// //     <aside
// //       className={`sidebar ${collapsed ? "collapsed" : ""} ${
// //         isOpen ? "open" : ""
// //       }`}
// //     >
// //       <div className="sidebar-header">
// //         <div className="logo">
// //           <div className="logo-icon">SS</div>
// //           {!collapsed && <span className="logo-text">Group</span>}
// //         </div>
// //         <button className="collapse-button" onClick={toggleCollapsed}>
// //           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
// //         </button>
// //       </div>

// //       <nav className="sidebar-nav">
// //         {favorites.length > 0 && (
// //           <div className="nav-section">
// //             <span className="nav-section-title">Favorites</span>
// //             <ul className="nav-items">
// //               {mainNavItems
// //                 .filter((item) => favorites.includes(item.name))
// //                 .map((item) => (
// //                   <li
// //                     key={`fav-${item.name}`}
// //                     className={activeSection === item.name ? "active" : ""}
// //                     onClick={() => {
// //                       setActiveSection(item.name);
// //                       updateLocalStorageActiveSection(item.name);
// //                       if (item.path) navigate(item.path);
// //                     }}
// //                   >
// //                     <div className="nav-item">
// //                       <span className="nav-icon">{item.icon}</span>
// //                       {!collapsed && (
// //                         <span className="nav-text">{item.name}</span>
// //                       )}
// //                     </div>
// //                   </li>
// //                 ))}
// //             </ul>
// //           </div>
// //         )}

// //         <div className="nav-section">
// //           <span className="nav-section-title">Modules</span>
// //           <ul className="nav-items">
// //             {sections
// //               .filter((section) => {
// //                 if (actualRole === "Admin" || actualRole === "Head")
// //                   return true;
// //                 if (actualRole === "Partner")
// //                   return section.name === "Land Management";
// //                 if (actualRole === "Employee")
// //                   return ["Task Management", "Lead Management"].includes(
// //                     section.name
// //                   );
// //                 if (actualRole === "Engineer")
// //                   return section.name === "Material Management";
// //                 return false;
// //               })
// //               .map((section) => (
// //                 <li key={section.name}>
// //                   <li
// //                     className={activeSection === section.name ? "active" : ""}
// //                     onClick={() => handleSectionClick(section)}
// //                   >
// //                     <div className="nav-item">
// //                       <span className={`nav-icon module-icon ${section.color}`}>
// //                         {section.icon}
// //                       </span>
// //                       {!collapsed && (
// //                         <>
// //                           <span className="nav-text">{section.name}</span>
// //                           {section.hasSubmenu && (
// //                             <span
// //                               className={`submenu-arrow ${
// //                                 expandedMenus[section.name] ? "expanded" : ""
// //                               }`}
// //                               onClick={(e) => toggleSubmenu(section.name, e)}
// //                             >
// //                               <ChevronDown size={16} />
// //                             </span>
// //                           )}
// //                         </>
// //                       )}
// //                     </div>
// //                   </li>

// //                   {section.hasSubmenu &&
// //                     expandedMenus[section.name] &&
// //                     !collapsed && (
// //                       <ul className="submenu">
// //                         {section.subItems.map((subItem) => (
// //                           <li
// //                             key={subItem.name}
// //                             className={
// //                               activeSection === subItem.name ? "active" : ""
// //                             }
// //                             onClick={() => handleSubItemClick(subItem)}
// //                           >
// //                             <div className="nav-item submenu-item">
// //                               <span className="nav-icon submenu-icon">
// //                                 {subItem.icon}
// //                               </span>
// //                               <span className="nav-text">{subItem.name}</span>
// //                             </div>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     )}
// //                 </li>
// //               ))}
// //           </ul>
// //         </div>
// //       </nav>

// //       <div className="sidebar-footer">
// //         <ul className="nav-items">
// //           {bottomNavItems.map((item) => (
// //             <li key={item.name}>
// //               <a href="#" className="nav-item">
// //                 <span className="nav-icon">{item.icon}</span>
// //                 {!collapsed && (
// //                   <span className="nav-text" onClick={handleLogOut}>
// //                     {item.name}
// //                   </span>
// //                 )}
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </aside>
// //   );
// // }

// // below white theme
// import { useState, useEffect } from "react";
// import {
//   LayoutGrid,
//   FileText,
//   Building,
//   ChevronRight,
//   ChevronLeft,
//   ChevronDown,
//   LogOut,
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
//   Wrench,
//   Hammer,
//   Truck,
// } from "lucide-react";
// import "./sidebar.css";
// import { useNavigate } from "react-router-dom";

// export default function Sidebar({ isOpen, setIsOpen }) {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeSection, setActiveSection] = useState("Dashboard");
//   const [favorites, setFavorites] = useState(["Dashboard", "Calendar"]);
//   const [expandedMenus, setExpandedMenus] = useState({});

//   // Extract user role from localStorage
//   const storedData = JSON.parse(
//     localStorage.getItem("NagpurProperties") || "{}"
//   );
//   const actualRole = Array.isArray(storedData?.role)
//     ? storedData.role[0]?.roleName
//     : storedData?.role;

//   useEffect(() => {
//     const saved = localStorage.getItem("NagpurProperties");
//     if (saved) {
//       try {
//         const data = JSON.parse(saved);
//         if (data.activeSection) {
//           setActiveSection(data.activeSection);
//         }
//       } catch (e) {
//         console.error("Error parsing NagpurProperties:", e);
//       }
//     }
//   }, []);

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

//   const toggleSubmenu = (sectionName, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setExpandedMenus((prev) => ({
//       ...prev,
//       [sectionName]: !prev[sectionName],
//     }));
//   };

//   const updateLocalStorageActiveSection = (sectionName) => {
//     const saved = localStorage.getItem("NagpurProperties");
//     let data = {};
//     try {
//       data = saved ? JSON.parse(saved) : {};
//     } catch {
//       data = {};
//     }
//     data.activeSection = sectionName;
//     localStorage.setItem("NagpurProperties", JSON.stringify(data));
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
//       name: "Partner Management",
//       icon: <HardHat size={22} />,
//       color: "orange",
//       count: 32,
//       path: "/labour",
//     },
//     {
//       name: "Plot Management",
//       icon: <MapPin size={22} />,
//       color: "red",
//       count: 15,
//       path: "/plot",
//     },
//     {
//       name: "Task Management",
//       icon: <CheckSquare size={22} />,
//       color: "green",
//       count: 47,
//       path: "/task",
//     },
//     {
//       name: "Material Management",
//       icon: <Tool size={22} />,
//       color: "teal",
//       count: 29,
//       path: "/material",
//       hasSubmenu: true,
//       subItems: [
//         {
//           name: "All Sites",
//           icon: <Package size={18} />,
//           path: "/material",
//         },
//         {
//           name: "Purchase Orders",
//           icon: <Wrench size={18} />,
//           path: "/purchesOrder",
//         },
//         {
//           name: "Vehicle Entry",
//           icon: <Hammer size={18} />,
//           path: "/vehicleMaterial",
//         },
//         {
//           name: " Stock Transfer",
//           icon: <FileText size={18} />,
//           path: "/MaterialStock",
//         },
//         // {
//         //   name: "Supplier Management",
//         //   icon: <Truck size={18} />,
//         //   // path: "/material/suppliers",
//         // },
//       ],
//     },
//     {
//       name: "Employee Management",
//       icon: <Users size={22} />,
//       color: "indigo",
//       count: 36,
//       hasSubmenu: true,
//       subItems: [
//         {
//           name: "Add Department",
//           icon: <Package size={18} />,
//           path: "/getDepartment",
//         },
//         {
//           name: "Attendance",
//           icon: <FileText size={18} />,
//           path: "/empList",
//         },
//         {
//           name: "Add Holiday",
//           icon: <Hammer size={18} />,
//           path: "/holiday",
//         },
//       ],
//     },

//     {
//       name: "Contractor Management",
//       icon: <Handshake size={22} />,
//       color: "yellow",
//       count: 12,
//       path: "/contractor",
//     },
//     {
//       name: "Finance Management",
//       icon: <DollarSign size={22} />,
//       color: "emerald",
//       count: 19,
//       path: "/finance",
//     },
//     {
//       name: "Machine Management",
//       icon: <Settings size={22} />,
//       color: "gray",
//       count: 8,
//       path: "/machine",
//     },
//     {
//       name: "Letter Head",
//       icon: <Mail size={22} />,
//       color: "lime",
//       count: 6,
//       path: "/letter",
//     },
//     {
//       name: "Office Expense",
//       icon: <Building size={22} />,
//       color: "pink",
//       count: 11,
//       path: "/office",
//     },
//     {
//       name: "Stationary Management",
//       icon: <Pen size={22} />,
//       color: "violet",
//       count: 9,
//       path: "/stationary",
//     },
//     {
//       name: "Registration",
//       icon: <FileText size={22} />,
//       color: "cyan",
//       count: 5,
//       path: "/registration",
//     },
//   ];

//   const mainNavItems = [
//     { name: "Dashboard", icon: <LayoutGrid size={20} />, path: "/" },
//   ];

//   const bottomNavItems = [{ name: "Logout", icon: <LogOut size={20} /> }];

//   function handleLogOut() {
//     const logOut = window.confirm("Are You Sure To LogOut ?");
//     if (!logOut) return;
//     localStorage.removeItem("NagpurProperties");
//     navigate("/login");
//   }

//   const handleSectionClick = (section) => {
//     if (section.hasSubmenu && !collapsed) {
//       toggleSubmenu(section.name, {
//         preventDefault: () => {},
//         stopPropagation: () => {},
//       });
//     } else {
//       setActiveSection(section.name);
//       updateLocalStorageActiveSection(section.name);
//       if (section.path) {
//         navigate(section.path);
//       }
//     }
//   };

//   const handleSubItemClick = (subItem) => {
//     setActiveSection(subItem.name);
//     updateLocalStorageActiveSection(subItem.name);
//     if (subItem.path) {
//       navigate(subItem.path);
//     }
//   };

//   return (
//     <aside
//       className={`sidebar-main ${collapsed ? "sidebar-collapsed" : ""} ${
//         isOpen ? "sidebar-open" : ""
//       }`}
//     >
//       <div className="sidebar-header">
//         <div className="sidebar-logo">
//           <div className="sidebar-logo-icon">SS</div>
//           {!collapsed && <span className="sidebar-logo-text">Group</span>}
//         </div>
//         <button className="sidebar-collapse-button" onClick={toggleCollapsed}>
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       <nav className="sidebar-nav">
//         {favorites.length > 0 && (
//           <div className="sidebar-nav-section">
//             <span className="sidebar-nav-section-title">Favorites</span>
//             <ul className="sidebar-nav-items">
//               {mainNavItems
//                 .filter((item) => favorites.includes(item.name))
//                 .map((item) => (
//                   <li
//                     key={`fav-${item.name}`}
//                     className={
//                       activeSection === item.name ? "sidebar-active" : ""
//                     }
//                     onClick={() => {
//                       setActiveSection(item.name);
//                       updateLocalStorageActiveSection(item.name);
//                       if (item.path) navigate(item.path);
//                     }}
//                   >
//                     <div className="sidebar-nav-item">
//                       <span className="sidebar-nav-icon">{item.icon}</span>
//                       {!collapsed && (
//                         <span className="sidebar-nav-text">{item.name}</span>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         )}

//         <div className="sidebar-nav-section">
//           <span className="sidebar-nav-section-title">Modules</span>
//           <ul className="sidebar-nav-items">
//             {sections
//               .filter((section) => {
//                 if (actualRole === "Admin" || actualRole === "Head")
//                   return true;
//                 if (actualRole === "Partner")
//                   return section.name === "Land Management";
//                 if (actualRole === "Employee")
//                   return section.name === "Task Management";
//                 return false;
//               })
//               .map((section) => (
//                 <li key={section.name}>
//                   <li
//                     className={
//                       activeSection === section.name ? "sidebar-active" : ""
//                     }
//                     onClick={() => handleSectionClick(section)}
//                   >
//                     <div className="sidebar-nav-item">
//                       <span
//                         className={`sidebar-nav-icon sidebar-module-icon ${section.color}`}
//                       >
//                         {section.icon}
//                       </span>
//                       {!collapsed && (
//                         <>
//                           <span className="sidebar-nav-text">
//                             {section.name}
//                           </span>
//                           {section.hasSubmenu && (
//                             <span
//                               className={`sidebar-submenu-arrow ${
//                                 expandedMenus[section.name]
//                                   ? "sidebar-expanded"
//                                   : ""
//                               }`}
//                               onClick={(e) => toggleSubmenu(section.name, e)}
//                             >
//                               <ChevronDown size={16} />
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </li>
//                   {section.hasSubmenu &&
//                     expandedMenus[section.name] &&
//                     !collapsed && (
//                       <ul className="sidebar-submenu">
//                         {section.subItems.map((subItem) => (
//                           <li
//                             key={subItem.name}
//                             className={
//                               activeSection === subItem.name
//                                 ? "sidebar-active"
//                                 : ""
//                             }
//                             onClick={() => handleSubItemClick(subItem)}
//                           >
//                             <div className="sidebar-nav-item sidebar-submenu-item">
//                               <span className="sidebar-nav-icon sidebar-submenu-icon">
//                                 {subItem.icon}
//                               </span>
//                               <span className="sidebar-nav-text">
//                                 {subItem.name}
//                               </span>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                 </li>
//               ))}
//           </ul>
//         </div>
//       </nav>

//       <div className="sidebar-footer">
//         <ul className="sidebar-nav-items">
//           {bottomNavItems.map((item) => (
//             <li key={item.name}>
//               <a href="#" className="sidebar-nav-item">
//                 <span className="sidebar-nav-icon">{item.icon}</span>
//                 {!collapsed && (
//                   <span className="sidebar-nav-text" onClick={handleLogOut}>
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
  FileText,
  Building,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  LogOut,
  MapPin,
  Phone,
  HardHat,
  Map,
  CheckSquare,
  Users,
  Handshake,
  Package,
  DollarSign,
  Settings,
  Mail,
  Pen,
  Wrench,
  Hammer,
  Truck,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to track current route
  const [collapsed, setCollapsed] = useState(false);
  const [favorites, setFavorites] = useState(["Dashboard", "Calendar"]);
  const [expandedMenus, setExpandedMenus] = useState({});

  const storedData = JSON.parse(
    localStorage.getItem("NagpurProperties") || "{}"
  );
  const actualRole = Array.isArray(storedData?.role)
    ? storedData.role[0]?.roleName
    : storedData?.role;

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

  const toggleSubmenu = (sectionName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
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
      name: "Partner Management",
      icon: <HardHat size={22} />,
      color: "orange",
      count: 32,
      path: "/labour",
    },
    {
      name: "Plot Management",
      icon: <MapPin size={22} />,
      color: "red",
      count: 15,
      path: "/plot",
    },
    {
      name: "Task Management",
      icon: <CheckSquare size={22} />,
      color: "green",
      count: 47,
      path: "/task",
    },
    {
      name: "Material Management",
      icon: <Users size={22} />,
      color: "teal",
      count: 29,
      path: "/material",
      hasSubmenu: true,
      subItems: [
        { name: "All Sites", icon: <Package size={18} />, path: "/material" },
        {
          name: "Purchase Orders",
          icon: <Wrench size={18} />,
          path: "/purchesOrder",
        },
        {
          name: "Vehicle Entry",
          icon: <Hammer size={18} />,
          path: "/vehicleMaterial",
        },
        {
          name: "Stock Transfer",
          icon: <FileText size={18} />,
          path: "/MaterialStock",
        },
        {
          name: "Stock Summary",
          icon: <Wrench size={18} />,
          path: "/StockSummary",
        },
      ],
    },
    {
      name: "Employee Management",
      icon: <Users size={22} />,
      color: "indigo",
      count: 36,
      path: "/getDepartment",
      hasSubmenu: true,
      subItems: [
        {
          name: "Add Department",
          icon: <Package size={18} />,
          path: "/getDepartment",
        },
        { name: "Attendance", icon: <FileText size={18} />, path: "/empList" },
        { name: "Add Holiday", icon: <Hammer size={18} />, path: "/holiday" },
      ],
    },
    {
      name: "Contractor Management",
      icon: <Handshake size={22} />,
      color: "yellow",
      count: 12,
      path: "/contractor",
    },
    {
      name: "Finance Management",
      icon: <DollarSign size={22} />,
      color: "emerald",
      count: 19,
      path: "/finance",
    },
    {
      name: "Machine Management",
      icon: <Settings size={22} />,
      color: "gray",
      count: 8,
      path: "/machine",
    },
    {
      name: "Letter Head",
      icon: <Mail size={22} />,
      color: "lime",
      count: 6,
      path: "/letter",
    },
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
    {
      name: "Registration",
      icon: <FileText size={22} />,
      color: "cyan",
      count: 5,
      path: "/registration",
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

  // Debug current route
  console.log("Current route:", location.pathname);

  return (
    <aside
      className={`sidebar-main ${collapsed ? "sidebar-collapsed" : ""} ${
        isOpen ? "sidebar-open" : ""
      }`}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">SS</div>
          {!collapsed && <span className="sidebar-logo-text">Group</span>}
        </div>
        <button className="sidebar-collapse-button" onClick={toggleCollapsed}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {favorites.length > 0 && (
          <div className="sidebar-nav-section">
            <span className="sidebar-nav-section-title">Favorites</span>
            <ul className="sidebar-nav-items">
              {mainNavItems
                .filter((item) => favorites.includes(item.name))
                .map((item) => (
                  <li key={`fav-${item.name}`}>
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `sidebar-nav-item ${isActive ? "sidebar-active" : ""}`
                      }
                      onClick={() => setIsOpen(false)}
                      aria-current={(isActive) =>
                        isActive ? "page" : undefined
                      }
                    >
                      <span className="sidebar-nav-icon">{item.icon}</span>
                      {!collapsed && (
                        <span className="sidebar-nav-text">{item.name}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="sidebar-nav-section">
          <span className="sidebar-nav-section-title">Modules</span>
          <ul className="sidebar-nav-items">
            {sections
              .filter((section) => {
                if (actualRole === "Admin" || actualRole === "Head")
                  return true;
                if (actualRole === "Partner")
                  return section.name === "Land Management";
                if (actualRole === "Employee")
                  return ["Task Management", "Lead Management"].includes(
                    section.name
                  );
                if (actualRole === "Engineer")
                  return section.name === "Material Management";
                return false;
              })
              .map((section) => (
                <li key={section.name}>
                  <NavLink
                    to={section.path}
                    end
                    className={({ isActive }) =>
                      `sidebar-nav-item ${
                        isActive && location.pathname === section.path
                          ? "sidebar-active"
                          : ""
                      } ${
                        section.hasSubmenu && !collapsed ? "has-submenu" : ""
                      }`
                    }
                    onClick={(e) => {
                      if (section.hasSubmenu && !collapsed) {
                        toggleSubmenu(section.name, e);
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    aria-current={(isActive) => (isActive ? "page" : undefined)}
                  >
                    <span
                      className={`sidebar-nav-icon sidebar-module-icon ${section.color}`}
                    >
                      {section.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="sidebar-nav-text">{section.name}</span>
                        {section.hasSubmenu && (
                          <span
                            className={`sidebar-submenu-arrow ${
                              expandedMenus[section.name]
                                ? "sidebar-expanded"
                                : ""
                            }`}
                            onClick={(e) => toggleSubmenu(section.name, e)}
                          >
                            <ChevronDown size={16} />
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                  {section.hasSubmenu &&
                    expandedMenus[section.name] &&
                    !collapsed && (
                      <ul className="sidebar-submenu">
                        {section.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <NavLink
                              to={subItem.path}
                              end
                              className={({ isActive }) =>
                                `sidebar-nav-item sidebar-submenu-item ${
                                  isActive ? "sidebar-active" : ""
                                }`
                              }
                              onClick={() => setIsOpen(false)}
                              aria-current={(isActive) =>
                                isActive ? "page" : undefined
                              }
                            >
                              <span className="sidebar-nav-icon sidebar-submenu-icon">
                                {subItem.icon}
                              </span>
                              <span className="sidebar-nav-text">
                                {subItem.name}
                              </span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <ul className="sidebar-nav-items">
          {bottomNavItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className="sidebar-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogOut();
                }}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <span className="sidebar-nav-text">{item.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
