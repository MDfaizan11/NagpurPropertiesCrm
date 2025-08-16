import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";
import "./history.css";

function History() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const { id } = useParams();
  const [customerHistory, setCustomerHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("customer-details-print");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const getPersonalDetails = (customer) => {
    return {
      name: customer.customerName,
      age: customer.age || "N/A",
      occupation: customer.occupation || "N/A",
      dateOfBirth: customer.dob || "N/A",
      anniversary: customer.anniversary || "N/A",
    };
  };

  const getContactDetails = (customer) => {
    return {
      address: customer.address || "N/A",
      city: customer.city || "N/A",
      state: customer.state || "N/A",
      pincode: customer.pincode || "N/A",
      contact: customer.contactNo || customer.phno || "N/A",
      email: customer.email || "N/A",
    };
  };

  const getNomineeDetails = (customer) => {
    return {
      nomineeName: customer.nominee || "N/A",
      nomineeAge: customer.nomineeAge || "N/A",
      relation: customer.relation || "N/A",
    };
  };

  const getPlotDetails = (customer) => {
    return {
      projectName: customer.projectName || "N/A",
      plotNo: customer.plotno || "N/A",
      khNo: customer.khNo || "N/A",
      mouza: customer.mouza || "N/A",
      size: customer.size || "N/A",
      sqft: customer.sqft || "N/A",
      sqmtr: customer.sqmtr || "N/A",
      rate: customer.rate || "N/A",
      totalAmount: customer.totalAmount || "N/A",
      dpAmount: customer.dpAmount || "N/A",
      dpDate: customer.dpDate || "N/A",
      tokenDate: customer.tokenDate || "N/A",
      installmentAmount: customer.installmentAmount || "N/A",
      installmentDate: customer.installmentDate || "N/A",
      noOfInstallment: customer.noOfInstallment || "N/A",
      bookingStatus: customer.bookingStatus || "N/A",
      anySpecialCondition: customer.anySpecialConduction || "N/A",
    };
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

  const filterCustomer = customerHistory.filter((item) => {
    return item.customerName
      .toLowerCase()
      .includes(searchCustomer.toLowerCase());
  });

  return (
    <div className="history-history-container">
      <div className="history-history-header-section">
        <h1 className="history-history-title">Customer History</h1>

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
        <div className="history-table-container">
          <table className="history-table">
            <thead className="history-table-header">
              <tr>
                <th className="history-table-th">Customer Name</th>
                <th className="history-table-th">Email</th>
                <th className="history-table-th">Phone</th>
                <th className="history-table-th">Plot Number</th>
                <th className="history-table-th">Status</th>
                <th className="history-table-th">Action</th>
              </tr>
            </thead>
            <tbody className="history-table-body">
              {filterCustomer.map((customer, index) => (
                <tr key={customer.id || index} className="history-table-row">
                  <td className="history-table-td">
                    <div className="history-customer-cell">
                      <div className="history-customer-avatar">
                        {customer.customerName?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                      <span className="history-customer-name">
                        {customer.customerName || "Unknown Customer"}
                      </span>
                    </div>
                  </td>
                  <td className="history-table-td">
                    {customer.email || "Not provided"}
                  </td>
                  <td className="history-table-td">
                    {customer.contactNo || "Not provided"}
                  </td>
                  <td className="history-table-td">
                    {customer.plotno || "Not specified"}
                  </td>
                  <td className="history-table-td">
                    {customer.bookingStatus || "Not specified"}
                  </td>
                  <td className="history-table-td">
                    <button
                      className="history-view-button"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedCustomer && (
        <div className="history-modal-overlay" onClick={closeModal}>
          <div
            className="history-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="history-modal-header">
              <h2 className="history-modal-title">Customer Details</h2>
              <button className="history-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div id="customer-details-print" className="history-modal-body">
              <div className="history-customer-title">
                {selectedCustomer.customerName} - Customer Details
              </div>

              <div className="history-details-grid">
                {/* Personal Information */}
                <div className="history-detail-section">
                  <h3 className="history-section-title">
                    Personal Information
                  </h3>
                  <div className="history-section-content">
                    {Object.entries(getPersonalDetails(selectedCustomer)).map(
                      ([key, value]) => (
                        <div key={key} className="history-field-group">
                          <div className="history-field-label">
                            {formatKey(key).toUpperCase()}:
                          </div>
                          <div className="history-field-value">{value}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="history-detail-section">
                  <h3 className="history-section-title">Contact Information</h3>
                  <div className="history-section-content">
                    {Object.entries(getContactDetails(selectedCustomer)).map(
                      ([key, value]) => (
                        <div key={key} className="history-field-group">
                          <div className="history-field-label">
                            {formatKey(key).toUpperCase()}:
                          </div>
                          <div className="history-field-value">
                            {value || "N/A"}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Nominee Details */}
                <div className="history-detail-section">
                  <h3 className="history-section-title">Nominee Details</h3>
                  <div className="history-section-content">
                    {Object.entries(getNomineeDetails(selectedCustomer)).map(
                      ([key, value]) => (
                        <div key={key} className="history-field-group">
                          <div className="history-field-label">
                            {formatKey(key).toUpperCase()}:
                          </div>
                          <div className="history-field-value">{value}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Plot Details */}
                <div className="history-detail-section">
                  <h3 className="history-section-title">Plot Details</h3>
                  <div className="history-section-content">
                    {Object.entries(getPlotDetails(selectedCustomer)).map(
                      ([key, value]) => (
                        <div key={key} className="history-field-group">
                          <div className="history-field-label">
                            {formatKey(key).toUpperCase()}:
                          </div>
                          <div className="history-field-value">
                            {value || "N/A"}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="history-modal-actions">
              {/* <button className="history-action-button history-edit-button">
                Edit Customer
              </button>
              <button
                className="history-action-button history-print-button"
                onClick={handlePrint}
              >
                Print Details
              </button> */}
              <button
                className="history-action-button history-close-button"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
