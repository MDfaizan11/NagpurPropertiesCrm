// import { useEffect, useState } from "react";
// import "../Land/land.css";
// import axiosInstance from "../../utils/axiosInstance";
// import { BASE_URL } from "../../config";
// import { Search } from "lucide-react";
// function Land() {
//   const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
//   const [landData, setLandData] = useState([]);
//   const [toggleSection, setToggleSection] = useState({});

//   useEffect(() => {
//     async function getAllLand() {
//       try {
//         const response = await axiosInstance.get(`${BASE_URL}/AllLand`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         setLandData(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     getAllLand();
//   }, [token]);

//   const toggle = (key) => {
//     setToggleSection((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   return (
//     <>
//       <div className="office-header">
//         <div className="office-header-bg">
//           <div className="animated-shape shape-1"></div>
//           <div className="animated-shape shape-2"></div>
//           <div className="animated-shape shape-3"></div>
//           <div className="animated-shape shape-4"></div>
//         </div>
//         <div className="office-header-content">
//           <h1 className="office-title">Land Management</h1>
//           <p className="office-subtitle">
//             Comprehensive property management with advanced analytics and
//             seamless tracking
//           </p>
//         </div>
//       </div>

//       <div className="land_search_section">
//         <input
//           type="search"
//           className="Land_search_bar"
//           placeholder={`${(<Search />)} Enter Owner Name.. `}
//         />
//         <div className="AddLand_button_wrapper">
//           <select name="" id="">
//             <option value=""> </option>
//           </select>

//           <button className="land_add_property_button"> + Add Property</button>
//         </div>
//       </div>
//       <div className="land-container">
//         <h2>Land Records</h2>
//         {landData.length === 0 ? (
//           <p>No Data Found</p>
//         ) : (
//           landData.map((item, landIndex) => {
//             const baseKey = `land-${landIndex}`;
//             return (
//               <div key={item.id} className="land-card">
//                 <h2> Owner Name : {item.owner?.name}</h2>
//                 <h3>
//                   Plot No: {item.plotno || "N/A"} | Area: {item.area} sqft
//                 </h3>
//                 <p>Total: ₹{item.totalAmount}</p>
//                 <p>
//                   Token: ₹{item.tokenAmount} on {item.tokenDate}
//                 </p>
//                 <p>
//                   Agreement: ₹{item.agreementAmount} on {item.agreementDate}
//                 </p>
//                 <p>
//                   Registry: ₹{item.registryAmount} on {item.registryDate}
//                 </p>
//                 <p>Remaining: ₹{item.reamingAmount}</p>

//                 {/* Section Toggles */}
//                 <div className="land_button-group">
//                   <button onClick={() => toggle(`${baseKey}-owner`)}>
//                     Owner
//                   </button>
//                   <button onClick={() => toggle(`${baseKey}-purchaser`)}>
//                     Purchaser
//                   </button>
//                   <button onClick={() => toggle(`${baseKey}-partners`)}>
//                     Partners
//                   </button>
//                   <button onClick={() => toggle(`${baseKey}-address`)}>
//                     Address
//                   </button>
//                 </div>

//                 {/* Owner */}
//                 {toggleSection[`${baseKey}-owner`] && item.owner && (
//                   <div className="landowner_section">
//                     <h4>Owner</h4>
//                     <p>Name: {item.owner.name}</p>
//                     <p>Phone: {item.owner.phoneNumber}</p>
//                     <p>Aadhar: {item.owner.aadharNumber}</p>
//                     <p>Address: {item.owner.address}</p>
//                     <button onClick={() => toggle(`${baseKey}-owner-txn`)}>
//                       {toggleSection[`${baseKey}-owner-txn`]
//                         ? "Hide Transactions"
//                         : "Show Transactions"}
//                     </button>
//                     <button>Add Transaction</button>
//                     {toggleSection[`${baseKey}-owner-txn`] &&
//                       (item.owner.landTransactions?.length > 0 ? (
//                         item.owner.landTransactions.map((txn, i) => (
//                           <p key={i}>
//                             {txn.transactionDate} - ₹{txn.transactionAmount} (
//                             {txn.change}) - {txn.note}
//                           </p>
//                         ))
//                       ) : (
//                         <p>No Transactions</p>
//                       ))}
//                   </div>
//                 )}

//                 {/* Purchaser */}
//                 {toggleSection[`${baseKey}-purchaser`] && item.purchaser && (
//                   <div className="land_purches_section">
//                     <h4>Purchaser</h4>
//                     <p>Name: {item.purchaser.name}</p>
//                     <p>Phone: {item.purchaser.phoneNumber}</p>
//                     <p>Aadhar: {item.purchaser.aadharNumber}</p>
//                     <p>Address: {item.purchaser.address}</p>
//                     <button onClick={() => toggle(`${baseKey}-purchaser-txn`)}>
//                       {toggleSection[`${baseKey}-purchaser-txn`]
//                         ? "Hide Transactions"
//                         : "Show Transactions"}
//                     </button>
//                     <button>Add Transaction</button>
//                     {toggleSection[`${baseKey}-purchaser-txn`] &&
//                       (item.purchaser.landTransactions?.length > 0 ? (
//                         item.purchaser.landTransactions.map((txn, i) => (
//                           <p key={i}>
//                             {txn.transactionDate} - ₹{txn.transactionAmount} (
//                             {txn.change}) - {txn.note}
//                           </p>
//                         ))
//                       ) : (
//                         <p>No Transactions</p>
//                       ))}
//                   </div>
//                 )}

//                 {/* Partners */}
//                 {toggleSection[`${baseKey}-partners`] && (
//                   <div className="land_patner_section">
//                     <h4>Partners</h4>
//                     {item.partners?.map((partner, pIndex) => {
//                       const partnerKey = `${baseKey}-partner-${pIndex}`;
//                       return (
//                         <div
//                           key={partner.id || pIndex}
//                           className="partner-section"
//                         >
//                           <p>Name: {partner.name}</p>
//                           <p>Phone: {partner.phoneNumber}</p>
//                           <p>Aadhar: {partner.addhar_number}</p>
//                           <p>City: {partner.city}</p>
//                           <button onClick={() => toggle(`${partnerKey}-txn`)}>
//                             {toggleSection[`${partnerKey}-txn`]
//                               ? "Hide Transactions"
//                               : "Show Transactions"}
//                           </button>
//                           <button>Add Transaction</button>
//                           {toggleSection[`${partnerKey}-txn`] &&
//                             (partner.landTransactions?.length > 0 ? (
//                               partner.landTransactions.map((txn, i) => (
//                                 <p key={i}>
//                                   {txn.transactionDate} - ₹
//                                   {txn.transactionAmount} ({txn.change}) -{" "}
//                                   {txn.note}
//                                 </p>
//                               ))
//                             ) : (
//                               <p>No Transactions</p>
//                             ))}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Address */}
//                 {toggleSection[`${baseKey}-address`] && item.address && (
//                   <div className="land_address_section">
//                     <h4>Property Address</h4>
//                     <p>Landmark: {item.address.landmark}</p>
//                     <p>City: {item.address.city}</p>
//                     <p>State: {item.address.state}</p>
//                     <p>Pincode: {item.address.pincode}</p>
//                     <p>KH No: {item.address.khno}</p>
//                     <p>MUZA: {item.address.muza}</p>
//                     <p>Plot No: {item.address.plotno}</p>
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </>
//   );
// }

// export default Land;

"use client";

import { useEffect, useState } from "react";
import "../Land/land.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import {
  Search,
  Plus,
  MapPin,
  User,
  Users,
  Home,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  IndianRupee,
  Phone,
  CreditCard,
  Building,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function Land() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [landData, setLandData] = useState([]);
  const [toggleSection, setToggleSection] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [area, setArea] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenDate, setTokenDate] = useState("");
  const [agreementAmount, setAgreementAmount] = useState("");
  const [agreementDate, setAgreementDate] = useState("");
  const [registryAmount, setRegistryAmount] = useState("");
  const [registryDate, setRegistryDate] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerAadhar, setOwnerAadhar] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserPhone, setPurchaserPhone] = useState("");
  const [purchaserAadhar, setPurchaserAadhar] = useState("");
  const [purchaserAddress, setPurchaserAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [muza, setMuza] = useState("");
  const [khno, setKhno] = useState("");
  const [plotno, setPlotno] = useState("");
  const [phno, setPhno] = useState("");

  const [partners, setPartners] = useState([]);

  const handleAddPartner = () => {
    setPartners([
      ...partners,
      { name: "", phoneNumber: "", city: "", addhar_number: "" },
    ]);
  };
  const handlePartnerChange = (index, field, value) => {
    const updatedPartners = [...partners];
    updatedPartners[index][field] = value;
    setPartners(updatedPartners);
  };

  useEffect(() => {
    async function getAllLand() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${BASE_URL}/AllLand`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setLandData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getAllLand();
  }, [token, refreshKey]);

  const toggle = (key) => {
    setToggleSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredLandData = landData.filter((item) => {
    const matchesSearch =
      item.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plotno?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && item.reamingAmount > 0) ||
      (activeTab === "completed" && item.reamingAmount === 0);

    return matchesSearch && matchesTab;
  });

  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
  };

  const closePropertyDetails = () => {
    setSelectedProperty(null);
  };

  const openAddPropertyModal = () => {
    setShowAddPropertyModal(true);
  };

  const closeAddPropertyModal = () => {
    setShowAddPropertyModal(false);
  };

  const openTransactionModal = () => {
    setShowTransactionModal(true);
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
  };

  async function handleSubmitAddLand(e) {
    e.preventDefault();
    const body = {
      area: parseFloat(area),
      tokenAmount: parseFloat(tokenAmount),
      tokenDate,
      agreementAmount: parseFloat(agreementAmount),
      agreementDate,
      registryAmount: registryAmount || "0",
      registryDate,
      totalAmount: parseFloat(totalAmount),
      address: {
        landmark,
        pincode,
        city,
        state,
        country,
        muza,
        khno,
        plotno,
        phno,
      },
      purchaser: {
        name: purchaserName,
        address: purchaserAddress,
        phoneNumber: purchaserPhone,
        aadharNumber: purchaserAadhar,
      },
      owner: {
        name: ownerName,
        address: ownerAddress,
        phoneNumber: ownerPhone,
        aadharNumber: ownerAadhar,
      },
      partners,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/createLand`,
        body,
        {
          headers: {
            Authorization: `Bearer${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Land Added Successfully");
        setRefreshKey((prev) => prev + 1);
        setShowAddPropertyModal(false);
        setArea("");
        setTokenAmount("");
        setTokenDate("");
        setAgreementAmount("");
        setAgreementDate("");
        setRegistryAmount("");
        setRegistryDate("");
        setTotalAmount("");
        setLandmark("");
        setPincode("");
        setCity("");
        setState("");
        setCountry("");
        setMuza("");
        setKhno("");
        setPlotno("");
        setPhno("");
        setPurchaserName("");
        setPurchaserAddress("");
        setPurchaserPhone("");
        setPurchaserAadhar("");
        setOwnerName("");
        setOwnerAddress("");
        setOwnerPhone("");
        setOwnerAadhar("");
        setPartners([]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {/* Header Section */}
      <div className="land-header">
        <div className="land-header-bg">
          <div className="land-animated-shape land-shape-1"></div>
          <div className="land-animated-shape land-shape-2"></div>
          <div className="land-animated-shape land-shape-3"></div>
          <div className="land-animated-shape land-shape-4"></div>
        </div>
        <div className="land-header-content">
          <h1 className="land-title">Land Management System</h1>
          <p className="land-subtitle">
            Comprehensive property management with advanced analytics and
            seamless tracking
          </p>
          {/* <div className="land-stats">
            <div className="land-stat-item">
              <span className="land-stat-number">{landData.length}</span>
              <span className="land-stat-label">Total Properties</span>
            </div>
            <div className="land-stat-item">
              <span className="land-stat-number">
                ₹
                {landData
                  .reduce((sum, item) => sum + (item.totalAmount || 0), 0)
                  .toLocaleString()}
              </span>
              <span className="land-stat-label">Total Value</span>
            </div>
            <div className="land-stat-item">
              <span className="land-stat-number">
                {landData.filter((item) => item.reamingAmount === 0).length}
              </span>
              <span className="land-stat-label">Completed</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="land-search-section">
        <div className="land-search-container">
          <div className="land-search-wrapper">
            <Search className="land-search-icon" />
            <input
              type="search"
              className="land-search-bar"
              placeholder="Search by owner name or plot number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          className="land-add-property-button"
          onClick={openAddPropertyModal}
        >
          <Plus className="land-button-icon" />
          Add Property
        </button>
      </div>

      {/* Tabs */}
      <div className="land-tabs-container">
        <div className="land-tabs">
          <button
            className={`land-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Properties
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="land-container">
        {loading ? (
          <div className="land-loading">
            <div className="land-spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : filteredLandData.length === 0 ? (
          <div className="land-no-data">
            <Building className="land-no-data-icon" />
            <h3>No Properties Found</h3>
            <p>Start by adding your first property to the system</p>
            <button
              className="land-add-first-property"
              onClick={openAddPropertyModal}
            >
              <Plus /> Add First Property
            </button>
          </div>
        ) : (
          <div className="land-grid">
            {filteredLandData.map((item, landIndex) => {
              const baseKey = `land-${landIndex}`;
              const isCompleted = item.reamingAmount === 0;

              return (
                <div
                  key={item.id}
                  className={`land-card ${
                    isCompleted ? "land-card-completed" : ""
                  }`}
                >
                  {/* <div className="land-card-status">
                    {isCompleted ? (
                      <span className="land-status-badge land-status-completed">
                        <CheckCircle className="land-status-icon" /> Completed
                      </span>
                    ) : (
                      <span className="land-status-badge land-status-pending">
                        <Clock className="land-status-icon" /> Pending
                      </span>
                    )}
                  </div> */}

                  <div className="land-card-header">
                    <div className="land-card-title">
                      <h3>{item.owner?.name || "Unknown Owner"}</h3>
                      <span className="land-plot-number">
                        Plot #{item.plotno || "N/A"}
                      </span>
                    </div>
                    <div className="land-card-actions">
                      <button
                        className="land-action-btn land-view-btn"
                        onClick={() => openPropertyDetails(item)}
                        title="View Details"
                      >
                        <Eye />
                      </button>
                      <button
                        className="land-action-btn land-edit-btn"
                        title="Edit"
                      >
                        <Edit />
                      </button>
                      <button
                        className="land-action-btn land-delete-btn"
                        title="Delete"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  <div className="land-card-content">
                    <div className="land-property-info">
                      <div className="land-info-item land-info-area">
                        <MapPin className="land-info-icon" />
                        <span>{item.area} sqft</span>
                      </div>
                      <div className="land-info-item land-info-price">
                        <IndianRupee className="land-info-icon" />
                        <span>₹{item.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="land-payment-summary">
                      <div className="land-payment-item land-payment-token">
                        <span className="land-payment-label">Token</span>
                        <span className="land-payment-amount">
                          ₹{item.tokenAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="land-payment-item land-payment-agreement">
                        <span className="land-payment-label">Agreement</span>
                        <span className="land-payment-amount">
                          ₹{item.agreementAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="land-payment-item land-payment-registry">
                        <span className="land-payment-label">Registry</span>
                        <span className="land-payment-amount">
                          ₹{item.registryAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="land-payment-item land-remaining">
                        <span className="land-payment-label">Remaining</span>
                        <span className="land-payment-amount">
                          ₹{item.reamingAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="land-button-group">
                      <button
                        className={`land-toggle-btn ${
                          toggleSection[`${baseKey}-owner`] ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(`${baseKey}-owner`);
                        }}
                      >
                        <User className="land-btn-icon" />
                        Owner
                      </button>
                      <button
                        className={`land-toggle-btn ${
                          toggleSection[`${baseKey}-purchaser`] ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(`${baseKey}-purchaser`);
                        }}
                      >
                        <User className="land-btn-icon" />
                        Purchaser
                      </button>
                      <button
                        className={`land-toggle-btn ${
                          toggleSection[`${baseKey}-partners`] ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(`${baseKey}-partners`);
                        }}
                      >
                        <Users className="land-btn-icon" />
                        Partners
                      </button>
                      <button
                        className={`land-toggle-btn ${
                          toggleSection[`${baseKey}-address`] ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(`${baseKey}-address`);
                        }}
                      >
                        <Home className="land-btn-icon" />
                        Address
                      </button>
                    </div>

                    {/* Expandable Sections */}
                    {toggleSection[`${baseKey}-owner`] && item.owner && (
                      <div
                        className={`land-section land-address-section ${
                          toggleSection[`${baseKey}-address`] ? "expanded" : ""
                        }`}
                      >
                        <h4 className="land-section-title">Owner Details</h4>
                        <div className="land-person-info">
                          <div className="land-person-detail">
                            <User className="land-detail-icon" />
                            <span>{item.owner.name}</span>
                          </div>
                          <div className="land-person-detail">
                            <Phone className="land-detail-icon" />
                            <span>{item.owner.phoneNumber}</span>
                          </div>
                          <div className="land-person-detail">
                            <CreditCard className="land-detail-icon" />
                            <span>{item.owner.aadharNumber}</span>
                          </div>
                          <div className="land-person-detail">
                            <MapPin className="land-detail-icon" />
                            <span>{item.owner.address}</span>
                          </div>
                        </div>
                        <div className="land-transaction-controls">
                          <button
                            className="land-transaction-btn"
                            onClick={() => toggle(`${baseKey}-owner-txn`)}
                          >
                            {toggleSection[`${baseKey}-owner-txn`]
                              ? "Hide"
                              : "Show"}{" "}
                            Transactions
                          </button>
                          <button
                            className="land-add-transaction-btn"
                            onClick={openTransactionModal}
                          >
                            <Plus className="land-btn-icon-sm" /> Add
                            Transaction
                          </button>
                        </div>
                        {toggleSection[`${baseKey}-owner-txn`] && (
                          <div className="land-transactions">
                            {item.owner.landTransactions?.length > 0 ? (
                              item.owner.landTransactions.map((txn, i) => (
                                <div key={i} className="land-transaction-item">
                                  <div className="land-transaction-date">
                                    <Calendar className="land-transaction-icon" />
                                    {txn.transactionDate}
                                  </div>
                                  <div className="land-transaction-amount">
                                    <IndianRupee className="land-transaction-icon" />
                                    ₹{txn.transactionAmount}
                                  </div>
                                  <div className="land-transaction-note">
                                    {txn.note}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="land-no-transactions">
                                No transactions found
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {toggleSection[`${baseKey}-purchaser`] &&
                      item.purchaser && (
                        <div className="land-section land-purchaser-section">
                          <h4 className="land-section-title">
                            Purchaser Details
                          </h4>
                          <div className="land-person-info">
                            <div className="land-person-detail">
                              <User className="land-detail-icon" />
                              <span>{item.purchaser.name}</span>
                            </div>
                            <div className="land-person-detail">
                              <Phone className="land-detail-icon" />
                              <span>{item.purchaser.phoneNumber}</span>
                            </div>
                            <div className="land-person-detail">
                              <CreditCard className="land-detail-icon" />
                              <span>{item.purchaser.aadharNumber}</span>
                            </div>
                            <div className="land-person-detail">
                              <MapPin className="land-detail-icon" />
                              <span>{item.purchaser.address}</span>
                            </div>
                          </div>
                          <div className="land-transaction-controls">
                            <button
                              className="land-transaction-btn"
                              onClick={() => toggle(`${baseKey}-purchaser-txn`)}
                            >
                              {toggleSection[`${baseKey}-purchaser-txn`]
                                ? "Hide"
                                : "Show"}{" "}
                              Transactions
                            </button>
                            <button
                              className="land-add-transaction-btn"
                              onClick={openTransactionModal}
                            >
                              <Plus className="land-btn-icon-sm" /> Add
                              Transaction
                            </button>
                          </div>
                          {toggleSection[`${baseKey}-purchaser-txn`] && (
                            <div className="land-transactions">
                              {item.purchaser.landTransactions?.length > 0 ? (
                                item.purchaser.landTransactions.map(
                                  (txn, i) => (
                                    <div
                                      key={i}
                                      className="land-transaction-item"
                                    >
                                      <div className="land-transaction-date">
                                        <Calendar className="land-transaction-icon" />
                                        {txn.transactionDate}
                                      </div>
                                      <div className="land-transaction-amount">
                                        <IndianRupee className="land-transaction-icon" />
                                        ₹{txn.transactionAmount}
                                      </div>
                                      <div className="land-transaction-note">
                                        {txn.note}
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="land-no-transactions">
                                  No transactions found
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    {toggleSection[`${baseKey}-partners`] && (
                      <div className="land-section land-partners-section">
                        <h4 className="land-section-title">Partners</h4>
                        {item.partners?.map((partner, pIndex) => {
                          const partnerKey = `${baseKey}-partner-${pIndex}`;
                          return (
                            <div
                              key={partner.id || pIndex}
                              className="land-partner-card"
                            >
                              <div className="land-person-info">
                                <div className="land-person-detail">
                                  <User className="land-detail-icon" />
                                  <span>{partner.name}</span>
                                </div>
                                <div className="land-person-detail">
                                  <Phone className="land-detail-icon" />
                                  <span>{partner.phoneNumber}</span>
                                </div>
                                <div className="land-person-detail">
                                  <CreditCard className="land-detail-icon" />
                                  <span>{partner.addhar_number}</span>
                                </div>
                                <div className="land-person-detail">
                                  <MapPin className="land-detail-icon" />
                                  <span>{partner.city}</span>
                                </div>
                              </div>
                              <div className="land-transaction-controls">
                                <button
                                  className="land-transaction-btn"
                                  onClick={() => toggle(`${partnerKey}-txn`)}
                                >
                                  {toggleSection[`${partnerKey}-txn`]
                                    ? "Hide"
                                    : "Show"}{" "}
                                  Transactions
                                </button>
                                <button
                                  className="land-add-transaction-btn"
                                  onClick={openTransactionModal}
                                >
                                  <Plus className="land-btn-icon-sm" /> Add
                                  Transaction
                                </button>
                              </div>
                              {toggleSection[`${partnerKey}-txn`] && (
                                <div className="land-transactions">
                                  {partner.landTransactions?.length > 0 ? (
                                    partner.landTransactions.map((txn, i) => (
                                      <div
                                        key={i}
                                        className="land-transaction-item"
                                      >
                                        <div className="land-transaction-date">
                                          <Calendar className="land-transaction-icon" />
                                          {txn.transactionDate}
                                        </div>
                                        <div className="land-transaction-amount">
                                          <IndianRupee className="land-transaction-icon" />
                                          ₹{txn.transactionAmount}
                                        </div>
                                        <div className="land-transaction-note">
                                          {txn.note}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="land-no-transactions">
                                      No transactions found
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {toggleSection[`${baseKey}-address`] && item.address && (
                      <div className="land-section land-address-section">
                        <h4 className="land-section-title">Property Address</h4>
                        <div className="land-address-grid">
                          <div className="land-address-item">
                            <span className="land-address-label">Landmark</span>
                            <span className="land-address-value">
                              {item.address.landmark}
                            </span>
                          </div>
                          <div className="land-address-item">
                            <span className="land-address-label">City</span>
                            <span className="land-address-value">
                              {item.address.city}
                            </span>
                          </div>
                          <div className="land-address-item">
                            <span className="land-address-label">State</span>
                            <span className="land-address-value">
                              {item.address.state}
                            </span>
                          </div>
                          <div className="land-address-item">
                            <span className="land-address-label">Pincode</span>
                            <span className="land-address-value">
                              {item.address.pincode}
                            </span>
                          </div>
                          <div className="land-address-item">
                            <span className="land-address-label">KH No</span>
                            <span className="land-address-value">
                              {item.address.khno}
                            </span>
                          </div>
                          <div className="land-address-item">
                            <span className="land-address-label">MUZA</span>
                            <span className="land-address-value">
                              {item.address.muza}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="land-modal-overlay" onClick={closePropertyDetails}>
          <div
            className="land-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Property Details</h2>
              <button
                className="land-modal-close"
                onClick={closePropertyDetails}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <div className="land-property-overview">
                <h3>{selectedProperty.owner?.name}</h3>
                <p>
                  Plot #{selectedProperty.plotno} • {selectedProperty.area} sqft
                </p>
                <div className="land-property-value">
                  Total Value: ₹{selectedProperty.totalAmount?.toLocaleString()}
                </div>

                <div className="land-property-status">
                  {selectedProperty.reamingAmount === 0 ? (
                    <div className="land-status-complete">
                      <CheckCircle className="land-status-icon-lg" />
                      <span>Payment Completed</span>
                    </div>
                  ) : (
                    <div className="land-status-pending">
                      <AlertCircle className="land-status-icon-lg" />
                      <span>
                        Pending Amount: ₹
                        {selectedProperty.reamingAmount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="land-modal-details">
                <div className="land-modal-section">
                  <h4>Payment Details</h4>
                  <div className="land-modal-payment-grid">
                    <div className="land-modal-payment-item">
                      <span className="land-modal-payment-label">
                        Token Amount
                      </span>
                      <span className="land-modal-payment-value">
                        ₹{selectedProperty.tokenAmount?.toLocaleString()}
                      </span>
                      <span className="land-modal-payment-date">
                        {selectedProperty.tokenDate}
                      </span>
                    </div>
                    <div className="land-modal-payment-item">
                      <span className="land-modal-payment-label">
                        Agreement Amount
                      </span>
                      <span className="land-modal-payment-value">
                        ₹{selectedProperty.agreementAmount?.toLocaleString()}
                      </span>
                      <span className="land-modal-payment-date">
                        {selectedProperty.agreementDate}
                      </span>
                    </div>
                    <div className="land-modal-payment-item">
                      <span className="land-modal-payment-label">
                        Registry Amount
                      </span>
                      <span className="land-modal-payment-value">
                        ₹{selectedProperty.registryAmount?.toLocaleString()}
                      </span>
                      <span className="land-modal-payment-date">
                        {selectedProperty.registryDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="land-modal-footer">
              <button className="land-modal-btn land-modal-edit-btn">
                <Edit className="land-modal-btn-icon" /> Edit Property
              </button>
              <button
                className="land-modal-btn land-modal-transaction-btn"
                onClick={openTransactionModal}
              >
                <Plus className="land-modal-btn-icon" /> Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="land-modal-overlay" onClick={closeAddPropertyModal}>
          <div
            className="land-modal-content land-add-property-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Add New Property</h2>
              <button
                className="land-modal-close"
                onClick={closeAddPropertyModal}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <form
                className="land-add-property-form"
                onSubmit={handleSubmitAddLand}
              >
                <div className="land-form-section">
                  <h3 className="land-form-section-title">Property Details</h3>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Area (sqft)</label>
                      <input
                        type="number"
                        placeholder="Area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Total Amount</label>
                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Token Date</label>
                      <input
                        type="date"
                        placeholder="Token Date"
                        value={tokenDate}
                        onChange={(e) => setTokenDate(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Token Amount</label>
                      <input
                        type="number"
                        placeholder="Token Amount"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Agreement Amount</label>
                      <input
                        type="number"
                        placeholder="Agreement Amount"
                        value={agreementAmount}
                        onChange={(e) => setAgreementAmount(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Agreement Date</label>
                      <input
                        type="date"
                        placeholder="Agreement Date"
                        value={agreementDate}
                        onChange={(e) => setAgreementDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Registry Amount</label>
                      <input
                        type="number"
                        placeholder="Registry Amount"
                        value={registryAmount}
                        onChange={(e) => setRegistryAmount(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Registry Date</label>
                      <input
                        type="date"
                        placeholder="Registry Date"
                        value={registryDate}
                        onChange={(e) => setRegistryDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="land-form-section">
                  <h3 className="land-form-section-title">Owner Details</h3>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Owner Name</label>
                      <input
                        type="text"
                        placeholder="Owner Name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Owner Phone"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Aadhar Number</label>
                      <input
                        type="text"
                        placeholder="Owner Aadhar"
                        value={ownerAadhar}
                        onChange={(e) => setOwnerAadhar(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>Address</label>
                      <textarea
                        placeholder="Owner Address"
                        value={ownerAddress}
                        onChange={(e) => setOwnerAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="land-form-section">
                  <h3 className="land-form-section-title">Purchaser Details</h3>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Purchaser Name</label>
                      <input
                        type="text"
                        placeholder="Purchaser Name"
                        value={purchaserName}
                        onChange={(e) => setPurchaserName(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Purchaser Number</label>
                      <input
                        type="tel"
                        placeholder="Purchaser Phone"
                        value={purchaserPhone}
                        onChange={(e) => setPurchaserPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Purchaser Aadhar Number</label>
                      <input
                        type="text"
                        placeholder="Purchaser Aadhar"
                        value={purchaserAadhar}
                        onChange={(e) => setPurchaserAadhar(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>Purchaser Address</label>
                      <textarea
                        placeholder="Purchaser Address"
                        value={purchaserAddress}
                        onChange={(e) => setPurchaserAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="land-form-section">
                  <h3 className="land-form-section-title">Address Details</h3>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Landmark</label>
                      <input
                        placeholder="Landmark"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Pincode Number</label>
                      <input
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>city</label>
                      <input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>Country</label>
                      <input
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>state</label>
                      <input
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>muza</label>
                      <input
                        placeholder="Muza"
                        value={muza}
                        onChange={(e) => setMuza(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>khno</label>
                      <input
                        placeholder="KHNO"
                        value={khno}
                        onChange={(e) => setKhno(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>plot No</label>
                      <input
                        placeholder="Plot No"
                        value={plotno}
                        onChange={(e) => setPlotno(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>phno</label>
                      <input
                        placeholder="PHNO"
                        value={phno}
                        onChange={(e) => setPhno(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="land-form-section">
                  <h3 className="land-form-section-title">Partner Details</h3>
                  {partners.map((partner, index) => (
                    <div className="land-form-row" key={index}>
                      <h3 className="land-form-section-title">
                        Partner {index + 1}
                      </h3>
                      <div className="land-form-group">
                        <label>Partner Name</label>
                        <input
                          type="text"
                          placeholder="Enter partner name"
                          value={partner.name}
                          onChange={(e) =>
                            handlePartnerChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="land-form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={partner.phoneNumber}
                          onChange={(e) =>
                            handlePartnerChange(
                              index,
                              "phoneNumber",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="land-form-group">
                        <label>City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={partner.city}
                          onChange={(e) =>
                            handlePartnerChange(index, "city", e.target.value)
                          }
                        />
                      </div>
                      <div className="land-form-group">
                        <label>Aadhar Number</label>
                        <input
                          type="text"
                          placeholder="Enter Aadhar number"
                          value={partner.addhar_number}
                          onChange={(e) =>
                            handlePartnerChange(
                              index,
                              "addhar_number",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="land-form-actions">
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={handleAddPartner}
                  >
                    {" "}
                    Add Patner
                  </button>
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={closeAddPropertyModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" /> Add Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="land-modal-overlay" onClick={closeTransactionModal}>
          <div
            className="land-modal-content land-transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Add Transaction</h2>
              <button
                className="land-modal-close"
                onClick={closeTransactionModal}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <form className="land-transaction-form">
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Transaction Type</label>
                    <select>
                      <option value="">Select type</option>
                      <option value="agreement">Agreement</option>
                      <option value="registry">Registry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="land-form-group">
                    <label>Transaction Date</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Amount</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="land-form-group">
                    <label>Payment Method</label>
                    <select>
                      <option value="">Select method</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                </div>
                <div className="land-form-group land-form-group-full">
                  <label>Note</label>
                  <textarea placeholder="Enter transaction note"></textarea>
                </div>
                <div className="land-form-actions">
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={closeTransactionModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" /> Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Land;
