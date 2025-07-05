import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./MaterialVendorDetails.css";
import { useRef } from "react";

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

  // Form states
  const [siteName, setSiteName] = useState(ProjectName);
  const [supplierName, setSupplierName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [billNo, setBillNo] = useState("");
  const [vehicalNo, setVehicalNo] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [file, setFile] = useState(null);

  const [error, setError] = useState("");

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsType, setDetailsType] = useState("");

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

      let sortedData = response.data.sort((a, b) => {
        // Ensure date is comparable — adjust if your date format is different
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

  const handleSubmitMaterialDetails = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!qty || isNaN(qty) || parseInt(qty) <= 0) {
      alert("Please enter a valid quantity.");
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

    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      setError("Please enter a valid time in HH:MM format.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("siteName", siteName.trim());
    formData.append("supplierName", supplierName.trim());
    formData.append("materialName", materialName.trim());
    formData.append("unit", unit.trim());
    formData.append("qty", qty.toString()); // Add qty as string
    formData.append("billNo", billNo.trim());
    formData.append("vehicalNo", vehicalNo.trim());
    formData.append("remark", remark.trim());
    formData.append("date", date);
    formData.append("time", time);

    if (file) {
      formData.append("file", file);
    }

    console.log(formData);
    try {
      const response = await axiosInstance.post(
        `/projects/${ProjectId}/${VendorId}/add-material`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form on success
      setSiteName("");
      setSupplierName("");
      setMaterialName("");
      setUnit("");
      setQty("");
      setBillNo("");
      setVehicalNo("");
      setRemark("");
      setDate("");
      setTime("");
      setFile(null);
      alert("Material added successfully!");
      VendorMaterialDetail();
      setAddMaterialFormShow(false); // Close modal on success
    } catch (error) {
      console.error("Error adding material:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error adding material. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    VendorMaterialDetail();
  }, []);

  if (loading) {
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
    window.location.reload(); // restore React app
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // month is 0-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="MaterialVendorDetails-container">
      <div className="MaterialVendorDetails-header">
        <h1 className="MaterialVendorDetails-title">
          Material Vendor Details {ProjectName}
        </h1>
        <div
          className="MaterialVendorDetails-badge"
          style={{ cursor: "pointer" }}
          onClick={() => setAddMaterialFormShow(true)}
        >
          Add Material
        </div>
      </div>

      {/* Search Controls */}
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
        <div
          className="MaterialVendorDetails-results-count"
          style={{ cursor: "pointer" }}
          onClick={handlePrint}
        >
          🖨️ Print
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
                {/* <th>Actions</th> */}
                <th> Remark</th>
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
                  {/* <td className="MaterialVendorDetails-table-cell">
                    <button
                      className="MaterialVendorDetails-table-action-btn"
                      // onClick={() => handleViewLog(item)}
                    >
                      📋 Log
                    </button>
                  </td> */}
                  <td>{item?.remark}</td>
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
                      {selectedDetails.vehicalNo}
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

      {/* Add Material Form Modal */}
      {AddMaterialFormShow && (
        <div
          className="MaterialVendorDetails-modal-overlay"
          onClick={() => setAddMaterialFormShow(false)}
        >
          <div
            className="MaterialVendorDetails-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="MaterialVendorDetails-form-header">
              <h2 className="MaterialVendorDetails-form-title">
                Add New Material
              </h2>
              <button
                className="MaterialVendorDetails-modal-close"
                onClick={() => setAddMaterialFormShow(false)}
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
                      Vehical No *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter vehical number"
                      value={vehicalNo}
                      onChange={(e) => setVehicalNo(e.target.value)}
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
                      onChange={(e) => setTime(e.target.value)}
                      className="MaterialVendorDetails-form-input"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="MaterialVendorDetails-form-group MaterialVendorDetails-form-group-full">
                    <label className="MaterialVendorDetails-form-label">
                      Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="MaterialVendorDetails-form-input"
                      accept="image/*"
                      disabled={loading}
                    />
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
                    onClick={() => setAddMaterialFormShow(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="MaterialVendorDetails-form-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Material"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialVendorDetails;
