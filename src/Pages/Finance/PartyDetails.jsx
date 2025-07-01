import React, { useState } from "react";
import "./partyDetails.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useParams, useNavigate } from "react-router-dom";

function PartyDetails() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionMode, setTransactionMode] = useState("");
  const [checkNo, setCheckNo] = useState("");
  const [onlineTransactionId, setOnlineTransactionId] = useState("");
  const [bankName, setBankName] = useState("");
  const [remark, setRemark] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setAmount("");
    setTransactionType("");
    setTransactionMode("");
    setCheckNo("");
    setOnlineTransactionId("");
    setBankName("");
    setRemark("");
    setDocument(null);
    setError("");
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("transactionType", transactionType);
    formData.append("transactionMode", transactionMode);
    formData.append("checkNo", transactionMode === "CHECK" ? checkNo : "");
    formData.append(
      "onlineTransactionId",
      transactionMode === "ONLINE" ? onlineTransactionId : ""
    );
    formData.append("bankName", transactionMode === "BANK" ? bankName : "");
    formData.append("remark", remark || "");
    if (document) {
      formData.append("document", document);
    }

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/party/${id}/created-transaction`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Transaction created successfully");
        resetForm();
        setShowTransactionForm(false);
      } else {
        setError("Failed to create transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 404) {
        setError(`Party with ID ${id} not found`);
      } else if (error.response?.status === 403) {
        setError("You do not have permission to create this transaction");
      } else if (error.response?.status === 400) {
        setError("Invalid input. Please check all required fields.");
      } else {
        setError("An error occurred while creating the transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PartyDetails-container">
      <div className="PartyDetails-header">
        <h1 className="PartyDetails-title">Transaction Management</h1>
      </div>

      <div className="PartyDetails-controls">
        <button
          className="PartyDetails-add-btn"
          onClick={() => {
            resetForm();
            setShowTransactionForm(true);
          }}
        >
          <svg
            className="PartyDetails-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Transaction
        </button>
        <button
          className="PartyDetails-add-btn"
          onClick={() => navigate(`/partyTransaction/${id}/${name}`)}
        >
          <svg
            className="PartyDetails-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          View Transaction
        </button>
      </div>

      {showTransactionForm && (
        <div className="PartyDetails-modal-overlay">
          <div className="PartyDetails-modal-container">
            <div className="PartyDetails-modal-header">
              <h2 className="PartyDetails-modal-title">Add New Transaction</h2>
              <button
                className="PartyDetails-modal-close-btn"
                onClick={() => {
                  setShowTransactionForm(false);
                  resetForm();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form
              className="PartyDetails-transaction-form"
              onSubmit={handleCreateTransaction}
            >
              {error && (
                <div className="PartyDetails-error-message">{error}</div>
              )}

              <div className="PartyDetails-form-group">
                <label className="PartyDetails-form-label">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="PartyDetails-form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="PartyDetails-form-group">
                <label className="PartyDetails-form-label">
                  Transaction Type
                </label>
                <select
                  className="PartyDetails-form-input"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select transaction type
                  </option>
                  <option value="RECEIPT"> Receive Payment</option>
                  <option value="PAYMENT"> Send Payment</option>
                </select>
              </div>

              <div className="PartyDetails-form-group">
                <label className="PartyDetails-form-label">
                  Transaction Mode
                </label>
                <select
                  className="PartyDetails-form-input"
                  value={transactionMode}
                  onChange={(e) => {
                    setTransactionMode(e.target.value);
                    setCheckNo("");
                    setOnlineTransactionId("");
                    setBankName("");
                  }}
                  required
                >
                  <option value="" disabled>
                    Select transaction mode
                  </option>
                  <option value="BANK">Bank</option>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
                  <option value="DD">Demand Draft</option>
                  <option value="ONLINE">Online</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {transactionMode === "CHECK" && (
                <div className="PartyDetails-form-group">
                  <label className="PartyDetails-form-label">
                    Check Number
                  </label>
                  <input
                    type="text"
                    className="PartyDetails-form-input"
                    value={checkNo}
                    onChange={(e) => setCheckNo(e.target.value)}
                    placeholder="Enter check number"
                    required
                  />
                </div>
              )}

              {transactionMode === "ONLINE" && (
                <div className="PartyDetails-form-group">
                  <label className="PartyDetails-form-label">
                    Online Transaction ID
                  </label>
                  <input
                    type="text"
                    className="PartyDetails-form-input"
                    value={onlineTransactionId}
                    onChange={(e) => setOnlineTransactionId(e.target.value)}
                    placeholder="Enter online transaction ID"
                    required
                  />
                </div>
              )}

              {transactionMode === "BANK" && (
                <div className="PartyDetails-form-group">
                  <label className="PartyDetails-form-label">Bank Name</label>
                  <input
                    type="text"
                    className="PartyDetails-form-input"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              )}

              <div className="PartyDetails-form-group">
                <label className="PartyDetails-form-label">Remark</label>
                <textarea
                  className="PartyDetails-form-textarea"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark"
                  rows="4"
                />
              </div>

              <div className="PartyDetails-form-group">
                <label className="PartyDetails-form-label">Document</label>
                <input
                  type="file"
                  className="PartyDetails-form-input"
                  onChange={(e) => setDocument(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div className="PartyDetails-form-actions">
                <button
                  type="button"
                  className="PartyDetails-btn-secondary"
                  onClick={() => {
                    setShowTransactionForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="PartyDetails-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartyDetails;
