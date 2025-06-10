import { useEffect, useState, useRef } from "react";
import "../office/office.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import html2pdf from "html2pdf.js";
import { NotebookPen, Search } from "lucide-react";

function Office() {
  const printOfficeTableRefs = useRef({});
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [officeExpenseData, setOfficeExpenseData] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Expenses");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("cards");
  const expensesPerPage = 12;
  const [showAddOfficeExpense, setshowAddOfficeExpense] = useState(false);
  const [officeGiverName, setOfficeGiverName] = useState("");
  const [officeReceiverName, setOfficeReceiverName] = useState("");
  const [officeRemark, setOfficeRemark] = useState("");
  const [officeAmount, setOfficeAmount] = useState("");
  const [officeDate, setOfficeDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editOfficeExpenseId, setEditOfficeExpenseId] = useState("");
  const [ShowOfficeExpenseEditForm, setShowOfficeExpenseEditForm] =
    useState(false);
  const [editofficeGiverName, setEditOfficeGiverName] = useState("");
  const [editofficeReceiverName, seteditOfficeReceiverName] = useState("");
  const [EditofficeRemark, setEditOfficeRemark] = useState("");
  const [EditofficeAmount, setEditOfficeAmount] = useState("");
  const [EditofficeDate, setEditOfficeDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);

  useEffect(() => {
    async function getAllOfficeExpense() {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `${BASE_URL}/office-expenses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setOfficeExpenseData(response.data);
        setFilteredExpenses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to load office expenses. Please try again.");
        setIsLoading(false);
      }
    }
    getAllOfficeExpense();
  }, [token, refreshKey]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = officeExpenseData.filter(
      (expense) =>
        expense.remark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.reciverName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        expense.giverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.amount?.toString().includes(searchQuery)
    );

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
    }

    if (activeFilter !== "All Expenses") {
      const amount = Number.parseFloat(activeFilter.split(" ")[0]);
      if (activeFilter.includes("High")) {
        filtered = filtered.filter(
          (expense) => Number.parseFloat(expense.amount) >= 10000
        );
      } else if (activeFilter.includes("Medium")) {
        filtered = filtered.filter(
          (expense) =>
            Number.parseFloat(expense.amount) >= 5000 &&
            Number.parseFloat(expense.amount) < 10000
        );
      } else if (activeFilter.includes("Low")) {
        filtered = filtered.filter(
          (expense) => Number.parseFloat(expense.amount) < 5000
        );
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "amount") {
          aValue = Number.parseFloat(aValue) || 0;
          bValue = Number.parseFloat(bValue) || 0;
        } else if (sortConfig.key === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    const total = filtered.reduce(
      (sum, expense) => sum + (Number.parseFloat(expense.amount) || 0),
      0
    );
    setTotalFilteredAmount(total);

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  }, [
    searchQuery,
    officeExpenseData,
    activeFilter,
    sortConfig,
    startDate,
    endDate,
  ]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // New function to reset all filters
  const handleShowAllData = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setActiveFilter("All Expenses");
    setSortConfig({ key: null, direction: "ascending" });
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteExpense = async (id) => {
    const deleteConfirm = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!deleteConfirm) return;

    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/office-expenses/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Expense deleted successfully");
        const updatedExpenses = officeExpenseData.filter(
          (expense) => expense.id !== id
        );
        setOfficeExpenseData(updatedExpenses);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete expense");
    }
  };

  async function handleAddOfficeExpense(e) {
    e.preventDefault();
    const body = {
      date: officeDate,
      reciverName: officeReceiverName,
      giverName: officeGiverName,
      amount: officeAmount,
      remark: officeRemark,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/office-expenses/create`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Office Expense Add SuccessFully");
        setRefreshKey(refreshKey + 1);
        setOfficeAmount("");
        setOfficeDate("");
        setOfficeGiverName("");
        setOfficeReceiverName("");
        setOfficeRemark("");
        setshowAddOfficeExpense(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditOfficeExpense(id) {
    setEditOfficeExpenseId(id);
    setShowOfficeExpenseEditForm(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/office-expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      seteditOfficeReceiverName(response.data?.reciverName);
      setEditOfficeAmount(response.data?.amount);
      setEditOfficeDate(response.data?.date);
      setEditOfficeGiverName(response.data?.giverName);
      setEditOfficeRemark(response.data?.remark);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateOfficeExpense(e) {
    e.preventDefault();
    const body = {
      date: EditofficeDate,
      reciverName: editofficeReceiverName,
      giverName: editofficeGiverName,
      amount: EditofficeAmount,
      remark: EditofficeRemark,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/office-expenses/update/${editOfficeExpenseId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("office expense update successfully");
        setRefreshKey((ref) => ref + 1);
        setEditOfficeAmount("");
        seteditOfficeReceiverName("");
        setEditOfficeDate("");
        setEditOfficeGiverName("");
        setEditOfficeRemark("");
        setShowOfficeExpenseEditForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePrintOfficeExpense = (id) => {
    const element = printOfficeTableRefs.current[id];
    if (!element) {
      alert("Printable table not found.");
      return;
    }

    const opt = {
      margin: 0.3,
      filename: `OfficeExpense_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <div className="office-wrapper">
        <div className="office-header">
          <div className="office-header-bg">
            <div className="animated-shape shape-1"></div>
            <div className="animated-shape shape-2"></div>
            <div className="animated-shape shape-3"></div>
            <div className="animated-shape shape-4"></div>
          </div>
          <div className="office-header-content">
            <h1 className="office-title">Office Expense Management</h1>
            <p className="office-subtitle">
              Track and manage your office expenses efficiently
            </p>
          </div>
        </div>

        <div className="office-controls">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by remark, receiver, giver, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="office-search-input"
              aria-label="Search expenses"
            />
            <span className="search-icon">
              <Search />
            </span>
          </div>

          <div className="date-range-wrapper">
            <div className="date-input">
              <label htmlFor="start-date" className="date-label">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="office-search-input"
                aria-label="Start date"
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date" className="date-label">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="office-search-input"
                aria-label="End date"
              />
            </div>
          </div>

          <div className="total-amount">
            <h3>Total Amount: {formatCurrency(totalFilteredAmount)}</h3>
          </div>

          <div className="view-controls">
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${
                  viewMode === "cards" ? "active" : ""
                }`}
                onClick={() => setViewMode("cards")}
              >
                <span className="view-icon">🃏</span>
                <span className="view-text">Cards</span>
              </button>
            </div>

            <div className="filter-and-sort">
              <button
                className="add-expense-btn"
                onClick={() => setshowAddOfficeExpense(!showAddOfficeExpense)}
              >
                <span className="btn-icon">+</span>
                <span>Add Expense</span>
              </button>

              <button className="show-all-btn" onClick={handleShowAllData}>
                <span className="btn-icon">↻</span>
                <span>Show All Data</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="stationary-error">
            <div className="error-icon">!</div>
            <div className="error-content">
              <h4>Error Occurred</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="stationary-loading">
            <div className="loading-animation">
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
            </div>
            <p>Loading office expenses...</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="stationary-card-container">
            {currentExpenses.length > 0 ? (
              currentExpenses.map((expense, index) => (
                <div key={expense.id || index}>
                  <div className="stationary-card">
                    <div className="stationary-card-header">
                      <h3>
                        <span className="card-icon">
                          <NotebookPen />
                        </span>
                      </h3>
                      <div className="stationary-price">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                    <div className="stationary-card-body">
                      <div className="stationary-info">
                        <div className="info-item">
                          <span className="info-label">Date</span>
                          <span className="info-value">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Description</span>
                          <span className="info-value">{expense.remark}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">From</span>
                          <span className="info-value">
                            {expense.giverName}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">To</span>
                          <span className="info-value">
                            {expense.reciverName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="stationary-card-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditOfficeExpense(expense.id)}
                      >
                        <span>Edit</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <span>Delete</span>
                      </button>
                      <button
                        className="action-btn print-btn"
                        onClick={() => handlePrintOfficeExpense(expense.id)}
                      >
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "none" }}>
                    <table
                      ref={(el) =>
                        (printOfficeTableRefs.current[expense.id] = el)
                      }
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
                            Description
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            From
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            To
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
                            {formatDate(expense.date)}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {expense.remark}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {expense.giverName}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {expense.reciverName}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {formatCurrency(expense.amount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="office-no-data">
                <div className="no-data-content">
                  <div className="no-data-icon">📊</div>
                  <h3>No Office Expenses Found</h3>
                  <p>
                    {searchQuery || startDate || endDate
                      ? "Try adjusting your search criteria, date range, or filters"
                      : "No office expenses have been recorded yet"}
                  </p>
                  <button className="add-expense-btn-small">
                    <span className="btn-icon">+</span>
                    <span>Add First Expense</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddOfficeExpense && (
        <div className="addofficeExpenseform-overlay">
          <div className="addofficeExpenseform-container">
            <button
              onClick={() => setshowAddOfficeExpense(false)}
              className="addofficeExpenseform-close-button"
            >
              ✕
            </button>
            <h2 className="addofficeExpenseform-title">Add Office Expense</h2>

            <form
              className="addofficeExpenseform-form"
              onSubmit={handleAddOfficeExpense}
            >
              <div className="addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Giver Name"
                  className="addofficeExpenseform-input"
                  value={officeGiverName}
                  onChange={(e) => setOfficeGiverName(e.target.value)}
                  required
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  className="addofficeExpenseform-input"
                  value={officeReceiverName}
                  onChange={(e) => setOfficeReceiverName(e.target.value)}
                  required
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="addofficeExpenseform-input"
                  value={officeRemark}
                  onChange={(e) => setOfficeRemark(e.target.value)}
                  required
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="addofficeExpenseform-input"
                  value={officeAmount}
                  onChange={(e) => setOfficeAmount(e.target.value)}
                  required
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="date"
                  className="addofficeExpenseform-input"
                  value={officeDate}
                  onChange={(e) => setOfficeDate(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="addofficeExpenseform-submit-button"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {ShowOfficeExpenseEditForm && (
        <div className="addofficeExpenseform-overlay">
          <div className="addofficeExpenseform-container">
            <button
              onClick={() => setShowOfficeExpenseEditForm(false)}
              className="addofficeExpenseform-close-button"
            >
              ✕
            </button>
            <h2 className="addofficeExpenseform-title">Edit Office Expense</h2>

            <form
              className="addofficeExpenseform-form"
              onSubmit={handleUpdateOfficeExpense}
            >
              <div className="addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Giver Name"
                  className="addofficeExpenseform-input"
                  value={editofficeGiverName}
                  onChange={(e) => setEditOfficeGiverName(e.target.value)}
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  className="addofficeExpenseform-input"
                  value={editofficeReceiverName}
                  onChange={(e) => seteditOfficeReceiverName(e.target.value)}
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="addofficeExpenseform-input"
                  value={EditofficeRemark}
                  onChange={(e) => setEditOfficeRemark(e.target.value)}
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="addofficeExpenseform-input"
                  value={EditofficeAmount}
                  onChange={(e) => setEditOfficeAmount(e.target.value)}
                />
              </div>

              <div className="addofficeExpenseform-field">
                <input
                  type="date"
                  className="addofficeExpenseform-input"
                  value={EditofficeDate}
                  onChange={(e) => setEditOfficeDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="addofficeExpenseform-submit-button"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Office;
