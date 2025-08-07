import { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import { Loader2, Search, Filter, ChevronRight, MapPin } from "lucide-react";
import "../Plot/Plot.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function Plot() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    async function fetchPlots() {
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

        setPlots(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch plots:", error);
        setError("Failed to load plots. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlots();
  }, [token]);

  const categories = ["All", "ACTIVE", "INACTIVE", "COMPLETED"];

  const filteredPlots = plots
    .filter((plot) => {
      const normalizedStatus = plot.status?.trim().toUpperCase();
      return (
        selectedCategory === "All" ||
        normalizedStatus === selectedCategory.toUpperCase()
      );
    })
    .filter((plot) => {
      const query = searchQuery.toLowerCase();
      return (
        query === "" ||
        plot.name?.toLowerCase().includes(query) ||
        plot.location?.toLowerCase().includes(query) ||
        plot.description?.toLowerCase().includes(query)
      );
    });

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-completed";
      case "completed":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  function handleViewPlot(ProjectId, ProjectName) {
    // alert([plotId, plotName]);
    navigate(`/plotDetails/${ProjectId}/${ProjectName}`);
  }

  return (
    <>
      <div className="plot-wrapper">
        <div className="plot-header">
          <div className="header-content">
            <h1 className="plot-title">Plot Dashboard</h1>
            {/* <p className="plot-subtitle">
              Manage and track all your property development plots
            </p> */}
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
              placeholder="Search plots by name, location or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
          <div className="plot-filters-container">
            <div className="filter-label">
              <Filter className="filter-icon" />
              <span>Filter:</span>
            </div>
            <div className="plot-filters">
              {categories.map((category) => {
                const count =
                  category === "All"
                    ? plots.length
                    : plots.filter(
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
        </div>

        <div className="plot-container">
          {loading ? (
            <div className="plot-loading">
              <div className="loading-spinner">
                <Loader2 className="loading-icon" />
              </div>
              <p>Loading your plots...</p>
            </div>
          ) : error ? (
            <div className="plot-error">
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
          ) : filteredPlots.length === 0 ? (
            <div className="plot-empty">
              <div className="empty-illustration"></div>
              <h3>No plots found</h3>
              <p>We couldn't find any plots matching your criteria</p>
            </div>
          ) : (
            <div className="plot-grid">
              {filteredPlots.map((plot, index) => (
                <div key={index} className="plot-card">
                  {/* <div className="card-top-gradient"></div> */}
                  <div
                    className={`plot-status-badge ${getStatusClass(
                      plot.status
                    )}`}
                  >
                    <span className="status-dot"></span>
                    {plot.status}
                  </div>

                  <h3 className="plot-name">{plot.name}</h3>

                  <div className="plot-details">
                    {plot.name && (
                      <div className="detail_item_plot">
                        <div className="detail-icon-wrapper">
                          <MapPin className="detail-icon" />
                        </div>
                        <p>
                          <span>{plot.location || "n/a"}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="plot-description">
                    {plot.description ||
                      "Premium plot development with modern amenities and strategic location."}
                  </p>

                  <div className="plot-button-container">
                    <button
                      className="plot-view-btn"
                      onClick={() => handleViewPlot(plot.id, plot.name)}
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
    </>
  );
}

export default Plot;
