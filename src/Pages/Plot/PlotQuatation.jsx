import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "../Plot/plotquatation.css";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
function PlotQuatation() {
  const { plotId } = useParams();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const printRef = useRef();

  const [quotationData, setQuotationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [searchQuatation, setsearchQuatation] = useState("");

  useEffect(() => {
    async function getAllPlotQuotations() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${BASE_URL}/quotation/by-layout/${plotId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("API response:", response.data);
        setQuotationData(response.data);
        setError(null);
        setSelectedQuotation(null);
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
        setError("Failed to load quotations. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getAllPlotQuotations();
  }, [plotId, token]);

  const handleViewDetails = (quotation) => {
    console.log("Opening modal for quotation:", quotation);
    setSelectedQuotation(quotation);
  };

  const closeDetailsModal = () => {
    console.log("Closing modal, resetting selectedQuotation");
    setSelectedQuotation(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filterPlotQuatation = quotationData.filter((item) => {
    return (
      item.coustomerName
        .toLowerCase()
        .includes(searchQuatation.toLowerCase()) ||
      item.plotno.toLowerCase().includes(searchQuatation.toLowerCase())
    );
  });

  const handlePrint = () => {
    const element = printRef.current;

    const opt = {
      margin: 0.5,
      filename: `quotation-${
        selectedQuotation.coustomerName || "ss-group"
      }.pdf`,

      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };
  return (
    <>
      <div className="PlotQuatation-container">
        <div className="PlotQuatation-header">
          <div className="PlotQuatation-header-content">
            <h1 className="PlotQuatation-title">Plot Quotations</h1>
            <p className="PlotQuatation-subtitle">
              View and manage all quotations for this plot
            </p>
          </div>
        </div>

        {loading ? (
          <div className="PlotQuatation-loading">
            <div className="PlotQuatation-loading-spinner"></div>
            <p>Loading quotations...</p>
          </div>
        ) : error ? (
          <div className="PlotQuatation-error">
            <div className="PlotQuatation-error-icon">!</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button
              className="PlotQuatation-retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : quotationData.length === 0 ? (
          <div className="PlotQuatation-empty">
            <div className="PlotQuatation-empty-illustration"></div>
            <h3>No Quotations Found</h3>
            <p>There are no quotations available for this plot.</p>
          </div>
        ) : (
          <div className="PlotQuatation-content">
            <div className="PlotQuatation-count">
              <span>{quotationData.length}</span> Quotations Found
            </div>
            <div className="PlotQuatation-search-section">
              <div className="PlotQuatation-search-container">
                <input
                  type="search"
                  value={searchQuatation}
                  onChange={(e) => setsearchQuatation(e.target.value)}
                  placeholder="Search quotations by customer name or plot number..."
                  className="PlotQuatation-search-input"
                />
                <span className="PlotQuatation-search-icon">🔍</span>
              </div>
            </div>
            <div className="PlotQuatation-grid">
              {filterPlotQuatation.map((item, index) => (
                <div className="PlotQuatation-card" key={index}>
                  <div className="PlotQuatation-card-header">
                    <h3 className="PlotQuatation-customer-name">
                      <span className="PlotQuatation-info-label">
                        Coustomer Name
                      </span>
                      <br />
                      {item.coustomerName || "Unnamed Customer"}
                    </h3>
                    <span className="PlotQuatation-date">
                      <span className="PlotQuatation-info-label">
                        Booking Date
                      </span>
                      <br />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <div className="PlotQuatation-card-body">
                    <div className="PlotQuatation-info-row">
                      <div className="PlotQuatation-info-item">
                        <span className="PlotQuatation-info-label">
                          Plot No
                        </span>
                        <span className="PlotQuatation-info-value">
                          {item.plotno || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-info-item">
                        <span className="PlotQuatation-info-label">Area</span>
                        <span className="PlotQuatation-info-value">
                          {item.area || "N/A"} sq.ft
                        </span>
                      </div>
                    </div>
                    <div className="PlotQuatation-booking-amount">
                      <span className="PlotQuatation-amount-label">
                        Booking Amount
                      </span>
                      <span className="PlotQuatation-amount-value">
                        {formatCurrency(item.bookingAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="PlotQuatation-card-footer">
                    <button
                      className="PlotQuatation-view-details-btn"
                      onClick={() => handleViewDetails(item)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedQuotation && (
          <div className="PlotQuatation-modal-overlay">
            <div className="PlotQuatation-modal">
              <div className="PlotQuatation-modal-header">
                <h2> Quotation Details</h2>
                <button
                  className="PlotQuatation-close-modal"
                  onClick={closeDetailsModal}
                >
                  ×
                </button>
              </div>
              <div className="PlotQuatation-modal-content">
                <div className="PlotQuatation_print_section" ref={printRef}>
                  <div className="PlotQuatation-modal-section">
                    <h2 style={{ textAlign: "center" }}>
                      SS Group - Quotation Details
                    </h2>

                    <div className="PlotQuatation-detail-item">
                      <span className="PlotQuatation-detail-label">
                        Date:{" "}
                        {new Date().toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <br />

                    <h3>Customer Information</h3>
                    <div className="PlotQuatation-detail-grid">
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">Name</span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.coustomerName || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Contact
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.contactNumber || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Email
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="PlotQuatation-modal-section">
                    <h3>Plot Information</h3>
                    <div className="PlotQuatation-detail-grid">
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Project Name
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.projectName || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          mouza
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.mouza || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Plot No
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.plotno || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">Area</span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.area || "N/A"} sq.ft
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Location
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.location || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">Rate</span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(selectedQuotation.rate || "N/A")}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Total Cost
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(selectedQuotation.totalCost || "N/A")}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Booking Amount
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(
                            selectedQuotation.bookingAmount || "N/A"
                          )}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Balance Amount
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(
                            selectedQuotation.balanceAmount || "N/A"
                          )}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Remaining Amount
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(
                            selectedQuotation.remainingAmount || "N/A"
                          )}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          No Of EMI
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.noOfEMI || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Monthly EMI
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(
                            selectedQuotation.monthlyEMI || "N/A"
                          )}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Bank Finance
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.bankFinance || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Stamp Duty
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(selectedQuotation.stampDuty || "N/A")}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Registration Fess
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {formatCurrency(
                            selectedQuotation.registrationFess || "N/A"
                          )}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Any Special Conduction
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.anyspecialConduction || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          B.P.name
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.bPname || "N/A"}
                        </span>
                      </div>
                      <div className="PlotQuatation-detail-item">
                        <span className="PlotQuatation-detail-label">
                          Director sign
                        </span>
                        <span className="PlotQuatation-detail-value">
                          {selectedQuotation.directorsign || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="PlotQuatation-modal-section">
                  <h3>Financial Details</h3>
                  <div className="PlotQuatation-detail-grid">
                    <div className="PlotQuatation-detail-item">
                      <span className="PlotQuatation-detail-label">
                        Booking Amount
                      </span>
                      <span className="PlotQuatation-detail-value">
                        {formatCurrency(selectedQuotation.bookingAmount)}
                      </span>
                    </div>
                    <div className="PlotQuatation-detail-item">
                      <span className="PlotQuatation-detail-label">
                        Total Amount
                      </span>
                      <span className="PlotQuatation-detail-value">
                        {formatCurrency(selectedQuotation.totalAmount)}
                      </span>
                    </div>
                    <div className="PlotQuatation-detail-item">
                      <span className="PlotQuatation-detail-label">
                        Total Amount
                      </span>
                      <span className="PlotQuatation-detail-value">
                        {formatCurrency(selectedQuotation.totalAmount)}
                      </span>
                    </div>
                    <div className="PlotQuatation-detail-item">
                      <span className="PlotQuatation-detail-label">Date</span>
                      <span className="PlotQuatation-detail-value">
                        {formatDate(selectedQuotation.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="PlotQuatation-modal-section">
                  <h3>Additional Information</h3>
                  <div className="PlotQuatation-detail-grid">
                    <div className="PlotQuatation-detail-item PlotQuatation-full-width">
                      <span className="PlotQuatation-detail-label">Notes</span>
                      <span className="PlotQuatation-detail-value">
                        {selectedQuotation.notes || "No additional notes"}
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="PlotQuatation-modal-footer">
                <button
                  className="PlotQuatation-modal-btn PlotQuatation-print-btn"
                  onClick={handlePrint}
                >
                  Print Quotation
                </button>
                <button className="PlotQuatation-modal-btn PlotQuatation-edit-btn">
                  Edit Quotation
                </button>
                <button
                  className="PlotQuatation-modal-btn PlotQuatation-close-btn"
                  onClick={closeDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PlotQuatation;
