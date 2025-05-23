import { useEffect, useState, useRef } from "react";
import "../stationary/stationary.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { NotebookPen } from "lucide-react";
import html2pdf from "html2pdf.js";

function Stationary() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [stationaryData, setStationaryData] = useState([]);
  const [searchStationary, setSearchStationary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStationaryForm, setShowAddStationaryForm] = useState(false);
  const [ProductAmount, setProductAmount] = useState("");
  const [ProductName, setProductName] = useState("");
  const [ProductDate, setProductDate] = useState("");
  const [showEditStationaryForm, setShowEditStationaryForm] = useState(false);
  const [editStationaryId, setEditStationaryId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductDate, setEditProductDate] = useState("");
  const [editProductAmount, setEditProductAmount] = useState("");
  const printTableRefs = useRef({});

  useEffect(() => {
    async function getStationary() {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`${BASE_URL}/stationery`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setStationaryData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to load stationary items");
        setIsLoading(false);
      }
    }
    getStationary();
  }, [token]);

  const filteredStationaryData = stationaryData.filter((item) => {
    return (
      item.remark.toLowerCase().includes(searchStationary.toLowerCase()) ||
      item.date.toLowerCase().includes(searchStationary.toLowerCase()) ||
      item.amount.toString().includes(searchStationary.toLowerCase())
    );
  });

  async function handleDeleteStationary(id) {
    const deleteConfirm = window.confirm("Are you sure you want to delete?");
    if (!deleteConfirm) return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/stationery/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Stationary Deleted Successfully");
        const updatedStationaryData = stationaryData.filter(
          (item) => item.id !== id
        );
        setStationaryData(updatedStationaryData);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete stationary item");
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (!price) return "₹0";
    return `₹${Number.parseFloat(price).toLocaleString("en-IN")}`;
  };

  async function handleSubmitStationaryItem(e) {
    e.preventDefault();
    const ProductBody = {
      remark: ProductName,
      date: ProductDate,
      amount: ProductAmount,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/stationery/create`,
        ProductBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Stationary Added Successfully");
        setShowAddStationaryForm(false);
        setProductName("");
        setProductDate("");
        setProductAmount("");
        const newStationaryData = [...stationaryData, response.data];
        setStationaryData(newStationaryData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditStationary(id) {
    setEditStationaryId(id);
    setShowEditStationaryForm(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/stationery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setEditProductName(response.data.remark);
      setEditProductDate(response.data.date);
      setEditProductAmount(response.data.amount);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleupdateStationaryItem(e) {
    e.preventDefault();
    const body = {
      remark: editProductName,
      date: editProductDate,
      amount: editProductAmount,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/stationery/update/${editStationaryId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Stationary Updated Successfully");
        setShowEditStationaryForm(false);
        setEditProductName("");
        setEditProductDate("");
        setEditProductAmount("");
        const updatedStationaryData = stationaryData.map((item) =>
          item.id === editStationaryId ? { ...item, ...body } : item
        );
        setStationaryData(updatedStationaryData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePrintStationary = (id) => {
    const element = printTableRefs.current[id];
    if (!element) {
      alert("Printable table not found.");
      return;
    }

    const opt = {
      margin: 0.3,
      filename: `Stationary_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };
  return (
    <>
      <div className="stationary-container">
        <div className="stationary-header">
          <div className="stationary-header-content">
            <h1 className="stationary-title">Stationary Management</h1>
            <p className="stationary-subtitle">
              Manage your office stationary inventory
            </p>
          </div>
        </div>

        <div className="stationary-controls">
          <div className="search-wrapper">
            <input
              type="search"
              value={searchStationary}
              onChange={(e) => setSearchStationary(e.target.value)}
              className="stationary-search-input"
              placeholder="Search stationary items..."
            />
            <span className="search-icon">🔍</span>
          </div>

          <button className="add-stationary-btn">
            <span className="btn-icon">+</span>
            <span onClick={() => setShowAddStationaryForm(true)}>
              Add Stationary
            </span>
          </button>
        </div>

        {isLoading ? (
          <div className="stationary-loading">
            <div className="loading-animation">
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
            </div>
            <p>Loading stationary items...</p>
          </div>
        ) : error ? (
          <div className="stationary-error">
            <div className="error-icon">!</div>
            <div className="error-content">
              <h4>Error Occurred</h4>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="stationary-card-container">
            {filteredStationaryData.length > 0 ? (
              filteredStationaryData.map((item, index) => (
                <div key={item.id || index}>
                  {/* 👇 Visible Card */}
                  <div className="stationary-card">
                    <div className="stationary-card-header">
                      <h3>
                        <NotebookPen />
                      </h3>
                      <div className="stationary-price">
                        {formatPrice(item.amount)}
                      </div>
                    </div>
                    <div className="stationary-card-body">
                      <div className="stationary-info">
                        <div className="info-item">
                          <span className="info-label">Date</span>
                          <span className="info-value">
                            {formatDate(item.date)}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Product Name</span>
                          <span className="info-value">{item.remark}</span>
                        </div>
                      </div>
                    </div>
                    <div className="stationary-card-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditStationary(item.id)}
                      >
                        <span>Edit</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteStationary(item.id)}
                      >
                        <span>Delete</span>
                      </button>
                      <button
                        className="action-btn print-btn"
                        onClick={() => handlePrintStationary(item.id)}
                      >
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {/* 👇 Hidden Table for PDF */}
                  <div style={{ display: "none" }}>
                    <table
                      ref={(el) => (printTableRefs.current[item.id] = el)}
                      style={{ borderCollapse: "collapse", width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            Date
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            Product Name
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {formatDate(item.date)}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {item.remark}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {formatPrice(item.amount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-found">
                <div className="no-data-icon">📋</div>
                <h3>No Stationary Items Found</h3>
                <p>
                  {searchStationary
                    ? "Try adjusting your search criteria"
                    : "Add some stationary items to get started"}
                </p>
                <button className="add-stationary-btn-small">
                  Add Stationary
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddStationaryForm && (
        <div className="add-stationary-form-overlay">
          <div className="add-stationary-form">
            <h2 className="Add_stationary_form_heading">Add Stationary Item</h2>

            <button
              className="add_statinary_close-form-btn"
              onClick={() => setShowAddStationaryForm(false)}
            >
              X
            </button>

            <form
              className="Addstationary-form"
              onSubmit={handleSubmitStationaryItem}
            >
              <input
                type="text"
                placeholder="Product Name"
                className="Addstationary-form_input"
                value={ProductName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
              <input
                type="date"
                placeholder="Date"
                className="Addstationary-form_input"
                value={ProductDate}
                onChange={(e) => setProductDate(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="Addstationary-form_input"
                value={ProductAmount}
                onChange={(e) => setProductAmount(e.target.value)}
                required
              />
              <button
                type="submit"
                className="Addstationary-form_submit_button"
              >
                Add Stationary
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditStationaryForm && (
        <div className="add-stationary-form-overlay">
          <div className="add-stationary-form">
            <h2 className="Add_stationary_form_heading">
              Edit Stationary Item
            </h2>

            <button
              className="add_statinary_close-form-btn"
              onClick={() => setShowEditStationaryForm(false)}
            >
              X
            </button>

            <form
              className="Addstationary-form"
              onSubmit={handleupdateStationaryItem}
            >
              <input
                type="text"
                placeholder="Product Name"
                className="Addstationary-form_input"
                value={editProductName}
                onChange={(e) => setEditProductName(e.target.value)}
              />
              <input
                type="date"
                placeholder="Date"
                className="Addstationary-form_input"
                value={editProductDate}
                onChange={(e) => setEditProductDate(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                className="Addstationary-form_input"
                value={editProductAmount}
                onChange={(e) => setEditProductAmount(e.target.value)}
              />
              <button
                type="submit"
                className="Addstationary-form_submit_button"
              >
                Update Stationary
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Stationary;
