import { useEffect, useState } from "react";
import "./material.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
function Material() {
  const navigate = useNavigate();
  const { token, role, allowedSite } =
    JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const [Project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleName = role[0].roleName;
  console.log(roleName);
  console.log(allowedSite);

  useEffect(() => {
    async function fetchProject() {
      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }

        setLoading(true);
        const response = await axiosInstance(`${BASE_URL}/show-AllProject`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (allowedSite) {
          setProject(allowedSite);
        } else {
          setProject(response.data);
        }
        // console.log(response.data);
        // setProject(response.data);

        setError(null);
      } catch (error) {
        console.error("Failed to fetch plots:", error);
        setError("Failed to load plots. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [token]);

  // const handleViewDetails = (ProjectId, ProjectName) => {
  //   navigate(`/materialVendor/${ProjectId}/${ProjectName}`);
  // };

  const handleViewDetails = (ProjectId, ProjectName) => {
    navigate(`/MaterialAllDetails/${ProjectId}/${ProjectName}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ongoing":
        return "material-status-success";
      case "completed":
        return "material-status-info";
      case "pending":
        return "material-status-warning";
      case "inactive":
        return "material-status-danger";
      default:
        return "material-status-default";
    }
  };

  if (loading) {
    return (
      <div className="material-container">
        <div className="material-loading-wrapper">
          <div className="material-loading-spinner"></div>
          <p className="material-loading-text">Loading amazing projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="material-container">
        <div className="material-error-wrapper">
          <div className="material-error-icon">⚠️</div>
          <p className="material-error-text">{error}</p>
          <button
            className="material-retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="material-container">
      <div className="material-header">
        <h1 className="material-title">
          {/* <span className="material-title-icon">🏢</span> */}
          Available Projects
        </h1>
        <p className="material-subtitle">
          Discover our premium real estate projects
        </p>
        {/* <div className="material-stats">
          <div className="material-stat-item">
            <span className="material-stat-number">{Project.length}</span>
            <span className="material-stat-label">Total Projects</span>
          </div>
        </div> */}
      </div>

      <div className="material-grid">
        {Project.map((project, index) => (
          <div
            key={project.id}
            className="material-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="material-card-header">
              <div className="material-card-icon">🏗️</div>
              <div
                className={`material-status-badge ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status || "ACTIVE"}
              </div>
            </div>

            <div className="material-card-content">
              <h2 className="material-card-title">{project.name}</h2>

              {role?.some(
                (r) => r.roleName === "Admin" || r.roleName === "Head"
              ) && (
                <div className="material-card-details">
                  <div className="material-detail-item">
                    <span className="material-detail-icon">📍</span>
                    <div className="material-detail-content">
                      <span className="material-detail-label">Location</span>
                      <span className="material-detail-value">
                        {project.location}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="material-card-footer">
              {role?.[0]?.roleName === "Admin" &&
                "Head" && ( // Condition: Show button only for Engineer
                  <button
                    className="material-view-button"
                    onClick={() => handleViewDetails(project.id, project.name)}
                  >
                    <span className="material-button-text">View Details</span>
                    <span className="material-button-icon">→</span>
                  </button>
                )}
            </div>

            <div className="material-card-overlay"></div>
          </div>
        ))}
      </div>

      {Project.length === 0 && (
        <div className="material-empty-state">
          <div className="material-empty-icon">📋</div>
          <h3 className="material-empty-title">No Projects Found</h3>
          <p className="material-empty-text">
            There are no projects available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}

export default Material;
