// "use client";

// import { useEffect, useState, useRef } from "react";
// import "./office.css";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";
// import html2pdf from "html2pdf.js";
// import { NotebookPen, Search } from "lucide-react";

// function Office() {
//   const printOfficeTableRefs = useRef({});
//   const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
//   const [officeExpenseData, setOfficeExpenseData] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All Expenses");
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewMode, setViewMode] = useState("grid");
//   const expensesPerPage = 12;
//   const [showAddOfficeExpense, setshowAddOfficeExpense] = useState(false);
//   const [officeGiverName, setOfficeGiverName] = useState("");
//   const [officeReceiverName, setOfficeReceiverName] = useState("");
//   const [officeRemark, setOfficeRemark] = useState("");
//   const [officeAmount, setOfficeAmount] = useState("");
//   const [officeDate, setOfficeDate] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [editOfficeExpenseId, setEditOfficeExpenseId] = useState("");
//   const [ShowOfficeExpenseEditForm, setShowOfficeExpenseEditForm] =
//     useState(false);
//   const [editofficeGiverName, setEditOfficeGiverName] = useState("");
//   const [editofficeReceiverName, seteditOfficeReceiverName] = useState("");
//   const [EditofficeRemark, setEditOfficeRemark] = useState("");
//   const [EditofficeAmount, setEditOfficeAmount] = useState("");
//   const [EditofficeDate, setEditOfficeDate] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);

//   useEffect(() => {
//     async function getAllOfficeExpense() {
//       try {
//         setIsLoading(true);
//         const response = await axiosInstance.get(
//           `${BASE_URL}/office-expenses`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log(response.data);
//         setOfficeExpenseData(response.data);
//         setFilteredExpenses(response.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.log(error);
//         setError("Failed to load office expenses. Please try again.");
//         setIsLoading(false);
//       }
//     }
//     getAllOfficeExpense();
//   }, [token, refreshKey]);

//   // Filter and search functionality
//   useEffect(() => {
//     let filtered = officeExpenseData.filter(
//       (expense) =>
//         expense.remark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         expense.reciverName
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         expense.giverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         expense.amount?.toString().includes(searchQuery)
//     );

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       filtered = filtered.filter((expense) => {
//         const expenseDate = new Date(expense.date);
//         return expenseDate >= start && expenseDate <= end;
//       });
//     }

//     if (activeFilter !== "All Expenses") {
//       const amount = Number.parseFloat(activeFilter.split(" ")[0]);
//       if (activeFilter.includes("High")) {
//         filtered = filtered.filter(
//           (expense) => Number.parseFloat(expense.amount) >= 10000
//         );
//       } else if (activeFilter.includes("Medium")) {
//         filtered = filtered.filter(
//           (expense) =>
//             Number.parseFloat(expense.amount) >= 5000 &&
//             Number.parseFloat(expense.amount) < 10000
//         );
//       } else if (activeFilter.includes("Low")) {
//         filtered = filtered.filter(
//           (expense) => Number.parseFloat(expense.amount) < 5000
//         );
//       }
//     }

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         let aValue = a[sortConfig.key];
//         let bValue = b[sortConfig.key];
//         if (sortConfig.key === "amount") {
//           aValue = Number.parseFloat(aValue) || 0;
//           bValue = Number.parseFloat(bValue) || 0;
//         } else if (sortConfig.key === "date") {
//           aValue = new Date(aValue);
//           bValue = new Date(bValue);
//         } else {
//           aValue = String(aValue).toLowerCase();
//           bValue = String(bValue).toLowerCase();
//         }
//         if (aValue < bValue) {
//           return sortConfig.direction === "ascending" ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === "ascending" ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     const total = filtered.reduce(
//       (sum, expense) => sum + (Number.parseFloat(expense.amount) || 0),
//       0
//     );
//     setTotalFilteredAmount(total);
//     setFilteredExpenses(filtered);
//     setCurrentPage(1);
//   }, [
//     searchQuery,
//     officeExpenseData,
//     activeFilter,
//     sortConfig,
//     startDate,
//     endDate,
//   ]);

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleFilterChange = (filter) => {
//     setActiveFilter(filter);
//   };

//   // New function to reset all filters
//   const handleShowAllData = () => {
//     setSearchQuery("");
//     setStartDate("");
//     setEndDate("");
//     setActiveFilter("All Expenses");
//     setSortConfig({ key: null, direction: "ascending" });
//     setCurrentPage(1);
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const indexOfLastExpense = currentPage * expensesPerPage;
//   const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
//   const currentExpenses = filteredExpenses.slice(
//     indexOfFirstExpense,
//     indexOfLastExpense
//   );

//   const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handleDeleteExpense = async (id) => {
//     const deleteConfirm = window.confirm(
//       "Are you sure you want to delete this expense?"
//     );
//     if (!deleteConfirm) return;

//     try {
//       const response = await axiosInstance.delete(
//         `${BASE_URL}/office-expenses/delete/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.status === 200) {
//         alert("Expense deleted successfully");
//         const updatedExpenses = officeExpenseData.filter(
//           (expense) => expense.id !== id
//         );
//         setOfficeExpenseData(updatedExpenses);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Failed to delete expense");
//     }
//   };

//   async function handleAddOfficeExpense(e) {
//     e.preventDefault();
//     const body = {
//       date: officeDate,
//       reciverName: officeReceiverName,
//       giverName: officeGiverName,
//       amount: officeAmount,
//       remark: officeRemark,
//     };

//     try {
//       const response = await axiosInstance.post(
//         `${BASE_URL}/office-expenses/create`,
//         body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.status === 200) {
//         alert("Office Expense Add SuccessFully");
//         setRefreshKey(refreshKey + 1);
//         setOfficeAmount("");
//         setOfficeDate("");
//         setOfficeGiverName("");
//         setOfficeReceiverName("");
//         setOfficeRemark("");
//         setshowAddOfficeExpense(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function handleEditOfficeExpense(id) {
//     setEditOfficeExpenseId(id);
//     setShowOfficeExpenseEditForm(true);
//     try {
//       const response = await axiosInstance.get(
//         `${BASE_URL}/office-expenses/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(response.data);
//       seteditOfficeReceiverName(response.data?.reciverName);
//       setEditOfficeAmount(response.data?.amount);
//       setEditOfficeDate(response.data?.date);
//       setEditOfficeGiverName(response.data?.giverName);
//       setEditOfficeRemark(response.data?.remark);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function handleUpdateOfficeExpense(e) {
//     e.preventDefault();
//     const body = {
//       date: EditofficeDate,
//       reciverName: editofficeReceiverName,
//       giverName: editofficeGiverName,
//       amount: EditofficeAmount,
//       remark: EditofficeRemark,
//     };

//     try {
//       const response = await axiosInstance.put(
//         `${BASE_URL}/office-expenses/update/${editOfficeExpenseId}`,
//         body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.status === 200) {
//         alert("office expense update successfully");
//         setRefreshKey((ref) => ref + 1);
//         setEditOfficeAmount("");
//         seteditOfficeReceiverName("");
//         setEditOfficeDate("");
//         setEditOfficeGiverName("");
//         setEditOfficeRemark("");
//         setShowOfficeExpenseEditForm(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const handlePrintOfficeExpense = (id) => {
//     const element = printOfficeTableRefs.current[id];
//     if (!element) {
//       alert("Printable table not found.");
//       return;
//     }

//     const opt = {
//       margin: 0.3,
//       filename: `OfficeExpense_${id}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };

//     html2pdf().set(opt).from(element).save();
//   };

//   return (
//     <>
//       <div className="office-wrapper">
//         <div className="office-header">
//           <div className="office-header-bg">
//             <div className="animated-shape shape-1"></div>
//             <div className="animated-shape shape-2"></div>
//             <div className="animated-shape shape-3"></div>
//             <div className="animated-shape shape-4"></div>
//           </div>
//           <div className="office-header-content">
//             <h1 className="office-title">Office Expense Management</h1>
//             <p className="office-subtitle">
//               Track and manage your office expenses efficiently
//             </p>
//           </div>
//         </div>

//         <div className="office-controls">
//           {/* First Line: Search and Date Filters */}
//           <div className="controls-first-line">
//             <div className="equal-width-inputs">
//               <div className="search-wrapper">
//                 <input
//                   type="text"
//                   placeholder="Search by remark, receiver, giver, or amount..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="office-search-input"
//                   aria-label="Search expenses"
//                 />
//                 <span className="search-icon">
//                   <Search />
//                 </span>
//               </div>
//               <div className="date-range-wrapper">
//                 <div className="date-input">
//                   {/* <label htmlFor="start-date" className="date-label">
//                     Start Date
//                   </label> */}
//                   <input
//                     type="date"
//                     id="start-date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="office-search-input"
//                     aria-label="Start date"
//                   />
//                 </div>
//                 <div className="date-input">
//                   {/* <label htmlFor="end-date" className="date-label">
//                     End Date
//                   </label> */}
//                   <input
//                     type="date"
//                     id="end-date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="office-search-input"
//                     aria-label="End date"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Second Line: Total Amount and Action Buttons */}
//           <div className="controls-second-line">
//             <div className="total-amount">
//               <h3>Total Amount: {formatCurrency(totalFilteredAmount)}</h3>
//             </div>
//             <div className="action-buttons">
//               <button
//                 className="add-expense-btn"
//                 onClick={() => setshowAddOfficeExpense(!showAddOfficeExpense)}
//               >
//                 <span className="btn-icon">+</span>
//                 <span>Add Expense</span>
//               </button>
//               <button className="show-all-btn" onClick={handleShowAllData}>
//                 <span className="btn-icon">↻</span>
//                 <span>Show All Data</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="stationary-error">
//             <div className="error-icon">!</div>
//             <div className="error-content">
//               <h4>Error Occurred</h4>
//               <p>{error}</p>
//             </div>
//           </div>
//         )}

//         {isLoading && (
//           <div className="stationary-loading">
//             <div className="loading-animation">
//               <div className="loading-circle"></div>
//               <div className="loading-circle"></div>
//               <div className="loading-circle"></div>
//             </div>
//             <p>Loading office expenses...</p>
//           </div>
//         )}

//         {!isLoading && !error && (
//           <div className="stationary-container">
//             {currentExpenses.length > 0 ? (
//               currentExpenses.map((expense, index) => (
//                 <div key={expense.id || index}>
//                   <div className="stationary-item">
//                     <div className="stationary-item-header">
//                       <h3>
//                         <span className="item-icon">
//                           <NotebookPen />
//                         </span>
//                       </h3>
//                       <div className="stationary-price">
//                         {formatCurrency(expense.amount)}
//                       </div>
//                     </div>
//                     <div className="stationary-item-body">
//                       <div className="stationary-info">
//                         <div className="info-item">
//                           <span className="info-label">Date</span>
//                           <span className="info-value">
//                             {formatDate(expense.date)}
//                           </span>
//                         </div>
//                         <div className="info-item">
//                           <span className="info-label">Description</span>
//                           <span className="info-value">{expense.remark}</span>
//                         </div>
//                         <div className="info-item">
//                           <span className="info-label">From</span>
//                           <span className="info-value">
//                             {expense.giverName}
//                           </span>
//                         </div>
//                         <div className="info-item">
//                           <span className="info-label">To</span>
//                           <span className="info-value">
//                             {expense.reciverName}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="stationary-item-actions">
//                       <button
//                         className="action-btn edit-btn"
//                         onClick={() => handleEditOfficeExpense(expense.id)}
//                       >
//                         <span>Edit</span>
//                       </button>
//                       <button
//                         className="action-btn delete-btn"
//                         onClick={() => handleDeleteExpense(expense.id)}
//                       >
//                         <span>Delete</span>
//                       </button>
//                       <button
//                         className="action-btn print-btn"
//                         onClick={() => handlePrintOfficeExpense(expense.id)}
//                       >
//                         <span>Print</span>
//                       </button>
//                     </div>
//                   </div>
//                   <div style={{ display: "none" }}>
//                     <table
//                       ref={(el) =>
//                         (printOfficeTableRefs.current[expense.id] = el)
//                       }
//                       style={{ borderCollapse: "collapse", width: "100%" }}
//                     >
//                       <thead>
//                         <tr>
//                           <th
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             Date
//                           </th>
//                           <th
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             Description
//                           </th>
//                           <th
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             From
//                           </th>
//                           <th
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             To
//                           </th>
//                           <th
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             Amount
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             {formatDate(expense.date)}
//                           </td>
//                           <td
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             {expense.remark}
//                           </td>
//                           <td
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             {expense.giverName}
//                           </td>
//                           <td
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             {expense.reciverName}
//                           </td>
//                           <td
//                             style={{
//                               border: "1px solid black",
//                               padding: "8px",
//                             }}
//                           >
//                             {formatCurrency(expense.amount)}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="office-no-data">
//                 <div className="no-data-content">
//                   <div className="no-data-icon">📊</div>
//                   <h3>No Office Expenses Found</h3>
//                   <p>
//                     {searchQuery || startDate || endDate
//                       ? "Try adjusting your search criteria, date range, or filters"
//                       : "No office expenses have been recorded yet"}
//                   </p>
//                   <button className="add-expense-btn-small">
//                     <span className="btn-icon">+</span>
//                     <span>Add First Expense</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {showAddOfficeExpense && (
//         <div className="addofficeExpenseform-overlay">
//           <div className="addofficeExpenseform-container">
//             <button
//               onClick={() => setshowAddOfficeExpense(false)}
//               className="addofficeExpenseform-close-button"
//             >
//               ✕
//             </button>
//             <h2 className="addofficeExpenseform-title">Add Office Expense</h2>
//             <form
//               className="addofficeExpenseform-form"
//               onSubmit={handleAddOfficeExpense}
//             >
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="text"
//                   placeholder="Enter Giver Name"
//                   className="addofficeExpenseform-input"
//                   value={officeGiverName}
//                   onChange={(e) => setOfficeGiverName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="text"
//                   placeholder="Enter Receiver Name"
//                   className="addofficeExpenseform-input"
//                   value={officeReceiverName}
//                   onChange={(e) => setOfficeReceiverName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="text"
//                   placeholder="Enter Remark"
//                   className="addofficeExpenseform-input"
//                   value={officeRemark}
//                   onChange={(e) => setOfficeRemark(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="number"
//                   placeholder="Enter Amount"
//                   className="addofficeExpenseform-input"
//                   value={officeAmount}
//                   onChange={(e) => setOfficeAmount(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="date"
//                   className="addofficeExpenseform-input"
//                   value={officeDate}
//                   onChange={(e) => setOfficeDate(e.target.value)}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="addofficeExpenseform-submit-button"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {ShowOfficeExpenseEditForm && (
//         <div className="addofficeExpenseform-overlay">
//           <div className="addofficeExpenseform-container">
//             <button
//               onClick={() => setShowOfficeExpenseEditForm(false)}
//               className="addofficeExpenseform-close-button"
//             >
//               ✕
//             </button>
//             <h2 className="addofficeExpenseform-title">Edit Office Expense</h2>
//             <form
//               className="addofficeExpenseform-form"
//               onSubmit={handleUpdateOfficeExpense}
//             >
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="text"
//                   placeholder="Enter Giver Name"
//                   className="addofficeExpenseform-input"
//                   value={editofficeGiverName}
//                   onChange={(e) => setEditOfficeGiverName(e.target.value)}
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="text"
//                   placeholder="Enter Receiver Name"
//                   className="addofficeExpenseform-input"
//                   value={editofficeReceiverName}
//                   onChange={(e) => seteditOfficeReceiverName(e.target.value)}
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="text"
//                   placeholder="Enter Remark"
//                   className="addofficeExpenseform-input"
//                   value={EditofficeRemark}
//                   onChange={(e) => setEditOfficeRemark(e.target.value)}
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="number"
//                   placeholder="Enter Amount"
//                   className="addofficeExpenseform-input"
//                   value={EditofficeAmount}
//                   onChange={(e) => setEditOfficeAmount(e.target.value)}
//                 />
//               </div>
//               <div className="addofficeExpenseform-field">
//                 <input
//                   type="date"
//                   className="addofficeExpenseform-input"
//                   value={EditofficeDate}
//                   onChange={(e) => setEditOfficeDate(e.target.value)}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="addofficeExpenseform-submit-button"
//               >
//                 Update
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Office;

import { useEffect, useState, useRef } from "react";
import "./office.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import html2pdf from "html2pdf.js";
import { SquarePen, Trash2, Printer, Search } from "lucide-react";

function Office() {
  const printOfficeTableRefs = useRef({});
  const printAllTableRef = useRef(null);
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
  const [viewMode, setViewMode] = useState("table");
  const expensesPerPage = 12;
  const [showAddOfficeExpense, setShowAddOfficeExpense] = useState(false);
  const [officeGiverName, setOfficeGiverName] = useState("");
  const [officeReceiverName, setOfficeReceiverName] = useState("");
  const [officeRemark, setOfficeRemark] = useState("");
  const [officeAmount, setOfficeAmount] = useState("");
  const [officeDate, setOfficeDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editOfficeExpenseId, setEditOfficeExpenseId] = useState("");
  const [showOfficeExpenseEditForm, setShowOfficeExpenseEditForm] =
    useState(false);
  const [editOfficeGiverName, setEditOfficeGiverName] = useState("");
  const [editOfficeReceiverName, setEditOfficeReceiverName] = useState("");
  const [editOfficeRemark, setEditOfficeRemark] = useState("");
  const [editOfficeAmount, setEditOfficeAmount] = useState("");
  const [editOfficeDate, setEditOfficeDate] = useState("");
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
        alert("Office Expense Added Successfully");
        setRefreshKey(refreshKey + 1);
        setOfficeAmount("");
        setOfficeDate("");
        setOfficeGiverName("");
        setOfficeReceiverName("");
        setOfficeRemark("");
        setShowAddOfficeExpense(false);
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
      setEditOfficeReceiverName(response.data?.reciverName);
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
      date: editOfficeDate,
      reciverName: editOfficeReceiverName,
      giverName: editOfficeGiverName,
      amount: editOfficeAmount,
      remark: editOfficeRemark,
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
        alert("Office expense updated successfully");
        setRefreshKey((ref) => ref + 1);
        setEditOfficeAmount("");
        setEditOfficeReceiverName("");
        setEditOfficeDate("");
        setEditOfficeGiverName("");
        setEditOfficeRemark("");
        setShowOfficeExpenseEditForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePrintAllExpenses = () => {
    const element = printAllTableRef.current;
    if (!element) {
      alert("Printable table not found.");
      return;
    }

    const opt = {
      margin: 0.3,
      filename: `All_Office_Expenses.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const EditIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
  return (
    <>
      <div className="office-wrapper">
        <div className="office-header">
          {/* <div className="office-header-bg">
            <div className="office-animated-shape office-shape-1"></div>
            <div className="office-animated-shape office-shape-2"></div>
            <div className="office-animated-shape office-shape-3"></div>
            <div className="office-animated-shape office-shape-4"></div>
          </div> */}
          <div className="office-header-content">
            <h1 className="office-title">Office Expense Management</h1>
            <p className="office-subtitle">
              Track and manage your office expenses efficiently
            </p>
          </div>
        </div>

        <div className="office-controls">
          <div className="office-controls-first-line">
            <div className="office-equal-width-inputs">
              <div className="office-search-wrapper">
                <input
                  type="text"
                  placeholder="Search by remark, receiver, giver, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="office-search-input"
                  aria-label="Search expenses"
                />
                <span className="office-search-icon">
                  <Search />
                </span>
              </div>
              <div className="office-date-range-wrapper">
                <div className="office-date-input">
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="office-search-input"
                    aria-label="Start date"
                  />
                </div>
                <div className="office-date-input">
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
            </div>
          </div>

          <div className="office-controls-second-line">
            <div className="office-total-amount">
              <h3>Total Amount: {formatCurrency(totalFilteredAmount)}</h3>
            </div>
            <div className="office-action-buttons">
              <button
                className="office-add-expense-btn"
                onClick={() => setShowAddOfficeExpense(!showAddOfficeExpense)}
              >
                <span className="office-btn-icon">+</span>
                <span>Add Expense</span>
              </button>
              <button
                className="office-show-all-btn"
                onClick={handleShowAllData}
              >
                <span className="office-btn-icon">↻</span>
                <span>Show All Data</span>
              </button>
              <button
                className="office-print-all-btn"
                onClick={handlePrintAllExpenses}
                title="Print All Expenses"
              >
                Print <Printer className="office-icon" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="office-stationary-error">
            <div className="office-error-icon">!</div>
            <div className="office-error-content">
              <h4>Error Occurred</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="office-stationary-loading">
            <div className="office-loading-animation">
              <div className="office-loading-circle"></div>
              <div className="office-loading-circle"></div>
              <div className="office-loading-circle"></div>
            </div>
            <p>Loading office expenses...</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="office-stationary-container">
            {currentExpenses.length > 0 ? (
              <>
                <table className="office-expense-table">
                  <thead>
                    <tr>
                      <th onClick={() => requestSort("date")}>Date</th>
                      <th onClick={() => requestSort("remark")}>Description</th>
                      <th onClick={() => requestSort("giverName")}>From</th>
                      <th onClick={() => requestSort("reciverName")}>To</th>
                      <th onClick={() => requestSort("amount")}>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExpenses.map((expense, index) => (
                      <tr key={expense.id || index}>
                        <td>{formatDate(expense.date)}</td>
                        <td>{expense.remark}</td>
                        <td>{expense.giverName}</td>
                        <td>{expense.reciverName}</td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td>
                          <button
                            className="office-action-btn office-edit-btn"
                            onClick={() => handleEditOfficeExpense(expense.id)}
                            title="Edit Expense"
                          >
                            <EditIcon className="office-icon" />
                          </button>
                          <button
                            className="office-action-btn office-delete-btn"
                            onClick={() => handleDeleteExpense(expense.id)}
                            title="Delete Expense"
                          >
                            <DeleteIcon className="office-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: "none" }}>
                  <table ref={printAllTableRef} className="office-print-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentExpenses.map((expense, index) => (
                        <tr key={expense.id || index}>
                          <td>{formatDate(expense.date)}</td>
                          <td>{expense.remark}</td>
                          <td>{expense.giverName}</td>
                          <td>{expense.reciverName}</td>
                          <td>{formatCurrency(expense.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="office-no-data">
                <div className="office-no-data-content">
                  <div className="office-no-data-icon">📊</div>
                  <h3>No Office Expenses Found</h3>
                  <p>
                    {searchQuery || startDate || endDate
                      ? "Try adjusting your search criteria, date range, or filters"
                      : "No office expenses have been recorded yet"}
                  </p>
                  <button
                    className="office-add-expense-btn-small"
                    onClick={() => setShowAddOfficeExpense(true)}
                  >
                    <span className="office-btn-icon">+</span>
                    <span>Add First Expense</span>
                  </button>
                </div>
              </div>
            )}

            {currentExpenses.length > 0 && (
              <div className="office-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`office-pagination-btn ${
                      currentPage === i + 1 ? "office-active" : ""
                    }`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddOfficeExpense && (
        <div className="office-addofficeExpenseform-overlay">
          <div className="office-addofficeExpenseform-container">
            <button
              onClick={() => setShowAddOfficeExpense(false)}
              className="office-addofficeExpenseform-close-button"
            >
              ✕
            </button>
            <h2 className="office-addofficeExpenseform-title">
              Add Office Expense
            </h2>
            <form
              className="office-addofficeExpenseform-form"
              onSubmit={handleAddOfficeExpense}
            >
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Giver Name"
                  className="office-addofficeExpenseform-input"
                  value={officeGiverName}
                  onChange={(e) => setOfficeGiverName(e.target.value)}
                  required
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  className="office-addofficeExpenseform-input"
                  value={officeReceiverName}
                  onChange={(e) => setOfficeReceiverName(e.target.value)}
                  required
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="office-addofficeExpenseform-input"
                  value={officeRemark}
                  onChange={(e) => setOfficeRemark(e.target.value)}
                  required
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="office-addofficeExpenseform-input"
                  value={officeAmount}
                  onChange={(e) => setOfficeAmount(e.target.value)}
                  required
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="date"
                  className="office-addofficeExpenseform-input"
                  value={officeDate}
                  onChange={(e) => setOfficeDate(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="office-addofficeExpenseform-submit-button"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showOfficeExpenseEditForm && (
        <div className="office-addofficeExpenseform-overlay">
          <div className="office-addofficeExpenseform-container">
            <button
              onClick={() => setShowOfficeExpenseEditForm(false)}
              className="office-addofficeExpenseform-close-button"
            >
              ✕
            </button>
            <h2 className="office-addofficeExpenseform-title">
              Edit Office Expense
            </h2>
            <form
              className="office-addofficeExpenseform-form"
              onSubmit={handleUpdateOfficeExpense}
            >
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Giver Name"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeGiverName}
                  onChange={(e) => setEditOfficeGiverName(e.target.value)}
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeReceiverName}
                  onChange={(e) => setEditOfficeReceiverName(e.target.value)}
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeRemark}
                  onChange={(e) => setEditOfficeRemark(e.target.value)}
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeAmount}
                  onChange={(e) => setEditOfficeAmount(e.target.value)}
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="date"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeDate}
                  onChange={(e) => setEditOfficeDate(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="office-addofficeExpenseform-submit-button"
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
