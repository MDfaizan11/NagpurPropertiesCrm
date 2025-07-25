// import { useEffect, useState, useRef } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";
// import "./VehicleMaterial.css";
// import { useNavigate } from "react-router-dom";

// function VehicleMaterial() {
//   const navigate = useNavigate();
//   const { token, role } =
//     JSON.parse(localStorage.getItem("NagpurProperties")) || {};
//   const [poNumbers, setPoNumbers] = useState([]);
//   const [vehicleDetailedData, setVehicleDetailedData] = useState([]);
//   const [formData, setFormData] = useState({
//     vehicleNo: "",
//     poNumber: "",
//     file: null,
//   });
//   const [formError, setFormError] = useState(null);
//   const [formSuccess, setFormSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const fileInputRef = useRef(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [siteFilter, setSiteFilter] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   // New state for Purchase Order modal
//   const [showPOModal, setShowPOModal] = useState(false);
//   const [selectedPO, setSelectedPO] = useState(null);

//   // New states for updating received quantity
//   const [showUpdateQtyModal, setShowUpdateQtyModal] = useState(false);
//   const [selectedOrderItem, setSelectedOrderItem] = useState(null);
//   const [updateQtyData, setUpdateQtyData] = useState({
//     recivedQty: 0,
//   });
//   const [updateQtyLoading, setUpdateQtyLoading] = useState(false);
//   const [updateQtyError, setUpdateQtyError] = useState(null);
//   const [updateQtySuccess, setUpdateQtySuccess] = useState(null);

//   const [orderItemUpdateId, setOrderItemUpdateId] = useState(null);
//   const [showOderItemUpdateModal, setShowOderItemUpdateModal] = useState(false);
//   const [updateExistingOrderQuantity, setupdateExistingOrderQuantity] =
//     useState("");
//   const [updateExistingVehicleNumber, setupdateExistingVehicleNumber] =
//     useState("");

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }
//         setLoading(true);
//         const poResponse = await axiosInstance.get(
//           `${BASE_URL}/purchase-orders/all-PoNumber`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const vehicleResponse = await axiosInstance.get(
//           `${BASE_URL}/vehicle-entries`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log(vehicleResponse.data);
//         setPoNumbers(poResponse.data || []);
//         setVehicleDetailedData(vehicleResponse.data || []);
//         setError(null);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         setError("Failed to load data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [token]);

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = vehicleDetailedData;
//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (item) =>
//           item.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.engineerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.purchaseOrder?.poNumber
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           item.purchaseOrder?.supplierName
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           item.purchaseOrder?.orderItems?.some((oi) =>
//             oi.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//       );
//     }
//     // Status filter
//     if (statusFilter) {
//       filtered = filtered.filter(
//         (item) =>
//           item.purchaseOrder?.orderItemStatus?.toLowerCase() ===
//           statusFilter.toLowerCase()
//       );
//     }
//     // Site filter
//     if (siteFilter) {
//       filtered = filtered.filter(
//         (item) => item.purchaseOrder?.siteName === siteFilter
//       );
//     }
//     setFilteredData(filtered);
//   }, [vehicleDetailedData, searchTerm, statusFilter, siteFilter]);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError(null);
//     setFormSuccess(null);
//     if (!formData.vehicleNo || !formData.poNumber) {
//       setFormError("Vehicle Number and PO Number are required.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = new FormData();
//       data.append("vehicleNo", formData.vehicleNo);
//       data.append("poNumber", formData.poNumber);
//       if (formData.file) {
//         data.append("file", formData.file);
//       }
//       const response = await axiosInstance.post(
//         `${BASE_URL}/vehicle-entries`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setFormSuccess("Vehicle entry created successfully!");
//       setFormData({ vehicleNo: "", poNumber: "", file: null });
//       if (fileInputRef.current) {
//         fileInputRef.current.value = null;
//       }
//       // Refresh vehicle entries after submission
//       const vehicleResponse = await axiosInstance.get(
//         `${BASE_URL}/vehicle-entries`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setVehicleDetailedData(vehicleResponse.data || []);
//     } catch (error) {
//       console.error("Failed to create vehicle entry:", error);
//       setFormError(
//         error.response?.data?.message ||
//           "Failed to create vehicle entry. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get unique site names for filter dropdown
//   const uniqueSiteNames = [
//     ...new Set(
//       vehicleDetailedData
//         .map((item) => item.purchaseOrder?.siteName)
//         .filter(Boolean)
//     ),
//   ];

//   // Handle image view
//   const handleImageView = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setShowImageModal(true);
//   };

//   // Handle Purchase Order view
//   const handlePOView = (purchaseOrder) => {
//     setSelectedPO(purchaseOrder);
//     setShowPOModal(true);
//   };

//   // Handle form submission and close modal
//   const handleFormSubmit = async (e) => {
//     await handleSubmit(e);
//     if (formSuccess) {
//       setShowAddForm(false);
//     }
//   };

//   // Handle update received quantity
//   const handleUpdateReceivedQty = (orderItem) => {
//     setSelectedOrderItem(orderItem);
//     setUpdateQtyData({
//       recivedQty: orderItem.recivedQty || 0,
//     });
//     setUpdateQtyError(null);
//     setUpdateQtySuccess(null);
//     setShowUpdateQtyModal(true);
//   };

//   // Handle quantity input change
//   const handleQtyInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateQtyData((prev) => ({
//       ...prev,
//       [name]: Number.parseInt(value) || 0,
//     }));
//   };

//   // Handle quantity update submission
//   const handleQtyUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setUpdateQtyError(null);
//     setUpdateQtySuccess(null);

//     if (!selectedOrderItem) {
//       setUpdateQtyError("No order item selected.");
//       return;
//     }

//     if (updateQtyData.recivedQty < 0) {
//       setUpdateQtyError("Received quantity cannot be negative.");
//       return;
//     }

//     if (updateQtyData.recivedQty > selectedOrderItem.orderQty) {
//       setUpdateQtyError("Received quantity cannot exceed order quantity.");
//       return;
//     }

//     try {
//       setUpdateQtyLoading(true);

//       const response = await axiosInstance.put(
//         `${BASE_URL}/purchase-orders/order-items/${selectedOrderItem.id}/receive`,
//         {
//           recivedQty: updateQtyData.recivedQty,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       alert("Received quantity updated successfully!");
//       setUpdateQtySuccess("Received quantity updated successfully!");

//       // Refresh vehicle entries to get updated data
//       const vehicleResponse = await axiosInstance.get(
//         `${BASE_URL}/vehicle-entries`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setVehicleDetailedData(vehicleResponse.data || []);

//       // Update the selected PO data if it's currently open
//       if (selectedPO) {
//         const updatedOrderItems = selectedPO.orderItems.map((item) =>
//           item.id === selectedOrderItem.id
//             ? {
//                 ...item,
//                 recivedQty: updateQtyData.recivedQty,
//                 reamingQty: item.orderQty - updateQtyData.recivedQty,
//               }
//             : item
//         );
//         setSelectedPO({ ...selectedPO, orderItems: updatedOrderItems });
//       }

//       // Close modal after 2 seconds
//       setTimeout(() => {
//         setShowUpdateQtyModal(false);
//       }, 2000);
//     } catch (error) {
//       console.error("Failed to update received quantity:", error);
//       setUpdateQtyError(
//         error.response?.data?.message ||
//           "Failed to update received quantity. Please try again."
//       );
//     } finally {
//       setUpdateQtyLoading(false);
//     }
//   };

//   function handleShowDeleverdQuantity(item) {
//     setOrderItemUpdateId(item.id);
//     setShowOderItemUpdateModal(true);
//   }

//   async function handleUpdateExistingOrderItem(e) {
//     e.preventDefault();
//     const bodyData = {
//       orderItemId: orderItemUpdateId,
//       deliveredQty: updateExistingOrderQuantity,
//       vehicleNo: updateExistingVehicleNumber,
//     };
//     try {
//       const response = await axiosInstance.post(
//         `${BASE_URL}/deliveries`,
//         bodyData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       alert("Order item updated successfully!");
//       setShowOderItemUpdateModal(false);
//       setupdateExistingOrderQuantity("");
//       setupdateExistingVehicleNumber("");
//       // Refresh vehicle entries to get updated data
//     } catch (error) {
//       console.log(error);
//       alert(
//         error.response?.data?.message ||
//           "Failed to update order item. Please try again."
//       );
//     }
//   }

//   async function handleViewAllDelivery(id, name) {
//     console.log(id, name);
//     navigate(`/MaterialLogDetails/${id}/${name}`);
//     // alert(id);
//     // try {
//     //   const response = await axiosInstance.get(
//     //     `${BASE_URL}/deliveries/order-item/${id}/logs`,
//     //     {
//     //       headers: {
//     //         Authorization: `Bearer ${token}`,
//     //         "Content-Type": "application/json",
//     //       },
//     //     }
//     //   );
//     //   console.log(response.data);
//     // } catch (error) {
//     //   console.log(error);
//     // }
//   }
//   // Loading state
//   if (loading) {
//     return (
//       <div className="VehicleMaterialcontainer">
//         <div className="VehicleMaterialloading-wrapper">
//           <div className="VehicleMaterialloading-spinner"></div>
//           <div className="VehicleMaterialloading-content">
//             <h3 className="VehicleMaterialloading-title">Loading...</h3>
//             <p className="VehicleMaterialloading-text">
//               Please wait while we fetch your data
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="VehicleMaterialcontainer">
//         <div className="VehicleMaterialerror-wrapper">
//           <div className="VehicleMaterialerror-icon">
//             <svg
//               width="48"
//               height="48"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M12 2L2 22H22L12 2Z"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M12 9V13"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M12 17H12.01"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//           <h3 className="VehicleMaterialerror-title">Something went wrong</h3>
//           <p className="VehicleMaterialerror-text">{error}</p>
//           <button
//             className="VehicleMaterialretry-button"
//             onClick={() => window.location.reload()}
//           >
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M1 4V10H7"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M23 20V14H17"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Role-based message for unauthorized users
//   if (!["Admin", "Engineer"].includes(role?.[0]?.roleName)) {
//     return (
//       <div className="VehicleMaterialcontainer">
//         <div className="VehicleMaterialunauthorized-wrapper">
//           <div className="VehicleMaterialunauthorized-icon">
//             <svg
//               width="64"
//               height="64"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <circle
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               />
//               <path
//                 d="M15 9L9 15"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M9 9L15 15"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//           <h3 className="VehicleMaterialunauthorized-title">Access Denied</h3>
//           <p className="VehicleMaterialunauthorized-text">
//             You are not authorized to create vehicle entries.
//           </p>
//           <p className="VehicleMaterialunauthorized-subtext">
//             Please contact your administrator for access.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="VehicleMaterialcontainer">
//       {/* Header */}
//       {/* <div className="VehicleMaterialheader">
//         <div className="VehicleMaterialheader-content">
//           <h1 className="VehicleMaterialheader-title">
//             Vehicle Material Management
//           </h1>
//           <p className="VehicleMaterialheader-subtitle">
//             Manage vehicle entries and track material deliveries
//           </p>
//         </div>
//       </div> */}

//       {/* Main Content */}
//       <div className="VehicleMaterialmain-content">
//         <div className="VehicleMaterialcontrols-section">
//           {/* <div className="VehicleMaterialcontrols-header">
//             <h2 className="VehicleMaterialcontrols-title">
//               Vehicle Entries Management
//             </h2>
//           </div> */}

//           {/* Search and Filters */}
//           <div className="VehicleMaterialfilters-container">
//             <div className="VehicleMaterialsearch-container">
//               <div className="VehicleMaterialsearch-wrapper">
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <circle
//                     cx="11"
//                     cy="11"
//                     r="8"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                   <path
//                     d="M21 21L16.65 16.65"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search by vehicle, engineer, PO number, supplier, or material..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="VehicleMaterialsearch-input"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="VehicleMaterialsearch-clear"
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <line
//                         x1="18"
//                         y1="6"
//                         x2="6"
//                         y2="18"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="6"
//                         y1="6"
//                         x2="18"
//                         y2="18"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div className="VehicleMaterialfilters-wrapper">
//               <div className="VehicleMaterialfilter-group">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="VehicleMaterialfilter-select"
//                 >
//                   <option value="">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                   <option value="in-progress">In Progress</option>
//                 </select>
//               </div>
//               <div className="VehicleMaterialfilter-group">
//                 <select
//                   value={siteFilter}
//                   onChange={(e) => setSiteFilter(e.target.value)}
//                   className="VehicleMaterialfilter-select"
//                 >
//                   <option value="">All Sites</option>
//                   {uniqueSiteNames.map((siteName, index) => (
//                     <option key={index} value={siteName}>
//                       {siteName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {(searchTerm || statusFilter || siteFilter) && (
//                 <button
//                   onClick={() => {
//                     setSearchTerm("");
//                     setStatusFilter("");
//                     setSiteFilter("");
//                   }}
//                   className="VehicleMaterialclear-filters"
//                 >
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M3 6H21" stroke="currentColor" strokeWidth="2" />
//                     <path
//                       d="M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <path
//                       d="M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <line
//                       x1="10"
//                       y1="11"
//                       x2="10"
//                       y2="17"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <line
//                       x1="14"
//                       y1="11"
//                       x2="14"
//                       y2="17"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                   Clear Filters
//                 </button>
//               )}
//               <button
//                 className="VehicleMaterialadd-button"
//                 onClick={() => setShowAddForm(true)}
//               >
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M12 5V19"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M5 12H19"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Add Vehicle
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Vehicle Entries Table */}
//         <div className="VehicleMaterialtable-container">
//           {filteredData.length > 0 ? (
//             <div className="VehicleMaterialtable-wrapper">
//               <table className="VehicleMaterialtable">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Vehicle No</th>
//                     <th>Engineer</th>
//                     <th>Site</th>
//                     <th>PO Number</th>
//                     {/* <th>Supplier</th> */}
//                     {/* <th>Material</th> */}
//                     {/* <th>Qty</th> */}
//                     {/* <th>Unit Cost</th> */}
//                     {/* <th>Total Cost</th> */}
//                     <th>Status</th>
//                     {/* <th>Note</th> */}
//                     {/* <th>Expected Date</th> */}
//                     <th>Image</th>
//                     <th>Purchase Order</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((item, index) => (
//                     <tr key={item.id} className="VehicleMaterialtable-row">
//                       <td className="VehicleMaterialtable-cell-index">
//                         {index + 1}
//                       </td>
//                       <td>{item.date || "N/A"}</td>
//                       <td>{item.time || "N/A"}</td>
//                       <td className="VehicleMaterialtable-cell-vehicle">
//                         {item.vehicleNo || "N/A"}
//                       </td>
//                       <td>{item.engineerName || "N/A"}</td>
//                       <td>{item.purchaseOrder?.siteName || "N/A"}</td>
//                       <td className="VehicleMaterialtable-cell-po">
//                         {item.purchaseOrder?.poNumber || "N/A"}
//                       </td>
//                       {/* <td>{item.purchaseOrder?.supplierName || "N/A"}</td> */}
//                       {/* <td className="VehicleMaterialtable-cell-material">
//                         {item.purchaseOrder?.orderItems?.length > 0
//                           ? item.purchaseOrder.orderItems
//                               .map((oi) => oi.materialName)
//                               .join(", ")
//                           : "N/A"}
//                       </td> */}
//                       {/* <td>
//                         {item.purchaseOrder?.orderItems?.length > 0
//                           ? item.purchaseOrder.orderItems[0].orderQty || "N/A"
//                           : "N/A"}
//                       </td> */}
//                       {/* <td>
//                         {item.purchaseOrder?.orderItems?.length > 0
//                           ? `₹${
//                               item.purchaseOrder.orderItems[0].unitCost || "N/A"
//                             }`
//                           : "N/A"}
//                       </td> */}
//                       {/* <td className="VehicleMaterialtable-cell-cost">
//                         {item.purchaseOrder?.orderItems?.length > 0
//                           ? `₹${
//                               item.purchaseOrder.orderItems[0].totalCost ||
//                               "N/A"
//                             }`
//                           : "N/A"}
//                       </td> */}
//                       <td>
//                         <span
//                           className={`VehicleMaterialstatus-badge VehicleMaterialstatus-${
//                             item.purchaseOrder?.orderItemStatus?.toLowerCase() ||
//                             "pending"
//                           }`}
//                         >
//                           {item.purchaseOrder?.orderItemStatus || "Pending"}
//                         </span>
//                       </td>
//                       {/* <td className="VehicleMaterialtable-cell-note">
//                         {item.purchaseOrder?.note || "N/A"}
//                       </td> */}
//                       {/* <td>{item.purchaseOrder?.expectDate || "N/A"}</td> */}
//                       <td>
//                         {item.images ? (
//                           <button
//                             onClick={() => handleImageView(item.images)}
//                             className="VehicleMaterialview-button"
//                           >
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               />
//                               <circle
//                                 cx="12"
//                                 cy="12"
//                                 r="3"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                               />
//                             </svg>
//                             View
//                           </button>
//                         ) : (
//                           <span className="VehicleMaterialno-image">
//                             No Image
//                           </span>
//                         )}
//                       </td>
//                       <td>
//                         {item.purchaseOrder ? (
//                           <button
//                             onClick={() => handlePOView(item.purchaseOrder)}
//                             className="VehicleMaterialpo-button"
//                           >
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                               <polyline
//                                 points="14,2 14,8 20,8"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                             View PO
//                           </button>
//                         ) : (
//                           <span className="VehicleMaterialno-po">No PO</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="VehicleMaterialno-data">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <circle
//                   cx="11"
//                   cy="11"
//                   r="8"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <path
//                   d="M21 21L16.65 16.65"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//               </svg>
//               <h3>No Vehicle Entries Found</h3>
//               <p>
//                 {searchTerm || statusFilter || siteFilter
//                   ? "Try adjusting your search or filters to find what you're looking for."
//                   : "Start by creating your first vehicle entry using the Add Vehicle button."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Vehicle Form Modal */}
//       {showAddForm && (
//         <div
//           className="VehicleMaterialmodal-overlay"
//           onClick={() => setShowAddForm(false)}
//         >
//           <div
//             className="VehicleMaterialmodal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="VehicleMaterialmodal-header">
//               <h2 className="VehicleMaterialmodal-title">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <polyline
//                     points="14,2 14,8 20,8"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <line
//                     x1="16"
//                     y1="13"
//                     x2="8"
//                     y2="13"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <line
//                     x1="16"
//                     y1="17"
//                     x2="8"
//                     y2="17"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Create Vehicle Entry
//               </h2>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="VehicleMaterialmodal-close"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
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
//             <form
//               onSubmit={handleFormSubmit}
//               className="VehicleMaterialmodal-form"
//             >
//               <div className="VehicleMaterialform-grid">
//                 <div className="VehicleMaterialform-group">
//                   <label
//                     htmlFor="vehicleNo"
//                     className="VehicleMaterialform-label"
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M7 17L17 7H7V17Z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     Vehicle Number
//                   </label>
//                   <input
//                     type="text"
//                     id="vehicleNo"
//                     name="vehicleNo"
//                     value={formData.vehicleNo}
//                     onChange={handleInputChange}
//                     className="VehicleMaterialform-input"
//                     placeholder="Enter vehicle number (e.g., MH-12-AB-1234)"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//                 <div className="VehicleMaterialform-group">
//                   <label
//                     htmlFor="poNumber"
//                     className="VehicleMaterialform-label"
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     PO Number
//                   </label>
//                   <select
//                     id="poNumber"
//                     name="poNumber"
//                     value={formData.poNumber}
//                     onChange={handleInputChange}
//                     className="VehicleMaterialform-select"
//                     required
//                     disabled={loading || poNumbers.length === 0}
//                   >
//                     <option value="" disabled>
//                       {poNumbers.length === 0
//                         ? "No PO Numbers Available"
//                         : "Select PO Number"}
//                     </option>
//                     {poNumbers.map((item, index) => (
//                       <option key={index} value={item.poNumber}>
//                         {item.poNumber}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="VehicleMaterialform-group VehicleMaterialfile-upload-group">
//                 <label
//                   htmlFor="fileInput"
//                   className="VehicleMaterialform-label"
//                 >
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <rect
//                       x="3"
//                       y="3"
//                       width="18"
//                       height="18"
//                       rx="2"
//                       ry="2"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <circle
//                       cx="8.5"
//                       cy="8.5"
//                       r="1.5"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <polyline
//                       points="21,15 16,10 5,21"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                   Upload Image (Optional)
//                 </label>
//                 <div className="VehicleMaterialfile-upload-wrapper">
//                   <input
//                     type="file"
//                     id="fileInput"
//                     name="file"
//                     onChange={handleFileChange}
//                     className="VehicleMaterialfile-input"
//                     accept="image/*"
//                     disabled={loading}
//                     ref={fileInputRef}
//                   />
//                   <div className="VehicleMaterialfile-upload-display">
//                     {formData.file ? (
//                       <div className="VehicleMaterialfile-selected">
//                         <svg
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M13 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V9L13 2Z"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                         <span>{formData.file.name}</span>
//                       </div>
//                     ) : (
//                       <div className="VehicleMaterialfile-placeholder">
//                         <svg
//                           width="32"
//                           height="32"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <polyline
//                             points="7,10 12,15 17,10"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <line
//                             x1="12"
//                             y1="15"
//                             x2="12"
//                             y2="3"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                         <p>Click to upload or drag and drop</p>
//                         <span>PNG, JPG, GIF up to 10MB</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="VehicleMaterialmodal-actions">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddForm(false)}
//                   className="VehicleMaterialcancel-button"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="VehicleMaterialsubmit-button"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="VehicleMaterialbutton-spinner"></div>
//                       Submitting...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M20 6L9 17L4 12"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                       Submit Vehicle Entry
//                     </>
//                   )}
//                 </button>
//               </div>
//               {formError && (
//                 <div className="VehicleMaterialform-message VehicleMaterialform-error">
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <circle
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <line
//                       x1="15"
//                       y1="9"
//                       x2="9"
//                       y2="15"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                     <line
//                       x1="9"
//                       y1="9"
//                       x2="15"
//                       y2="15"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                   {formError}
//                 </div>
//               )}
//               {formSuccess && (
//                 <div className="VehicleMaterialform-message VehicleMaterialform-success">
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M22 11.08V12A10 10 0 1 1 5.93 7.01"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <polyline
//                       points="22,4 12,14.01 9,11.01"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   {formSuccess}
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Image Modal */}
//       {showImageModal && selectedImage && (
//         <div
//           className="VehicleMaterialimage-modal-overlay"
//           onClick={() => setShowImageModal(false)}
//         >
//           <div
//             className="VehicleMaterialimage-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="VehicleMaterialimage-modal-header">
//               <h3 className="VehicleMaterialimage-modal-title">
//                 Vehicle Image
//               </h3>
//               <button
//                 onClick={() => setShowImageModal(false)}
//                 className="VehicleMaterialimage-modal-close"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
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
//             <div className="VehicleMaterialimage-modal-body">
//               <img
//                 src={selectedImage || "/placeholder.svg"}
//                 alt="Vehicle Entry"
//                 className="VehicleMaterialfullscreen-image"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Purchase Order Modal */}
//       {showPOModal && selectedPO && (
//         <div
//           className="VehicleMaterialmodal-overlay"
//           onClick={() => setShowPOModal(false)}
//         >
//           <div
//             className="VehicleMaterialpo-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="VehicleMaterialmodal-header">
//               <h2 className="VehicleMaterialmodal-title">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <polyline
//                     points="14,2 14,8 20,8"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Purchase Order Details
//               </h2>
//               <button
//                 onClick={() => setShowPOModal(false)}
//                 className="VehicleMaterialmodal-close"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
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
//             <div className="VehicleMaterialpo-modal-body">
//               {/* PO Header Information */}
//               <div className="VehicleMaterialpo-header-section">
//                 <div className="VehicleMaterialpo-info-grid">
//                   <div className="VehicleMaterialpo-info-item">
//                     <label className="VehicleMaterialpo-info-label">
//                       PO Number
//                     </label>
//                     <span className="VehicleMaterialpo-info-value">
//                       {selectedPO.poNumber || "N/A"}
//                     </span>
//                   </div>
//                   <div className="VehicleMaterialpo-info-item">
//                     <label className="VehicleMaterialpo-info-label">
//                       Supplier Name
//                     </label>
//                     <span className="VehicleMaterialpo-info-value">
//                       {selectedPO.supplierName || "N/A"}
//                     </span>
//                   </div>
//                   <div className="VehicleMaterialpo-info-item">
//                     <label className="VehicleMaterialpo-info-label">
//                       Site Name
//                     </label>
//                     <span className="VehicleMaterialpo-info-value">
//                       {selectedPO.siteName || "N/A"}
//                     </span>
//                   </div>
//                   <div className="VehicleMaterialpo-info-item">
//                     <label className="VehicleMaterialpo-info-label">
//                       Status
//                     </label>
//                     <span
//                       className={`VehicleMaterialstatus-badge VehicleMaterialstatus-${
//                         selectedPO.orderItemStatus?.toLowerCase() || "pending"
//                       }`}
//                     >
//                       {selectedPO.orderItemStatus || "Pending"}
//                     </span>
//                   </div>
//                   <div className="VehicleMaterialpo-info-item">
//                     <label className="VehicleMaterialpo-info-label">
//                       Order Date
//                     </label>
//                     <span className="VehicleMaterialpo-info-value">
//                       {selectedPO.todayDate || "N/A"}
//                     </span>
//                   </div>
//                   <div className="VehicleMaterialpo-info-item">
//                     <label className="VehicleMaterialpo-info-label">
//                       Expected Date
//                     </label>
//                     <span className="VehicleMaterialpo-info-value">
//                       {selectedPO.expectDate || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//                 {selectedPO.note && (
//                   <div className="VehicleMaterialpo-note-section">
//                     <label className="VehicleMaterialpo-info-label">Note</label>
//                     <p className="VehicleMaterialpo-note-text">
//                       {selectedPO.note}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Order Items */}
//               <div className="VehicleMaterialpo-items-section">
//                 <h3 className="VehicleMaterialpo-section-title">
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M16 4H18A2 2 0 0 1 20 6V20A2 2 0 0 1 18 22H6A2 2 0 0 1 4 20V6A2 2 0 0 1 6 4H8"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <rect
//                       x="8"
//                       y="2"
//                       width="8"
//                       height="4"
//                       rx="1"
//                       ry="1"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                   Order Items ({selectedPO.orderItems?.length || 0})
//                 </h3>
//                 {selectedPO.orderItems && selectedPO.orderItems.length > 0 ? (
//                   <div className="VehicleMaterialpo-items-table-wrapper">
//                     <table className="VehicleMaterialpo-items-table">
//                       <thead>
//                         <tr>
//                           <th>#</th>
//                           <th>Material Name</th>
//                           <th>Order Qty</th>
//                           <th>Received Qty</th>
//                           <th>Remaining Qty</th>
//                           <th>Unit Cost</th>
//                           <th>Total Cost</th>
//                           <th> Status</th>
//                           <th> Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedPO.orderItems.map((item, index) => (
//                           <tr key={item.id || index}>
//                             <td className="VehicleMaterialpo-items-index">
//                               {index + 1}
//                             </td>
//                             <td className="VehicleMaterialpo-items-material">
//                               {item.materialName || "N/A"}
//                             </td>
//                             <td>{item.orderQty || 0}</td>
//                             <td className="VehicleMaterialpo-items-received">
//                               <div className="VehicleMaterialpo-qty-container">
//                                 <span>{item.recivedQty || 0}</span>
//                                 {/* <button
//                                   onClick={() => handleUpdateReceivedQty(item)}
//                                   className="VehicleMaterialpo-update-qty-btn"
//                                   title="Update Received Quantity"
//                                 >
//                                   <svg
//                                     width="14"
//                                     height="14"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M11 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H16A2 2 0 0 0 18 18V11"
//                                       stroke="currentColor"
//                                       strokeWidth="2"
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                     />
//                                     <path
//                                       d="M18.5 2.5A2.121 2.121 0 0 1 21 4.621L12 13.621L8 14.621L9 10.621L18.5 2.5Z"
//                                       stroke="currentColor"
//                                       strokeWidth="2"
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                     />
//                                   </svg>
//                                 </button> */}
//                               </div>
//                             </td>
//                             <td className="VehicleMaterialpo-items-remaining">
//                               {item.reamingQty || 0}
//                             </td>
//                             <td className="VehicleMaterialpo-items-unit-cost">
//                               ₹{item.unitCost || 0}
//                             </td>
//                             <td className="VehicleMaterialpo-items-total-cost">
//                               ₹{item.totalCost || 0}
//                             </td>
//                             <td className="VehicleMaterialpo-items-status">
//                               <span
//                                 className={`VehicleMaterialstatus-badge VehicleMaterialstatus-${
//                                   item.orderItemStatus?.toLowerCase() ||
//                                   "pending"
//                                 }`}
//                               >
//                                 {item.orderItemStatus || "Pending"}
//                               </span>
//                             </td>
//                             <td>
//                               <button
//                                 className="VehicleMaterialpo-add-btn"
//                                 onClick={() => handleShowDeleverdQuantity(item)}
//                               >
//                                 Add
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleViewAllDelivery(
//                                     item.id,
//                                     item.materialName
//                                   )
//                                 }
//                               >
//                                 {" "}
//                                 view
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="VehicleMaterialpo-no-items">
//                     <svg
//                       width="48"
//                       height="48"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M16 16L12 12L8 16"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         d="M12 8V12"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     <p>No order items found for this purchase order.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Received Quantity Modal */}
//       {showUpdateQtyModal && selectedOrderItem && (
//         <div
//           className="VehicleMaterialmodal-overlay"
//           onClick={() => setShowUpdateQtyModal(false)}
//         >
//           <div
//             className="VehicleMaterialupdate-qty-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="VehicleMaterialmodal-header">
//               <h2 className="VehicleMaterialmodal-title">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M11 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H16A2 2 0 0 0 18 18V11"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M18.5 2.5A2.121 2.121 0 0 1 21 4.621L12 13.621L8 14.621L9 10.621L18.5 2.5Z"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Update Received Quantity
//               </h2>
//               <button
//                 onClick={() => setShowUpdateQtyModal(false)}
//                 className="VehicleMaterialmodal-close"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
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
//             <div className="VehicleMaterialupdate-qty-modal-body">
//               <div className="VehicleMaterialupdate-qty-info">
//                 <div className="VehicleMaterialupdate-qty-item-details">
//                   <h3 className="VehicleMaterialupdate-qty-material-name">
//                     {selectedOrderItem.materialName}
//                   </h3>
//                   <div className="VehicleMaterialupdate-qty-details-grid">
//                     <div className="VehicleMaterialupdate-qty-detail">
//                       <label>Order Quantity</label>
//                       <span>{selectedOrderItem.orderQty || 0}</span>
//                     </div>
//                     <div className="VehicleMaterialupdate-qty-detail">
//                       <label>Current Received</label>
//                       <span>{selectedOrderItem.recivedQty || 0}</span>
//                     </div>
//                     <div className="VehicleMaterialupdate-qty-detail">
//                       <label>Remaining</label>
//                       <span>{selectedOrderItem.reamingQty || 0}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <form
//                 onSubmit={handleQtyUpdateSubmit}
//                 className="VehicleMaterialupdate-qty-form"
//               >
//                 <div className="VehicleMaterialform-group">
//                   <label
//                     htmlFor="recivedQty"
//                     className="VehicleMaterialform-label"
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M9 11H15M9 15H15M17 21H7A2 2 0 0 1 5 19V5A2 2 0 0 1 7 3H12.586A1 1 0 0 1 13.293 3.293L17.707 7.707A1 1 0 0 1 18 8.414V19A2 2 0 0 1 17 21Z"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     New Received Quantity
//                   </label>
//                   <input
//                     type="number"
//                     id="recivedQty"
//                     name="recivedQty"
//                     value={updateQtyData.recivedQty}
//                     onChange={handleQtyInputChange}
//                     className="VehicleMaterialform-input"
//                     placeholder="Enter received quantity"
//                     min=""
//                     max={selectedOrderItem.orderQty}
//                     required
//                     disabled={updateQtyLoading}
//                   />
//                   <small className="VehicleMaterialupdate-qty-helper">
//                     Maximum allowed: {selectedOrderItem.orderQty}
//                   </small>
//                 </div>

//                 <div className="VehicleMaterialmodal-actions">
//                   <button
//                     type="button"
//                     onClick={() => setShowUpdateQtyModal(false)}
//                     className="VehicleMaterialcancel-button"
//                     disabled={updateQtyLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="VehicleMaterialsubmit-button"
//                     disabled={updateQtyLoading}
//                   >
//                     {updateQtyLoading ? (
//                       <>
//                         <div className="VehicleMaterialbutton-spinner"></div>
//                         Updating...
//                       </>
//                     ) : (
//                       <>
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M20 6L9 17L4 12"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                         Update Quantity
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {updateQtyError && (
//                   <div className="VehicleMaterialform-message VehicleMaterialform-error">
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="15"
//                         y1="9"
//                         x2="9"
//                         y2="15"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                       <line
//                         x1="9"
//                         y1="9"
//                         x2="15"
//                         y2="15"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     {updateQtyError}
//                   </div>
//                 )}

//                 {updateQtySuccess && (
//                   <div className="VehicleMaterialform-message VehicleMaterialform-success">
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M22 11.08V12A10 10 0 1 1 5.93 7.01"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <polyline
//                         points="22,4 12,14.01 9,11.01"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     {updateQtySuccess}
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Order Item Update Modal */}
//       {showOderItemUpdateModal && orderItemUpdateId && (
//         <div
//           className="VehicleMaterialmodal-overlay"
//           onClick={() => setShowOderItemUpdateModal(false)}
//         >
//           <div
//             className="VehicleMaterialupdate-qty-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="VehicleMaterialmodal-header">
//               <h2 className="VehicleMaterialmodal-title">Update Order Item</h2>
//               <button
//                 onClick={() => setShowOderItemUpdateModal(false)}
//                 className="VehicleMaterialmodal-close"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
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
//             {/* Content for updating order item */}
//             <div className="VehicleMaterialupdate-qty-modal-body">
//               {/* Content goes here */}
//               <form
//                 className="VehicleMaterialupdate-qty-form"
//                 onSubmit={handleUpdateExistingOrderItem}
//               >
//                 <div className="VehicleMaterialform-group">
//                   <label
//                     htmlFor="orderItemStatus"
//                     className="VehicleMaterialform-label"
//                   >
//                     Delivered Quantity
//                   </label>
//                   <input
//                     type="number"
//                     id="deliveredQty"
//                     name="deliveredQty"
//                     className="VehicleMaterialform-input"
//                     placeholder="Enter delivered quantity"
//                     required
//                     value={updateExistingOrderQuantity}
//                     onChange={(e) =>
//                       setupdateExistingOrderQuantity(e.target.value)
//                     }
//                   />
//                   <label htmlFor="">Vehicle Number</label>
//                   <input
//                     type="text"
//                     id="vehicleNumber"
//                     name="vehicleNumber"
//                     className="VehicleMaterialform-input"
//                     placeholder="Enter vehicle number"
//                     required
//                     value={updateExistingVehicleNumber}
//                     onChange={(e) =>
//                       setupdateExistingVehicleNumber(e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="VehicleMaterialmodal-actions">
//                   <button
//                     type="button"
//                     onClick={() => setShowOderItemUpdateModal(false)}
//                     className="VehicleMaterialcancel-button"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="VehicleMaterialsubmit-button"
//                   >
//                     Update Order Item
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VehicleMaterial;

"use client";

import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./VehicleMaterial.css";
import { useNavigate } from "react-router-dom";

function VehicleMaterial() {
  const navigate = useNavigate();
  const { token, role } =
    JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const [poNumbers, setPoNumbers] = useState([]);
  const [vehicleDetailedData, setVehicleDetailedData] = useState([]);
  const [formData, setFormData] = useState({
    vehicleNo: "",
    poNumber: "",
    file: null,
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [showUpdateQtyModal, setShowUpdateQtyModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [updateQtyData, setUpdateQtyData] = useState({
    recivedQty: 0,
  });
  const [updateQtyLoading, setUpdateQtyLoading] = useState(false);
  const [updateQtyError, setUpdateQtyError] = useState(null);
  const [updateQtySuccess, setUpdateQtySuccess] = useState(null);
  const [orderItemUpdateId, setOrderItemUpdateId] = useState(null);
  const [showOderItemUpdateModal, setShowOderItemUpdateModal] = useState(false);
  const [updateExistingOrderQuantity, setupdateExistingOrderQuantity] =
    useState("");
  const [updateExistingVehicleNumber, setupdateExistingVehicleNumber] =
    useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }
        setLoading(true);
        const poResponse = await axiosInstance.get(
          `${BASE_URL}/purchase-orders/all-PoNumber`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const vehicleResponse = await axiosInstance.get(
          `${BASE_URL}/vehicle-entries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(vehicleResponse.data);
        setPoNumbers(poResponse.data || []);
        setVehicleDetailedData(vehicleResponse.data || []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    let filtered = vehicleDetailedData;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.engineerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.purchaseOrder?.poNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.purchaseOrder?.supplierName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.purchaseOrder?.orderItems?.some((oi) =>
            oi.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (item) =>
          item.purchaseOrder?.orderItemStatus?.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }
    if (siteFilter) {
      filtered = filtered.filter(
        (item) => item.purchaseOrder?.siteName === siteFilter
      );
    }
    setFilteredData(filtered);
  }, [vehicleDetailedData, searchTerm, statusFilter, siteFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!formData.vehicleNo || !formData.poNumber) {
      setFormError("Vehicle Number and PO Number are required.");
      return;
    }
    try {
      setLoading(true);
      const data = new FormData();
      data.append("vehicleNo", formData.vehicleNo);
      data.append("poNumber", formData.poNumber);
      if (formData.file) {
        data.append("file", formData.file);
      }
      const response = await axiosInstance.post(
        `${BASE_URL}/vehicle-entries`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFormSuccess("Vehicle entry created successfully!");
      setFormData({ vehicleNo: "", poNumber: "", file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      const vehicleResponse = await axiosInstance.get(
        `${BASE_URL}/vehicle-entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVehicleDetailedData(vehicleResponse.data || []);
    } catch (error) {
      console.error("Failed to create vehicle entry:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to create vehicle entry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const uniqueSiteNames = [
    ...new Set(
      vehicleDetailedData
        .map((item) => item.purchaseOrder?.siteName)
        .filter(Boolean)
    ),
  ];

  const handleImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handlePOView = (purchaseOrder) => {
    setSelectedPO(purchaseOrder);
    setShowPOModal(true);
  };

  const handleFormSubmit = async (e) => {
    await handleSubmit(e);
    if (formSuccess) {
      setShowAddForm(false);
    }
  };

  const handleUpdateReceivedQty = (orderItem) => {
    setSelectedOrderItem(orderItem);
    setUpdateQtyData({
      recivedQty: orderItem.recivedQty || 0,
    });
    setUpdateQtyError(null);
    setUpdateQtySuccess(null);
    setShowUpdateQtyModal(true);
  };

  const handleQtyInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateQtyData((prev) => ({
      ...prev,
      [name]: Number.parseInt(value) || 0,
    }));
  };

  const handleQtyUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateQtyError(null);
    setUpdateQtySuccess(null);
    if (!selectedOrderItem) {
      setUpdateQtyError("No order item selected.");
      return;
    }
    if (updateQtyData.recivedQty < 0) {
      setUpdateQtyError("Received quantity cannot be negative.");
      return;
    }
    if (updateQtyData.recivedQty > selectedOrderItem.orderQty) {
      setUpdateQtyError("Received quantity cannot exceed order quantity.");
      return;
    }
    try {
      setUpdateQtyLoading(true);
      const response = await axiosInstance.put(
        `${BASE_URL}/purchase-orders/order-items/${selectedOrderItem.id}/receive`,
        {
          recivedQty: updateQtyData.recivedQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Received quantity updated successfully!");
      setUpdateQtySuccess("Received quantity updated successfully!");
      const vehicleResponse = await axiosInstance.get(
        `${BASE_URL}/vehicle-entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVehicleDetailedData(vehicleResponse.data || []);
      if (selectedPO) {
        const updatedOrderItems = selectedPO.orderItems.map((item) =>
          item.id === selectedOrderItem.id
            ? {
                ...item,
                recivedQty: updateQtyData.recivedQty,
                reamingQty: item.orderQty - updateQtyData.recivedQty,
              }
            : item
        );
        setSelectedPO({ ...selectedPO, orderItems: updatedOrderItems });
      }
      setTimeout(() => {
        setShowUpdateQtyModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to update received quantity:", error);
      setUpdateQtyError(
        error.response?.data?.message ||
          "Failed to update received quantity. Please try again."
      );
    } finally {
      setUpdateQtyLoading(false);
    }
  };

  function handleShowDeleverdQuantity(item) {
    setOrderItemUpdateId(item.id);
    setShowOderItemUpdateModal(true);
  }

  async function handleUpdateExistingOrderItem(e) {
    e.preventDefault();
    const bodyData = {
      orderItemId: orderItemUpdateId,
      deliveredQty: updateExistingOrderQuantity,
      vehicleNo: updateExistingVehicleNumber,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/deliveries`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Order item updated successfully!");
      setShowOderItemUpdateModal(false);
      setupdateExistingOrderQuantity("");
      setupdateExistingVehicleNumber("");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to update order item. Please try again."
      );
    }
  }

  async function handleViewAllDelivery(id, name) {
    console.log(id, name);
    navigate(`/MaterilOrderSummery/${id}/${name}`);
  }

  if (loading) {
    return (
      <div className="VehicleMaterialcontainer">
        <div className="VehicleMaterialloading-wrapper">
          <div className="VehicleMaterialloading-spinner"></div>
          <div className="VehicleMaterialloading-content">
            <h3 className="VehicleMaterialloading-title">Loading...</h3>
            <p className="VehicleMaterialloading-text">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="VehicleMaterialcontainer">
        <div className="VehicleMaterialerror-wrapper">
          <div className="VehicleMaterialerror-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 22H22L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="VehicleMaterialerror-title">Something went wrong</h3>
          <p className="VehicleMaterialerror-text">{error}</p>
          <button
            className="VehicleMaterialretry-button"
            onClick={() => window.location.reload()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4V10H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 20V14H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!["Admin", "Engineer"].includes(role?.[0]?.roleName)) {
    return (
      <div className="VehicleMaterialcontainer">
        <div className="VehicleMaterialunauthorized-wrapper">
          <div className="VehicleMaterialunauthorized-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M15 9L9 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="VehicleMaterialunauthorized-title">Access Denied</h3>
          <p className="VehicleMaterialunauthorized-text">
            You are not authorized to create vehicle entries.
          </p>
          <p className="VehicleMaterialunauthorized-subtext">
            Please contact your administrator for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="VehicleMaterialcontainer">
      <div className="VehicleMaterialmain-content">
        <div className="VehicleMaterialcontrols-section">
          <div className="VehicleMaterialfilters-container">
            <div className="VehicleMaterialsearch-container">
              <div className="VehicleMaterialsearch-wrapper">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by vehicle, engineer, PO number, supplier, or material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="VehicleMaterialsearch-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="VehicleMaterialsearch-clear"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <div className="VehicleMaterialfilters-wrapper">
              <div className="VehicleMaterialfilter-group">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="VehicleMaterialfilter-select"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
              <div className="VehicleMaterialfilter-group">
                <select
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                  className="VehicleMaterialfilter-select"
                >
                  <option value="">All Sites</option>
                  {uniqueSiteNames.map((siteName, index) => (
                    <option key={index} value={siteName}>
                      {siteName}
                    </option>
                  ))}
                </select>
              </div>
              {(searchTerm || statusFilter || siteFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setSiteFilter("");
                  }}
                  className="VehicleMaterialclear-filters"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6"
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
                  Clear Filters
                </button>
              )}
              <button
                className="VehicleMaterialadd-button"
                onClick={() => setShowAddForm(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add Vehicle
              </button>
            </div>
          </div>
        </div>

        <div className="VehicleMaterialtable-container">
          {filteredData.length > 0 ? (
            <div className="VehicleMaterialtable-wrapper">
              <table className="VehicleMaterialtable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Vehicle No</th>
                    <th>Engineer</th>
                    <th>Site</th>
                    <th>PO Number</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Purchase Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="VehicleMaterialtable-row">
                      <td className="VehicleMaterialtable-cell-index">
                        {index + 1}
                      </td>
                      <td>{item.date || "N/A"}</td>
                      <td>{item.time || "N/A"}</td>
                      <td className="VehicleMaterialtable-cell-vehicle">
                        {item.vehicleNo || "N/A"}
                      </td>
                      <td>{item.engineerName || "N/A"}</td>
                      <td>{item.purchaseOrder?.siteName || "N/A"}</td>
                      <td className="VehicleMaterialtable-cell-po">
                        {item.purchaseOrder?.poNumber || "N/A"}
                      </td>
                      <td>
                        <span
                          className={`VehicleMaterialstatus-badge VehicleMaterialstatus-${
                            item.purchaseOrder?.orderItemStatus?.toLowerCase() ||
                            "pending"
                          }`}
                        >
                          {item.purchaseOrder?.orderItemStatus || "Pending"}
                        </span>
                      </td>
                      <td>
                        {item.images ? (
                          <button
                            onClick={() => handleImageView(item.images)}
                            className="VehicleMaterialview-button"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
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
                            View
                          </button>
                        ) : (
                          <span className="VehicleMaterialno-image">
                            No Image
                          </span>
                        )}
                      </td>
                      <td>
                        {item.purchaseOrder ? (
                          <button
                            onClick={() => handlePOView(item.purchaseOrder)}
                            className="VehicleMaterialpo-button"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polyline
                                points="14,2 14,8 20,8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            View PO
                          </button>
                        ) : (
                          <span className="VehicleMaterialno-po">No PO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="VehicleMaterialno-data">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <h3>No Vehicle Entries Found</h3>
              <p>
                {searchTerm || statusFilter || siteFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start by creating your first vehicle entry using the Add Vehicle button."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Vehicle Form Modal */}
      {showAddForm && (
        <div
          className="VehicleMaterialmodal-overlay"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="VehicleMaterialmodal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleMaterialmodal-header">
              <h2 className="VehicleMaterialmodal-title">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Create Vehicle Entry
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="VehicleMaterialmodal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="VehicleMaterialmodal-form"
            >
              <div className="VehicleMaterialform-grid">
                <div className="VehicleMaterialform-group">
                  <label
                    htmlFor="vehicleNo"
                    className="VehicleMaterialform-label"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7H7V17Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    id="vehicleNo"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className="VehicleMaterialform-input"
                    placeholder="Enter vehicle number (e.g., MH-12-AB-1234)"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="VehicleMaterialform-group">
                  <label
                    htmlFor="poNumber"
                    className="VehicleMaterialform-label"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    PO Number
                  </label>
                  <select
                    id="poNumber"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    className="VehicleMaterialform-select"
                    required
                    disabled={loading || poNumbers.length === 0}
                  >
                    <option value="" disabled>
                      {poNumbers.length === 0
                        ? "No PO Numbers Available"
                        : "Select PO Number"}
                    </option>
                    {poNumbers.map((item, index) => (
                      <option key={index} value={item.poNumber}>
                        {item.poNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="VehicleMaterialform-group VehicleMaterialfile-upload-group">
                <label
                  htmlFor="fileInput"
                  className="VehicleMaterialform-label"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="21,15 16,10 5,21"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Upload Image (Optional)
                </label>
                <div className="VehicleMaterialfile-upload-wrapper">
                  <input
                    type="file"
                    id="fileInput"
                    name="file"
                    onChange={handleFileChange}
                    className="VehicleMaterialfile-input"
                    accept="image/*"
                    disabled={loading}
                    ref={fileInputRef}
                  />
                  <div className="VehicleMaterialfile-upload-display">
                    {formData.file ? (
                      <div className="VehicleMaterialfile-selected">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V9L13 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{formData.file.name}</span>
                      </div>
                    ) : (
                      <div className="VehicleMaterialfile-placeholder">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="7,10 12,15 17,10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="12"
                            y1="15"
                            x2="12"
                            y2="3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p>Click to upload or drag and drop</p>
                        <span>PNG, JPG, GIF up to 10MB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="VehicleMaterialmodal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="VehicleMaterialcancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="VehicleMaterialsubmit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="VehicleMaterialbutton-spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Submit Vehicle Entry
                    </>
                  )}
                </button>
              </div>
              {formError && (
                <div className="VehicleMaterialform-message VehicleMaterialform-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="15"
                      y1="9"
                      x2="9"
                      y2="15"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="9"
                      y1="9"
                      x2="15"
                      y2="15"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="VehicleMaterialform-message VehicleMaterialform-success">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 11.08V12A10 10 0 1 1 5.93 7.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,4 12,14.01 9,11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {formSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div
          className="VehicleMaterialimage-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="VehicleMaterialimage-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleMaterialimage-modal-header">
              <h3 className="VehicleMaterialimage-modal-title">
                Vehicle Image
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="VehicleMaterialimage-modal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <div className="VehicleMaterialimage-modal-body">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Vehicle Entry"
                className="VehicleMaterialfullscreen-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* REDESIGNED Purchase Order Modal */}
      {showPOModal && selectedPO && (
        <div
          className="VehicleMaterialmodal-overlay"
          onClick={() => setShowPOModal(false)}
        >
          <div
            className="VehicleMaterialpo-modal-simple"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="VehicleMaterialpo-modal-header-simple">
              <h2 className="VehicleMaterialpo-modal-title-simple">
                Purchase Order Details
              </h2>
              <button
                onClick={() => setShowPOModal(false)}
                className="VehicleMaterialpo-modal-close-simple"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>

            {/* Modal Body */}
            <div className="VehicleMaterialpo-modal-body-simple">
              {/* Simple PO Details */}
              <div className="VehicleMaterialpo-details-simple">
                <div className="VehicleMaterialpo-detail-row">
                  <span className="VehicleMaterialpo-detail-label-simple">
                    PO Number:
                  </span>
                  <span className="VehicleMaterialpo-detail-value-simple">
                    {selectedPO.poNumber || "N/A"}
                  </span>
                </div>
                <div className="VehicleMaterialpo-detail-row">
                  <span className="VehicleMaterialpo-detail-label-simple">
                    Supplier:
                  </span>
                  <span className="VehicleMaterialpo-detail-value-simple">
                    {selectedPO.supplierName || "N/A"}
                  </span>
                </div>
                <div className="VehicleMaterialpo-detail-row">
                  <span className="VehicleMaterialpo-detail-label-simple">
                    Site Name:
                  </span>
                  <span className="VehicleMaterialpo-detail-value-simple">
                    {selectedPO.siteName || "N/A"}
                  </span>
                </div>
                <div className="VehicleMaterialpo-detail-row">
                  <span className="VehicleMaterialpo-detail-label-simple">
                    Status:
                  </span>
                  <span
                    className={`VehicleMaterialstatus-badge VehicleMaterialstatus-${
                      selectedPO.orderItemStatus?.toLowerCase() || "pending"
                    }`}
                  >
                    {selectedPO.orderItemStatus || "Pending"}
                  </span>
                </div>
                <div className="VehicleMaterialpo-detail-row">
                  <span className="VehicleMaterialpo-detail-label-simple">
                    Order Date:
                  </span>
                  <span className="VehicleMaterialpo-detail-value-simple">
                    {selectedPO.todayDate || "N/A"}
                  </span>
                </div>
                <div className="VehicleMaterialpo-detail-row">
                  <span className="VehicleMaterialpo-detail-label-simple">
                    Expected Date:
                  </span>
                  <span className="VehicleMaterialpo-detail-value-simple">
                    {selectedPO.expectDate || "N/A"}
                  </span>
                </div>
                {selectedPO.note && (
                  <div className="VehicleMaterialpo-note-simple">
                    <strong>Note:</strong> {selectedPO.note}
                  </div>
                )}
              </div>

              {/* Note Section */}

              {/* Order Items Table */}
              <div className="VehicleMaterialpo-items-section-simple">
                <h3 className="VehicleMaterialpo-items-title-simple">
                  Order Items ({selectedPO.orderItems?.length || 0})
                </h3>

                {selectedPO.orderItems && selectedPO.orderItems.length > 0 ? (
                  <div className="VehicleMaterialpo-table-container-simple">
                    <table className="VehicleMaterialpo-table-simple">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Material Name</th>
                          <th>Order Qty</th>
                          <th>Received Qty</th>
                          <th>Remaining Qty</th>
                          <th>Unit Cost</th>
                          <th>Total Cost</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPO.orderItems.map((item, index) => (
                          <tr key={item.id || index}>
                            <td className="VehicleMaterialpo-table-index-simple">
                              {index + 1}
                            </td>
                            <td className="VehicleMaterialpo-table-material-simple">
                              {item.materialName || "N/A"}
                            </td>
                            <td className="VehicleMaterialpo-table-qty-simple">
                              {item.orderQty || 0}
                            </td>
                            <td className="VehicleMaterialpo-table-received-simple">
                              {item.recivedQty || 0}
                            </td>
                            <td className="VehicleMaterialpo-table-remaining-simple">
                              {item.reamingQty || 0}
                            </td>
                            <td className="VehicleMaterialpo-table-cost-simple">
                              ₹{item.unitCost || 0}
                            </td>
                            <td className="VehicleMaterialpo-table-total-simple">
                              ₹{item.totalCost || 0}
                            </td>
                            <td>
                              <span
                                className={`VehicleMaterialstatus-badge-small VehicleMaterialstatus-${
                                  item.orderItemStatus?.toLowerCase() ||
                                  "pending"
                                }`}
                              >
                                {item.orderItemStatus || "Pending"}
                              </span>
                            </td>
                            <td className="VehicleMaterialpo-table-actions-simple">
                              <button
                                className="VehicleMaterialpo-add-btn-simple"
                                onClick={() => handleShowDeleverdQuantity(item)}
                              >
                                Add
                              </button>
                              <button
                                className="VehicleMaterialpo-view-btn-simple"
                                onClick={() =>
                                  handleViewAllDelivery(
                                    item.id,
                                    item.materialName
                                  )
                                }
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="VehicleMaterialpo-no-items-simple">
                    <p>No order items found for this purchase order.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Received Quantity Modal */}
      {showUpdateQtyModal && selectedOrderItem && (
        <div
          className="VehicleMaterialmodal-overlay"
          onClick={() => setShowUpdateQtyModal(false)}
        >
          <div
            className="VehicleMaterialupdate-qty-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleMaterialmodal-header">
              <h2 className="VehicleMaterialmodal-title">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H16A2 2 0 0 0 18 18V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.5A2.121 2.121 0 0 1 21 4.621L12 13.621L8 14.621L9 10.621L18.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Update Received Quantity
              </h2>
              <button
                onClick={() => setShowUpdateQtyModal(false)}
                className="VehicleMaterialmodal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <div className="VehicleMaterialupdate-qty-modal-body">
              <div className="VehicleMaterialupdate-qty-info">
                <div className="VehicleMaterialupdate-qty-item-details">
                  <h3 className="VehicleMaterialupdate-qty-material-name">
                    {selectedOrderItem.materialName}
                  </h3>
                  <div className="VehicleMaterialupdate-qty-details-grid">
                    <div className="VehicleMaterialupdate-qty-detail">
                      <label>Order Quantity</label>
                      <span>{selectedOrderItem.orderQty || 0}</span>
                    </div>
                    <div className="VehicleMaterialupdate-qty-detail">
                      <label>Current Received</label>
                      <span>{selectedOrderItem.recivedQty || 0}</span>
                    </div>
                    <div className="VehicleMaterialupdate-qty-detail">
                      <label>Remaining</label>
                      <span>{selectedOrderItem.reamingQty || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <form
                onSubmit={handleQtyUpdateSubmit}
                className="VehicleMaterialupdate-qty-form"
              >
                <div className="VehicleMaterialform-group">
                  <label
                    htmlFor="recivedQty"
                    className="VehicleMaterialform-label"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 11H15M9 15H15M17 21H7A2 2 0 0 1 5 19V5A2 2 0 0 1 7 3H12.586A1 1 0 0 1 13.293 3.293L17.707 7.707A1 1 0 0 1 18 8.414V19A2 2 0 0 1 17 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    New Received Quantity
                  </label>
                  <input
                    type="number"
                    id="recivedQty"
                    name="recivedQty"
                    value={updateQtyData.recivedQty}
                    onChange={handleQtyInputChange}
                    className="VehicleMaterialform-input"
                    placeholder="Enter received quantity"
                    min="0"
                    max={selectedOrderItem.orderQty}
                    required
                    disabled={updateQtyLoading}
                  />
                  <small className="VehicleMaterialupdate-qty-helper">
                    Maximum allowed: {selectedOrderItem.orderQty}
                  </small>
                </div>
                <div className="VehicleMaterialmodal-actions">
                  <button
                    type="button"
                    onClick={() => setShowUpdateQtyModal(false)}
                    className="VehicleMaterialcancel-button"
                    disabled={updateQtyLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="VehicleMaterialsubmit-button"
                    disabled={updateQtyLoading}
                  >
                    {updateQtyLoading ? (
                      <>
                        <div className="VehicleMaterialbutton-spinner"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Update Quantity
                      </>
                    )}
                  </button>
                </div>
                {updateQtyError && (
                  <div className="VehicleMaterialform-message VehicleMaterialform-error">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="15"
                        y1="9"
                        x2="9"
                        y2="15"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="9"
                        y1="9"
                        x2="15"
                        y2="15"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    {updateQtyError}
                  </div>
                )}
                {updateQtySuccess && (
                  <div className="VehicleMaterialform-message VehicleMaterialform-success">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 11.08V12A10 10 0 1 1 5.93 7.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="22,4 12,14.01 9,11.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {updateQtySuccess}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Item Update Modal */}
      {showOderItemUpdateModal && orderItemUpdateId && (
        <div
          className="VehicleMaterialmodal-overlay"
          onClick={() => setShowOderItemUpdateModal(false)}
        >
          <div
            className="VehicleMaterialupdate-qty-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleMaterialmodal-header">
              <h2 className="VehicleMaterialmodal-title">Update Order Item</h2>
              <button
                onClick={() => setShowOderItemUpdateModal(false)}
                className="VehicleMaterialmodal-close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <div className="VehicleMaterialupdate-qty-modal-body">
              <form
                className="VehicleMaterialupdate-qty-form"
                onSubmit={handleUpdateExistingOrderItem}
              >
                <div className="VehicleMaterialform-group">
                  <label
                    htmlFor="orderItemStatus"
                    className="VehicleMaterialform-label"
                  >
                    Delivered Quantity
                  </label>
                  <input
                    type="number"
                    id="deliveredQty"
                    name="deliveredQty"
                    className="VehicleMaterialform-input"
                    placeholder="Enter delivered quantity"
                    required
                    value={updateExistingOrderQuantity}
                    onChange={(e) =>
                      setupdateExistingOrderQuantity(e.target.value)
                    }
                  />
                  <label htmlFor="">Vehicle Number</label>
                  <input
                    type="text"
                    id="vehicleNumber"
                    name="vehicleNumber"
                    className="VehicleMaterialform-input"
                    placeholder="Enter vehicle number"
                    required
                    value={updateExistingVehicleNumber}
                    onChange={(e) =>
                      setupdateExistingVehicleNumber(e.target.value)
                    }
                  />
                </div>
                <div className="VehicleMaterialmodal-actions">
                  <button
                    type="button"
                    onClick={() => setShowOderItemUpdateModal(false)}
                    className="VehicleMaterialcancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="VehicleMaterialsubmit-button"
                  >
                    Update Order Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleMaterial;
