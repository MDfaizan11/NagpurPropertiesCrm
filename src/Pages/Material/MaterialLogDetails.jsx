"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./MaterialLogDetails.css";

function MaterialLogDetails() {
  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [getLogData, setGetLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    unit: "",
    qty: "",
    billNo: "",
    vehicalNo: "",
    date: "",
    time: "",
    remark: "",
  });
  const [file, setFile] = useState(null);

  async function getAllLog() {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/${id}/Addstock-in-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setGetLogData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllLog();
  }, []);

  useEffect(() => {
    const filtered = getLogData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, getLogData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append(
      "data",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (file) {
      form.append("file", file);
    }

    try {
      await axiosInstance.post(`${BASE_URL}/${id}/add-stock`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Material added successfully!");
      setFormData({
        unit: "",
        qty: "",
        billNo: "",
        vehicalNo: "",
        date: "",
        time: "",
        remark: "",
      });
      setFile(null);
      setShowForm(false);
      getAllLog();
    } catch (error) {
      console.error(error);
      alert("Failed to add material. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      unit: "",
      qty: "",
      billNo: "",
      vehicalNo: "",
      date: "",
      time: "",
      remark: "",
    });
    setFile(null);
  };

  return (
    <div className="MaterialLogDetails-container">
      <div className="MaterialLogDetails-header">
        <h1 className="MaterialLogDetails-title">
          <span className="MaterialLogDetails-icon">📋</span>
          Material Log Details
        </h1>
        <button
          className="MaterialLogDetails-addButton"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <span className="MaterialLogDetails-buttonIcon">+</span>
          Add Material
        </button>
      </div>

      <div className="MaterialLogDetails-controls">
        <div className="MaterialLogDetails-searchContainer">
          <div className="MaterialLogDetails-searchWrapper">
            <span className="MaterialLogDetails-searchIcon">🔍</span>
            <input
              type="text"
              className="MaterialLogDetails-searchInput"
              placeholder="Search by bill no, vehicle no, date, or any field..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="MaterialLogDetails-clearButton"
                onClick={clearSearch}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="MaterialLogDetails-actionButtons">
          <button
            className="MaterialLogDetails-printButton"
            onClick={handlePrint}
            type="button"
          >
            <span className="MaterialLogDetails-buttonIcon">🖨️</span>
            Print
          </button>
          <div className="MaterialLogDetails-stats">
            <span className="MaterialLogDetails-count">
              {filteredData.length} of {getLogData.length} records
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="MaterialLogDetails-loading">
          <div className="MaterialLogDetails-spinner"></div>
          <span>Loading...</span>
        </div>
      )}

      <div className="MaterialLogDetails-tableContainer">
        <table className="MaterialLogDetails-table">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Bill No</th>
              <th>Date</th>
              <th>Time</th>
              <th>Vehicle No</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Remark</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id} className="MaterialLogDetails-row">
                  <td className="MaterialLogDetails-srNo">{index + 1}</td>
                  <td className="MaterialLogDetails-billNo">{item.billNo}</td>
                  <td className="MaterialLogDetails-date">{item.date}</td>
                  <td className="MaterialLogDetails-time">{item.time}</td>
                  <td className="MaterialLogDetails-vehicleNo">
                    {item.vehicalNo}
                  </td>
                  <td className="MaterialLogDetails-qty">{item.qty}</td>
                  <td className="MaterialLogDetails-unit">{item.unit}</td>
                  <td className="MaterialLogDetails-remark">{item.remark}</td>
                  <td className="MaterialLogDetails-imageCell">
                    <button
                      className="MaterialLogDetails-viewButton"
                      onClick={() => setSelectedImage(item.image)}
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="MaterialLogDetails-noData">
                  {searchTerm ? "No matching records found" : "No Log Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="MaterialLogDetails-overlay" onClick={closeForm}>
          <div
            className="MaterialLogDetails-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="MaterialLogDetails-popupHeader">
              <h3>Add New Material</h3>
              <button
                className="MaterialLogDetails-closeButton"
                onClick={closeForm}
                type="button"
              >
                ✕
              </button>
            </div>

            <form
              className="MaterialLogDetails-form"
              onSubmit={handleFormSubmit}
            >
              <div className="MaterialLogDetails-formGrid">
                <div className="MaterialLogDetails-formGroup">
                  <label className="MaterialLogDetails-label">Unit</label>
                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleFormChange}
                    className="MaterialLogDetails-input"
                    placeholder="Enter unit"
                    required
                  />
                </div>

                <div className="MaterialLogDetails-formGroup">
                  <label className="MaterialLogDetails-label">Quantity</label>
                  <input
                    name="qty"
                    type="number"
                    value={formData.qty}
                    onChange={handleFormChange}
                    className="MaterialLogDetails-input"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="MaterialLogDetails-formGroup">
                  <label className="MaterialLogDetails-label">Bill No</label>
                  <input
                    name="billNo"
                    value={formData.billNo}
                    onChange={handleFormChange}
                    className="MaterialLogDetails-input"
                    placeholder="Enter bill number"
                    required
                  />
                </div>

                <div className="MaterialLogDetails-formGroup">
                  <label className="MaterialLogDetails-label">Vehicle No</label>
                  <input
                    name="vehicalNo"
                    value={formData.vehicalNo}
                    onChange={handleFormChange}
                    className="MaterialLogDetails-input"
                    placeholder="Enter vehicle number"
                    required
                  />
                </div>

                <div className="MaterialLogDetails-formGroup">
                  <label className="MaterialLogDetails-label">Date</label>
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="MaterialLogDetails-input"
                    required
                  />
                </div>

                <div className="MaterialLogDetails-formGroup">
                  <label className="MaterialLogDetails-label">Time</label>
                  <input
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    className="MaterialLogDetails-input"
                    required
                  />
                </div>
              </div>

              <div className="MaterialLogDetails-formGroup MaterialLogDetails-fullWidth">
                <label className="MaterialLogDetails-label">Remark</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleFormChange}
                  className="MaterialLogDetails-textarea"
                  placeholder="Enter remarks"
                  rows="3"
                  required
                />
              </div>

              <div className="MaterialLogDetails-formGroup MaterialLogDetails-fullWidth">
                <label className="MaterialLogDetails-label">Upload Image</label>
                <div className="MaterialLogDetails-fileUpload">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="MaterialLogDetails-fileInput"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="MaterialLogDetails-fileLabel"
                  >
                    📁 Choose File
                  </label>
                  {file && (
                    <span className="MaterialLogDetails-fileName">
                      {file.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="MaterialLogDetails-formActions">
                <button
                  type="button"
                  className="MaterialLogDetails-cancelButton"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="MaterialLogDetails-submitButton"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="MaterialLogDetails-modal"
          onClick={() => setSelectedImage(null)}
        >
          <div className="MaterialLogDetails-modalContent">
            <button
              className="MaterialLogDetails-modalClose"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Full View"
              className="MaterialLogDetails-fullImage"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialLogDetails;
