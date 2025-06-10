import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";
import "../Plot/history.css";

function History() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const { id } = useParams();
  const [customerHistory, setCustomerHistory] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");

  useEffect(() => {
    async function getAllCancelPlotDetail() {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `${BASE_URL}/bookings/layout/${id}/cencelled`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setCustomerHistory(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load customer history. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    getAllCancelPlotDetail();
  }, [token, id]);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  if (loading) {
    return (
      <div className="history-history-container">
        <div className="history-loading-container">
          <div className="history-loading-spinner"></div>
          <p className="history-loading-text">Loading customer history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-history-container">
        <div className="history-error-container">
          <div className="history-error-icon">⚠️</div>
          <p className="history-error-text">{error}</p>
          <button
            className="history-retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filterCustomer = customerHistory.filter((item, idex) => {
    return item.customerName
      .toLowerCase()
      .includes(searchCustomer.toLocaleLowerCase());
  });

  return (
    <div className="history-history-container">
      <div className="history-history-header-section">
        <h1 className="history-history-title">Customer History</h1>
        <p className="history-history-subtitle">
          View cancelled booking details and customer information
        </p>
        {/* <div className="history-history-stats">
          <span className="history-stats-count">{customerHistory.length}</span>
          <span className="history-stats-label">Total Records</span>
        </div> */}
        <input
          type="search"
          className="history-search-input"
          placeholder="Search customer history..."
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
      </div>

      {customerHistory.length === 0 ? (
        <div className="history-empty-state">
          <div className="history-empty-icon">📋</div>
          <h3 className="history-empty-title">No History Found</h3>
          <p className="history-empty-description">
            There are no cancelled bookings to display at this time.
          </p>
        </div>
      ) : (
        <div className="history-history-list">
          {filterCustomer.map((customer, index) => (
            <div
              className={`history-history-card ${
                openIndex === index ? "history-expanded" : ""
              }`}
              key={customer.id || index}
            >
              <div
                className="history-history-card-header"
                onClick={() => toggleIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleIndex(index);
                  }
                }}
              >
                <div className="history-customer-info">
                  <div className="history-customer-avatar">
                    {customer.customerName?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div className="history-customer-details">
                    <h3 className="history-customer-name">
                      {customer.customerName || "Unknown Customer"}
                    </h3>
                  </div>
                </div>
                <div className="history-expand-controls">
                  <span className="history-expand-text">
                    {openIndex === index ? "Hide Details" : "View Details"}
                  </span>
                  <div
                    className={`history-expand-icon ${
                      openIndex === index ? "history-rotated" : ""
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className={`history-history-card-content ${
                  openIndex === index ? "history-open" : ""
                }`}
              >
                <div className="history-details-grid">
                  {Object.entries(customer).map(([key, value]) =>
                    key !== "id" && key !== "customerName" ? (
                      <div key={key} className="history-detail-item">
                        <div className="history-detail-label">
                          {formatKey(key)}
                        </div>
                        <div className="history-detail-value">
                          {value || "Not specified"}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
