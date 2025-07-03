import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2, Search, Filter, ChevronRight, MapPin } from "lucide-react";
import { BASE_URL } from "../../config";
import "../Contractor/Contractor.css";

function Contractor() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${BASE_URL}/show-AllProject`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [token]);

  const categories = ["All", "ACTIVE", "INACTIVE", "COMPLETED"];

  const filteredProjects = projects
    .filter((project) => {
      const status = project.status?.trim().toUpperCase();
      return selectedCategory === "All" || status === selectedCategory;
    })
    .filter((project) => {
      const q = searchQuery.toLowerCase();
      return (
        q === "" ||
        project.name?.toLowerCase().includes(q) ||
        project.location?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q)
      );
    });

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "completed":
        return "status-completed";
      default:
        return "status-default";
    }
  };

  function handleViewDetails(projectId, projectName) {
    navigate(`/contractorDetails/${projectId}`, { state: { projectName } });
  }

  return (
    <div className="plot-wrapper">
      <div className="plot-header">
        <div className="header-content">
          <h1 className="plot-title">Contractor Management</h1>
          <p className="plot-subtitle">Manage and track all your property</p>
        </div>
      </div>

      <div className="plot-controls">
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
      </div>

      <div className="plot-container">
        <div className="plot-filters-container">
          <div className="filter-label">
            <Filter className="filter-icon" />
            <span>Filter by Status:</span>
          </div>
          <div className="plot-filters">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter(
                      (p) => p.status?.trim().toUpperCase() === cat
                    ).length;
              return (
                <button
                  key={cat}
                  className={`filter-btn ${
                    selectedCategory === cat ? "filter-active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="plot-loading">
            <Loader2 className="loading-icon" />
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="plot-error">
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
          <div className="plot-empty">
            <h3>No projects found</h3>
            <p>We couldn't find any projects matching your criteria.</p>
          </div>
        ) : (
          <div className="plot-grid">
            {filteredProjects.map((project) => (
              <div key={project._id || project.id} className="plot-card">
                <div
                  className={`plot-status-badge ${getStatusClass(
                    project.status
                  )}`}
                >
                  <span className="status-dot"></span>
                  {project.status}
                </div>

                <h3 className="plot-name">{project.name}</h3>

                <div className="plot-details">
                  <div className="detail_item_plot">
                    <div className="detail-icon-wrapper">
                      <MapPin className="detail-icon" />
                    </div>
                    <p>{project.location || "n/a"}</p>
                  </div>
                </div>

                <p className="plot-description">
                  {project.description ||
                    "Premium plot development with modern amenities."}
                </p>

                <div className="plot-button-container">
                  <button
                    className="plot-view-btn"
                    onClick={() =>
                      handleViewDetails(project._id || project.id, project.name)
                    }
                  >
                    View Details <ChevronRight className="btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contractor;
