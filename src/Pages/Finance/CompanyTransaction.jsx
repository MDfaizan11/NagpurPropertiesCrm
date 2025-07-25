import React, { useState, useEffect, useRef } from "react";
import "./companyTransaction.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";
import * as html2pdf from "html2pdf.js";

function CompanyTransaction() {
  const { id, name } = useParams();
  const printRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tableRef = useRef(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/company/${id}/transactions`,
        {
          params: {
            startingDate,
            endingDate,
          },
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("NagpurProperties"))?.token
            }`,
          },
        }
      );
      console.log("Transaction API Response:", response.data);
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response?.status === 404) {
        setError(`Transactions for company ID ${id} not found`);
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view transactions");
      } else {
        setError("An error occurred while fetching transactions");
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [id, startingDate, endingDate]);

  const handleSearchTransactions = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
    <html>
      <head>
        <title>Transactions for ${name || "Company"}</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          h2 { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleDownloadPDF = () => {
    if (!tableRef.current) return;
    const tempContainer = document.createElement("div");
    tempContainer.className = "company-transaction-pdf-container";
    const pdfHeader = document.createElement("h2");
    pdfHeader.className = "company-transaction-print-header";
    pdfHeader.textContent = `Transactions for ${name || "Company"}`;
    tempContainer.appendChild(pdfHeader);
    const tableClone = tableRef.current.cloneNode(true);
    tempContainer.appendChild(tableClone);
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `${name || "company"}_transactions_${today}.pdf`;
    const opt = {
      margin: [15, 10, 10, 10],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(tempContainer).save();
  };

  return (
    <div className="company-transaction-container">
      {/* Header */}
      <div className="company-transaction-header">
        <h1 className="company-transaction-title">
          Transactions: {name || "Company"}
        </h1>
      </div>

      {/* Transactions Section */}
      <div className="company-transaction-section">
        <div className="company-transaction-header-section">
          <h3 className="company-transaction-title-section">
            Company Transactions ({transactions.length})
          </h3>
        </div>
        <div className="company-transaction-controls">
          <form
            onSubmit={handleSearchTransactions}
            className="company-transaction-search-form"
          >
            <div className="company-transaction-form-group">
              <label className="company-transaction-form-label">
                Start Date
              </label>
              <input
                type="date"
                className="company-transaction-form-input"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                required
                aria-label="Start date for transactions"
              />
            </div>
            <div className="company-transaction-form-group">
              <label className="company-transaction-form-label">End Date</label>
              <input
                type="date"
                className="company-transaction-form-input"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                required
                aria-label="End date for transactions"
              />
            </div>
            <div className="company-transaction-form-group">
              <label className="company-transaction-form-label">Search</label>
              <button
                type="submit"
                className="company-transaction-btn-primary"
                disabled={loading}
                aria-label="Search transactions"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
          <div className="company-transaction-action-buttons">
            <button
              className="company-transaction-btn-primary company-transaction-action-btn-print"
              onClick={handlePrint}
              disabled={loading || transactions.length === 0}
              aria-label="Print transactions"
            >
              <svg
                className="company-transaction-btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <path d="M6 14h12v8H6z" />
              </svg>
              Print
            </button>
            <button
              className="company-transaction-btn-primary company-transaction-action-btn-pdf"
              onClick={handleDownloadPDF}
              disabled={loading || transactions.length === 0}
              aria-label="Download transactions as PDF"
            >
              <svg
                className="company-transaction-btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        {/* {error && (
          <div className="company-transaction-error-message">{error}</div>
        )} */}

        {loading ? (
          <div className="company-transaction-loading-container">
            <div className="company-transaction-loading-spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="company-transaction-empty-state">
            <div className="company-transaction-empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <h3>No Transactions Found</h3>
            <p>No transactions available for the selected date range.</p>
            {/* {error && (
              <p className="company-transaction-error-message">{error}</p>
            )} */}
          </div>
        ) : (
          <div className="company-transaction-print-area" ref={printRef}>
            <h2 className="company-transaction-print-header">
              Transactions for {name || "Company"}
            </h2>
            <div className="company-transaction-table-wrapper">
              <div
                className="company-transaction-table-container"
                ref={tableRef}
              >
                <table
                  className="company-transaction-table"
                  aria-label="Company transactions table"
                >
                  <thead>
                    <tr>
                      <th scope="col">Party Name</th>
                      <th scope="col">Total Payment Send Amount</th>
                      <th scope="col">Total Payment Receive Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.partyId}>
                        <td>{transaction.partyName}</td>
                        <td>₹{transaction.totalPaymentAmount}</td>
                        <td>₹{transaction.totalReceiptAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyTransaction;
