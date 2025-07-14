// // import { useEffect, useState } from "react";
// // import axiosInstance from "../../utils/axiosInstance";
// // import { BASE_URL } from "../../config";
// // import "./MaterialPurches.css";
// // const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

// // function MaterialPurches() {
// //   const [supplierName, setSupplierName] = useState("");
// //   const [siteName, setSiteName] = useState("");
// //   const [expectDate, setExpectDate] = useState("");
// //   const [note, setNote] = useState("");
// //   const [orderItems, setOrderItems] = useState([
// //     { materialName: "", orderQty: "", unitCost: "" },
// //   ]);
// //   const [purchesOrders, setPurchesOrders] = useState([]);

// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [showForm, setShowForm] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [editId, setEditId] = useState(null);
// //   console.log(editId);
// //   const [viewOrder, setViewOrder] = useState(null);

// //   const handleItemChange = (index, field, value) => {
// //     const updatedItems = [...orderItems];
// //     updatedItems[index][field] =
// //       field === "orderQty" || field === "unitCost" ? Number(value) : value;
// //     setOrderItems(updatedItems);
// //   };

// //   const addOrderItem = () => {
// //     setOrderItems([
// //       ...orderItems,
// //       { materialName: "", orderQty: 0, unitCost: 0 },
// //     ]);
// //   };

// //   const removeOrderItem = (index) => {
// //     const updatedItems = [...orderItems];
// //     updatedItems.splice(index, 1);
// //     setOrderItems(updatedItems);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const body = {
// //       supplierName,
// //       siteName,
// //       expectDate,
// //       note,
// //       orderItems,
// //     };

// //     try {
// //       let response;
// //       if (isEditMode && editId) {
// //         response = await axiosInstance.put(
// //           `${BASE_URL}/purchase-orders/${editId}`,
// //           body,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               "Content-Type": "application/json",
// //             },
// //           }
// //         );
// //         alert("Order Updated Successfully");
// //       } else {
// //         response = await axiosInstance.post(
// //           `${BASE_URL}/purchase-orders`,
// //           body,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               "Content-Type": "application/json",
// //             },
// //           }
// //         );
// //         alert("Order Added Successfully");
// //       }

// //       resetForm();
// //       getPurchesOrder();
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const resetForm = () => {
// //     setSupplierName("");
// //     setSiteName("");
// //     setExpectDate("");
// //     setNote("");
// //     setOrderItems([{ materialName: "", orderQty: "", unitCost: "" }]);
// //     setShowForm(false);
// //     setIsEditMode(false);
// //     setEditId(null);
// //   };

// //   const handleEdit = (order) => {
// //     setSupplierName(order.supplierName);
// //     setSiteName(order.siteName);
// //     setExpectDate(order.expectDate);
// //     setNote(order.note);
// //     setOrderItems(order.orderItems);
// //     setIsEditMode(true);
// //     setEditId(order.id);
// //     setShowForm(true);
// //   };

// //   const handleDelete = async (id) => {
// //     alert(id);
// //     if (window.confirm("Are you sure you want to delete this order?")) {
// //       try {
// //         await axiosInstance.delete(`${BASE_URL}/purchase-orders/${id}`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });
// //         alert("Delete Order Successfully");
// //         getPurchesOrder();
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     }
// //   };

// //   const handleView = (order) => {
// //     setViewOrder(order);
// //   };

// //   async function getPurchesOrder() {
// //     try {
// //       const res = await axiosInstance.get(`${BASE_URL}/purchase-orders`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });
// //       console.log(res);
// //       setPurchesOrders(res.data);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   }

// //   useEffect(() => {
// //     getPurchesOrder();
// //   }, []);

// //   const filteredOrders = purchesOrders.filter((order) =>
// //     order.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   const calculateItemTotal = (item) => item.orderQty * item.unitCost;
// //   const calculateGrandTotal = (items) =>
// //     items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

// //   return (
// //     <>
// //       <div className="MaterialPurches-headerSection">
// //         <input
// //           type="text"
// //           placeholder="Search by supplier..."
// //           className="MaterialPurches-searchBar"
// //           value={searchQuery}
// //           onChange={(e) => setSearchQuery(e.target.value)}
// //         />
// //         <button
// //           className="MaterialPurches-toggleFormButton"
// //           onClick={() => {
// //             resetForm();
// //             setShowForm(true);
// //           }}
// //         >
// //           {isEditMode ? "Edit Purchase Order" : "Add Purchase Order"}
// //         </button>
// //       </div>

// //       {showForm && (
// //         <form onSubmit={handleSubmit} className="MaterialPurches-form">
// //           <div className="MaterialPurches-formGroup">
// //             <label>Supplier Name:</label>
// //             <input
// //               type="text"
// //               value={supplierName}
// //               onChange={(e) => setSupplierName(e.target.value)}
// //               required
// //             />
// //           </div>

// //           <div className="MaterialPurches-formGroup">
// //             <label>Site Name:</label>
// //             <input
// //               type="text"
// //               value={siteName}
// //               onChange={(e) => setSiteName(e.target.value)}
// //               required
// //             />
// //           </div>

// //           <div className="MaterialPurches-formGroup">
// //             <label>Expected Date:</label>
// //             <input
// //               type="date"
// //               value={expectDate}
// //               onChange={(e) => setExpectDate(e.target.value)}
// //               required
// //             />
// //           </div>

// //           <div className="MaterialPurches-formGroup">
// //             <label>Note:</label>
// //             <textarea
// //               value={note}
// //               onChange={(e) => setNote(e.target.value)}
// //               required
// //             ></textarea>
// //           </div>

// //           <div className="MaterialPurches-orderItemsSection">
// //             <h4>Order Items</h4>
// //             {orderItems.map((item, index) => (
// //               <div key={index} className="MaterialPurches-orderItemRow">
// //                 <input
// //                   type="text"
// //                   placeholder="Material Name"
// //                   value={item.materialName}
// //                   onChange={(e) =>
// //                     handleItemChange(index, "materialName", e.target.value)
// //                   }
// //                   required
// //                 />
// //                 <input
// //                   type="number"
// //                   placeholder="Qty"
// //                   value={item.orderQty}
// //                   onChange={(e) =>
// //                     handleItemChange(index, "orderQty", e.target.value)
// //                   }
// //                   required
// //                 />
// //                 <input
// //                   type="number"
// //                   placeholder="Unit Cost"
// //                   value={item.unitCost}
// //                   onChange={(e) =>
// //                     handleItemChange(index, "unitCost", e.target.value)
// //                   }
// //                   required
// //                 />
// //                 {orderItems.length > 1 && (
// //                   <button
// //                     type="button"
// //                     className="MaterialPurches-removeItemButton"
// //                     onClick={() => removeOrderItem(index)}
// //                   >
// //                     Remove
// //                   </button>
// //                 )}
// //               </div>
// //             ))}
// //             <button
// //               type="button"
// //               className="MaterialPurches-addItemButton"
// //               onClick={addOrderItem}
// //             >
// //               Add Item
// //             </button>
// //           </div>

// //           <button type="submit" className="MaterialPurches-submitButton">
// //             {isEditMode ? "Update Order" : "Submit Purchase Order"}
// //           </button>
// //           <button
// //             type="button"
// //             className="MaterialPurches-cancelButton"
// //             onClick={resetForm}
// //           >
// //             Cancel
// //           </button>
// //         </form>
// //       )}

// //       {viewOrder && (
// //         <div className="MaterialPurches-purchaseOrderCard">
// //           <h3>Purchase Order: {viewOrder.poNumber}</h3>
// //           <p>
// //             <strong>Supplier:</strong> {viewOrder.supplierName}
// //           </p>
// //           <p>
// //             <strong>Site:</strong> {viewOrder.siteName}
// //           </p>
// //           <p>
// //             <strong>Date:</strong> {viewOrder.expectDate}
// //           </p>
// //           <p>
// //             <strong>Note:</strong> {viewOrder.note}
// //           </p>
// //           <p>
// //             <strong>Status:</strong> {viewOrder.orderItemStatus}
// //           </p>
// //           <h4>Items:</h4>
// //           <ul className="MaterialPurches-itemList">
// //             {viewOrder.orderItems.map((item, idx) => (
// //               <li key={idx} className="MaterialPurches-item">
// //                 {item.materialName} - Qty: {item.orderQty}, Unit Cost: ₹
// //                 {item.unitCost}, tOTAL: ₹{calculateItemTotal(item)}
// //               </li>
// //             ))}
// //           </ul>
// //           <h4>Grand Total: ₹{calculateGrandTotal(viewOrder.orderItems)}</h4>
// //           <button
// //             className="MaterialPurches-closeButton"
// //             onClick={() => setViewOrder(null)}
// //           >
// //             Close
// //           </button>
// //         </div>
// //       )}

// //       <table className="MaterialPurches-table">
// //         <thead className="MaterialPurches-tableHead">
// //           <tr className="MaterialPurches-tableRow">
// //             <th className="MaterialPurches-tableHeader">PO Number</th>
// //             <th className="MaterialPurches-tableHeader">Supplier</th>
// //             <th className="MaterialPurches-tableHeader">Site</th>
// //             <th className="MaterialPurches-tableHeader">Expected Date</th>
// //             <th className="MaterialPurches-tableHeader">Status</th>
// //             <th className="MaterialPurches-tableHeader">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody className="MaterialPurches-tableBody">
// //           {filteredOrders.length > 0 ? (
// //             filteredOrders.map((order) => (
// //               <tr key={order.id} className="MaterialPurches-tableRow">
// //                 <td className="MaterialPurches-tableCell">{order.poNumber}</td>
// //                 <td className="MaterialPurches-tableCell">
// //                   {order.supplierName}
// //                 </td>
// //                 <td className="MaterialPurches-tableCell">{order.siteName}</td>
// //                 <td className="MaterialPurches-tableCell">
// //                   {order.expectDate}
// //                 </td>
// //                 <td className="MaterialPurches-tableCell">
// //                   {order.orderItemStatus}
// //                 </td>
// //                 <td className="MaterialPurches-tableCell MaterialPurches-actionsCell">
// //                   <button
// //                     className="MaterialPurches-viewButton"
// //                     onClick={() => handleView(order)}
// //                   >
// //                     View
// //                   </button>
// //                   <button
// //                     className="MaterialPurches-editButton"
// //                     onClick={() => handleEdit(order)}
// //                   >
// //                     Edit
// //                   </button>
// //                   <button
// //                     className="MaterialPurches-deleteButton"
// //                     onClick={() => handleDelete(order.id)}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))
// //           ) : (
// //             <tr className="MaterialPurches-tableRow">
// //               <td className="MaterialPurches-tableCell" colSpan="6">
// //                 No Material Found
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </>
// //   );
// // }

// // export default MaterialPurches;

// import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";
// import "./MaterialPurches.css";

// const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

// function MaterialPurches() {
//   const [supplierName, setSupplierName] = useState("");
//   const [siteName, setSiteName] = useState("");
//   const [expectDate, setExpectDate] = useState("");
//   const [note, setNote] = useState("");
//   const [DeliveredStatus, setDeliveredStatus] = useState("");
//   const [orderItems, setOrderItems] = useState([
//     { materialName: "", orderQty: "", unitCost: "" },
//   ]);
//   const [purchesOrders, setPurchesOrders] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [viewOrder, setViewOrder] = useState(null);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = {
//       supplierName,
//       siteName,
//       expectDate,
//       note,
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
//     setOrderItems(order.orderItems);
//     setIsEditMode(true);
//     setEditId(order.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       try {
//         await axiosInstance.delete(`${BASE_URL}/purchase-orders/${id}`, {
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

//   // New functions for individual order item edit/delete
//   const handleEditOrderItem = (itemIndex, item) => {
//     // You can implement edit functionality for individual items here
//     console.log("Edit item:", itemIndex, item);
//     // For now, just showing an alert - you can implement your logic
//     alert(`Edit item: ${item.materialName}`);
//   };

//   const handleDeleteOrderItem = async (itemIndex, item) => {
//     if (
//       window.confirm(`Are you sure you want to delete ${item.materialName}?`)
//     ) {
//       // You can implement delete functionality for individual items here
//       console.log("Delete item:", itemIndex, item);
//       // For now, just showing an alert - you can implement your logic
//       alert(`Delete item: ${item.materialName}`);
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

//   return (
//     <div className="MaterialPurches-container">
//       <div className="MaterialPurches-header">
//         <div className="MaterialPurches-headerContent">
//           <h1 className="MaterialPurches-title">Material Purchase Orders</h1>
//           <p className="MaterialPurches-subtitle">
//             Manage your material procurement efficiently
//           </p>
//         </div>
//       </div>

//       <div className="MaterialPurches-headerSection">
//         <div className="MaterialPurches-searchContainer">
//           <input
//             type="text"
//             placeholder="Search by supplier and Site Name..."
//             className="MaterialPurches-searchBar"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button
//           className="MaterialPurches-toggleFormButton"
//           onClick={() => {
//             resetForm();
//             setShowForm(true);
//           }}
//         >
//           <span className="MaterialPurches-buttonIcon">+</span>
//           {isEditMode ? "Edit Purchase Order" : "Add Purchase Order"}
//         </button>
//       </div>

//       {showForm && (
//         <div className="MaterialPurches-formOverlay">
//           <div className="MaterialPurches-formContainer">
//             <div className="MaterialPurches-formHeader">
//               <h2 className="MaterialPurches-formTitle">
//                 {isEditMode
//                   ? "Edit Purchase Order"
//                   : "Create New Purchase Order"}
//               </h2>
//               <button
//                 className="MaterialPurches-closeFormButton"
//                 onClick={resetForm}
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="MaterialPurches-form">
//               <div className="MaterialPurches-formGrid">
//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">Supplier Name</label>
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
//                   <label className="MaterialPurches-label">Site Name</label>
//                   <input
//                     type="text"
//                     className="MaterialPurches-input"
//                     value={siteName}
//                     onChange={(e) => setSiteName(e.target.value)}
//                     placeholder="Enter site name"
//                     required
//                   />
//                 </div>

//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">Expected Date</label>
//                   <input
//                     type="date"
//                     className="MaterialPurches-input"
//                     value={expectDate}
//                     onChange={(e) => setExpectDate(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="MaterialPurches-formGroup">
//                 <label className="MaterialPurches-label">Note</label>
//                 <textarea
//                   className="MaterialPurches-textarea"
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Add any additional notes..."
//                   rows={3}
//                   required
//                 />
//               </div>

//               <div className="MaterialPurches-orderItemsSection">
//                 <div className="MaterialPurches-orderItemsHeader">
//                   <h3 className="MaterialPurches-orderItemsTitle">
//                     Order Items
//                   </h3>
//                   <button
//                     type="button"
//                     className="MaterialPurches-addItemButton"
//                     onClick={addOrderItem}
//                   >
//                     + Add Item
//                   </button>
//                 </div>

//                 <div className="MaterialPurches-orderItemsList">
//                   {orderItems.map((item, index) => (
//                     <div key={index} className="MaterialPurches-orderItemCard">
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

//                         {isEditMode
//                           ? ""
//                           : orderItems.length > 1 && (
//                               <button
//                                 type="button"
//                                 className="MaterialPurches-removeItemButton"
//                                 onClick={() => removeOrderItem(index)}
//                               >
//                                 ×
//                               </button>
//                             )}
//                       </div>
//                     </div>
//                   ))}
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
//                   {isEditMode ? "Update Order" : "Create Purchase Order"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {viewOrder && (
//         <div className="MaterialPurches-viewOverlay">
//           <div className="MaterialPurches-viewContainer">
//             <div className="MaterialPurches-viewHeader">
//               <h2 className="MaterialPurches-viewTitle">
//                 Purchase Order Details
//               </h2>
//               <button
//                 className="MaterialPurches-closeViewButton"
//                 onClick={() => setViewOrder(null)}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="MaterialPurches-purchaseOrderCard">
//               <div className="MaterialPurches-orderInfo">
//                 <div className="MaterialPurches-orderNumber">
//                   <span className="MaterialPurches-orderLabel">PO Number:</span>
//                   <span className="MaterialPurches-orderValue">
//                     {viewOrder.poNumber}
//                   </span>
//                 </div>

//                 <div className="MaterialPurches-orderDetails">
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">
//                       Supplier:
//                     </span>
//                     <span className="MaterialPurches-detailValue">
//                       {viewOrder.supplierName}
//                     </span>
//                   </div>
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">Site:</span>
//                     <span className="MaterialPurches-detailValue">
//                       {viewOrder.siteName}
//                     </span>
//                   </div>
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">
//                       Expected Date:
//                     </span>
//                     <span className="MaterialPurches-detailValue">
//                       {viewOrder.expectDate}
//                     </span>
//                   </div>
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">Status:</span>
//                     <span
//                       className={`MaterialPurches-statusBadge MaterialPurches-status-${viewOrder.orderItemStatus.toLowerCase()}`}
//                     >
//                       {viewOrder.orderItemStatus}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="MaterialPurches-orderNote">
//                   <span className="MaterialPurches-noteLabel">Note:</span>
//                   <p className="MaterialPurches-noteText">{viewOrder.note}</p>
//                 </div>
//               </div>

//               <div className="MaterialPurches-itemsSection">
//                 <h3 className="MaterialPurches-itemsTitle">Order Items</h3>
//                 <div className="MaterialPurches-itemList">
//                   {viewOrder.orderItems.map((item, idx) => (
//                     <div key={idx} className="MaterialPurches-item">
//                       <div className="MaterialPurches-itemInfo">
//                         <div className="MaterialPurches-itemHeader">
//                           <span className="MaterialPurches-itemName">
//                             {item.materialName}
//                           </span>
//                           <div className="MaterialPurches-itemActions">
//                             <button
//                               className="MaterialPurches-itemEditButton"
//                               onClick={() => handleEditOrderItem(idx, item)}
//                               title="Edit Item"
//                             >
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               >
//                                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                                 <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                               </svg>
//                             </button>
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
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               >
//                                 <polyline points="3,6 5,6 21,6" />
//                                 <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
//                                 <line x1="10" y1="11" x2="10" y2="17" />
//                                 <line x1="14" y1="11" x2="14" y2="17" />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                         <div className="MaterialPurches-itemDetails">
//                           <span>Qty: {item.orderQty}</span>
//                           <span>
//                             Unit Cost: ₹{item.unitCost.toLocaleString()}
//                           </span>
//                           <span className="MaterialPurches-itemTotalAmount">
//                             Total: ₹{calculateItemTotal(item).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="MaterialPurches-grandTotal">
//                   <span className="MaterialPurches-grandTotalLabel">
//                     Grand Total:
//                   </span>
//                   <span className="MaterialPurches-grandTotalAmount">
//                     ₹
//                     {calculateGrandTotal(viewOrder.orderItems).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="MaterialPurches-tableContainer">
//         <div className="MaterialPurches-tableWrapper">
//           <table className="MaterialPurches-table">
//             <thead className="MaterialPurches-tableHead">
//               <tr className="MaterialPurches-tableRow">
//                 <th className="MaterialPurches-tableHeader">PO Number</th>
//                 <th className="MaterialPurches-tableHeader">Supplier</th>
//                 <th className="MaterialPurches-tableHeader">Site</th>
//                 <th className="MaterialPurches-tableHeader">Expected Date</th>
//                 <th className="MaterialPurches-tableHeader">Status</th>
//                 <th className="MaterialPurches-tableHeader">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="MaterialPurches-tableBody">
//               {filteredOrders.length > 0 ? (
//                 filteredOrders.map((order) => (
//                   <tr key={order.id} className="MaterialPurches-tableRow">
//                     <td className="MaterialPurches-tableCell">
//                       <span className="MaterialPurches-poNumber">
//                         {order.poNumber}
//                       </span>
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       {order.supplierName}
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       {order.siteName}
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       {order.expectDate}
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       <span
//                         className={`MaterialPurches-statusBadge MaterialPurches-status-${order.orderItemStatus.toLowerCase()}`}
//                       >
//                         {order.orderItemStatus}
//                       </span>
//                     </td>
//                     <td className="MaterialPurches-tableCell MaterialPurches-actionsCell">
//                       <div className="MaterialPurches-actionButtons">
//                         <button
//                           className="MaterialPurches-viewButton"
//                           onClick={() => handleView(order)}
//                         >
//                           View
//                         </button>
//                         <button
//                           className="MaterialPurches-editButton"
//                           onClick={() => handleEdit(order)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="MaterialPurches-deleteButton"
//                           onClick={() => handleDelete(order.id)}
//                         >
//                           Delete
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
//                       <span className="MaterialPurches-noDataIcon">📦</span>
//                       <span className="MaterialPurches-noDataText">
//                         No purchase orders found
//                       </span>
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

// import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";
// import "./MaterialPurches.css";
// import { FaAngleDown } from "react-icons/fa6";
// const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

// function MaterialPurches() {
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
//         // await axiosInstance.put(
//         //   `${BASE_URL}/purchase-orders/updatePurchaseOrderStatus/${editId}`,
//         //   { status: orderItemStatus },
//         //   {
//         //     headers: {
//         //       Authorization: `Bearer ${token}`,
//         //       "Content-Type": "application/json",
//         //     },
//         //   }
//         // );
//         // alert("Order Updated Successfully");
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

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this order?")) {
//       try {
//         await axiosInstance.delete(`${BASE_URL}/purchase-orders/${id}`, {
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
//       console.log("Delete item:", itemIndex, item);
//       alert(`Delete item: ${item.materialName}`);
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

//   return (
//     <div className="MaterialPurches-container">
//       <div className="MaterialPurches-header">
//         <div className="MaterialPurches-headerContent">
//           <h1 className="MaterialPurches-title">Material Purchase Orders</h1>
//           <p className="MaterialPurches-subtitle">
//             Manage your material procurement efficiently
//           </p>
//         </div>
//       </div>

//       <div className="MaterialPurches-headerSection">
//         <div className="MaterialPurches-searchContainer">
//           <input
//             type="text"
//             placeholder="Search by supplier and Site Name..."
//             className="MaterialPurches-searchBar"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button
//           className="MaterialPurches-toggleFormButton"
//           onClick={() => {
//             resetForm();
//             setShowForm(true);
//           }}
//         >
//           <span className="MaterialPurches-buttonIcon">+</span>
//           {isEditMode ? "Edit Purchase Order" : "Add Purchase Order"}
//         </button>
//       </div>

//       {showForm && (
//         <div className="MaterialPurches-formOverlay">
//           <div className="MaterialPurches-formContainer">
//             <div className="MaterialPurches-formHeader">
//               <h2 className="MaterialPurches-formTitle">
//                 {isEditMode
//                   ? "Edit Purchase Order"
//                   : "Create New Purchase Order"}
//               </h2>
//               <button
//                 className="MaterialPurches-closeFormButton"
//                 onClick={resetForm}
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="MaterialPurches-form">
//               <div className="MaterialPurches-formGrid">
//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">Supplier Name</label>
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
//                   <label className="MaterialPurches-label">Site Name</label>
//                   <input
//                     type="text"
//                     className="MaterialPurches-input"
//                     value={siteName}
//                     onChange={(e) => setSiteName(e.target.value)}
//                     placeholder="Enter site name"
//                     required
//                   />
//                 </div>

//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">Expected Date</label>
//                   <input
//                     type="date"
//                     className="MaterialPurches-input"
//                     value={expectDate}
//                     onChange={(e) => setExpectDate(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="MaterialPurches-formGroup">
//                   <label className="MaterialPurches-label">Status</label>
//                   <select
//                     className="MaterialPurches-input"
//                     value={orderItemStatus}
//                     onChange={(e) => setOrderItemStatus(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Status
//                     </option>
//                     <option value="PENDING">Pending</option>
//                     <option value="DELIVERED">Delivered</option>
//                     <option value="CANCELLED">Cancelled</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="MaterialPurches-formGroup">
//                 <label className="MaterialPurches-label">Note</label>
//                 <textarea
//                   className="MaterialPurches-textarea"
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Add any additional notes..."
//                   rows={3}
//                   required
//                 />
//               </div>

//               <div className="MaterialPurches-orderItemsSection">
//                 <div className="MaterialPurches-orderItemsHeader">
//                   <h3 className="MaterialPurches-orderItemsTitle">
//                     Order Items
//                   </h3>
//                   <button
//                     type="button"
//                     className="MaterialPurches-addItemButton"
//                     onClick={addOrderItem}
//                   >
//                     + Add Item
//                   </button>
//                 </div>

//                 <div className="MaterialPurches-orderItemsList">
//                   {orderItems.map((item, index) => (
//                     <div key={index} className="MaterialPurches-orderItemCard">
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

//                         {isEditMode
//                           ? ""
//                           : orderItems.length > 1 && (
//                               <button
//                                 type="button"
//                                 className="MaterialPurches-removeItemButton"
//                                 onClick={() => removeOrderItem(index)}
//                               >
//                                 ×
//                               </button>
//                             )}
//                       </div>
//                     </div>
//                   ))}
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
//                   {isEditMode ? "Update Order" : "Create Purchase Order"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {viewOrder && (
//         <div className="MaterialPurches-viewOverlay">
//           <div className="MaterialPurches-viewContainer">
//             <div className="MaterialPurches-viewHeader">
//               <h2 className="MaterialPurches-viewTitle">
//                 Purchase Order Details
//               </h2>
//               <button
//                 className="MaterialPurches-closeViewButton"
//                 onClick={() => setViewOrder(null)}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="MaterialPurches-purchaseOrderCard">
//               <div className="MaterialPurches-orderInfo">
//                 <div className="MaterialPurches-orderNumber">
//                   <span className="MaterialPurches-orderLabel">PO Number:</span>
//                   <span className="MaterialPurches-orderValue">
//                     {viewOrder.poNumber}
//                   </span>
//                 </div>

//                 <div className="MaterialPurches-orderDetails">
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">
//                       Supplier:
//                     </span>
//                     <span className="MaterialPurches-detailValue">
//                       {viewOrder.supplierName}
//                     </span>
//                   </div>
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">Site:</span>
//                     <span className="MaterialPurches-detailValue">
//                       {viewOrder.siteName}
//                     </span>
//                   </div>
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">
//                       Expected Date:
//                     </span>
//                     <span className="MaterialPurches-detailValue">
//                       {viewOrder.expectDate}
//                     </span>
//                   </div>
//                   <div className="MaterialPurches-orderDetail">
//                     <span className="MaterialPurches-detailLabel">Status:</span>
//                     <span
//                       className={`MaterialPurches-statusBadge MaterialPurches-status-${viewOrder.orderItemStatus.toLowerCase()}`}
//                     >
//                       {viewOrder.orderItemStatus}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="MaterialPurches-orderNote">
//                   <span className="MaterialPurches-noteLabel">Note:</span>
//                   <p className="MaterialPurches-noteText">{viewOrder.note}</p>
//                 </div>
//               </div>

//               <div className="MaterialPurches-itemsSection">
//                 <h3 className="MaterialPurches-itemsTitle">Order Items</h3>
//                 <div className="MaterialPurches-itemList">
//                   {viewOrder.orderItems.map((item, idx) => (
//                     <div key={idx} className="MaterialPurches-item">
//                       <div className="MaterialPurches-itemInfo">
//                         <div className="MaterialPurches-itemHeader">
//                           <span className="MaterialPurches-itemName">
//                             {item.materialName}
//                           </span>
//                           <div className="MaterialPurches-itemActions">
//                             <button
//                               className="MaterialPurches-itemEditButton"
//                               onClick={() => handleEditOrderItem(idx, item)}
//                               title="Edit Item"
//                             >
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               >
//                                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                                 <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                               </svg>
//                             </button>
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
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               >
//                                 <polyline points="3,6 5,6 21,6" />
//                                 <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
//                                 <line x1="10" y1="11" x2="10" y2="17" />
//                                 <line x1="14" y1="11" x2="14" y2="17" />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                         <div className="MaterialPurches-itemDetails">
//                           <span>Qty: {item.orderQty}</span>
//                           <span>
//                             Unit Cost: ₹{item.unitCost.toLocaleString()}
//                           </span>
//                           <span className="MaterialPurches-itemTotalAmount">
//                             Total: ₹{calculateItemTotal(item).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="MaterialPurches-grandTotal">
//                   <span className="MaterialPurches-grandTotalLabel">
//                     Grand Total:
//                   </span>
//                   <span className="MaterialPurches-grandTotalAmount">
//                     ₹
//                     {calculateGrandTotal(viewOrder.orderItems).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="MaterialPurches-tableContainer">
//         <div className="MaterialPurches-tableWrapper">
//           <table className="MaterialPurches-table">
//             <thead className="MaterialPurches-tableHead">
//               <tr className="MaterialPurches-tableRow">
//                 <th className="MaterialPurches-tableHeader">PO Number</th>
//                 <th className="MaterialPurches-tableHeader">Supplier</th>
//                 <th className="MaterialPurches-tableHeader">Site</th>
//                 <th className="MaterialPurches-tableHeader">Expected Date</th>
//                 <th className="MaterialPurches-tableHeader">Status</th>
//                 <th className="MaterialPurches-tableHeader">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="MaterialPurches-tableBody">
//               {filteredOrders.length > 0 ? (
//                 filteredOrders.map((order) => (
//                   <tr key={order.id} className="MaterialPurches-tableRow">
//                     <td className="MaterialPurches-tableCell">
//                       <span className="MaterialPurches-poNumber">
//                         {order.poNumber}
//                       </span>
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       {order.supplierName}
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       {order.siteName}
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       {order.expectDate}
//                     </td>
//                     <td className="MaterialPurches-tableCell">
//                       <div className="MaterialPurches-selectWrapper">
//                         <select
//                           className="MaterialPurches-statusSelect"
//                           value={order.orderItemStatus}
//                           onChange={(e) =>
//                             handleStatusChange(order.id, e.target.value)
//                           }
//                         >
//                           <option value="PENDING">Pending</option>
//                           <option value="DELIVERED">Delivered</option>
//                           <option value="CANCELLED">Cancelled</option>
//                         </select>
//                       </div>
//                     </td>

//                     <td className="MaterialPurches-tableCell MaterialPurches-actionsCell">
//                       <div className="MaterialPurches-actionButtons">
//                         <button
//                           className="MaterialPurches-viewButton"
//                           onClick={() => handleView(order)}
//                         >
//                           View
//                         </button>
//                         <button
//                           className="MaterialPurches-editButton"
//                           onClick={() => handleEdit(order)}
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                             <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                           </svg>{" "}
//                           Edit
//                         </button>
//                         <button
//                           className="MaterialPurches-deleteButton"
//                           onClick={() => handleDelete(order.id)}
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <polyline points="3,6 5,6 21,6" />
//                             <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
//                             <line x1="10" y1="11" x2="10" y2="17" />
//                             <line x1="14" y1="11" x2="14" y2="17" />
//                           </svg>{" "}
//                           Delete
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
//                       <span className="MaterialPurches-noDataIcon">📦</span>
//                       <span className="MaterialPurches-noDataText">
//                         No purchase orders found
//                       </span>
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

const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

function MaterialPurches() {
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axiosInstance.delete(`${BASE_URL}/purchase-orders/${id}`, {
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

  const handleEditOrderItem = (itemIndex, item) => {
    console.log("Edit item:", itemIndex, item);
    alert(`Edit item: ${item.materialName}`);
  };

  const handleDeleteOrderItem = async (itemIndex, item) => {
    if (
      window.confirm(`Are you sure you want to delete ${item.materialName}?`)
    ) {
      console.log("Delete item:", itemIndex, item);
      alert(`Delete item: ${item.materialName}`);
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
          <div className="MaterialPurches-statsGrid">
            <div className="MaterialPurches-statCard">
              <div className="MaterialPurches-statNumber">
                {purchesOrders.length}
              </div>
              <div className="MaterialPurches-statLabel">Total Orders</div>
            </div>
            <div className="MaterialPurches-statCard">
              <div className="MaterialPurches-statNumber">
                {
                  purchesOrders.filter(
                    (order) => order.orderItemStatus === "PENDING"
                  ).length
                }
              </div>
              <div className="MaterialPurches-statLabel">Pending</div>
            </div>
            <div className="MaterialPurches-statCard">
              <div className="MaterialPurches-statNumber">
                {
                  purchesOrders.filter(
                    (order) => order.orderItemStatus === "DELIVERED"
                  ).length
                }
              </div>
              <div className="MaterialPurches-statLabel">Delivered</div>
            </div>
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
        </div>
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
                  <input
                    type="text"
                    className="MaterialPurches-input"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Enter site name"
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
                        <span className="MaterialPurches-itemNumber">
                          Item {index + 1}
                        </span>
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

      {/* Enhanced View Modal */}
      {viewOrder && (
        <div className="MaterialPurches-viewOverlay">
          <div className="MaterialPurches-viewContainer">
            <div className="MaterialPurches-viewHeader">
              <div className="MaterialPurches-viewHeaderContent">
                <h2 className="MaterialPurches-viewTitle">
                  Purchase Order Details
                </h2>
                <span className="MaterialPurches-viewSubtitle">
                  Order #{viewOrder.poNumber}
                </span>
              </div>
              <button
                className="MaterialPurches-closeViewButton"
                onClick={() => setViewOrder(null)}
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

            <div className="MaterialPurches-purchaseOrderCard">
              <div className="MaterialPurches-orderInfo">
                <div className="MaterialPurches-orderNumber">
                  <div className="MaterialPurches-orderNumberContent">
                    <span className="MaterialPurches-orderLabel">
                      PO Number
                    </span>
                    <span className="MaterialPurches-orderValue">
                      {viewOrder.poNumber}
                    </span>
                  </div>
                  <span
                    className={`MaterialPurches-statusBadge MaterialPurches-status-${viewOrder.orderItemStatus.toLowerCase()}`}
                  >
                    {viewOrder.orderItemStatus}
                  </span>
                </div>

                <div className="MaterialPurches-orderDetails">
                  <div className="MaterialPurches-orderDetail">
                    <div className="MaterialPurches-detailIcon">
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
                    </div>
                    <div className="MaterialPurches-detailContent">
                      <span className="MaterialPurches-detailLabel">
                        Supplier
                      </span>
                      <span className="MaterialPurches-detailValue">
                        {viewOrder.supplierName}
                      </span>
                    </div>
                  </div>

                  <div className="MaterialPurches-orderDetail">
                    <div className="MaterialPurches-detailIcon">
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
                    </div>
                    <div className="MaterialPurches-detailContent">
                      <span className="MaterialPurches-detailLabel">Site</span>
                      <span className="MaterialPurches-detailValue">
                        {viewOrder.siteName}
                      </span>
                    </div>
                  </div>

                  <div className="MaterialPurches-orderDetail">
                    <div className="MaterialPurches-detailIcon">
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
                    </div>
                    <div className="MaterialPurches-detailContent">
                      <span className="MaterialPurches-detailLabel">
                        Expected Date
                      </span>
                      <span className="MaterialPurches-detailValue">
                        {viewOrder.expectDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="MaterialPurches-orderNote">
                  <div className="MaterialPurches-noteHeader">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                    </svg>
                    <span className="MaterialPurches-noteLabel">Note</span>
                  </div>
                  <p className="MaterialPurches-noteText">{viewOrder.note}</p>
                </div>
              </div>

              <div className="MaterialPurches-itemsSection">
                <div className="MaterialPurches-itemsSectionHeader">
                  <h3 className="MaterialPurches-itemsTitle">Order Items</h3>
                  <span className="MaterialPurches-itemsCount">
                    {viewOrder.orderItems.length} items
                  </span>
                </div>

                <div className="MaterialPurches-itemList">
                  {viewOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="MaterialPurches-item">
                      <div className="MaterialPurches-itemInfo">
                        <div className="MaterialPurches-itemHeader">
                          <div className="MaterialPurches-itemHeaderLeft">
                            <span className="MaterialPurches-itemNumber">
                              #{idx + 1}
                            </span>
                            <span className="MaterialPurches-itemName">
                              {item.materialName}
                            </span>
                          </div>
                          <div className="MaterialPurches-itemActions">
                            <button
                              className="MaterialPurches-itemEditButton"
                              onClick={() => handleEditOrderItem(idx, item)}
                              title="Edit Item"
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
                              className="MaterialPurches-itemDeleteButton"
                              onClick={() => handleDeleteOrderItem(idx, item)}
                              title="Delete Item"
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
                        </div>
                        <div className="MaterialPurches-itemDetails">
                          <div className="MaterialPurches-itemDetailItem">
                            <span className="MaterialPurches-itemDetailLabel">
                              Qty:
                            </span>
                            <span className="MaterialPurches-itemDetailValue">
                              {item.orderQty}
                            </span>
                          </div>
                          <div className="MaterialPurches-itemDetailItem">
                            <span className="MaterialPurches-itemDetailLabel">
                              Unit Cost:
                            </span>
                            <span className="MaterialPurches-itemDetailValue">
                              ₹{item.unitCost.toLocaleString()}
                            </span>
                          </div>
                          <div className="MaterialPurches-itemDetailItem MaterialPurches-itemTotalAmount">
                            <span className="MaterialPurches-itemDetailLabel">
                              Total:
                            </span>
                            <span className="MaterialPurches-itemDetailValue">
                              ₹{calculateItemTotal(item).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="MaterialPurches-grandTotal">
                  <div className="MaterialPurches-grandTotalContent">
                    <span className="MaterialPurches-grandTotalLabel">
                      Grand Total
                    </span>
                    <span className="MaterialPurches-grandTotalAmount">
                      ₹
                      {calculateGrandTotal(
                        viewOrder.orderItems
                      ).toLocaleString()}
                    </span>
                  </div>
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

        <div className="MaterialPurches-tableWrapper">
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
                          onClick={() => handleDelete(order.id)}
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
