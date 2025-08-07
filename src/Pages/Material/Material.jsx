import { useEffect, useState } from "react";
import "./material.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import MaterialPurches from "./MaterialPurches";
import VehicleMaterial from "./VehicleMaterial";
import MaterialStock from "./MaterialStock";
import { Package, Wrench, Truck, TruckElectric } from "lucide-react";
import StockSummary from "./StockSummary";
function Material() {
  const navigate = useNavigate();
  const { token, role, allowedSite } =
    JSON.parse(localStorage.getItem("NagpurProperties")) || {};

  const [activeTab, setActiveTab] = useState("All Sites");
  const [Project, setProject] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const roleName = role[0].roleName;

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

        // Set sample purchase orders - replace with actual API call

        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [token]);

  const handleViewDetails = (ProjectId, ProjectName) => {
    navigate(`/MaterialAllDetails/${ProjectId}/${ProjectName}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ongoing":
      case "approved":
        return "material-status-success";
      case "completed":
        return "material-status-info";
      case "pending":
        return "material-status-warning";
      case "inactive":
      case "rejected":
        return "material-status-danger";
      default:
        return "material-status-default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPurchaseOrders = purchaseOrders.filter(
    (order) =>
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="material-container">
        <div className="material-loading-wrapper">
          <div className="material-loading-spinner"></div>
          <p className="material-loading-text">
            Loading material management...
          </p>
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
    <>
      {/* <div className="material-header">
        <h1 className="material-title">Available Projects</h1>
        <p className="material-subtitle">
          Discover our premium real estate projects
        </p>
      </div> */}

      <div className="material-container">
        {/* Navigation Tabs */}
        <div className="material-nav-tabs">
          <button
            className={`material-tab ${
              activeTab === "All Sites" ? "active" : ""
            }`}
            onClick={() => setActiveTab("All Sites")}
          >
            <span className="material-tab-icon">
              <Package />
            </span>
            All Sites
          </button>
          <button
            className={`material-tab ${
              activeTab === "purchase-orders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("purchase-orders")}
          >
            <span className="material-tab-icon">
              <Wrench />
            </span>
            Purchase Orders
          </button>
          <button
            className={`material-tab ${
              activeTab === "vehicle-entry" ? "active" : ""
            }`}
            onClick={() => setActiveTab("vehicle-entry")}
          >
            <span className="material-tab-icon">
              <Truck />
            </span>
            Vehicle Entry
          </button>
          <button
            className={`material-tab ${
              activeTab === "stock-Transfer" ? "active" : ""
            }`}
            onClick={() => setActiveTab("stock-Transfer")}
          >
            <span className="material-tab-icon">
              <TruckElectric />
            </span>
            Stock Entry
          </button>
          <button
            className={`material-tab ${
              activeTab === "stockSummary" ? "active" : ""
            }`}
            onClick={() => setActiveTab("stockSummary")}
          >
            <span className="material-tab-icon">
              <Package />
            </span>
            Stock Summary
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "All Sites" && (
          <>
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
                            <span className="material-detail-label">
                              Location
                            </span>
                            <span className="material-detail-value">
                              {project.location}
                            </span>
                          </div>
                        </div>
                      </div>
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
          </>
        )}

        {/* Purchase Orders Tab Content */}
        {activeTab === "purchase-orders" && (
          <>
            <MaterialPurches />
          </>
        )}

        {activeTab === "vehicle-entry" && (
          <>
            <VehicleMaterial />
          </>
        )}

        {activeTab === "stock-Transfer" && (
          <>
            <MaterialStock />
          </>
        )}
        {activeTab === "stockSummary" && (
          <>
            <StockSummary />
          </>
        )}
      </div>
    </>
  );
}

export default Material;
