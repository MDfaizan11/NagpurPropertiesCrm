import React, { useState, useEffect, useRef } from "react";
import "./partyTransaction.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";
import * as html2pdf from "html2pdf.js";

function PartyTransaction() {
  const { id, name } = useParams();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [transactions, setTransactions] = useState([]);
  const [startingDate, setStartingDate] = useState("2025-06-26");
  const [endingDate, setEndingDate] = useState("2025-06-30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tableRef = useRef(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/party/${id}/transactions`,
        {
          params: {
            startingDate,
            endingDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Debug: Log the response to inspect its structure
      console.log("API Response:", response.data);

      // Extract payments and receipts, ensure they are arrays
      const payments = Array.isArray(response.data.payments)
        ? response.data.payments
        : [];
      const receipts = Array.isArray(response.data.receipts)
        ? response.data.receipts
        : [];
      // Combine payments and receipts into a single array
      const transactionData = [...payments, ...receipts];
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response?.status === 404) {
        setError(`Party with ID ${id} not found`);
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view transactions");
      } else {
        setError("An error occurred while fetching transactions");
      }
      setTransactions([]); // Ensure transactions is an array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [id, startingDate, endingDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handlePrint = () => {
    if (!tableRef.current) return;

    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
    <html>
      <head>
        <title>Transactions for ${name || "Party"}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          h2 { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadPDF = () => {
    if (!tableRef.current) return;

    // Create a temporary container for PDF content
    const tempContainer = document.createElement("div");
    tempContainer.className = "PartyTransaction-pdf-container";

    // Add party name as header
    const pdfHeader = document.createElement("h2");
    pdfHeader.className = "PartyTransaction-print-header";
    pdfHeader.textContent = `Transactions for ${name || "Party"}`;
    tempContainer.appendChild(pdfHeader);

    // Clone the table and append to temporary container
    const tableClone = tableRef.current.cloneNode(true);
    tempContainer.appendChild(tableClone);

    // Generate PDF
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `${name || "party"}_transactions_${today}.pdf`;

    const opt = {
      margin: [15, 10, 15, 10],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true, // helps with cross-origin inline images
        logging: true, // useful for debug
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.body.scrollWidth, // full width
        windowHeight: document.body.scrollHeight, // full height
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(tempContainer).save();
  };

  return (
    <div className="PartyTransaction-container">
      <div className="PartyTransaction-header">
        <h1 className="PartyTransaction-title">Party Transactions</h1>
      </div>

      <div className="PartyTransaction-controls">
        <form onSubmit={handleSearch} className="PartyTransaction-search-form">
          <div className="PartyTransaction-form-group">
            <label className="PartyTransaction-form-label">Start Date</label>
            <input
              type="date"
              className="PartyTransaction-form-input"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
              required
            />
          </div>
          <div className="PartyTransaction-form-group">
            <label className="PartyTransaction-form-label">End Date</label>
            <input
              type="date"
              className="PartyTransaction-form-input"
              value={endingDate}
              onChange={(e) => setEndingDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="PartyTransaction-btn-primary"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="PartyTransaction-action-buttons">
          <button
            className="PartyTransaction-btn-primary"
            onClick={handlePrint}
            disabled={loading || transactions.length === 0}
          >
            <svg
              className="PartyTransaction-btn-icon"
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
            className="PartyTransaction-btn-primary"
            onClick={handleDownloadPDF}
            disabled={loading || transactions.length === 0}
          >
            <svg
              className="PartyTransaction-btn-icon"
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

      {error && <div className="PartyTransaction-error-message">{error}</div>}

      {loading ? (
        <div className="PartyTransaction-loading">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="PartyTransaction-empty">No transactions found</div>
      ) : (
        <div className="PartyTransaction-print-area">
          <h2 className="PartyTransaction-print-header">
            Transactions for {name || "Party"}
          </h2>
          <div className="PartyTransaction-table-container" ref={tableRef}>
            <table className="PartyTransaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Mode</th>
                  <th>Check No</th>
                  <th>Online ID</th>
                  <th>Description</th>
                  <th>Remark</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td>{transaction.transactionDate}</td>
                    <td>₹{transaction.amount}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{transaction.transactionMode}</td>
                    <td>{transaction.checkNo || "-"}</td>
                    <td>{transaction.onlineTransactionId || "-"}</td>
                    <td>{transaction.description || "-"}</td>
                    <td>{transaction.remark || "-"}</td>
                    <td>
                      {transaction.documentUrl ? (
                        <a
                          href={transaction.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="PartyTransaction-document-link"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartyTransaction;
