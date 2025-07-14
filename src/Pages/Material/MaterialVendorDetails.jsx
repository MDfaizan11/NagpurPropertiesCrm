import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./MaterialVendorDetails.css";
import { useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function MaterialVendorDetails() {
  const { VendorId, ProjectName, ProjectId } = useParams();
  const navigate = useNavigate();
  const Tableref = useRef();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [vendorData, setVendorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [AddMaterialFormShow, setAddMaterialFormShow] = useState(false);

  // Edit states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [siteName, setSiteName] = useState(ProjectName);
  const [supplierName, setSupplierName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [billNo, setBillNo] = useState("");
  const [vehicalNo, setVehicleNo] = useState(""); // Changed from vehicalNo
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [existingImage, setExistingImage] = useState("");

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsType, setDetailsType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // transaction model
  const [
    addTransactionShowAddTransaction,
    setAddTransactionShowAddTransaction,
  ] = useState(false);
  const [addTransactionAmount, setAddTransactionAmount] = useState("");
  const [addTransactionPaymentMode, setAddTransactionPaymentMode] =
    useState("");
  const [addTransactionPaymentDate, setAddTransactionPaymentDate] =
    useState("");
  const [addTransactionRemark, setAddTransactionRemark] = useState("");
  const [addTransactionLoading, setAddTransactionLoading] = useState(false);
  const [addTransactionError, setAddTransactionError] = useState("");
  const [getTransactionData, setGetTransactionData] = useState([]);
  const [ShowTransaction, setShowTransaction] = useState(false);
  // Normalize time to HH:MM format
  const normalizeTime = (timeString) => {
    if (!timeString) return "";
    // Handle common formats: HH:MM, HH:MM:SS, HH:MM:SS.sss
    const match = timeString.match(/^(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?$/);
    return match ? match[1] : timeString; // Return HH:MM or original if invalid
  };

  async function VendorMaterialDetail() {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${BASE_URL}/materials/vendor/${VendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const sortedData = response.data.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setVendorData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = vendorData.filter(
      (item) =>
        item.materialName?.toLowerCase().includes(term) ||
        item.billNo?.toLowerCase().includes(term) ||
        item.siteName?.toLowerCase().includes(term) ||
        item.supplierName?.toLowerCase().includes(term) ||
        item.vendor?.vendorName?.toLowerCase().includes(term) ||
        item.addedByEngineer?.name?.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const openDetailsModal = (item, type) => {
    setSelectedDetails(item);
    setDetailsType(type);
    setShowDetailsModal(true);
  };

  const handleViewLog = (item) => {
    const id = item.id;
    const name = item.supplierName;
    navigate(`/MaterialLogDetails/${id}/${name}`);
  };

  // Reset form function
  const resetForm = () => {
    setSiteName(ProjectName);
    setSupplierName("");
    setMaterialName("");
    setUnit("");
    setQty("");
    setBillNo("");
    setVehicleNo("");
    setRemark("");
    setDate("");
    setTime("");
    setFile(null);
    setError("");
    setExistingImage("");
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setIsEditMode(true);
    setEditingItem(item);

    // Pre-fill form with existing data
    setSiteName(item.siteName || "");
    setSupplierName(item.supplierName || "");
    setMaterialName(item.materialName || "");
    setUnit(item.unit || "");
    setQty(item.qty || "");
    setBillNo(item.billNo || "");
    setVehicleNo(item.vehicleNo || ""); // Changed from vehicalNo
    setRemark(item.remark || "");
    setDate(item.date ? item.date.split("T")[0] : "");
    setTime(item.time ? normalizeTime(item.time) : "");
    setExistingImage(item.images || "");

    setAddMaterialFormShow(true);
  };

  // Handle add button click
  const handleAddClick = () => {
    setIsEditMode(false);
    setEditingItem(null);
    resetForm();
    setAddMaterialFormShow(true);
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`${BASE_URL}/materials/${deletingItem.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Material deleted successfully!");
      VendorMaterialDetail();
      setShowDeleteModal(false);
      setDeletingItem(null);
    } catch (error) {
      console.error("Error deleting material:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting material. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMaterialDetails = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!qty || isNaN(qty) || Number.parseInt(qty) <= 0) {
      setError("Please enter a valid positive quantity.");
      setLoading(false);
      return;
    }
    if (
      !siteName.trim() ||
      !supplierName.trim() ||
      !materialName.trim() ||
      !unit.trim() ||
      !billNo.trim() ||
      !vehicalNo.trim()
    ) {
      setError("All required fields must be filled.");
      setLoading(false);
      return;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Please enter a valid date in YYYY-MM-DD format.");
      setLoading(false);
      return;
    }
    const normalizedTime = normalizeTime(time);
    if (!normalizedTime || !/^\d{2}:\d{2}$/.test(normalizedTime)) {
      setError("Please enter a valid time in HH:MM format (e.g., 14:30).");
      setLoading(false);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("siteName", siteName.trim());
    formData.append("supplierName", supplierName.trim());
    formData.append("materialName", materialName.trim());
    formData.append("unit", unit.trim());
    formData.append("qty", parseInt(qty));
    formData.append("billNo", billNo.trim());
    formData.append("vehicleNo", vehicalNo.trim()); // Changed from vehicalNo
    formData.append("remark", remark.trim());
    formData.append("date", date);
    formData.append("time", normalizedTime);
    if (file) {
      formData.append("file", file);
    }

    try {
      let response;
      if (isEditMode && editingItem) {
        // Update existing material
        response = await axiosInstance.put(
          `${BASE_URL}/projects/${ProjectId}/${VendorId}/materials/${editingItem.id}/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Material updated successfully!");
      } else {
        // Add new material
        response = await axiosInstance.post(
          `${BASE_URL}/projects/${ProjectId}/${VendorId}/add-material`, // Fixed missing BASE_URL
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Material added successfully!");
      }

      resetForm();
      VendorMaterialDetail();
      setAddMaterialFormShow(false);
      setIsEditMode(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving material:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors
          ?.map((err) => err.defaultMessage || err)
          .join(", ") ||
        `Error ${
          isEditMode ? "updating" : "adding"
        } material. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setAddMaterialFormShow(false);
    setIsEditMode(false);
    setEditingItem(null);
    resetForm();
  };

  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      navigate("/login");
      return;
    }
    VendorMaterialDetail();
    getAllTransaction();
  }, [navigate, token]);

  if (loading && !AddMaterialFormShow && !showDeleteModal) {
    return (
      <div className="MaterialVendorDetails-container">
        <div className="MaterialVendorDetails-loading">
          <div className="MaterialVendorDetails-spinner"></div>
          <p>Loading vendor details...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    const printContent = Tableref.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
      <div style="padding: 5px; margin: 5px;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmitAddTransaction = async (e) => {
    e.preventDefault();
    setAddTransactionError("");
    setAddTransactionLoading(true);

    // Validation
    if (
      !addTransactionAmount ||
      isNaN(addTransactionAmount) ||
      Number.parseFloat(addTransactionAmount) <= 0
    ) {
      setAddTransactionError("Please enter a valid amount.");
      setAddTransactionLoading(false);
      return;
    }
    if (!addTransactionPaymentMode.trim()) {
      setAddTransactionError("Please select a payment mode.");
      setAddTransactionLoading(false);
      return;
    }
    if (!addTransactionPaymentDate) {
      setAddTransactionError("Please select a payment date.");
      setAddTransactionLoading(false);
      return;
    }

    try {
      // API call would go here
      const transactionData = {
        amount: Number.parseFloat(addTransactionAmount),
        paymentMode: addTransactionPaymentMode.trim(),
        paymentDate: addTransactionPaymentDate,
        remark: addTransactionRemark.trim(),
        projectId: ProjectId,
        vendorId: VendorId,
      };

      const response = await axiosInstance.post(
        `${BASE_URL}/addVendorPayment`,
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Transaction Data:", transactionData);
      // Reset form on success
      setAddTransactionAmount("");
      setAddTransactionPaymentMode("");
      setAddTransactionPaymentDate("");
      setAddTransactionRemark("");
      alert("Transaction added successfully!");
      setAddTransactionShowAddTransaction(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setAddTransactionError("Error adding transaction. Please try again.");
    } finally {
      setAddTransactionLoading(false);
    }
  };
  // useEffect(() => {
  // }, []);
  async function getAllTransaction() {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/vendor/${VendorId}/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setGetTransactionData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="MaterialVendorDetails-container">
      <div className="MaterialVendorDetails-header">
        <h1 className="MaterialVendorDetails-title">
          Material Vendor Details {ProjectName}
        </h1>

        <div>
          <button
            onClick={handleAddClick}
            className="MaterialVendorDetails-badge"
            style={{ cursor: "pointer", border: "none", outline: "none" }}
          >
            Add Material
          </button>
          <button
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              marginLeft: "3px",
            }}
            onClick={handlePrint}
            className="MaterialVendorDetails-badge"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="MaterialVendorDetails-controls">
        <div className="MaterialVendorDetails-search-container">
          <input
            type="text"
            placeholder="Search by material, bill no, site, supplier, vendor, or engineer..."
            value={searchTerm}
            onChange={handleSearch}
            className="MaterialVendorDetails-search-input"
          />
          <div className="MaterialVendorDetails-search-icon">🔍</div>
        </div>
        <div>
          <button
            className="MaterialVendorDetails-results-count"
            style={{ cursor: "pointer" }}
            onClick={() => setAddTransactionShowAddTransaction(true)}
          >
            Add Transaction
          </button>
          <button
            className="MaterialVendorDetails-results-count"
            style={{ cursor: "pointer", marginLeft: "5px" }}
            onClick={() => setShowTransaction(true)}
          >
            View Transaction{" "}
          </button>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="MaterialVendorDetails-table-container" ref={Tableref}>
          <div className="MaterialVendorDetails-printInfo">
            <span className="MaterialVendorDetails-projectName">
              Project: {ProjectName}
            </span>{" "}
            <span className="MaterialVendorDetails-printDate">
              Date: {new Date().toLocaleDateString()}
            </span>
          </div>
          <table className="MaterialVendorDetails-table">
            <thead className="MaterialVendorDetails-table-header">
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Material</th>
                <th>Quantity</th>
                <th>Site Name</th>
                <th>Supplier</th>
                <th>Vendor</th>
                <th>Engineer</th>
                <th>Image</th>
                <th>Remark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="MaterialVendorDetails-table-body">
              {filteredData.map((item, index) => (
                <tr key={index} className="MaterialVendorDetails-table-row">
                  <td className="MaterialVendorDetails-table-cell MaterialVendorDetails-bill-cell">
                    {item.billNo}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    {formatDate(item.date)}
                  </td>
                  <td className="MaterialVendorDetails-table-cell MaterialVendorDetails-material-cell">
                    {item.materialName}
                  </td>
                  <td className="MaterialVendorDetails-table-cell MaterialVendorDetails-quantity-cell">
                    {item.qty} {item.unit}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    {item.siteName}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    <button
                      className="MaterialVendorDetails-table-link-btn"
                      onClick={() => openDetailsModal(item, "supplier")}
                    >
                      {item.supplierName}
                    </button>
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    {item.vendor && (
                      <button
                        className="MaterialVendorDetails-table-link-btn"
                        onClick={() => openDetailsModal(item, "vendor")}
                      >
                        {item.vendor.vendorName}
                      </button>
                    )}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    {item.addedByEngineer && (
                      <button
                        className="MaterialVendorDetails-table-link-btn"
                        onClick={() => openDetailsModal(item, "engineer")}
                      >
                        {item.addedByEngineer.name}
                      </button>
                    )}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    {item.images && (
                      <button
                        className="MaterialVendorDetails-table-image-btn"
                        onClick={() => openImageModal(item.images)}
                      >
                        🖼️ View
                      </button>
                    )}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    {item?.remark}
                  </td>
                  <td className="MaterialVendorDetails-table-cell">
                    <div className="MaterialVendorDetails-action-buttons">
                      <button
                        className="MaterialVendorDetails-edit-btn"
                        onClick={() => handleEditClick(item)}
                        title="Edit Material"
                      >
                        <CiEdit />
                      </button>
                      <button
                        className="MaterialVendorDetails-delete-btn"
                        onClick={() => handleDeleteClick(item)}
                        title="Delete Material"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="MaterialVendorDetails-noData">
          <div className="MaterialVendorDetails-noData-icon">📋</div>
          <h3>No Data Found</h3>
          <p>
            {searchTerm
              ? `No material vendor details match your search "${searchTerm}".`
              : "No material vendor details are available for this vendor."}
          </p>
          {searchTerm && (
            <button
              className="MaterialVendorDetails-clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setFilteredData(vendorData);
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="MaterialVendorDetails-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="MaterialVendorDetails-image-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="MaterialVendorDetails-modal-close"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Material Full Screen"
              className="MaterialVendorDetails-modal-image"
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedDetails && (
        <div
          className="MaterialVendorDetails-modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="MaterialVendorDetails-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="MaterialVendorDetails-modal-header">
              <h3 className="MaterialVendorDetails-modal-title">
                {detailsType === "engineer" && "Engineer Details"}
                {detailsType === "vendor" && "Vendor Details"}
                {detailsType === "supplier" && "Supplier Details"}
              </h3>
              <button
                className="MaterialVendorDetails-modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="MaterialVendorDetails-modal-content">
              {detailsType === "engineer" &&
                selectedDetails.addedByEngineer && (
                  <div className="MaterialVendorDetails-modal-fields">
                    <div className="MaterialVendorDetails-modal-field">
                      <span className="MaterialVendorDetails-modal-label">
                        Name:
                      </span>
                      <span className="MaterialVendorDetails-modal-value">
                        {selectedDetails.addedByEngineer.name}
                      </span>
                    </div>
                    <div className="MaterialVendorDetails-modal-field">
                      <span className="MaterialVendorDetails-modal-label">
                        Email:
                      </span>
                      <span className="MaterialVendorDetails-modal-value">
                        {selectedDetails.addedByEngineer.email}
                      </span>
                    </div>
                    <div className="MaterialVendorDetails-modal-field">
                      <span className="MaterialVendorDetails-modal-label">
                        ID:
                      </span>
                      <span className="MaterialVendorDetails-modal-value">
                        {selectedDetails.addedByEngineer.id}
                      </span>
                    </div>
                  </div>
                )}
              {detailsType === "vendor" && selectedDetails.vendor && (
                <div className="MaterialVendorDetails-modal-fields">
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Vendor Name:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.vendor.vendorName}
                    </span>
                  </div>
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Phone:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.vendor.phoneNo}
                    </span>
                  </div>
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Project Name:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.vendor.projectName}
                    </span>
                  </div>
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Project Location:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.vendor.projectLocation}
                    </span>
                  </div>
                </div>
              )}
              {detailsType === "supplier" && (
                <div className="MaterialVendorDetails-modal-fields">
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Supplier Name:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.supplierName}
                    </span>
                  </div>
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Vehicle No:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.vehicleNo} {/* Changed from vehicalNo */}
                    </span>
                  </div>
                  <div className="MaterialVendorDetails-modal-field">
                    <span className="MaterialVendorDetails-modal-label">
                      Time:
                    </span>
                    <span className="MaterialVendorDetails-modal-value">
                      {selectedDetails.time}
                    </span>
                  </div>
                  {selectedDetails.remark && (
                    <div className="MaterialVendorDetails-modal-field">
                      <span className="MaterialVendorDetails-modal-label">
                        Remark:
                      </span>
                      <span className="MaterialVendorDetails-modal-value">
                        {selectedDetails.remark}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingItem && (
        <div
          className="MaterialVendorDetails-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="MaterialVendorDetails-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="MaterialVendorDetails-delete-modal-header">
              <h3 className="MaterialVendorDetails-delete-modal-title">
                Confirm Delete
              </h3>
              <button
                className="MaterialVendorDetails-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="MaterialVendorDetails-delete-modal-content">
              <div className="MaterialVendorDetails-delete-modal-icon">🗑️</div>
              <p className="MaterialVendorDetails-delete-modal-text">
                Are you sure you want to delete this material entry?
              </p>
              <div className="MaterialVendorDetails-delete-modal-details">
                <strong>Material:</strong> {deletingItem.materialName}
                <br />
                <strong>Bill No:</strong> {deletingItem.billNo}
                <br />
                <strong>Supplier:</strong> {deletingItem.supplierName}
              </div>
              <div className="MaterialVendorDetails-delete-modal-actions">
                <button
                  className="MaterialVendorDetails-delete-cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="MaterialVendorDetails-delete-confirm-btn"
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Material Form Modal */}
      {AddMaterialFormShow && (
        <div
          className="MaterialVendorDetails-modal-overlay"
          onClick={handleFormClose}
        >
          <div
            className="MaterialVendorDetails-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="MaterialVendorDetails-form-header">
              <h2 className="MaterialVendorDetails-form-title">
                {isEditMode ? "Edit Material" : "Add New Material"}
              </h2>
              <button
                className="MaterialVendorDetails-modal-close"
                onClick={handleFormClose}
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="MaterialVendorDetails-form-content">
              {error && (
                <div className="MaterialVendorDetails-form-error">{error}</div>
              )}
              <form
                onSubmit={handleSubmitMaterialDetails}
                className="MaterialVendorDetails-form"
              >
                <div className="MaterialVendorDetails-form-grid">
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Site Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter site name"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter supplier name"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Material Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter material name"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Unit *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter unit (e.g., kg, m³)"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Bill No *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bill number"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Vehicle No *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter vehicle number"
                      value={vehicalNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group">
                    <label className="MaterialVendorDetails-form-label">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(normalizeTime(e.target.value))}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                      step="60" // Prevent seconds in time picker
                    />
                  </div>
                  <div className="MaterialVendorDetails-form-group MaterialVendorDetails-form-group-full">
                    <label className="MaterialVendorDetails-form-label">
                      Image
                    </label>
                    {isEditMode && existingImage && (
                      <div className="MaterialVendorDetails-existing-image">
                        <p className="MaterialVendorDetails-existing-image-label">
                          Current Image:
                        </p>
                        <img
                          src={existingImage || "/placeholder.svg"}
                          alt="Current material"
                          className="MaterialVendorDetails-existing-image-preview"
                          onClick={() => openImageModal(existingImage)}
                        />
                        <p className="MaterialVendorDetails-existing-image-note">
                          Upload a new image to replace the current one
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="MaterialVendorDetails-form-input"
                      accept="image/*"
                      disabled={loading}
                    />
                    {file && (
                      <p className="MaterialVendorDetails-new-file-selected">
                        New file selected: {file.name}
                      </p>
                    )}
                  </div>
                  <div className="MaterialVendorDetails-form-group MaterialVendorDetails-form-group-full">
                    <label className="MaterialVendorDetails-form-label">
                      Remarks
                    </label>
                    <textarea
                      placeholder="Enter any remarks (optional)"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="MaterialVendorDetails-form-textarea"
                      rows="3"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="MaterialVendorDetails-form-actions">
                  <button
                    type="button"
                    className="MaterialVendorDetails-form-cancel-btn"
                    onClick={handleFormClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="MaterialVendorDetails-form-submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Adding..."
                      : isEditMode
                      ? "Update Material"
                      : "Add Material"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {addTransactionShowAddTransaction && (
        <div className="MaterialVendorDetails_addtransaction-overlay">
          <div className="MaterialVendorDetails_addtransaction-modal">
            <div className="MaterialVendorDetails_addtransaction-header">
              <h2 className="MaterialVendorDetails_addtransaction-title">
                Add New Transaction
              </h2>
              <button
                className="MaterialVendorDetails_addtransaction-close-btn"
                onClick={() => setAddTransactionShowAddTransaction(false)}
                disabled={addTransactionLoading}
              >
                ✕
              </button>
            </div>

            <div className="MaterialVendorDetails_addtransaction-content">
              {addTransactionError && (
                <div className="MaterialVendorDetails_addtransaction-error">
                  {addTransactionError}
                </div>
              )}

              <form
                className="MaterialVendorDetails_addtransaction-form"
                onSubmit={handleSubmitAddTransaction}
              >
                <div className="MaterialVendorDetails_addtransaction-form-grid">
                  <div className="MaterialVendorDetails_addtransaction-form-group">
                    <label className="MaterialVendorDetails_addtransaction-form-label">
                      Amount *
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={addTransactionAmount}
                      onChange={(e) => setAddTransactionAmount(e.target.value)}
                      className="MaterialVendorDetails_addtransaction-form-input"
                      min="0"
                      step="0.01"
                      required
                      disabled={addTransactionLoading}
                    />
                  </div>

                  <div className="MaterialVendorDetails_addtransaction-form-group">
                    <label className="MaterialVendorDetails_addtransaction-form-label">
                      Payment Mode *
                    </label>
                    <select
                      value={addTransactionPaymentMode}
                      onChange={(e) =>
                        setAddTransactionPaymentMode(e.target.value)
                      }
                      className="MaterialVendorDetails_addtransaction-form-select"
                      required
                      disabled={addTransactionLoading}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="UPI">UPI</option>
                      <option value="CASH">Cash</option>
                      <option value="CHECK">Cheque</option>
                      <option value="RTGS">RTGS</option>
                      <option value="NEFT">NEFT</option>
                    </select>
                  </div>

                  <div className="MaterialVendorDetails_addtransaction-form-group MaterialVendorDetails_addtransaction-form-group-full">
                    <label className="MaterialVendorDetails_addtransaction-form-label">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      value={addTransactionPaymentDate}
                      onChange={(e) =>
                        setAddTransactionPaymentDate(e.target.value)
                      }
                      className="MaterialVendorDetails_addtransaction-form-input"
                      required
                      disabled={addTransactionLoading}
                    />
                  </div>

                  <div className="MaterialVendorDetails_addtransaction-form-group MaterialVendorDetails_addtransaction-form-group-full">
                    <label className="MaterialVendorDetails_addtransaction-form-label">
                      Remark
                    </label>
                    <textarea
                      placeholder="Enter remark (optional)"
                      value={addTransactionRemark}
                      onChange={(e) => setAddTransactionRemark(e.target.value)}
                      className="MaterialVendorDetails_addtransaction-form-textarea"
                      rows="3"
                      disabled={addTransactionLoading}
                    />
                  </div>
                </div>

                <div className="MaterialVendorDetails_addtransaction-form-actions">
                  <button
                    type="button"
                    className="MaterialVendorDetails_addtransaction-cancel-btn"
                    onClick={() => setAddTransactionShowAddTransaction(false)}
                    disabled={addTransactionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="MaterialVendorDetails_addtransaction-submit-btn"
                    disabled={addTransactionLoading}
                  >
                    {addTransactionLoading ? "Adding..." : "Add Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {ShowTransaction && (
        <>
          <button onClick={() => setShowTransaction(false)}>X</button>

          {getTransactionData.length > 0 ? (
            <table border="1" cellPadding="5" cellSpacing="0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Remark</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Payment Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getTransactionData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.remark}</td>
                    <td>{item.amount}</td>
                    <td>{item.paymentDate}</td>
                    <td>{item.paymentMode}</td>
                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Transaction Found</p>
          )}
        </>
      )}
    </div>
  );
}

export default MaterialVendorDetails;
