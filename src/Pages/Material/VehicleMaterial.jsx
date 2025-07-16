"use client";

import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./VehicleMaterial.css";
import { useNavigate } from "react-router-dom";

function VehicleMaterial() {
  const navigate = useNavigate();
  const { token, role } =
    JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const [poNumbers, setPoNumbers] = useState([]);
  const [vehicleDetailedData, setVehicleDetailedData] = useState([]);
  const [formData, setFormData] = useState({
    vehicleNo: "",
    poNumber: "",
    file: null,
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  console.log("Role:", role?.[0]?.roleName);

  // Fetch PO Numbers and Vehicle Entries
  useEffect(() => {
    async function fetchData() {
      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }
        setLoading(true);
        // Fetch PO Numbers
        const poResponse = await axiosInstance.get(
          `${BASE_URL}/purchase-orders/all-PoNumber`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Fetch Vehicle Entries
        const vehicleResponse = await axiosInstance.get(
          `${BASE_URL}/vehicle-entries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPoNumbers(poResponse.data || []);
        setVehicleDetailedData(vehicleResponse.data || []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Filter and search logic
  useEffect(() => {
    let filtered = vehicleDetailedData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.engineerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.purchaseOrder?.poNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.purchaseOrder?.supplierName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.purchaseOrder?.orderItems?.some((oi) =>
            oi.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (item) =>
          item.purchaseOrder?.orderItemStatus?.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    // Site filter
    if (siteFilter) {
      filtered = filtered.filter(
        (item) => item.purchaseOrder?.siteName === siteFilter
      );
    }

    setFilteredData(filtered);
  }, [vehicleDetailedData, searchTerm, statusFilter, siteFilter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!formData.vehicleNo || !formData.poNumber) {
      setFormError("Vehicle Number and PO Number are required.");
      return;
    }
    try {
      setLoading(true);
      const data = new FormData();
      data.append("vehicleNo", formData.vehicleNo);
      data.append("poNumber", formData.poNumber);
      if (formData.file) {
        data.append("file", formData.file);
      }
      const response = await axiosInstance.post(
        `${BASE_URL}/vehicle-entries`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFormSuccess("Vehicle entry created successfully!");
      setFormData({ vehicleNo: "", poNumber: "", file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      // Refresh vehicle entries after submission
      const vehicleResponse = await axiosInstance.get(
        `${BASE_URL}/vehicle-entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVehicleDetailedData(vehicleResponse.data || []);
    } catch (error) {
      console.error("Failed to create vehicle entry:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to create vehicle entry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get unique site names for filter dropdown
  const uniqueSiteNames = [
    ...new Set(
      vehicleDetailedData
        .map((item) => item.purchaseOrder?.siteName)
        .filter(Boolean)
    ),
  ];

  // Handle image view
  const handleImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Handle form submission and close modal
  const handleFormSubmit = async (e) => {
    await handleSubmit(e);
    if (formSuccess) {
      setShowAddForm(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="VehicleMaterialcontainer">
        <div className="VehicleMaterialloading-wrapper">
          <div className="VehicleMaterialloading-spinner"></div>
          <div className="VehicleMaterialloading-content">
            <h3 className="VehicleMaterialloading-title">Loading...</h3>
            <p className="VehicleMaterialloading-text">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="VehicleMaterialcontainer">
        <div className="VehicleMaterialerror-wrapper">
          <div className="VehicleMaterialerror-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 22H22L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="VehicleMaterialerror-title">Something went wrong</h3>
          <p className="VehicleMaterialerror-text">{error}</p>
          <button
            className="VehicleMaterialretry-button"
            onClick={() => window.location.reload()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4V10H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 20V14H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Role-based message for unauthorized users
  if (!["Admin", "Engineer"].includes(role?.[0]?.roleName)) {
    return (
      <div className="VehicleMaterialcontainer">
        <div className="VehicleMaterialunauthorized-wrapper">
          <div className="VehicleMaterialunauthorized-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M15 9L9 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="VehicleMaterialunauthorized-title">Access Denied</h3>
          <p className="VehicleMaterialunauthorized-text">
            You are not authorized to create vehicle entries.
          </p>
          <p className="VehicleMaterialunauthorized-subtext">
            Please contact your administrator for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="VehicleMaterialcontainer">
      {/* Header */}
      <div className="VehicleMaterialheader">
        <div className="VehicleMaterialheader-content">
          <h1 className="VehicleMaterialheader-title">
            Vehicle Material Management
          </h1>
          <p className="VehicleMaterialheader-subtitle">
            Manage vehicle entries and track material deliveries
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="VehicleMaterialmain-content">
        {/* Controls Section */}
        <div className="VehicleMaterialcontrols-section">
          <div className="VehicleMaterialcontrols-header">
            <h2 className="VehicleMaterialcontrols-title">
              Vehicle Entries Management
            </h2>
            <button
              className="VehicleMaterialadd-button"
              onClick={() => setShowAddForm(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add Vehicle
            </button>
          </div>

          {/* Search and Filters */}
          <div className="VehicleMaterialfilters-container">
            <div className="VehicleMaterialsearch-container">
              <div className="VehicleMaterialsearch-wrapper">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by vehicle, engineer, PO number, supplier, or material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="VehicleMaterialsearch-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="VehicleMaterialsearch-clear"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="18"
                        y1="6"
                        x2="6"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="VehicleMaterialfilters-wrapper">
              <div className="VehicleMaterialfilter-group">
                {/* <label className="VehicleMaterialfilter-label">Status</label> */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="VehicleMaterialfilter-select"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>

              <div className="VehicleMaterialfilter-group">
                {/* <label className="VehicleMaterialfilter-label">Site</label> */}
                <select
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                  className="VehicleMaterialfilter-select"
                >
                  <option value="">All Sites</option>
                  {uniqueSiteNames.map((siteName, index) => (
                    <option key={index} value={siteName}>
                      {siteName}
                    </option>
                  ))}
                </select>
              </div>

              {(searchTerm || statusFilter || siteFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setSiteFilter("");
                  }}
                  className="VehicleMaterialclear-filters"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="10"
                      y1="11"
                      x2="10"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="14"
                      y1="11"
                      x2="14"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          {/* <div className="VehicleMaterialresults-info">
            <p>
              Showing {filteredData.length} of {vehicleDetailedData.length}{" "}
              entries
              {searchTerm && <span> for "{searchTerm}"</span>}
              {statusFilter && <span> • Status: {statusFilter}</span>}
              {siteFilter && <span> • Site: {siteFilter}</span>}
            </p>
          </div> */}
        </div>

        {/* Vehicle Entries Table */}
        <div className="VehicleMaterialtable-container">
          {filteredData.length > 0 ? (
            <div className="VehicleMaterialtable-wrapper">
              <table className="VehicleMaterialtable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Vehicle No</th>
                    <th>Engineer</th>
                    <th>Site</th>
                    <th>PO Number</th>
                    <th>Supplier</th>
                    <th>Material</th>
                    <th>Qty</th>
                    <th>Unit Cost</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Note</th>
                    <th>Expected Date</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="VehicleMaterialtable-row">
                      <td className="VehicleMaterialtable-cell-index">
                        {index + 1}
                      </td>
                      <td>{item.date || "N/A"}</td>
                      <td>{item.time || "N/A"}</td>
                      <td className="VehicleMaterialtable-cell-vehicle">
                        {item.vehicleNo || "N/A"}
                      </td>
                      <td>{item.engineerName || "N/A"}</td>
                      <td>{item.purchaseOrder?.siteName || "N/A"}</td>
                      <td className="VehicleMaterialtable-cell-po">
                        {item.purchaseOrder?.poNumber || "N/A"}
                      </td>
                      <td>{item.purchaseOrder?.supplierName || "N/A"}</td>
                      <td className="VehicleMaterialtable-cell-material">
                        {item.purchaseOrder?.orderItems?.length > 0
                          ? item.purchaseOrder.orderItems
                              .map((oi) => oi.materialName)
                              .join(", ")
                          : "N/A"}
                      </td>
                      <td>
                        {item.purchaseOrder?.orderItems?.length > 0
                          ? item.purchaseOrder.orderItems[0].orderQty || "N/A"
                          : "N/A"}
                      </td>
                      <td>
                        {item.purchaseOrder?.orderItems?.length > 0
                          ? `₹${
                              item.purchaseOrder.orderItems[0].unitCost || "N/A"
                            }`
                          : "N/A"}
                      </td>
                      <td className="VehicleMaterialtable-cell-cost">
                        {item.purchaseOrder?.orderItems?.length > 0
                          ? `₹${
                              item.purchaseOrder.orderItems[0].totalCost ||
                              "N/A"
                            }`
                          : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`VehicleMaterialstatus-badge VehicleMaterialstatus-${
                            item.purchaseOrder?.orderItemStatus?.toLowerCase() ||
                            "pending"
                          }`}
                        >
                          {item.purchaseOrder?.orderItemStatus || "Pending"}
                        </span>
                      </td>
                      <td className="VehicleMaterialtable-cell-note">
                        {item.purchaseOrder?.note || "N/A"}
                      </td>
                      <td>{item.purchaseOrder?.expectDate || "N/A"}</td>
                      <td>
                        {item.images ? (
                          <button
                            onClick={() => handleImageView(item.images)}
                            className="VehicleMaterialview-button"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            View
                          </button>
                        ) : (
                          <span className="VehicleMaterialno-image">
                            No Image
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="VehicleMaterialno-data">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <h3>No Vehicle Entries Found</h3>
              <p>
                {searchTerm || statusFilter || siteFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start by creating your first vehicle entry using the Add Vehicle button."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Vehicle Form Modal */}
      {showAddForm && (
        <div
          className="VehicleMaterialmodal-overlay"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="VehicleMaterialmodal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleMaterialmodal-header">
              <h2 className="VehicleMaterialmodal-title">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Create Vehicle Entry
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="VehicleMaterialmodal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="VehicleMaterialmodal-form"
            >
              <div className="VehicleMaterialform-grid">
                <div className="VehicleMaterialform-group">
                  <label
                    htmlFor="vehicleNo"
                    className="VehicleMaterialform-label"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7H7V17Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    id="vehicleNo"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className="VehicleMaterialform-input"
                    placeholder="Enter vehicle number (e.g., MH-12-AB-1234)"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="VehicleMaterialform-group">
                  <label
                    htmlFor="poNumber"
                    className="VehicleMaterialform-label"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    PO Number
                  </label>
                  <select
                    id="poNumber"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    className="VehicleMaterialform-select"
                    required
                    disabled={loading || poNumbers.length === 0}
                  >
                    <option value="" disabled>
                      {poNumbers.length === 0
                        ? "No PO Numbers Available"
                        : "Select PO Number"}
                    </option>
                    {poNumbers.map((item, index) => (
                      <option key={index} value={item.poNumber}>
                        {item.poNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="VehicleMaterialform-group VehicleMaterialfile-upload-group">
                <label
                  htmlFor="fileInput"
                  className="VehicleMaterialform-label"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="21,15 16,10 5,21"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Upload Image (Optional)
                </label>
                <div className="VehicleMaterialfile-upload-wrapper">
                  <input
                    type="file"
                    id="fileInput"
                    name="file"
                    onChange={handleFileChange}
                    className="VehicleMaterialfile-input"
                    accept="image/*"
                    disabled={loading}
                    ref={fileInputRef}
                  />
                  <div className="VehicleMaterialfile-upload-display">
                    {formData.file ? (
                      <div className="VehicleMaterialfile-selected">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V9L13 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{formData.file.name}</span>
                      </div>
                    ) : (
                      <div className="VehicleMaterialfile-placeholder">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="7,10 12,15 17,10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="12"
                            y1="15"
                            x2="12"
                            y2="3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p>Click to upload or drag and drop</p>
                        <span>PNG, JPG, GIF up to 10MB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="VehicleMaterialmodal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="VehicleMaterialcancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="VehicleMaterialsubmit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="VehicleMaterialbutton-spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Submit Vehicle Entry
                    </>
                  )}
                </button>
              </div>

              {formError && (
                <div className="VehicleMaterialform-message VehicleMaterialform-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="15"
                      y1="9"
                      x2="9"
                      y2="15"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="9"
                      y1="9"
                      x2="15"
                      y2="15"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="VehicleMaterialform-message VehicleMaterialform-success">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 11.08V12A10 10 0 1 1 5.93 7.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,4 12,14.01 9,11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {formSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div
          className="VehicleMaterialimage-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="VehicleMaterialimage-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleMaterialimage-modal-header">
              <h3 className="VehicleMaterialimage-modal-title">
                Vehicle Image
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="VehicleMaterialimage-modal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            <div className="VehicleMaterialimage-modal-body">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Vehicle Entry"
                className="VehicleMaterialfullscreen-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleMaterial;
