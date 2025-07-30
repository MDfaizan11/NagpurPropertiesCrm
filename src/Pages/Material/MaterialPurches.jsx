// import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";
// import "./MaterialPurches.css";
// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

// const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

// function MaterialPurches() {
//   const purchesOrderPrint = useRef();
//   const handleOrderprint = useRef();

//   const [supplierName, setSupplierName] = useState("");
//   const [siteName, setSiteName] = useState("");
//   const [expectDate, setExpectDate] = useState("");
//   const [note, setNote] = useState("");
//   const [orderItemStatus, setOrderItemStatus] = useState("");
//   const [orderItems, setOrderItems] = useState([
//     { materialName: "", orderQty: "", unitCost: "" },
//   ]);
//   const [purchesOrders, setPurchesOrders] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [viewOrder, setViewOrder] = useState(null);
//   const [showSiteName, setShowSiteName] = useState([]);

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...orderItems];
//     updatedItems[index][field] =
//       field === "orderQty" || field === "unitCost" ? Number(value) : value;
//     setOrderItems(updatedItems);
//   };

//   const addOrderItem = () => {
//     setOrderItems([
//       ...orderItems,
//       { materialName: "", orderQty: 0, unitCost: 0 },
//     ]);
//   };

//   const removeOrderItem = (index) => {
//     const updatedItems = [...orderItems];
//     updatedItems.splice(index, 1);
//     setOrderItems(updatedItems);
//   };

//   useEffect(() => {
//     async function getAllSiteName() {
//       try {
//         const response = await axiosInstance.get(
//           `${BASE_URL}/show-AllProject`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log(response.data);
//         setShowSiteName(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     getAllSiteName();
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = {
//       supplierName,
//       siteName,
//       expectDate,
//       note,
//       orderItemStatus,
//       orderItems,
//     };
//     try {
//       let response;
//       if (isEditMode && editId) {
//         response = await axiosInstance.put(
//           `${BASE_URL}/purchase-orders/${editId}`,
//           body,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Order Updated Successfully");
//       } else {
//         response = await axiosInstance.post(
//           `${BASE_URL}/purchase-orders`,
//           body,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Order Added Successfully");
//       }
//       resetForm();
//       getPurchesOrder();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const resetForm = () => {
//     setSupplierName("");
//     setSiteName("");
//     setExpectDate("");
//     setNote("");
//     setOrderItemStatus("");
//     setOrderItems([{ materialName: "", orderQty: "", unitCost: "" }]);
//     setShowForm(false);
//     setIsEditMode(false);
//     setEditId(null);
//   };

//   const handleEdit = (order) => {
//     console.log(order);
//     setSupplierName(order.supplierName);
//     setSiteName(order.siteName);
//     setExpectDate(order.expectDate);
//     setNote(order.note);
//     setOrderItemStatus(order.orderItemStatus);
//     setOrderItems(order.orderItems);
//     setIsEditMode(true);
//     setEditId(order.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (order) => {
//     const status = order.orderItemStatus;
//     if (status === "DELIVERED") {
//       alert("Cannot delete a delivered order");
//       return;
//     }
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       try {
//         await axiosInstance.delete(`${BASE_URL}/purchase-orders/${order.id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         alert("Delete Order Successfully");
//         getPurchesOrder();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const handleView = (order) => {
//     setViewOrder(order);
//   };

//   const handleEditOrderItem = (itemIndex, item) => {
//     console.log("Edit item:", itemIndex, item);
//     alert(`Edit item: ${item.materialName}`);
//   };

//   const handleDeleteOrderItem = async (itemIndex, item) => {
//     if (
//       window.confirm(`Are you sure you want to delete ${item.materialName}?`)
//     ) {
//       try {
//         await axiosInstance.delete(
//           `${BASE_URL}/purchase-orders/orderItemDelete/${item.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Delete Order Item Successfully");
//         getPurchesOrder();

//         const updatedOrder = purchesOrders.find(
//           (order) => order.id === viewOrder.id
//         );
//         if (updatedOrder) {
//           const updatedItems = updatedOrder.orderItems.filter(
//             (orderItem) => orderItem.id !== item.id
//           );
//           setViewOrder({ ...updatedOrder, orderItems: updatedItems });
//         }
//       } catch (error) {
//         console.error("Error deleting order item:", error);
//         alert("Failed to delete order item");
//       }
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     if (
//       window.confirm(
//         `Are you sure you want to change the status to ${newStatus}?`
//       )
//     ) {
//       try {
//         await axiosInstance.post(
//           `${BASE_URL}/purchase-orders/updatePurchaseOrderStatus/${id}`,
//           { status: newStatus },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Status Updated Successfully");
//         getPurchesOrder();
//       } catch (error) {
//         console.error("Error updating status:", error);
//         alert("Failed to update status");
//       }
//     }
//   };

//   async function getPurchesOrder() {
//     try {
//       const res = await axiosInstance.get(`${BASE_URL}/purchase-orders`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(res);
//       setPurchesOrders(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     getPurchesOrder();
//   }, []);

//   const filteredOrders = purchesOrders.filter(
//     (order) =>
//       order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.siteName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const calculateItemTotal = (item) => item.orderQty * item.unitCost;
//   const calculateGrandTotal = (items) =>
//     items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

//   function handlePrintPurchesTable() {
//     const printContents = purchesOrderPrint.current.innerHTML;
//     const printWindow = window.open("", "", "height=600,width=800");
//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Print Purchase Orders</title>
//         <style>
//           /* Optional: basic styles for table printing */
//           body {
//             font-family: Arial, sans-serif;
//             padding: 20px;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//           }
//           th, td {
//             border: 1px solid #ccc;
//             padding: 8px;
//             text-align: left;
//           }
//           th {
//             background-color: #f0f0f0;
//           }

//            .MaterialPurches-actionsCell,
//         .MaterialPurches-tableHeaderCell:nth-child(6) {
//           display: none !important;
//         }
//         </style>
//       </head>
//       <body>
//         ${printContents}
//       </body>
//     </html>
//   `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   }

//   const handleOrderItemPrint = () => {
//     const printContent = handleOrderprint.current;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Purchase Order</title>
//           <style>
//             /* Tailwind CSS styles for printing */
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .MaterialPurches-viewOverlay { max-width: 800px; margin: 0 auto; }
//             .MaterialPurches-viewContainer { background: white; padding: 20px; border: 1px solid #e5e7eb; }
//             .MaterialPurches-viewHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//             .MaterialPurches-viewTitle { font-size: 1.5rem; font-weight: bold; }
//             .MaterialPurches-viewSubtitle { color: #6b7280; }
//             .MaterialPurches-toggleFormButton, .MaterialPurches-closeViewButton { display: none; } /* Hide buttons in print */
//             .MaterialPurches-orderInfo { margin-bottom: 20px; }
//             .MaterialPurches-orderNumber { display: flex; justify-content: space-between; align-items: center; }
//             .MaterialPurches-statusBadge { padding: 4px 8px; border-radius: 9999px; }
//             .MaterialPurches-status-pending { background: #fef3c7; color: #d97706; }
//             .MaterialPurches-status-completed { background: #d1fae5; color: #059669; }
//             .MaterialPurches-orderDetails { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
//             .MaterialPurches-orderDetail { display: flex; align-items: center; }
//             .MaterialPurches-detailIcon { margin-right: 8px; }
//             .MaterialPurches-detailLabel { color: #6b7280; }
//             .MaterialPurches-detailLabel::after { content: ' : '; } /* Add colon after labels */
//             .MaterialPurches-detailValue { font-weight: 500; }
//             .MaterialPurches-orderNote { margin-top: 16px; }
//             .MaterialPurches-noteHeader { display: flex; align-items: center; gap: 8px; }
//             .MaterialPurches-noteText { margin-top: 8px; color: #374151; }
//             .MaterialPurches-itemsSection { margin-top: 20px; }
//             .MaterialPurches-itemsSectionHeader { display: flex; justify-content: space-between; align-items: center; }
//             .MaterialPurches-itemsTitle { font-size: 1.25rem; font-weight: bold; }
//             .MaterialPurches-itemsCount { color: #6b7280; }
//             .MaterialPurches-itemList { margin-top: 16px; }
//             .MaterialPurches-item { border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 8px; border-radius: 8px; }
//             .MaterialPurches-itemHeader { display: flex; justify-content: space-between; align-items: center; }
//             .MaterialPurches-itemHeaderLeft { display: flex; align-items: center; gap: 8px; }
//             .MaterialPurches-itemNumber { font-weight: bold; }
//             .MaterialPurches-itemName { font-size: 1rem; }
//             .MaterialPurches-itemDeleteButton,.MaterialPurches-itemEditButton { display: none; } /* Hide edit/delete buttons in print */
//             .MaterialPurches-itemDetails { display: flex; gap: 16px; margin-top: 8px; }
//             .MaterialPurches-itemDetailItem { display: flex; gap: 8px; }
//             .MaterialPurches-itemDetailLabel { color: #6b7280; }
//             .MaterialPurches-itemDetailValue { font-weight: 500; }
//             .MaterialPurches-itemTotalAmount { font-weight: bold; }
//             .MaterialPurches-grandTotal { margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
//             .MaterialPurches-grandTotalContent { display: flex; justify-content: space-between; }
//             .MaterialPurches-grandTotalLabel { font-size: 1.125rem; font-weight: bold; }
//             .MaterialPurches-grandTotalAmount { font-size: 1.125rem; font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           ${printContent.innerHTML}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   async function handleChangeOrderItemStatus(id, status) {
//     if (
//       window.confirm(`Are you sure you want to change the status to ${status}?`)
//     ) {
//       try {
//         await axiosInstance.post(
//           `${BASE_URL}/purchase-orders/updateOrderItemStatus/${id}`,
//           { status: status },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         alert("Status Updated Successfully");

//         const response = await axiosInstance.get(
//           `${BASE_URL}/purchase-orders`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setPurchesOrders(response.data);

//         const updatedOrder = response.data.find(
//           (order) => order.id === viewOrder.id
//         );

//         if (updatedOrder) {
//           setViewOrder(updatedOrder);
//         }
//       } catch (error) {
//         console.error("Error updating status:", error);
//         alert("Failed to update status");
//       }
//     }
//   }

//   return (
//     <div className="MaterialPurches-container">
//       {/* Enhanced Header with Stats */}
//       <div className="MaterialPurches-header">
//         <div className="MaterialPurches-headerContent">
//           <div className="MaterialPurches-headerText">
//             <h1 className="MaterialPurches-title">Material Purchase Orders</h1>
//             <p className="MaterialPurches-subtitle">
//               Manage your material procurement efficiently
//             </p>
//           </div>
//           {/* <div className="MaterialPurches-statsGrid">
//             <div className="MaterialPurches-statCard">
//               <div className="MaterialPurches-statNumber">
//                 {purchesOrders.length}
//               </div>
//               <div className="MaterialPurches-statLabel">Total Orders</div>
//             </div>
//             <div className="MaterialPurches-statCard">
//               <div className="MaterialPurches-statNumber">
//                 {
//                   purchesOrders.filter(
//                     (order) => order.orderItemStatus === "PENDING"
//                   ).length
//                 }
//               </div>
//               <div className="MaterialPurches-statLabel">Pending</div>
//             </div>
//             <div className="MaterialPurches-statCard">
//               <div className="MaterialPurches-statNumber">
//                 {
//                   purchesOrders.filter(
//                     (order) => order.orderItemStatus === "DELIVERED"
//                   ).length
//                 }
//               </div>
//               <div className="MaterialPurches-statLabel">Delivered</div>
//             </div>
//           </div> */}
//         </div>
//       </div>

//       {/* Enhanced Search and Action Section */}
//       <div className="MaterialPurches-headerSection">
//         <div className="MaterialPurches-searchContainer">
//           <div className="MaterialPurches-searchWrapper">
//             <svg
//               className="MaterialPurches-searchIcon"
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <circle
//                 cx="11"
//                 cy="11"
//                 r="8"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               />
//               <path
//                 d="m21 21-4.35-4.35"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by supplier and site name..."
//               className="MaterialPurches-searchBar"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <div className="print_button_material_purches">
//             <button
//               className="MaterialPurches-toggleFormButton"
//               onClick={handlePrintPurchesTable}
//             >
//               <svg
//                 className="MaterialPurches-buttonIcon"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <line
//                   x1="12"
//                   y1="5"
//                   x2="12"
//                   y2="19"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <line
//                   x1="5"
//                   y1="12"
//                   x2="19"
//                   y2="12"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//               </svg>
//               print
//             </button>
//             <button
//               className="MaterialPurches-toggleFormButton"
//               onClick={() => {
//                 resetForm();
//                 setShowForm(true);
//               }}
//             >
//               <svg
//                 className="MaterialPurches-buttonIcon"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <line
//                   x1="12"
//                   y1="5"
//                   x2="12"
//                   y2="19"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <line
//                   x1="5"
//                   y1="12"
//                   x2="19"
//                   y2="12"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//               </svg>
//               {isEditMode ? "Edit Purchase Order" : "Add Purchase Order"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Form Modal */}
//       {showForm && (
//         <div className="MaterialPurches-formOverlay">
//           <div className="MaterialPurches-formContainer">
//             <div className="MaterialPurches-formHeader">
//               <div className="MaterialPurches-formHeaderContent">
//                 <h2 className="MaterialPurches-formTitle">
//                   {isEditMode
//                     ? "Edit Purchase Order"
//                     : "Create New Purchase Order"}
//                 </h2>
//                 <p className="MaterialPurches-formSubtitle">
//                   {isEditMode
//                     ? "Update the purchase order details"
//                     : "Fill in the details to create a new order"}
//                 </p>
//               </div>
//               <button
//                 className="MaterialPurches-closeFormButton"
//                 onClick={resetForm}
//               >
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                   <line
//                     x1="18"
//                     y1="6"
//                     x2="6"
//                     y2="18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                   <line
//                     x1="6"
//                     y1="6"
//                     x2="18"
//                     y2="18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="MaterialPurches-form">
//               <div className="MaterialPurches-formGrid">
//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">
//                     <svg
//                       className="MaterialPurches-labelIcon"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <path
//                         d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <circle
//                         cx="12"
//                         cy="7"
//                         r="4"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     Supplier Name
//                   </label>
//                   <input
//                     type="text"
//                     className="MaterialPurches-input"
//                     value={supplierName}
//                     onChange={(e) => setSupplierName(e.target.value)}
//                     placeholder="Enter supplier name"
//                     required
//                   />
//                 </div>

//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">
//                     <svg
//                       className="MaterialPurches-labelIcon"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <path
//                         d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <circle
//                         cx="12"
//                         cy="10"
//                         r="3"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     Site Name
//                   </label>

//                   <select
//                     value={siteName}
//                     onChange={(e) => setSiteName(e.target.value)}
//                     className="MaterialPurches-input MaterialPurches-select"
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Site
//                     </option>
//                     {showSiteName.length > 0 ? (
//                       showSiteName.map((item, index) => (
//                         <option key={index} value={item.name}>
//                           {item.name}
//                         </option>
//                       ))
//                     ) : (
//                       <option disabled>No Site Found</option>
//                     )}
//                   </select>
//                 </div>

//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">
//                     <svg
//                       className="MaterialPurches-labelIcon"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <rect
//                         x="3"
//                         y="4"
//                         width="18"
//                         height="18"
//                         rx="2"
//                         ry="2"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="16"
//                         y1="2"
//                         x2="16"
//                         y2="6"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="8"
//                         y1="2"
//                         x2="8"
//                         y2="6"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="3"
//                         y1="10"
//                         x2="21"
//                         y2="10"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     Expected Date
//                   </label>
//                   <input
//                     type="date"
//                     className="MaterialPurches-input"
//                     value={expectDate}
//                     onChange={(e) => setExpectDate(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">
//                     <svg
//                       className="MaterialPurches-labelIcon"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <circle
//                         cx="12"
//                         cy="12"
//                         r="3"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M12 1v6m0 6v6"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     Status
//                   </label>
//                   <div className="MaterialPurches-selectWrapper">
//                     <select
//                       className="MaterialPurches-input MaterialPurches-select"
//                       value={orderItemStatus}
//                       onChange={(e) => setOrderItemStatus(e.target.value)}
//                       required
//                     >
//                       <option value="" disabled>
//                         Select Status
//                       </option>
//                       <option value="PENDING">Pending</option>
//                       <option value="DELIVERED">Delivered</option>
//                       <option value="CANCELLED">Cancelled</option>
//                     </select>
//                     <svg
//                       className="MaterialPurches-selectArrow"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <polyline
//                         points="6,9 12,15 18,9"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <div className="MaterialPurches-formGroup">
//                 <label className="MaterialPurches-label">
//                   <svg
//                     className="MaterialPurches-labelIcon"
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <polyline
//                       points="14,2 14,8 20,8"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <line
//                       x1="16"
//                       y1="13"
//                       x2="8"
//                       y2="13"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <line
//                       x1="16"
//                       y1="17"
//                       x2="8"
//                       y2="17"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                   Note
//                 </label>
//                 <textarea
//                   className="MaterialPurches-textarea"
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Add any additional notes..."
//                   rows={3}
//                   required
//                 />
//               </div>

//               {/* Enhanced Order Items Section */}
//               <div className="MaterialPurches-orderItemsSection">
//                 <div className="MaterialPurches-orderItemsHeader">
//                   <div className="MaterialPurches-orderItemsHeaderContent">
//                     <h3 className="MaterialPurches-orderItemsTitle">
//                       Order Items
//                     </h3>
//                     <span className="MaterialPurches-itemsCount">
//                       {orderItems.length} items
//                     </span>
//                   </div>
//                   <button
//                     type="button"
//                     className="MaterialPurches-addItemButton"
//                     onClick={addOrderItem}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <line
//                         x1="12"
//                         y1="5"
//                         x2="12"
//                         y2="19"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="5"
//                         y1="12"
//                         x2="19"
//                         y2="12"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     Add Item
//                   </button>
//                 </div>

//                 <div className="MaterialPurches-orderItemsList">
//                   {orderItems.map((item, index) => (
//                     <div key={index} className="MaterialPurches-orderItemCard">
//                       <div className="MaterialPurches-orderItemHeader">
//                         <span className="MaterialPurches-itemNumber">
//                           Item {index + 1}
//                         </span>
//                         {!isEditMode && orderItems.length > 1 && (
//                           <button
//                             type="button"
//                             className="MaterialPurches-removeItemButton"
//                             onClick={() => removeOrderItem(index)}
//                           >
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                             >
//                               <line
//                                 x1="18"
//                                 y1="6"
//                                 x2="6"
//                                 y2="18"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               />
//                               <line
//                                 x1="6"
//                                 y1="6"
//                                 x2="18"
//                                 y2="18"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               />
//                             </svg>
//                           </button>
//                         )}
//                       </div>
//                       <div className="MaterialPurches-orderItemRow">
//                         <div className="MaterialPurches-orderItemField">
//                           <label className="MaterialPurches-itemLabel">
//                             Material Name
//                           </label>
//                           <input
//                             type="text"
//                             className="MaterialPurches-itemInput"
//                             placeholder="Enter material name"
//                             value={item.materialName}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 index,
//                                 "materialName",
//                                 e.target.value
//                               )
//                             }
//                             required
//                           />
//                         </div>

//                         <div className="MaterialPurches-orderItemField">
//                           <label className="MaterialPurches-itemLabel">
//                             Quantity
//                           </label>
//                           <input
//                             type="number"
//                             className="MaterialPurches-itemInput"
//                             placeholder="0"
//                             value={item.orderQty}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 index,
//                                 "orderQty",
//                                 e.target.value
//                               )
//                             }
//                             required
//                           />
//                         </div>

//                         <div className="MaterialPurches-orderItemField">
//                           <label className="MaterialPurches-itemLabel">
//                             Unit Cost (₹)
//                           </label>
//                           <input
//                             type="number"
//                             className="MaterialPurches-itemInput"
//                             placeholder="0.00"
//                             value={item.unitCost}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 index,
//                                 "unitCost",
//                                 e.target.value
//                               )
//                             }
//                             required
//                           />
//                         </div>

//                         <div className="MaterialPurches-orderItemField">
//                           <label className="MaterialPurches-itemLabel">
//                             Total
//                           </label>
//                           <div className="MaterialPurches-itemTotal">
//                             ₹
//                             {(
//                               item.orderQty * item.unitCost || 0
//                             ).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Grand Total */}
//                 <div className="MaterialPurches-orderSummary">
//                   <div className="MaterialPurches-summaryRow">
//                     <span className="MaterialPurches-summaryLabel">
//                       Grand Total:
//                     </span>
//                     <span className="MaterialPurches-summaryValue">
//                       ₹{calculateGrandTotal(orderItems).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="MaterialPurches-formActions">
//                 <button
//                   type="button"
//                   className="MaterialPurches-cancelButton"
//                   onClick={resetForm}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="MaterialPurches-submitButton">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                     <polyline
//                       points="20,6 9,17 4,12"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                   {isEditMode ? "Update Order" : "Create Purchase Order"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Enhanced View Modal */}
//       {viewOrder && (
//         <div className="MaterialPurches-viewOverlay" ref={handleOrderprint}>
//           <div className="MaterialPurches-viewContainer">
//             <div className="MaterialPurches-viewHeader">
//               <div className="MaterialPurches-viewHeaderContent">
//                 <h2 className="MaterialPurches-viewTitle">
//                   Purchase Order Details
//                 </h2>
//                 <span className="MaterialPurches-viewSubtitle">
//                   Order #{viewOrder.poNumber}
//                 </span>
//               </div>
//               <button
//                 className="MaterialPurches-toggleFormButton"
//                 onClick={handleOrderItemPrint}
//               >
//                 + Print
//               </button>
//               <button
//                 className="MaterialPurches-closeViewButton"
//                 onClick={() => setViewOrder(null)}
//               >
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                   <line
//                     x1="18"
//                     y1="6"
//                     x2="6"
//                     y2="18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                   <line
//                     x1="6"
//                     y1="6"
//                     x2="18"
//                     y2="18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="MaterialPurches-purchaseOrderCard">
//               <div className="MaterialPurches-orderInfo">
//                 <div className="MaterialPurches-orderNumber">
//                   <div className="MaterialPurches-orderNumberContent">
//                     <span className="MaterialPurches-orderLabel">
//                       PO Number
//                     </span>
//                     <span className="MaterialPurches-orderValue">
//                       {viewOrder.poNumber}
//                     </span>
//                   </div>
//                   <span
//                     className={`MaterialPurches-statusBadge MaterialPurches-status-${viewOrder.orderItemStatus.toLowerCase()}`}
//                   >
//                     {viewOrder.orderItemStatus}
//                   </span>
//                 </div>

//                 <div className="MaterialPurches-orderDetails">
//                   <div className="MaterialPurches-orderDetail">
//                     <div className="MaterialPurches-detailIcon">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                         <circle
//                           cx="12"
//                           cy="7"
//                           r="4"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                     </div>
//                     <div className="MaterialPurches-detailContent">
//                       <span className="MaterialPurches-detailLabel">
//                         Supplier
//                       </span>
//                       <span className="MaterialPurches-detailValue">
//                         {viewOrder.supplierName}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="MaterialPurches-orderDetail">
//                     <div className="MaterialPurches-detailIcon">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                         <circle
//                           cx="12"
//                           cy="10"
//                           r="3"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                     </div>
//                     <div className="MaterialPurches-detailContent">
//                       <span className="MaterialPurches-detailLabel">Site</span>
//                       <span className="MaterialPurches-detailValue">
//                         {viewOrder.siteName}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="MaterialPurches-orderDetail">
//                     <div className="MaterialPurches-detailIcon">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <rect
//                           x="3"
//                           y="4"
//                           width="18"
//                           height="18"
//                           rx="2"
//                           ry="2"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                         <line
//                           x1="16"
//                           y1="2"
//                           x2="16"
//                           y2="6"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                         <line
//                           x1="8"
//                           y1="2"
//                           x2="8"
//                           y2="6"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                         <line
//                           x1="3"
//                           y1="10"
//                           x2="21"
//                           y2="10"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                     </div>
//                     <div className="MaterialPurches-detailContent">
//                       <span className="MaterialPurches-detailLabel">
//                         Expected Date
//                       </span>
//                       <span className="MaterialPurches-detailValue">
//                         {viewOrder.expectDate}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="MaterialPurches-orderNote">
//                   <div className="MaterialPurches-noteHeader">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path
//                         d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <polyline
//                         points="14,2 14,8 20,8"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     <span className="MaterialPurches-noteLabel">Note</span>
//                   </div>
//                   <p className="MaterialPurches-noteText">{viewOrder.note}</p>
//                 </div>
//               </div>

//               <div className="MaterialPurches-itemsSection">
//                 <div className="MaterialPurches-itemsSectionHeader">
//                   <h3 className="MaterialPurches-itemsTitle">Order Items</h3>
//                   <span className="MaterialPurches-itemsCount">
//                     {viewOrder.orderItems.length} items
//                   </span>
//                 </div>

//                 <div className="MaterialPurches-itemList">
//                   {viewOrder.orderItems.map((item, idx) => (
//                     <div key={idx} className="MaterialPurches-item">
//                       <div className="MaterialPurches-itemInfo">
//                         <div className="MaterialPurches-itemHeader">
//                           <div className="MaterialPurches-itemHeaderLeft">
//                             <span className="MaterialPurches-itemNumber">
//                               #{idx + 1}
//                             </span>
//                             <span className="MaterialPurches-itemName">
//                               {item.materialName}
//                             </span>
//                           </div>
//                           <div className="MaterialPurches-itemActions">
//                             {/* <p className="MaterialPurches-itemNumber">
//                               {item.orderItemStatus || "NA"}
//                             </p> */}

//                             {/* <select
//                               className={`MaterialPurches-statusSelect MaterialPurches-status-${order.orderItemStatus.toLowerCase()}`}
//                               value={order.orderItemStatus}
//                               onChange={(e) =>
//                                 handleStatusChange(order.id, e.target.value)
//                               }
//                             >
//                               <option value="PENDING">Pending</option>
//                               <option value="DELIVERED">Delivered</option>
//                               <option value="CANCELLED">Cancelled</option>
//                             </select> */}

//                             <select
//                               name=""
//                               id=""
//                               className={`MaterialPurches-statusSelect MaterialPurches-status-${item.orderItemStatus?.toLowerCase()}`}
//                               value={item.orderItemStatus}
//                               onChange={(e) =>
//                                 handleChangeOrderItemStatus(
//                                   item.id,
//                                   e.target.value
//                                 )
//                               }
//                             >
//                               <option value="PENDING">Pending</option>
//                               <option value="RECEIVED">Received</option>
//                             </select>

//                             {/* <button
//                               className="MaterialPurches-itemEditButton"
//                               onClick={() => handleEditOrderItem(idx, item)}
//                               title="Edit Item"
//                             >
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 />
//                                 <path
//                                   d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 />
//                               </svg>
//                             </button> */}
//                             <button
//                               className="MaterialPurches-itemDeleteButton"
//                               onClick={() => handleDeleteOrderItem(idx, item)}
//                               title="Delete Item"
//                             >
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <polyline
//                                   points="3,6 5,6 21,6"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 />
//                                 <path
//                                   d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 />
//                                 <line
//                                   x1="10"
//                                   y1="11"
//                                   x2="10"
//                                   y2="17"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 />
//                                 <line
//                                   x1="14"
//                                   y1="11"
//                                   x2="14"
//                                   y2="17"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                         <div className="MaterialPurches-itemDetails">
//                           <div className="MaterialPurches-itemDetailItem">
//                             <span className="MaterialPurches-itemDetailLabel">
//                               Qty:
//                             </span>
//                             <span className="MaterialPurches-itemDetailValue">
//                               {item.orderQty}
//                             </span>
//                           </div>
//                           <div className="MaterialPurches-itemDetailItem">
//                             <span className="MaterialPurches-itemDetailLabel">
//                               Unit Cost:
//                             </span>
//                             <span className="MaterialPurches-itemDetailValue">
//                               ₹{item.unitCost.toLocaleString()}
//                             </span>
//                           </div>
//                           <div className="MaterialPurches-itemDetailItem MaterialPurches-itemTotalAmount">
//                             <span className="MaterialPurches-itemDetailLabel">
//                               Total:
//                             </span>
//                             <span className="MaterialPurches-itemDetailValue">
//                               ₹{calculateItemTotal(item).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="MaterialPurches-grandTotal">
//                   <div className="MaterialPurches-grandTotalContent">
//                     <span className="MaterialPurches-grandTotalLabel">
//                       Grand Total
//                     </span>
//                     <span className="MaterialPurches-grandTotalAmount">
//                       ₹
//                       {calculateGrandTotal(
//                         viewOrder.orderItems
//                       ).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Table */}
//       <div className="MaterialPurches-tableContainer">
//         <div className="MaterialPurches-tableHeader">
//           <h2 className="MaterialPurches-tableTitle">Purchase Orders</h2>
//           <div className="MaterialPurches-tableStats">
//             <span className="MaterialPurches-tableStatsText">
//               Showing {filteredOrders.length} of {purchesOrders.length} orders
//             </span>
//           </div>
//         </div>

//         <div className="MaterialPurches-tableWrapper" ref={purchesOrderPrint}>
//           <table className="MaterialPurches-table">
//             <thead className="MaterialPurches-tableHead">
//               <tr className="MaterialPurches-tableRow">
//                 <th className="MaterialPurches-tableHeaderCell">PO Number</th>
//                 <th className="MaterialPurches-tableHeaderCell">Supplier</th>
//                 <th className="MaterialPurches-tableHeaderCell">Site</th>
//                 <th className="MaterialPurches-tableHeaderCell">
//                   Expected Date
//                 </th>
//                 <th className="MaterialPurches-tableHeaderCell">Status</th>
//                 <th className="MaterialPurches-tableHeaderCell">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="MaterialPurches-tableBody">
//               {filteredOrders.length > 0 ? (
//                 filteredOrders.map((order) => (
//                   <tr key={order.id} className="MaterialPurches-tableRow">
//                     <td className="MaterialPurches-tableCell">
//                       <div className="MaterialPurches-poNumberCell">
//                         <span className="MaterialPurches-poNumber">
//                           {order.poNumber}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       <div className="MaterialPurches-supplierCell">
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <path
//                             d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <circle
//                             cx="12"
//                             cy="7"
//                             r="4"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                         </svg>
//                         <span>{order.supplierName}</span>
//                       </div>
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       <div className="MaterialPurches-siteCell">
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <path
//                             d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <circle
//                             cx="12"
//                             cy="10"
//                             r="3"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                         </svg>
//                         <span>{order.siteName}</span>
//                       </div>
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       <div className="MaterialPurches-dateCell">
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <rect
//                             x="3"
//                             y="4"
//                             width="18"
//                             height="18"
//                             rx="2"
//                             ry="2"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <line
//                             x1="16"
//                             y1="2"
//                             x2="16"
//                             y2="6"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <line
//                             x1="8"
//                             y1="2"
//                             x2="8"
//                             y2="6"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <line
//                             x1="3"
//                             y1="10"
//                             x2="21"
//                             y2="10"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                         </svg>
//                         <span>{order.expectDate}</span>
//                       </div>
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       <div className="MaterialPurches-statusSelectWrapper">
//                         <select
//                           className={`MaterialPurches-statusSelect MaterialPurches-status-${order.orderItemStatus.toLowerCase()}`}
//                           value={order.orderItemStatus}
//                           onChange={(e) =>
//                             handleStatusChange(order.id, e.target.value)
//                           }
//                         >
//                           <option value="PENDING">Pending</option>
//                           <option value="DELIVERED">Delivered</option>
//                           <option value="CANCELLED">Cancelled</option>
//                         </select>
//                         <svg
//                           className="MaterialPurches-statusSelectArrow"
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <polyline
//                             points="6,9 12,15 18,9"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                         </svg>
//                       </div>
//                     </td>
//                     <td className="MaterialPurches-tableCell MaterialPurches-actionsCell">
//                       <div className="MaterialPurches-actionButtons">
//                         <button
//                           className="MaterialPurches-viewButton"
//                           onClick={() => handleView(order)}
//                           title="View Details"
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <path
//                               d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                             <circle
//                               cx="12"
//                               cy="12"
//                               r="3"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           className="MaterialPurches-editButton"
//                           onClick={() => handleEdit(order)}
//                           title="Edit Order"
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <path
//                               d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                             <path
//                               d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           className="MaterialPurches-deleteButton"
//                           onClick={() => handleDelete(order)}
//                           title="Delete Order"
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <polyline
//                               points="3,6 5,6 21,6"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                             <path
//                               d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                             <line
//                               x1="10"
//                               y1="11"
//                               x2="10"
//                               y2="17"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                             <line
//                               x1="14"
//                               y1="11"
//                               x2="14"
//                               y2="17"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr className="MaterialPurches-tableRow">
//                   <td
//                     className="MaterialPurches-tableCell MaterialPurches-noData"
//                     colSpan={6}
//                   >
//                     <div className="MaterialPurches-noDataContent">
//                       <div className="MaterialPurches-noDataIcon">
//                         <svg
//                           width="48"
//                           height="48"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <rect
//                             x="3"
//                             y="3"
//                             width="18"
//                             height="18"
//                             rx="2"
//                             ry="2"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <rect
//                             x="7"
//                             y="7"
//                             width="3"
//                             height="9"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                           <rect
//                             x="14"
//                             y="7"
//                             width="3"
//                             height="5"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           />
//                         </svg>
//                       </div>
//                       <div className="MaterialPurches-noDataText">
//                         <h3>No purchase orders found</h3>
//                         <p>
//                           Try adjusting your search criteria or create a new
//                           purchase order
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MaterialPurches;

"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./MaterialPurches.css";
import { useRef } from "react";

const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

function MaterialPurches() {
  const purchesOrderPrint = useRef();
  const handleOrderprint = useRef();
  const [supplierName, setSupplierName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [expectDate, setExpectDate] = useState("");
  const [note, setNote] = useState("");
  const [orderItemStatus, setOrderItemStatus] = useState("");
  const [orderItems, setOrderItems] = useState([
    { materialName: "", orderQty: "", unitCost: "" },
  ]);
  const [purchesOrders, setPurchesOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [showSiteName, setShowSiteName] = useState([]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] =
      field === "orderQty" || field === "unitCost" ? Number(value) : value;
    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { materialName: "", orderQty: 0, unitCost: 0 },
    ]);
  };

  const removeOrderItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  useEffect(() => {
    async function getAllSiteName() {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/show-AllProject`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setShowSiteName(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllSiteName();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      supplierName,
      siteName,
      expectDate,
      note,
      orderItemStatus,
      orderItems,
    };
    try {
      let response;
      if (isEditMode && editId) {
        response = await axiosInstance.put(
          `${BASE_URL}/purchase-orders/${editId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Order Updated Successfully");
      } else {
        response = await axiosInstance.post(
          `${BASE_URL}/purchase-orders`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Order Added Successfully");
      }
      resetForm();
      getPurchesOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setSupplierName("");
    setSiteName("");
    setExpectDate("");
    setNote("");
    setOrderItemStatus("");
    setOrderItems([{ materialName: "", orderQty: "", unitCost: "" }]);
    setShowForm(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (order) => {
    console.log(order);
    setSupplierName(order.supplierName);
    setSiteName(order.siteName);
    setExpectDate(order.expectDate);
    setNote(order.note);
    setOrderItemStatus(order.orderItemStatus);
    setOrderItems(order.orderItems);
    setIsEditMode(true);
    setEditId(order.id);
    setShowForm(true);
  };

  const handleDelete = async (order) => {
    const status = order.orderItemStatus;
    if (status === "DELIVERED") {
      alert("Cannot delete a delivered order");
      return;
    }
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axiosInstance.delete(`${BASE_URL}/purchase-orders/${order.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Delete Order Successfully");
        getPurchesOrder();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleView = (order) => {
    setViewOrder(order);
  };

  const handleDeleteOrderItem = async (itemIndex, item) => {
    if (
      window.confirm(`Are you sure you want to delete ${item.materialName}?`)
    ) {
      try {
        await axiosInstance.delete(
          `${BASE_URL}/purchase-orders/orderItemDelete/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Delete Order Item Successfully");
        getPurchesOrder();
        const updatedOrder = purchesOrders.find(
          (order) => order.id === viewOrder.id
        );
        if (updatedOrder) {
          const updatedItems = updatedOrder.orderItems.filter(
            (orderItem) => orderItem.id !== item.id
          );
          setViewOrder({ ...updatedOrder, orderItems: updatedItems });
        }
      } catch (error) {
        console.error("Error deleting order item:", error);
        alert("Failed to delete order item");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to change the status to ${newStatus}?`
      )
    ) {
      try {
        await axiosInstance.post(
          `${BASE_URL}/purchase-orders/updatePurchaseOrderStatus/${id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Status Updated Successfully");
        getPurchesOrder();
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status");
      }
    }
  };

  async function getPurchesOrder() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/purchase-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const sortedOrders = res.data.sort((a, b) => b.id - a.id);
      res.data = sortedOrders;
      console.log(res);
      setPurchesOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPurchesOrder();
  }, []);

  const filteredOrders = purchesOrders.filter(
    (order) =>
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.siteName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateItemTotal = (item) => item.orderQty * item.unitCost;
  const calculateGrandTotal = (items) =>
    items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  function handlePrintPurchesTable() {
    const printContents = purchesOrderPrint.current.innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Purchase Orders</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
           .MaterialPurches-actionsCell,
        .MaterialPurches-tableHeaderCell:nth-child(6) {
          display: none !important;
        }
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
  }

  const handleOrderItemPrint = () => {
    const printContent = handleOrderprint.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Purchase Order</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 30px; }
            .print-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .print-subtitle { font-size: 16px; color: #666; }
            .order-info { margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
            .info-item { display: flex; }
            .info-label { font-weight: bold; margin-right: 10px; min-width: 120px; }
            .info-value { flex: 1; }
            .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-delivered { background: #d1ecf1; color: #0c5460; }
            .status-cancelled { background: #f8d7da; color: #721c24; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f8f9fa; font-weight: bold; }
            .total-row { background-color: #e9ecef; font-weight: bold; }
            .note-section { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; }
            .note-title { font-weight: bold; margin-bottom: 10px; }
            .print-actions { display: none; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  async function handleChangeOrderItemStatus(id, status) {
    if (
      window.confirm(`Are you sure you want to change the status to ${status}?`)
    ) {
      try {
        await axiosInstance.post(
          `${BASE_URL}/purchase-orders/updateOrderItemStatus/${id}`,
          { status: status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Status Updated Successfully");
        const response = await axiosInstance.get(
          `${BASE_URL}/purchase-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPurchesOrders(response.data);
        const updatedOrder = response.data.find(
          (order) => order.id === viewOrder.id
        );
        if (updatedOrder) {
          setViewOrder(updatedOrder);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status");
      }
    }
  }

  return (
    <div className="MaterialPurches-container">
      {/* Enhanced Header with Stats */}
      <div className="MaterialPurches-header">
        <div className="MaterialPurches-headerContent">
          <div className="MaterialPurches-headerText">
            <h1 className="MaterialPurches-title">Material Purchase Orders</h1>
            <p className="MaterialPurches-subtitle">
              Manage your material procurement efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Action Section */}
      <div className="MaterialPurches-headerSection">
        <div className="MaterialPurches-searchContainer">
          <div className="MaterialPurches-searchWrapper">
            <svg
              className="MaterialPurches-searchIcon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by supplier and site name..."
              className="MaterialPurches-searchBar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="print_button_material_purches">
            <button
              className="MaterialPurches-toggleFormButton"
              onClick={handlePrintPurchesTable}
            >
              <svg
                className="MaterialPurches-buttonIcon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Print
            </button>
            <button
              className="MaterialPurches-toggleFormButton"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <svg
                className="MaterialPurches-buttonIcon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {isEditMode ? "Edit Purchase Order" : "Add Purchase Order"}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Form Modal */}
      {showForm && (
        <div className="MaterialPurches-formOverlay">
          <div className="MaterialPurches-formContainer">
            <div className="MaterialPurches-formHeader">
              <div className="MaterialPurches-formHeaderContent">
                <h2 className="MaterialPurches-formTitle">
                  {isEditMode
                    ? "Edit Purchase Order"
                    : "Create New Purchase Order"}
                </h2>
                <p className="MaterialPurches-formSubtitle">
                  {isEditMode
                    ? "Update the purchase order details"
                    : "Fill in the details to create a new order"}
                </p>
              </div>
              <button
                className="MaterialPurches-closeFormButton"
                onClick={resetForm}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="MaterialPurches-form">
              <div className="MaterialPurches-formGrid">
                <div className="MaterialPurches-formGroup">
                  <label className="MaterialPurches-label">
                    <svg
                      className="MaterialPurches-labelIcon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    className="MaterialPurches-input"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Enter supplier name"
                    required
                  />
                </div>
                <div className="MaterialPurches-formGroup">
                  <label className="MaterialPurches-label">
                    <svg
                      className="MaterialPurches-labelIcon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Site Name
                  </label>
                  <select
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="MaterialPurches-input MaterialPurches-select"
                    required
                  >
                    <option value="" disabled>
                      Select Site
                    </option>
                    {showSiteName.length > 0 ? (
                      showSiteName.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Site Found</option>
                    )}
                  </select>
                </div>
                <div className="MaterialPurches-formGroup">
                  <label className="MaterialPurches-label">
                    <svg
                      className="MaterialPurches-labelIcon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="8"
                        y1="2"
                        x2="8"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="3"
                        y1="10"
                        x2="21"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Expected Date
                  </label>
                  <input
                    type="date"
                    className="MaterialPurches-input"
                    value={expectDate}
                    onChange={(e) => setExpectDate(e.target.value)}
                    required
                  />
                </div>
                <div className="MaterialPurches-formGroup">
                  <label className="MaterialPurches-label">
                    <svg
                      className="MaterialPurches-labelIcon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 1v6m0 6v6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Status
                  </label>
                  <div className="MaterialPurches-selectWrapper">
                    <select
                      className="MaterialPurches-input MaterialPurches-select"
                      value={orderItemStatus}
                      onChange={(e) => setOrderItemStatus(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="PENDING">Pending</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <svg
                      className="MaterialPurches-selectArrow"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <polyline
                        points="6,9 12,15 18,9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="MaterialPurches-formGroup">
                <label className="MaterialPurches-label">
                  <svg
                    className="MaterialPurches-labelIcon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="14,2 14,8 20,8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="16"
                      y1="13"
                      x2="8"
                      y2="13"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="16"
                      y1="17"
                      x2="8"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Note
                </label>
                <textarea
                  className="MaterialPurches-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  required
                />
              </div>

              {/* Enhanced Order Items Section */}
              <div className="MaterialPurches-orderItemsSection">
                <div className="MaterialPurches-orderItemsHeader">
                  <div className="MaterialPurches-orderItemsHeaderContent">
                    <h3 className="MaterialPurches-orderItemsTitle">
                      Order Items
                    </h3>
                    <span className="MaterialPurches-itemsCount">
                      {orderItems.length} items
                    </span>
                  </div>
                  <button
                    type="button"
                    className="MaterialPurches-addItemButton"
                    onClick={addOrderItem}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <line
                        x1="12"
                        y1="5"
                        x2="12"
                        y2="19"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Add Item
                  </button>
                </div>
                <div className="MaterialPurches-orderItemsList">
                  {orderItems.map((item, index) => (
                    <div key={index} className="MaterialPurches-orderItemCard">
                      <div className="MaterialPurches-orderItemHeader">
                        {/* <span className="MaterialPurches-itemNumber">
                          Item {index + 1}
                        </span> */}
                        {!isEditMode && orderItems.length > 1 && (
                          <button
                            type="button"
                            className="MaterialPurches-removeItemButton"
                            onClick={() => removeOrderItem(index)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <line
                                x1="18"
                                y1="6"
                                x2="6"
                                y2="18"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="6"
                                y1="6"
                                x2="18"
                                y2="18"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="MaterialPurches-orderItemRow">
                        <div className="MaterialPurches-orderItemField">
                          <label className="MaterialPurches-itemLabel">
                            Material Name
                          </label>
                          <input
                            type="text"
                            className="MaterialPurches-itemInput"
                            placeholder="Enter material name"
                            value={item.materialName}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "materialName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="MaterialPurches-orderItemField">
                          <label className="MaterialPurches-itemLabel">
                            Quantity
                          </label>
                          <input
                            type="number"
                            className="MaterialPurches-itemInput"
                            placeholder="0"
                            value={item.orderQty}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "orderQty",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="MaterialPurches-orderItemField">
                          <label className="MaterialPurches-itemLabel">
                            Unit Cost (₹)
                          </label>
                          <input
                            type="number"
                            className="MaterialPurches-itemInput"
                            placeholder="0.00"
                            value={item.unitCost}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "unitCost",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="MaterialPurches-orderItemField">
                          <label className="MaterialPurches-itemLabel">
                            Total
                          </label>
                          <div className="MaterialPurches-itemTotal">
                            ₹
                            {(
                              item.orderQty * item.unitCost || 0
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Grand Total */}
                <div className="MaterialPurches-orderSummary">
                  <div className="MaterialPurches-summaryRow">
                    <span className="MaterialPurches-summaryLabel">
                      Grand Total:
                    </span>
                    <span className="MaterialPurches-summaryValue">
                      ₹{calculateGrandTotal(orderItems).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="MaterialPurches-formActions">
                <button
                  type="button"
                  className="MaterialPurches-cancelButton"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="MaterialPurches-submitButton">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline
                      points="20,6 9,17 4,12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {isEditMode ? "Update Order" : "Create Purchase Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redesigned Simple View Modal */}
      {viewOrder && (
        <div className="MaterialPurches-viewOverlay">
          <div className="MaterialPurches-viewContainer" ref={handleOrderprint}>
            <div className="MaterialPurches-viewHeader">
              <div className="print-header">
                <h2 className="print-title">Purchase Order Details</h2>
                <p className="print-subtitle">Order #{viewOrder.poNumber}</p>
              </div>
              <div className="print-actions">
                <button
                  className="MaterialPurches-printButton"
                  onClick={handleOrderItemPrint}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Print
                </button>
                <button
                  className="MaterialPurches-closeViewButton"
                  onClick={() => setViewOrder(null)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <line
                      x1="18"
                      y1="6"
                      x2="6"
                      y2="18"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="6"
                      y1="6"
                      x2="18"
                      y2="18"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="MaterialPurches-viewContent">
              {/* Order Information */}
              <div className="order-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">PO Number:</span>
                    <span className="info-value">{viewOrder.poNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span
                      className={`status-badge status-${viewOrder.orderItemStatus.toLowerCase()}`}
                    >
                      {viewOrder.orderItemStatus}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Supplier:</span>
                    <span className="info-value">{viewOrder.supplierName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Site:</span>
                    <span className="info-value">{viewOrder.siteName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expected Date:</span>
                    <span className="info-value">{viewOrder.expectDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Items:</span>
                    <span className="info-value">
                      {viewOrder.orderItems.length}
                    </span>
                  </div>
                </div>

                {viewOrder.note && (
                  <div className="note-section">
                    <div className="note-title">Note:</div>
                    <div className="note-content">{viewOrder.note}</div>
                  </div>
                )}
              </div>

              {/* Order Items Table */}
              <div className="MaterialPurches-itemsTableSection">
                <h3 className="MaterialPurches-itemsTableTitle">Order Items</h3>
                <div className="MaterialPurches-itemsTableWrapper">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Material Name</th>
                        <th>Quantity</th>
                        <th>Unit Cost (₹)</th>
                        <th>Total (₹)</th>
                        <th>Status</th>
                        <th className="print-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewOrder.orderItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="MaterialPurches-materialName">
                            {item.materialName}
                          </td>
                          <td>{item.orderQty}</td>
                          <td>₹{item.unitCost.toLocaleString()}</td>
                          <td>₹{calculateItemTotal(item).toLocaleString()}</td>
                          <td>
                            <select
                              className={`MaterialPurches-itemStatusSelect status-${item.orderItemStatus?.toLowerCase()}`}
                              value={item.orderItemStatus || "PENDING"}
                              onChange={(e) =>
                                handleChangeOrderItemStatus(
                                  item.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="PENDING">Pending</option>
                              <option value="RECEIVED">Received</option>
                            </select>
                          </td>
                          <td className="print-actions">
                            <button
                              className="MaterialPurches-itemDeleteButton"
                              onClick={() => handleDeleteOrderItem(idx, item)}
                              title="Delete Item"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <polyline
                                  points="3,6 5,6 21,6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td
                          colSpan="4"
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          Grand Total:
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          ₹
                          {calculateGrandTotal(
                            viewOrder.orderItems
                          ).toLocaleString()}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Table */}
      <div className="MaterialPurches-tableContainer">
        <div className="MaterialPurches-tableHeader">
          <h2 className="MaterialPurches-tableTitle">Purchase Orders</h2>
          <div className="MaterialPurches-tableStats">
            <span className="MaterialPurches-tableStatsText">
              Showing {filteredOrders.length} of {purchesOrders.length} orders
            </span>
          </div>
        </div>
        <div className="MaterialPurches-tableWrapper" ref={purchesOrderPrint}>
          <table className="MaterialPurches-table">
            <thead className="MaterialPurches-tableHead">
              <tr className="MaterialPurches-tableRow">
                <th className="MaterialPurches-tableHeaderCell">PO Number</th>
                <th className="MaterialPurches-tableHeaderCell">Supplier</th>
                <th className="MaterialPurches-tableHeaderCell">Site</th>
                <th className="MaterialPurches-tableHeaderCell">
                  Expected Date
                </th>
                <th className="MaterialPurches-tableHeaderCell">Status</th>
                <th className="MaterialPurches-tableHeaderCell">Actions</th>
              </tr>
            </thead>
            <tbody className="MaterialPurches-tableBody">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="MaterialPurches-tableRow">
                    <td className="MaterialPurches-tableCell">
                      <div className="MaterialPurches-poNumberCell">
                        <span className="MaterialPurches-poNumber">
                          {order.poNumber}
                        </span>
                      </div>
                    </td>
                    <td className="MaterialPurches-tableCell">
                      <div className="MaterialPurches-supplierCell">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <span>{order.supplierName}</span>
                      </div>
                    </td>
                    <td className="MaterialPurches-tableCell">
                      <div className="MaterialPurches-siteCell">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="10"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <span>{order.siteName}</span>
                      </div>
                    </td>
                    <td className="MaterialPurches-tableCell">
                      <div className="MaterialPurches-dateCell">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="16"
                            y1="2"
                            x2="16"
                            y2="6"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="8"
                            y1="2"
                            x2="8"
                            y2="6"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="3"
                            y1="10"
                            x2="21"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        <span>{order.expectDate}</span>
                      </div>
                    </td>
                    <td className="MaterialPurches-tableCell">
                      <div className="MaterialPurches-statusSelectWrapper">
                        <select
                          className={`MaterialPurches-statusSelect MaterialPurches-status-${order.orderItemStatus.toLowerCase()}`}
                          value={order.orderItemStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <svg
                          className="MaterialPurches-statusSelectArrow"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <polyline
                            points="6,9 12,15 18,9"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="MaterialPurches-tableCell MaterialPurches-actionsCell">
                      <div className="MaterialPurches-actionButtons">
                        <button
                          className="MaterialPurches-viewButton"
                          onClick={() => handleView(order)}
                          title="View Details"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                        <button
                          className="MaterialPurches-editButton"
                          onClick={() => handleEdit(order)}
                          title="Edit Order"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                        <button
                          className="MaterialPurches-deleteButton"
                          onClick={() => handleDelete(order)}
                          title="Delete Order"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <polyline
                              points="3,6 5,6 21,6"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <line
                              x1="10"
                              y1="11"
                              x2="10"
                              y2="17"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <line
                              x1="14"
                              y1="11"
                              x2="14"
                              y2="17"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="MaterialPurches-tableRow">
                  <td
                    className="MaterialPurches-tableCell MaterialPurches-noData"
                    colSpan={6}
                  >
                    <div className="MaterialPurches-noDataContent">
                      <div className="MaterialPurches-noDataIcon">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <rect
                            x="7"
                            y="7"
                            width="3"
                            height="9"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <rect
                            x="14"
                            y="7"
                            width="3"
                            height="5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="MaterialPurches-noDataText">
                        <h3>No purchase orders found</h3>
                        <p>
                          Try adjusting your search criteria or create a new
                          purchase order
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MaterialPurches;
