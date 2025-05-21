// // import { useState, useEffect } from "react";
// // import axiosInstance from "../../utils/axiosInstance";
// // import { BASE_URL } from "../../config";
// // import "../Lead/leadproject.css"; // make sure this CSS file is created and imported

// // const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

// // function LeadProject() {
// //   const [project, setProject] = useState([]);

// //   useEffect(() => {
// //     async function GetAllProject() {
// //       try {
// //         const response = await axiosInstance.get(
// //           `${BASE_URL}/show-AllProject`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               "content-type": "application/json",
// //             },
// //           }
// //         );
// //         setProject(response.data);
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     }
// //     GetAllProject();
// //   }, []);

// //   return (
// //     <div className="leadproject-container">
// //       <h2 className="leadproject-title">All Projects</h2>
// //       <div className="leadproject-grid">
// //         {project.map((item, index) => (
// //           <div key={index} className="leadproject-card">
// //             <h3 className="leadproject-name">{item.name}</h3>
// //             <p className="leadproject-status">Status: {item.status}</p>
// //             <div className="leadproject-button-container">
// //               <button className="leadproject-view-btn">View</button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default LeadProject;

// // import { useState, useEffect } from "react";
// // import { BASE_URL } from "../../config";
// // import { Calendar, Clock, Briefcase, ArrowRight, Loader2 } from "lucide-react";
// // import "./leadproject.css";

// // function LeadProject() {
// //   const [projects, setProjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedCategory, setSelectedCategory] = useState("All");

// //   useEffect(() => {
// //     async function fetchProjects() {
// //       try {
// //         const authData = JSON.parse(localStorage.getItem("NagpurProperties"));
// //         const token = authData?.token;

// //         if (!token) {
// //           throw new Error("Authentication token not found");
// //         }

// //         setLoading(true);
// //         const response = await fetch(`${BASE_URL}/show-AllProject`, {
// //           method: "GET",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! Status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         setProjects(data);
// //         setError(null);
// //       } catch (error) {
// //         console.error("Failed to fetch projects:", error);
// //         setError("Failed to load projects. Please try again later.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchProjects();
// //   }, []);

// //   const categories = ["All", "Active", "Completed", "Pending"];

// //   const filteredProjects =
// //     selectedCategory === "All"
// //       ? projects
// //       : projects.filter((project) => project.status === selectedCategory);

// //   const getStatusClass = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case "active":
// //         return "status-active";
// //       case "completed":
// //         return "status-completed";
// //       case "pending":
// //         return "status-pending";
// //       default:
// //         return "status-default";
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="lead_project_search_section">
// //         <input type="search" />
// //         <button>Add Project</button>
// //       </div>
// //       <div className="leadproject-container">
// //         <div className="leadproject-filters">
// //           {categories.map((category) => (
// //             <button
// //               key={category}
// //               className={`filter-btn ${
// //                 selectedCategory === category ? "filter-active" : ""
// //               }`}
// //               onClick={() => setSelectedCategory(category)}
// //             >
// //               {category}
// //             </button>
// //           ))}
// //         </div>

// //         {loading ? (
// //           <div className="leadproject-loading">
// //             <Loader2 className="loading-icon" />
// //             <p>Loading projects...</p>
// //           </div>
// //         ) : error ? (
// //           <div className="leadproject-error">
// //             <p>{error}</p>
// //             <button
// //               className="retry-btn"
// //               onClick={() => window.location.reload()}
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         ) : filteredProjects.length === 0 ? (
// //           <div className="leadproject-empty">
// //             <p>No projects found in this category.</p>
// //           </div>
// //         ) : (
// //           <div className="leadproject-grid">
// //             {filteredProjects.map((project, index) => (
// //               <div key={index} className="leadproject-card">
// //                 <div
// //                   className={`project-status-badge ${getStatusClass(
// //                     project.status
// //                   )}`}
// //                 >
// //                   {project.status}
// //                 </div>

// //                 <h3 className="leadproject-name">{project.name}</h3>

// //                 <div className="project-details">
// //                   {project.location && (
// //                     <div className="detail-item">
// //                       <Briefcase className="detail-icon" />
// //                       <span>{project.location}</span>
// //                     </div>
// //                   )}

// //                   {project.date && (
// //                     <div className="detail-item">
// //                       <Calendar className="detail-icon" />
// //                       <span>{project.date}</span>
// //                     </div>
// //                   )}

// //                   {project.duration && (
// //                     <div className="detail-item">
// //                       <Clock className="detail-icon" />
// //                       <span>{project.duration}</span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 <p className="project-description">
// //                   {project.description ||
// //                     "Premium property development with modern amenities and strategic location."}
// //                 </p>

// //                 <div className="leadproject-button-container">
// //                   <button className="leadproject-view-btn">
// //                     View Details <ArrowRight className="btn-icon" />
// //                   </button>
// //                   <button> Edit</button>
// //                   <button> Delete</button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // }

// // export default LeadProject;

// // import { useState, useEffect } from "react";
// // import { BASE_URL } from "../../config";
// // import {
// //   Calendar,
// //   Clock,
// //   Briefcase,
// //   ArrowRight,
// //   Loader2,
// //   Search,
// //   Plus,
// //   Edit,
// //   Trash2,
// // } from "lucide-react";
// // import "../Lead/leadproject.css";
// // import { useNavigate } from "react-router-dom";
// // function LeadProject() {
// //   const navigate = useNavigate();
// //   const [projects, setProjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedCategory, setSelectedCategory] = useState("All");
// //   const [searchQuery, setSearchQuery] = useState("");

// //   useEffect(() => {
// //     async function fetchProjects() {
// //       try {
// //         const authData = JSON.parse(localStorage.getItem("NagpurProperties"));
// //         const token = authData?.token;

// //         if (!token) {
// //           throw new Error("Authentication token not found");
// //         }

// //         setLoading(true);
// //         const response = await fetch(`${BASE_URL}/show-AllProject`, {
// //           method: "GET",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! Status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         setProjects(data);
// //         setError(null);
// //       } catch (error) {
// //         console.error("Failed to fetch projects:", error);
// //         setError("Failed to load projects. Please try again later.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchProjects();
// //   }, []);

// //   const categories = ["All", "Active", "Completed", "Pending"];

// //   const filteredProjects = projects
// //     .filter(
// //       (project) =>
// //         selectedCategory === "All" || project.status === selectedCategory
// //     )
// //     .filter(
// //       (project) =>
// //         searchQuery === "" ||
// //         project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
// //     );

// //   const getStatusClass = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case "active":
// //         return "status-active";
// //       case "completed":
// //         return "status-completed";
// //       case "pending":
// //         return "status-pending";
// //       default:
// //         return "status-default";
// //     }
// //   };

// //   function handleViewLead(id) {
// //     alert(id);
// //     navigate(`/lead/${id}`);
// //   }
// //   return (
// //     <div className="leadproject-wrapper">
// //       <div className="leadproject-header">
// //         <h1 className="leadproject-title">Lead Management</h1>
// //         <p className="leadproject-subtitle">
// //           Manage and track all your property development projects in one place
// //         </p>
// //       </div>

// //       <div className="lead_project_search_section">
// //         <div className="search-container">
// //           <Search className="search-icon" />
// //           <input
// //             type="search"
// //             placeholder="Search projects..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //           />
// //         </div>
// //         <button className="add-project-btn">
// //           <Plus className="btn-icon" /> Add Project
// //         </button>
// //       </div>

// //       <div className="leadproject-container">
// //         <div className="leadproject-filters">
// //           {categories.map((category) => (
// //             <button
// //               key={category}
// //               className={`filter-btn ${
// //                 selectedCategory === category ? "filter-active" : ""
// //               }`}
// //               onClick={() => setSelectedCategory(category)}
// //             >
// //               {category}
// //             </button>
// //           ))}
// //         </div>

// //         {loading ? (
// //           <div className="leadproject-loading">
// //             <Loader2 className="loading-icon" />
// //             <p>Loading projects...</p>
// //           </div>
// //         ) : error ? (
// //           <div className="leadproject-error">
// //             <p>{error}</p>
// //             <button
// //               className="retry-btn"
// //               onClick={() => window.location.reload()}
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         ) : filteredProjects.length === 0 ? (
// //           <div className="leadproject-empty">
// //             <div className="empty-illustration"></div>
// //             <p>No projects found in this category.</p>
// //             <button className="add-project-btn-small">
// //               <Plus className="btn-icon" /> Add New Project
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="leadproject-grid">
// //             {filteredProjects.map((project, index) => (
// //               <div key={index} className="leadproject-card">
// //                 <div
// //                   className={`project-status-badge ${getStatusClass(
// //                     project.status
// //                   )}`}
// //                 >
// //                   {project.status}
// //                 </div>

// //                 <h3 className="leadproject-name">{project.name}</h3>

// //                 {/* <div className="project-details">
// //                   {project.location && (
// //                     <div className="detail-item">
// //                       <Briefcase className="detail-icon" />
// //                       <span>{project.location || "Nagpur"}</span>
// //                     </div>
// //                   )}

// //                   {project.date && (
// //                     <div className="detail-item">
// //                       <Calendar className="detail-icon" />
// //                       <span>{project.date || "27-8-2025"}</span>
// //                     </div>
// //                   )}

// //                   {project.duration && (
// //                     <div className="detail-item">
// //                       <Clock className="detail-icon" />
// //                       <span>{project.duration || "15 Days"}</span>
// //                     </div>
// //                   )}
// //                 </div> */}

// //                 <p className="project-description">
// //                   {project.description ||
// //                     "Premium property development with modern amenities and strategic location."}
// //                 </p>

// //                 <div className="leadproject-button-container">
// //                   <button
// //                     className="leadproject-view-btn"
// //                     onClick={() => handleViewLead(project.id)}
// //                   >
// //                     View Details <ArrowRight className="btn-icon" />
// //                   </button>
// //                   <div className="action-buttons">
// //                     <button className="edit-btn">
// //                       <Edit className="action-icon" /> Edit
// //                     </button>
// //                     <button className="delete-btn">
// //                       <Trash2 className="action-icon" /> Delete
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default LeadProject;

// "use client";

// import { useState, useEffect } from "react";
// import { BASE_URL } from "../../config";
// import {
//   Calendar,
//   Clock,
//   Briefcase,
//   Loader2,
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Filter,
//   ChevronRight,
// } from "lucide-react";
// import "./leadproject.css";

// function LeadProject() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchFocused, setIsSearchFocused] = useState(false);

//   useEffect(() => {
//     async function fetchProjects() {
//       try {
//         const authData = JSON.parse(localStorage.getItem("NagpurProperties"));
//         const token = authData?.token;

//         if (!token) {
//           throw new Error("Authentication token not found");
//         }

//         setLoading(true);
//         const response = await fetch(`${BASE_URL}/show-AllProject`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setProjects(data);
//         setError(null);
//       } catch (error) {
//         console.error("Failed to fetch projects:", error);
//         setError("Failed to load projects. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProjects();
//   }, []);

//   const categories = ["All", "Active", "Completed", "Pending"];

//   const filteredProjects = projects
//     .filter(
//       (project) =>
//         selectedCategory === "All" || project.status === selectedCategory
//     )
//     .filter(
//       (project) =>
//         searchQuery === "" ||
//         project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "active":
//         return "status-active";
//       case "completed":
//         return "status-completed";
//       case "pending":
//         return "status-pending";
//       default:
//         return "status-default";
//     }
//   };

//   return (
//     <div className="leadproject-wrapper">
//       <div className="leadproject-header">
//         <div className="header-content">
//           <h1 className="leadproject-title">Project Dashboard</h1>
//           <p className="leadproject-subtitle">
//             Manage and track all your property development projects
//           </p>
//         </div>
//       </div>

//       <div className="lead_project_controls">
//         <div
//           className={`search-container ${
//             isSearchFocused ? "search-focused" : ""
//           }`}
//         >
//           <Search className="search-icon" />
//           <input
//             type="search"
//             placeholder="Search projects by name, location or description..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onFocus={() => setIsSearchFocused(true)}
//             onBlur={() => setIsSearchFocused(false)}
//           />
//         </div>
//         <button className="add-project-btn">
//           <Plus className="btn-icon" /> Add New Project
//         </button>
//       </div>

//       <div className="leadproject-container">
//         <div className="leadproject-filters-container">
//           <div className="filter-label">
//             <Filter className="filter-icon" />
//             <span>Filter by Status:</span>
//           </div>
//           <div className="leadproject-filters">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 className={`filter-btn ${
//                   selectedCategory === category ? "filter-active" : ""
//                 }`}
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>

//         {loading ? (
//           <div className="leadproject-loading">
//             <div className="loading-spinner">
//               <Loader2 className="loading-icon" />
//             </div>
//             <p>Loading your projects...</p>
//           </div>
//         ) : error ? (
//           <div className="leadproject-error">
//             <div className="error-icon">!</div>
//             <h3>Something went wrong</h3>
//             <p>{error}</p>
//             <button
//               className="retry-btn"
//               onClick={() => window.location.reload()}
//             >
//               Try Again
//             </button>
//           </div>
//         ) : filteredProjects.length === 0 ? (
//           <div className="leadproject-empty">
//             <div className="empty-illustration"></div>
//             <h3>No projects found</h3>
//             <p>We couldn't find any projects matching your criteria</p>
//             <button className="add-project-btn-small">
//               <Plus className="btn-icon" /> Create Your First Project
//             </button>
//           </div>
//         ) : (
//           <div className="leadproject-grid">
//             {filteredProjects.map((project, index) => (
//               <div key={index} className="leadproject-card">
//                 <div className="card-top-gradient"></div>
//                 <div
//                   className={`project-status-badge ${getStatusClass(
//                     project.status
//                   )}`}
//                 >
//                   <span className="status-dot"></span>
//                   {project.status}
//                 </div>

//                 <h3 className="leadproject-name">{project.name}</h3>

//                 <div className="project-details">
//                   {project.location && (
//                     <div className="detail-item">
//                       <div className="detail-icon-wrapper">
//                         <Briefcase className="detail-icon" />
//                       </div>
//                       <span>{project.location}</span>
//                     </div>
//                   )}

//                   {project.date && (
//                     <div className="detail-item">
//                       <div className="detail-icon-wrapper">
//                         <Calendar className="detail-icon" />
//                       </div>
//                       <span>{project.date}</span>
//                     </div>
//                   )}

//                   {project.duration && (
//                     <div className="detail-item">
//                       <div className="detail-icon-wrapper">
//                         <Clock className="detail-icon" />
//                       </div>
//                       <span>{project.duration}</span>
//                     </div>
//                   )}
//                 </div>

//                 <p className="project-description">
//                   {project.description ||
//                     "Premium property development with modern amenities and strategic location."}
//                 </p>

//                 <div className="leadproject-button-container">
//                   <button className="leadproject-view-btn">
//                     View Details <ChevronRight className="btn-icon" />
//                   </button>
//                   <div className="action-buttons">
//                     <button className="edit-btn">
//                       <Edit className="action-icon" /> Edit
//                     </button>
//                     <button className="delete-btn">
//                       <Trash2 className="action-icon" /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LeadProject;

import { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import {
  Loader2,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronRight,
  MapPin,
} from "lucide-react";
import "./leadproject.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function LeadProject() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [ShowAddNewProjectPopup, setShowAddNewProjectPopup] = useState(false);
  const [ProjectName, setProjectName] = useState("");
  const [ProjectLocation, setProjectLocation] = useState("");
  const [ProjectStatus, setProjectStatus] = useState("");
  const [ShowEditProjectPopup, setShowEditProjectPopup] = useState(false);
  const [EditProjectId, setEditProjectId] = useState("");
  const [EditProjectName, setEditProjectName] = useState("");
  const [EditProjectLocation, setEditProjectLocation] = useState("");
  const [EditProjectStatus, setEditProjectStatus] = useState("");
  useEffect(() => {
    async function fetchProjects() {
      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }

        setLoading(true);
        const response = await fetch(`${BASE_URL}/show-AllProject`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setProjects(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const categories = ["All", "ACTIVE", "INACTIVE", "COMPLETED"];

  const filteredProjects = projects
    .filter((project) => {
      const normalizedStatus = project.status?.trim().toUpperCase();
      return (
        selectedCategory === "All" ||
        normalizedStatus === selectedCategory.toUpperCase()
      );
    })
    .filter((project) => {
      const query = searchQuery.toLowerCase();
      return (
        query === "" ||
        project.name?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    });

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "ACTIVE":
        return "status-active";
      case "INACTIVE":
        return "status-completed";
      case "COMPLETED":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  function handleAddNewProject() {
    setShowAddNewProjectPopup(true);
  }
  async function handleSubmitNewProject(e) {
    e.preventDefault();
    const ProjectData = {
      name: ProjectName,
      status: ProjectStatus,
      location: ProjectLocation,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/create-new-project`,
        ProjectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setProjects((prevProjects) => [...prevProjects, response.data]);
        alert("Project created successfully");
        setShowAddNewProjectPopup(false);
        setProjectName("");
        setProjectLocation("");
        setProjectStatus("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditLeadProject(id) {
    setEditProjectId(id);
    setShowEditProjectPopup(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/show-SingleProject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setEditProjectName(response.data?.name);
      setEditProjectLocation(response.data?.location);
      setEditProjectStatus(response.data?.status);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitEditProject(e) {
    e.preventDefault();
    const ProjectData = {
      name: EditProjectName,
      status: EditProjectStatus,
      location: EditProjectLocation,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/update-project/${EditProjectId}`,
        ProjectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === EditProjectId ? response.data : project
          )
        );
        alert("Project updated successfully");
        setShowEditProjectPopup(false);
        setEditProjectName("");
        setEditProjectLocation("");
        setEditProjectStatus("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteLeadProject(id) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmation) return;

    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/delete-project/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
        alert("Project deleted successfully");
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleViewLead(ProjectId, ProjectName) {
    navigate(`/lead/${ProjectId}/${ProjectName}`);
  }
  return (
    <>
      <div className="leadproject-wrapper">
        <div className="leadproject-header">
          <div className="header-content">
            <h1 className="leadproject-title">Lead Dashboard</h1>
            <p className="leadproject-subtitle">
              Manage and track all your property development projects
            </p>
          </div>
        </div>

        <div className="lead_project_controls">
          <div
            className={`search-container ${
              isSearchFocused ? "search-focused" : ""
            }`}
          >
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search projects by name, location or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
          <button className="add-project-btn" onClick={handleAddNewProject}>
            <Plus className="btn-icon" /> Add New Project
          </button>
        </div>

        <div className="leadproject-container">
          <div className="leadproject-filters-container">
            <div className="filter-label">
              <Filter className="filter-icon" />
              <span>Filter by Status:</span>
            </div>
            <div className="leadproject-filters">
              {categories.map((category) => {
                const count =
                  category === "All"
                    ? projects.length
                    : projects.filter(
                        (p) => p.status?.trim().toUpperCase() === category
                      ).length;

                return (
                  <button
                    key={category}
                    className={`filter-btn ${
                      selectedCategory === category ? "filter-active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="leadproject-loading">
              <div className="loading-spinner">
                <Loader2 className="loading-icon" />
              </div>
              <p>Loading your projects...</p>
            </div>
          ) : error ? (
            <div className="leadproject-error">
              <div className="error-icon">!</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="leadproject-empty">
              <div className="empty-illustration"></div>
              <h3>No projects found</h3>
              <p>We couldn't find any projects matching your criteria</p>
              <button
                className="add-project-btn-small"
                onClick={handleAddNewProject}
              >
                <Plus className="btn-icon" /> Create Your First Project
              </button>
            </div>
          ) : (
            <div className="leadproject-grid">
              {filteredProjects.map((project, index) => (
                <div key={index} className="leadproject-card">
                  <div className="card-top-gradient"></div>
                  <div
                    className={`project-status-badge ${getStatusClass(
                      project.status
                    )}`}
                  >
                    <span className="status-dot"></span>
                    {project.status}
                  </div>

                  <h3 className="leadproject-name">{project.name}</h3>

                  <div className="project-details">
                    {project.name && (
                      <div className="detail_item_lead_project">
                        <div className="detail-icon-wrapper">
                          <MapPin className="detail-icon" />
                        </div>
                        <p>
                          <span>{project.location || "n/a"}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="project-description">
                    {project.description ||
                      "Premium property development with modern amenities and strategic location."}
                  </p>

                  <div className="leadproject-button-container">
                    <button
                      className="leadproject-view-btn"
                      onClick={() => handleViewLead(project.id, project.name)}
                    >
                      View Details <ChevronRight className="btn-icon" />
                    </button>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditLeadProject(project.id)}
                      >
                        <Edit className="action-icon" /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteLeadProject(project.id)}
                      >
                        <Trash2 className="action-icon" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {ShowAddNewProjectPopup && (
        <div className="add-new-project-overlay">
          <div className="add-new-project-popup">
            <h2>Add New Project</h2>
            <button
              className="add-new-project_close-popup-btn"
              onClick={() => setShowAddNewProjectPopup(false)}
            >
              X
            </button>
            <form
              className="add-new-project-form"
              onSubmit={handleSubmitNewProject}
            >
              <input
                type="text"
                placeholder="Enter Project Name"
                className="add_new_project_inpt"
                value={ProjectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Project Location"
                className="add_new_project_inpt"
                value={ProjectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
              />
              <select
                className="add_new_project_select"
                value={ProjectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
              >
                <option value="" className="add_new_project_option">
                  Select Status
                </option>
                <option value="ACTIVE" className="add_new_project_option">
                  ACTIVE
                </option>
                <option value="INACTIVE" className="add_new_project_option">
                  INACTIVE
                </option>
                <option value="COMPLETED" className="add_new_project_option">
                  COMPLETED
                </option>
              </select>
              <button className="Add_new_project_submit_button" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {ShowEditProjectPopup && (
        <div className="add-new-project-overlay">
          <div className="add-new-project-popup">
            <h2>Edit Project</h2>
            <button
              className="add-new-project_close-popup-btn"
              onClick={() => setShowEditProjectPopup(false)}
            >
              X
            </button>
            <form
              className="add-new-project-form"
              onSubmit={handleSubmitEditProject}
            >
              <input
                type="text"
                placeholder="Enter Project Name"
                className="add_new_project_inpt"
                value={EditProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Project Location"
                className="add_new_project_inpt"
                value={EditProjectLocation}
                onChange={(e) => setEditProjectLocation(e.target.value)}
              />
              <select
                className="add_new_project_select"
                value={EditProjectStatus}
                onChange={(e) => setEditProjectStatus(e.target.value)}
              >
                <option value="" className="add_new_project_option">
                  Select Status
                </option>
                <option value="ACTIVE" className="add_new_project_option">
                  ACTIVE
                </option>
                <option value="INACTIVE" className="add_new_project_option">
                  INACTIVE
                </option>
                <option value="COMPLETED" className="add_new_project_option">
                  COMPLETED
                </option>
              </select>
              <button className="Add_new_project_submit_button" type="submit">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LeadProject;
