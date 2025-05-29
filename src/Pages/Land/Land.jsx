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

  const [editLandId, setEditLandId] = useState(null);
  const [ShowEditLandModal, setShowEditLandModal] = useState(false);

  const [editArea, setEditArea] = useState("");
  const [editTotalAmount, setEditTotalAmount] = useState("");
  const [editTokenDate, setEditTokenDate] = useState("");
  const [editTokenAmount, setEditTokenAmount] = useState("");
  const [editAgreementAmount, setEditAgreementAmount] = useState("");
  const [editAgreementDate, setEditAgreementDate] = useState("");
  const [editRegistryAmount, setEditRegistryAmount] = useState("");
  const [editRegistryDate, setEditRegistryDate] = useState("");

  const [editOwnerName, setEditOwnerName] = useState("");
  const [editOwnerPhone, setEditOwnerPhone] = useState("");
  const [editOwnerAadhar, setEditOwnerAadhar] = useState("");
  const [editOwnerAddress, setEditOwnerAddress] = useState("");

  const [editPurchaserName, setEditPurchaserName] = useState("");
  const [editPurchaserPhone, setEditPurchaserPhone] = useState("");
  const [editPurchaserAadhar, setEditPurchaserAadhar] = useState("");
  const [editPurchaserAddress, setEditPurchaserAddress] = useState("");

  const [editLandmark, setEditLandmark] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editState, setEditState] = useState("");
  const [editMuza, setEditMuza] = useState("");
  const [editKhno, setEditKhno] = useState("");
  const [editPlotno, setEditPlotno] = useState("");
  const [editPhno, setEditPhno] = useState("");

  // For partners, you can use an array
  const [editPartners, setEditPartners] = useState([
    { name: "", phoneNumber: "", city: "", addhar_number: "" },
  ]);

  const [LandId, setLandId] = useState("");

  const [showAddpatnerForm, setShowAddPatnerForm] = useState(false);
  const [newPatnerName, setNewPatnerName] = useState("");
  const [newPatnerCity, setNewPatnerCity] = useState("");
  const [newPatnerPhoneNumber, setNewPatnerPhoneNumber] = useState("");
  const [newPatnerAadharNumber, setNewPatnerAadharNumber] = useState("");

  const [patnerTransactionId, setpatnerTransactionId] = useState("");
  const [madeBy, setMadeBy] = useState("PARTNER");
  const [transactionType, setTransactionType] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [note, setNote] = useState("");
  const handleAddPartner = () => {
    setPartners([
      ...partners,
      { name: "", phoneNumber: "", city: "", addhar_number: "" },
    ]);
  };
  const handlePartnerChange = (index, field, value) => {
    const updatedPartners = [...editPartners];
    updatedPartners[index][field] = value;
    setEditPartners(updatedPartners);
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

  const openTransactionModal = (id) => {
    alert(id);
    setpatnerTransactionId(id);
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

  async function handleDeleteProperty(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/Land/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Property deleted successfully");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEditProperty(id) {
    setEditLandId(id);
    setShowEditLandModal(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/Land/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      setEditArea(data.area);
      setEditTotalAmount(data.totalAmount);
      setEditTokenDate(data.tokenDate);
      setEditTokenAmount(data.tokenAmount);
      setEditAgreementAmount(data.agreementAmount);
      setEditAgreementDate(data.agreementDate);
      setEditRegistryAmount(data.registryAmount);
      setEditRegistryDate(data.registryDate);

      setEditOwnerName(data.owner.name);
      setEditOwnerPhone(data.owner.phoneNumber);
      setEditOwnerAadhar(data.owner.aadharNumber);
      setEditOwnerAddress(data.owner.address);

      setEditPurchaserName(data.purchaser.name);
      setEditPurchaserPhone(data.purchaser.phoneNumber);
      setEditPurchaserAadhar(data.purchaser.aadharNumber);
      setEditPurchaserAddress(data.purchaser.address);

      setEditLandmark(data.address.landmark);
      setEditPincode(data.address.pincode);
      setEditCity(data.address.city);
      setEditState(data.address.state);
      setEditCountry(data.address?.country || "India");
      setEditMuza(data.address?.muza || "");
      setEditKhno(data.address?.khno || "");
      setEditPlotno(data.address?.plotno || "");
      setEditPhno(data.address?.phno || "");

      setEditPartners(data.partners || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateland(e) {
    e.preventDefault();
    const body = {
      area: editArea,
      tokenAmount: editTokenAmount,
      tokenDate: editTokenDate,
      agreementAmount: editAgreementAmount,
      agreementDate: editAgreementDate,
      registryAmount: editRegistryAmount,
      registryDate: editRegistryDate,
      totalAmount: editTotalAmount,
      address: {
        landmark: editLandmark,
        pincode: editPincode,
        city: editCity,
        country: editCountry,
        state: editState,
        muza: editMuza,
        khno: editKhno,
        plotno: editPlotno,
        phno: editPhno,
      },
      purchaser: {
        name: editPurchaserName,
        address: editPurchaserAddress,
        phoneNumber: editPurchaserPhone,
        aadharNumber: editPurchaserAadhar,
      },
      owner: {
        name: editOwnerName,
        address: editOwnerAddress,
        phoneNumber: editOwnerPhone,
        aadharNumber: editOwnerAadhar,
      },
      partners: editPartners.map((p) => ({
        name: p.name,
        city: p.city,
        phoneNumber: p.phoneNumber,
        addhar_number: p.addhar_number,
      })),
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/updateLand/${editLandId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Land updated successfully");
        setRefreshKey((prev) => prev + 1);
        setShowEditLandModal(false);
        setEditLandId(null);
        setEditArea("");
        setEditTotalAmount("");
        setEditTokenDate("");
        setEditTokenAmount("");
        setEditAgreementAmount("");
        setEditAgreementDate("");
        setEditRegistryAmount("");
        setEditRegistryDate("");
        setEditLandmark("");
        setEditPincode("");
        setEditCity("");
        setEditState("");
        setEditCountry("");
        setEditMuza("");
        setEditKhno("");
        setEditPlotno("");
        setEditPhno("");
        setEditPurchaserName("");
        setEditPurchaserAddress("");
        setEditPurchaserPhone("");
        setEditPurchaserAadhar("");
        setEditOwnerName("");
        setEditOwnerAddress("");
        setEditOwnerPhone("");
        setEditOwnerAadhar("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleShowAddpatnerForm(id) {
    setLandId(id);
    setShowAddPatnerForm(true);
  }

  const handleAddPatner = async (e) => {
    e.preventDefault();
    const newPatnerData = {
      name: newPatnerName,
      city: newPatnerCity,
      phoneNumber: newPatnerPhoneNumber,
      addhar_number: newPatnerAadharNumber,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/Land/${LandId}/addPartner`,
        newPatnerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Patner Added Successfully");
        setRefreshKey(refreshKey + 1);
        setNewPatnerName("");
        setNewPatnerCity("");
        setNewPatnerPhoneNumber("");
        setNewPatnerAadharNumber("");
        setShowAddPatnerForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleDeletePatner(id) {
    alert(id);
  }

  const handleSubmitpatnerTransaction = async (e) => {
    e.preventDefault();

    const transactionbody = {
      transactionDate,
      transactionAmount: parseFloat(transactionAmount),
      note,
      change: transactionType,
      madeBy,
      status: paymentMethod,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/addpayment/partner/${patnerTransactionId}`,
        transactionbody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      if (response.status === 201) {
        alert("Patner Transaction Added Successfully");
        setRefreshKey(refreshKey + 1);
        setTransactionDate("");
        setTransactionAmount("");
        setNote("");
        setTransactionType("");

        setPaymentMethod("");
        setShowTransactionModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                        onClick={() => handleEditProperty(item.id)}
                      >
                        <Edit />
                      </button>
                      <button
                        className="land-action-btn land-delete-btn"
                        title="Delete"
                        onClick={() => {
                          handleDeleteProperty(item.id);
                        }}
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
                        {item.partners?.length > 0 ? (
                          item.partners.map((partner, pIndex) => {
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
                                    onClick={() =>
                                      openTransactionModal(partner.id)
                                    }
                                  >
                                    <Plus className="land-btn-icon-sm" /> Add
                                    Transaction
                                  </button>
                                  <button
                                    className="land-transaction-btn"
                                    onClick={() =>
                                      handleDeletePatner(partner.id)
                                    }
                                  >
                                    Delete
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
                                            ₹
                                            {txn.transactionAmount.toLocaleString()}
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
                          })
                        ) : (
                          <p className="land-no-partners">
                            No partners available
                          </p>
                        )}
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
              <button
                className="land-modal-btn land-modal-edit-btn"
                onClick={() => handleShowAddpatnerForm(selectedProperty.id)}
              >
                <Edit className="land-modal-btn-icon" /> Add Patner
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
              <form
                className="land-transaction-form"
                onSubmit={handleSubmitpatnerTransaction}
              >
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Made By</label>
                    <input
                      type="text"
                      value={madeBy}
                      // onChange={(e) => setMadeBy(e.target.value)}
                    />

                    <label>Transaction Type</label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                    >
                      <option value="">Select type</option>
                      <option value="CREDIT">CREDIT</option>
                      <option value="DEBIT">DEBIT</option>
                    </select>
                  </div>

                  <div className="land-form-group">
                    <label>Transaction Date</label>
                    <input
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                    />
                  </div>

                  <div className="land-form-group">
                    <label>Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Select method</option>
                      <option value="CASH">Cash</option>
                      <option value="CHECK">Cheque</option>
                      <option value="RTGS">RTGS</option>
                      <option value="UPI">UPI</option>
                      <option value="NEFT">NEFT</option>
                    </select>
                  </div>
                </div>

                <div className="land-form-group land-form-group-full">
                  <label>Note</label>
                  <textarea
                    placeholder="Enter transaction note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
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

      {/* land Edit model */}

      {ShowEditLandModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowEditLandModal(false)}
        >
          <div
            className="land-modal-content land-edit-land-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Edit Land</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowEditLandModal(false)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <form
                className="land-add-property-form"
                onSubmit={handleUpdateland}
              >
                <div className="land-form-section">
                  <h3 className="land-form-section-title">Property Details</h3>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Area (sqft)</label>
                      <input
                        type="number"
                        placeholder="Area"
                        value={editArea}
                        onChange={(e) => setEditArea(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Total Amount</label>
                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={editTotalAmount}
                        onChange={(e) => setEditTotalAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Token Date</label>
                      <input
                        type="date"
                        placeholder="Token Date"
                        value={editTokenDate}
                        onChange={(e) => setEditTokenDate(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Token Amount</label>
                      <input
                        type="number"
                        placeholder="Token Amount"
                        value={editTokenAmount}
                        onChange={(e) => setEditTokenAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Agreement Amount</label>
                      <input
                        type="number"
                        placeholder="Agreement Amount"
                        value={editAgreementAmount}
                        onChange={(e) => setEditAgreementAmount(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Agreement Date</label>
                      <input
                        type="date"
                        placeholder="Agreement Date"
                        value={editAgreementDate}
                        onChange={(e) => setEditAgreementDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Registry Amount</label>
                      <input
                        type="number"
                        placeholder="Registry Amount"
                        value={editRegistryAmount}
                        onChange={(e) => setEditRegistryAmount(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Registry Date</label>
                      <input
                        type="date"
                        placeholder="Registry Date"
                        value={editRegistryDate}
                        onChange={(e) => setEditRegistryDate(e.target.value)}
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
                        value={editOwnerName}
                        onChange={(e) => setEditOwnerName(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Owner Phone"
                        value={editOwnerPhone}
                        onChange={(e) => setEditOwnerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Aadhar Number</label>

                      <input
                        type="text"
                        placeholder="Owner Aadhar"
                        value={editOwnerAadhar}
                        onChange={(e) => setEditOwnerAadhar(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>Address</label>
                      <textarea
                        placeholder="Owner Address"
                        value={editOwnerAddress}
                        onChange={(e) => setEditOwnerAddress(e.target.value)}
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
                        value={editPurchaserName}
                        onChange={(e) => setEditPurchaserName(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Purchaser Number</label>
                      <input
                        type="tel"
                        placeholder="Purchaser Phone"
                        value={editPurchaserPhone}
                        onChange={(e) => setEditPurchaserPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Purchaser Aadhar Number</label>
                      <input
                        type="text"
                        placeholder="Purchaser Aadhar"
                        value={editPurchaserAadhar}
                        onChange={(e) => setEditPurchaserAadhar(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>Purchaser Address</label>
                      <textarea
                        placeholder="Purchaser Address"
                        value={editPurchaserAddress}
                        onChange={(e) =>
                          setEditPurchaserAddress(e.target.value)
                        }
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
                        value={editLandmark}
                        onChange={(e) => setEditLandmark(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Pincode Number</label>
                      <input
                        placeholder="Pincode"
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>city</label>
                      <input
                        placeholder="City"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>Country</label>
                      <input
                        placeholder="Country"
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>state</label>
                      <input
                        placeholder="State"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>muza</label>
                      <input
                        placeholder="Muza"
                        value={editMuza}
                        onChange={(e) => setEditMuza(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>khno</label>
                      <input
                        placeholder="KHNO"
                        value={editKhno}
                        onChange={(e) => setEditKhno(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>plot No</label>
                      <input
                        placeholder="Plot No"
                        value={editPlotno}
                        onChange={(e) => setEditPlotno(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group land-form-group-full">
                      <label>phno</label>
                      <input
                        placeholder="PHNO"
                        value={editPhno}
                        onChange={(e) => setEditPhno(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="land-form-section">
                  <h3 className="land-form-section-title">Partner Details</h3>
                  {editPartners.map((partner, index) => (
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
                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" /> Update Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* add patner model */}
      {showAddpatnerForm && (
        <>
          <div className="Add_newPatner_popup_form_overlay">
            <form className="Add_newPatner_form" onSubmit={handleAddPatner}>
              <button
                type="button"
                onClick={() => setShowAddPatnerForm(false)}
                className="Add_newPatner_popup_form_close_button"
              >
                X
              </button>
              <input
                type="text"
                placeholder="Enter Patner Name"
                className="Add_newPatner_form_input"
                value={newPatnerName}
                onChange={(e) => setNewPatnerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Patner City Name"
                className="Add_newPatner_form_input"
                value={newPatnerCity}
                onChange={(e) => setNewPatnerCity(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Patner PhoneNumber"
                className="Add_newPatner_form_input"
                value={newPatnerPhoneNumber}
                onChange={(e) => setNewPatnerPhoneNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Patner Adhar Number"
                className="Add_newPatner_form_input"
                value={newPatnerAadharNumber}
                onChange={(e) => setNewPatnerAadharNumber(e.target.value)}
              />
              <button
                className="Add_newPatner_form_submit_button"
                type="submit"
              >
                Add Patner
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Land;
