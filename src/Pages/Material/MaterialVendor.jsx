import { useEffect, useState } from "react";
import "./materialVendor.css";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";

function MaterialVendor() {
  const { ProjectId, ProjectName } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVendor, setNewVendor] = useState({ vendorName: "", phoneNo: "" });
  const [editingVendor, setEditingVendor] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorNumber, setVendorNumber] = useState("");

  // Fetch vendors for the project
  const fetchVendors = async () => {
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }
      setLoading(true);
      const response = await axiosInstance.get(
        `${BASE_URL}/showVendorByProjectId/${ProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setVendors(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      setError("Failed to load vendors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize form fields for adding or editing
  const initializeForm = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      setVendorName(vendor.vendorName || "");
      setVendorNumber(vendor.phoneNo || "");
    } else {
      setEditingVendor(null);
      setVendorName("");
      setVendorNumber("");
    }
    setIsFormVisible(true);
  };

  // Validate phone number
  const validatePhoneNumber = (phoneNo) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNo);
  };

  // Add a new vendor
  const addVendor = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(vendorNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }
      await axiosInstance.post(
        `${BASE_URL}/createVendor`,
        { vendorName, phoneNo: vendorNumber, projectId: parseInt(ProjectId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Vendor Added Successfully");
      setNewVendor({ vendorName: "", phoneNo: "" });
      setVendorName("");
      setVendorNumber("");
      setIsFormVisible(false);
      await fetchVendors();
      setError(null);
    } catch (error) {
      console.error("Failed to add vendor:", error);
      setError("Failed to add vendor. Please try again.");
    }
  };

  // Load vendor details for editing
  const editVendor = async (vendorId) => {
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await axiosInstance.get(
        `${BASE_URL}/getVendorById/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      initializeForm(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to load vendor details:", error);
      setError("Failed to load vendor details. Please try again.");
    }
  };

  // Update an existing vendor
  const updateVendor = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(vendorNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }
      if (!editingVendor || !editingVendor.id) {
        throw new Error("No vendor selected for update");
      }
      await axiosInstance.put(
        `${BASE_URL}/updateVendor/${editingVendor.id}`,
        {
          vendorName,
          phoneNo: vendorNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVendorName("");
      setVendorNumber("");
      setEditingVendor(null);
      setIsFormVisible(false);
      await fetchVendors();
      setError(null);
      alert("Vendor updated successfully!");
    } catch (error) {
      console.error("Failed to update vendor:", error);
      setError("Failed to update vendor. Please try again.");
    }
  };

  // Delete a vendor
  const deleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) {
      return;
    }
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }
      await axiosInstance.delete(`${BASE_URL}/vendors/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Vendor Delete Successfully");
      await fetchVendors();
      setError(null);
    } catch (error) {
      console.error("Failed to delete vendor:", error);
      setError("Failed to delete vendor. Please try again.");
    }
  };

  // View vendor details (placeholder)
  const viewVendor = (VendorId) => {
    // console.log(`View details for vendor ID: ${id}`);
    navigate(`/MaterialVendorDetails/${VendorId}/${ProjectName}/${ProjectId}`);
  };

  // Cancel form editing
  const cancelEdit = () => {
    setEditingVendor(null);
    setNewVendor({ vendorName: "", phoneNo: "" });
    setVendorName("");
    setVendorNumber("");
    setIsFormVisible(false);
  };

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    (vendor) =>
      (vendor.vendorName &&
        vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      vendor.phoneNo.includes(searchTerm)
  );

  useEffect(() => {
    fetchVendors();
  }, [ProjectId, token]);

  if (loading) {
    return (
      <div className="MaterialVendor-container">
        <div className="MaterialVendor-loading-wrapper">
          <div className="MaterialVendor-loading-spinner"></div>
          <p className="MaterialVendor-loading-text">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="MaterialVendor-container">
        <div className="MaterialVendor-error-wrapper">
          <div className="MaterialVendor-error-icon">⚠️</div>
          <p className="MaterialVendor-error-text">{error}</p>
          <button
            className="MaterialVendor-retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="MaterialVendor-container">
      <div className="MaterialVendor-header">
        <div className="MaterialVendor-header-content">
          <h1 className="MaterialVendor-title">Vendors for {ProjectName}</h1>
          <p className="MaterialVendor-subtitle">
            Manage your project vendors efficiently
          </p>
        </div>
      </div>

      <div className="MaterialVendor-controls">
        <div className="MaterialVendor-search-wrapper">
          <span className="MaterialVendor-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search vendors by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="MaterialVendor-search-input"
          />
        </div>

        <button
          className="MaterialVendor-add-button"
          onClick={() => initializeForm()}
        >
          <span className="MaterialVendor-add-icon">+</span>
          Add New Vendor
        </button>
      </div>

      {isFormVisible && (
        <div className="MaterialVendor-form-overlay">
          <div className="MaterialVendor-form-modal">
            <div className="MaterialVendor-form-header">
              <h3 className="MaterialVendor-form-title">
                {editingVendor ? "Edit Vendor" : "Add New Vendor"}
              </h3>
              <button
                className="MaterialVendor-form-close"
                onClick={cancelEdit}
              >
                ×
              </button>
            </div>

            <form
              className="MaterialVendor-form"
              onSubmit={editingVendor ? updateVendor : addVendor}
            >
              <div className="MaterialVendor-form-group">
                <label className="MaterialVendor-form-label">Vendor Name</label>
                <input
                  type="text"
                  name="vendorName"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Enter vendor name"
                  className="MaterialVendor-form-input"
                  required
                />
              </div>

              <div className="MaterialVendor-form-group">
                <label className="MaterialVendor-form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={vendorNumber}
                  onChange={(e) => setVendorNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="MaterialVendor-form-input"
                  required
                />
              </div>

              <div className="MaterialVendor-form-actions">
                <button
                  type="button"
                  className="MaterialVendor-form-button MaterialVendor-form-button-cancel"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="MaterialVendor-form-button MaterialVendor-form-button-submit"
                >
                  {editingVendor ? "Update Vendor" : "Add Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="MaterialVendor-grid">
        {filteredVendors.map((vendor, index) => (
          <div
            key={vendor.id}
            className="MaterialVendor-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="MaterialVendor-card-header">
              <div className="MaterialVendor-card-avatar">
                {vendor?.vendorName
                  ? vendor.vendorName.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <div className="MaterialVendor-card-status">Active</div>
            </div>

            <div className="MaterialVendor-card-content">
              <h2 className="MaterialVendor-card-title">
                {vendor.vendorName || "Unnamed Vendor"}
              </h2>

              <div className="MaterialVendor-card-details">
                <div className="MaterialVendor-detail-item">
                  <span className="MaterialVendor-detail-icon">📞</span>
                  <div className="MaterialVendor-detail-content">
                    <span className="MaterialplanetaryVendor-detail-label">
                      Phone
                    </span>
                    <span className="MaterialVendor-detail-value">
                      {vendor.phoneNo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="MaterialVendor-card-footer">
              <div className="MaterialVendor-card-actions">
                <button
                  className="MaterialVendor-action-button MaterialVendor-action-view"
                  onClick={() => viewVendor(vendor.id)}
                  title="View Details"
                >
                  <span className="MaterialVendor-action-text">View</span>
                </button>

                <button
                  className="MaterialVendor-action-button MaterialVendor-action-edit"
                  onClick={() => editVendor(vendor.id)}
                  title="Edit Vendor"
                >
                  <span className="MaterialVendor-action-text">Edit</span>
                </button>

                <button
                  className="MaterialVendor-action-button MaterialVendor-action-delete"
                  onClick={() => deleteVendor(vendor.id)}
                  title="Delete Vendor"
                >
                  <span className="MaterialVendor-action-text">Delete</span>
                </button>
              </div>

              <div className="MaterialVendor-card-divider"></div>
            </div>

            <div className="MaterialVendor-card-overlay"></div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && !loading && (
        <div className="MaterialVendor-empty-state">
          <div className="MaterialVendor-empty-icon">👥</div>
          <h3 className="MaterialVendor-empty-title">
            {searchTerm ? "No vendors found" : "No vendors yet"}
          </h3>
          <p className="MaterialVendor-empty-text">
            {searchTerm
              ? `No vendors match "${searchTerm}". Try a different search term.`
              : "Start by adding your first vendor to this project."}
          </p>
          {!searchTerm && (
            <button
              className="MaterialVendor-empty-button"
              onClick={() => initializeForm()}
            >
              Add First Vendor
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MaterialVendor;
