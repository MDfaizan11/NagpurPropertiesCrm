import { useEffect, useState } from "react";
import "./land.css";
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
  EllipsisVertical,
} from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function Land() {
  const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const token = userData?.token;
  const role = userData?.role?.[0]?.roleName || "Partner";
  const userId = userData?.id;
  const partnerLandData = userData?.lands;

  const [landData, setLandData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [toggleSection, setToggleSection] = useState({});

  // Modal states
  const [showOwnerModal, setShowOwnerModal] = useState(null);
  const [showPurchaserModal, setShowPurchaserModal] = useState(null);
  const [showPartnersModal, setShowPartnersModal] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(null);
  const [showTransactionTableModal, setShowTransactionTableModal] =
    useState(false);
  const [transactionTableData, setTransactionTableData] = useState([]);
  const [transactionTableTitle, setTransactionTableTitle] = useState("");

  // Property form states
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

  // Button dropdown - now per row
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Edit states
  const [editLandId, setEditLandId] = useState(null);
  const [showEditLandModal, setShowEditLandModal] = useState(false);
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
  const [editPartners, setEditPartners] = useState([]);

  // Partner states
  const [landId, setLandId] = useState("");
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
  const [partnersData, setPartnersData] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [partnerTransactionId, setpartnerTransactionId] = useState("");
  const [OwnerTransactionId, setOwnerTransactionId] = useState("");
  const [purcheserTransactionId, setPurcheserTransactionId] = useState("");

  // Transaction states
  const [partnerTransaction, setPartnerTransaction] = useState({
    id: null,
    transactionDate: "",
    transactionAmount: "",
    note: "",
    change: "",
    madeBy: "PARTNER",
    status: "",
    nextPaymentDate: "",
    nextPaymentAmount: "",
    nextPaymentRemark: "",
  });

  const [purchaserTransaction, setPurchaserTransaction] = useState({
    id: null,
    transactionDate: "",
    transactionAmount: "",
    note: "",
    change: "CREDIT",
    madeBy: "PURCHASER",
    status: "UPI",
    nextPaymentDate: "",
    nextPaymentAmount: "",
    nextPaymentRemark: "",
  });

  const [ownerTransaction, setOwnerTransaction] = useState({
    id: null,
    transactionDate: "",
    transactionAmount: "",
    note: "",
    change: "",
    madeBy: "OWNER",
    status: "",
    nextPaymentDate: "",
    nextPaymentAmount: "",
    nextPaymentRemark: "",
  });

  // Transaction context
  const [partnerLandId, setPartnerLandId] = useState("");
  const [purchaserLandId, setPurchaserLandId] = useState("");
  const [ownerLandId, setOwnerLandId] = useState("");
  const [showAddPurcheserTransaction, setShowAddPurcheserTransaction] =
    useState(false);
  const [showOwnerTransactionModal, setShowOwnerTransactionModal] =
    useState(false);

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Helper function to get avatar color
  const getAvatarColor = (name) => {
    if (!name) return "#6b7280";
    const colors = [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  useEffect(() => {
    async function fetchLandData() {
      try {
        setLoading(true);
        if (!token) {
          alert("User not authenticated. Please log in.");
          return;
        }
        if (role === "Admin") {
          const response = await axiosInstance.get(`${BASE_URL}/AllLand`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log("fetchLandData response:", response.data);
          setLandData(response.data);
        } else if (role === "Partner" && partnerLandData) {
          console.log("fetchLandData (Partner) response:", partnerLandData);
          setLandData(partnerLandData);
        } else {
          setLandData([]);
        }
      } catch (error) {
        console.error("Error fetching land data:", error);
        alert("Failed to fetch land data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchLandData();
  }, [token, userId, role, refreshKey]);

  useEffect(() => {
    if (role !== "Admin" && role !== "Head") return;
    async function fetchPartners() {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/show-ActivePartner`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("fetchPartners response:", response.data);
        setPartnersData(response.data);
      } catch (error) {
        console.error("Error fetching partners:", error);
        alert("Failed to fetch partners. Please try again.");
      }
    }
    fetchPartners();
  }, []);

  const toggleSectionHandler = (key) => {
    setToggleSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredLandData =
    role === "Partner"
      ? partnerLandData
      : landData.filter(
          (item) =>
            (item.owner?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              item.address?.plotno
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            (activeTab === "all" ||
              (activeTab === "pending" && item.reamingAmount > 0) ||
              (activeTab === "completed" && item.reamingAmount === 0))
        );

  // Modal handlers
  const openOwnerModal = (item) => {
    setShowOwnerModal(item);
    setOwnerLandId(item.id);
    setOpenDropdownId(null);
  };

  const openPurchaserModal = (item) => {
    setShowPurchaserModal(item);
    setPurchaserLandId(item.id);
    setOpenDropdownId(null);
  };

  const openPartnersModal = (item) => {
    setShowPartnersModal(item);
    setPartnerLandId(item.id);
    setOpenDropdownId(null);
  };

  const openAddressModal = (item) => {
    setShowAddressModal(item);
    setOpenDropdownId(null);
  };

  const openTransactionTable = (transactions, title) => {
    const sortedTable = [...transactions].sort((a, b) => {
      return new Date(b.transactionDate) - new Date(a.transactionDate);
    });
    console.log(sortedTable);
    setTransactionTableData(sortedTable || []);
    setTransactionTableTitle(title);
    setShowTransactionTableModal(true);
  };

  const closeTransactionTable = () => {
    setShowTransactionTableModal(false);
    setTransactionTableData([]);
    setTransactionTableTitle("");
  };

  // Property handlers
  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setOpenDropdownId(null);
  };

  const closePropertyDetails = () => setSelectedProperty(null);
  const openAddPropertyModal = () => setShowAddPropertyModal(true);
  const closeAddPropertyModal = () => setShowAddPropertyModal(false);

  // Transaction handlers
  const openTransactionModal = (partnerId, landId) => {
    setPartnerLandId(landId);
    setPartnerTransaction((prev) => ({ ...prev, id: null, madeBy: "PARTNER" }));
    setShowTransactionModal(true);
    setpartnerTransactionId(partnerId);
  };

  const closeTransactionModal = () => setShowTransactionModal(false);

  // Handle dropdown toggle
  const handleDropdownToggle = (itemId) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function handleSubmitAddLand(e) {
    e.preventDefault();
    const body = {
      area: Number.parseFloat(area),
      tokenAmount: Number.parseFloat(tokenAmount),
      tokenDate,
      agreementAmount: Number.parseFloat(agreementAmount),
      agreementDate,
      registryAmount: Number.parseFloat(registryAmount) || 0,
      registryDate,
      totalAmount: Number.parseFloat(totalAmount),
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleSubmitAddLand response:", response.data);
      if (response.status === 201) {
        alert("Land Added Successfully");
        setRefreshKey((prev) => prev + 1);
        closeAddPropertyModal();
        resetPropertyForm();
      }
    } catch (error) {
      console.error("Error adding land:", error);
      alert("Failed to add land. Please try again.");
    }
  }

  async function handleDeleteProperty(id) {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      const response = await axiosInstance.delete(`${BASE_URL}/Land/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("handleDeleteProperty response:", response.data);
      if (response.status === 200) {
        alert("Property deleted successfully");
        setRefreshKey((prev) => prev + 1);
        setOpenDropdownId(null);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property. Please try again.");
    }
  }

  async function handleEditProperty(id) {
    setEditLandId(id);
    setShowEditLandModal(true);
    setOpenDropdownId(null);

    try {
      const response = await axiosInstance.get(`${BASE_URL}/Land/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("handleEditProperty response:", response.data);
      const data = response.data;
      setEditArea(data.area || "");
      setEditTotalAmount(data.totalAmount || "");
      setEditTokenDate(data.tokenDate || "");
      setEditTokenAmount(data.tokenAmount || "");
      setEditAgreementAmount(data.agreementAmount || "");
      setEditAgreementDate(data.agreementDate || "");
      setEditRegistryAmount(data.registryAmount || "");
      setEditRegistryDate(data.registryDate || "");
      setEditOwnerName(data.owner?.name || "");
      setEditOwnerPhone(data.owner?.phoneNumber || "");
      setEditOwnerAadhar(data.owner?.aadharNumber || "");
      setEditOwnerAddress(data.owner?.address || "");
      setEditPurchaserName(data.purchaser?.name || "");
      setEditPurchaserPhone(data.purchaser?.phoneNumber || "");
      setEditPurchaserAadhar(data.purchaser?.aadharNumber || "");
      setEditPurchaserAddress(data.purchaser?.address || "");
      setEditLandmark(data.address?.landmark || "");
      setEditPincode(data.address?.pincode || "");
      setEditCity(data.address?.city || "");
      setEditState(data.address?.state || "");
      setEditCountry(data.address?.country || "India");
      setEditMuza(data.address?.muza || "");
      setEditKhno(data.address?.khno || "");
      setEditPlotno(data.address?.plotno || "");
      setEditPhno(data.address?.phno || "");
      setEditPartners(data.partners || []);
    } catch (error) {
      console.error("Error fetching land data for edit:", error);
      alert("Failed to fetch land data for edit. Please try again.");
    }
  }

  async function handleUpdateLand(e) {
    e.preventDefault();
    const body = {
      area: Number.parseFloat(editArea),
      tokenAmount: Number.parseFloat(editTokenAmount),
      tokenDate: editTokenDate,
      agreementAmount: Number.parseFloat(editAgreementAmount),
      agreementDate: editAgreementDate,
      registryAmount: Number.parseFloat(editRegistryAmount) || 0,
      registryDate: editRegistryDate,
      totalAmount: Number.parseFloat(editTotalAmount),
      address: {
        landmark: editLandmark,
        pincode: editPincode,
        city: editCity,
        state: editState,
        country: editCountry,
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
      console.log("handleUpdateLand response:", response.data);
      if (response.status === 200) {
        alert("Land updated successfully");
        setRefreshKey((prev) => prev + 1);
        setShowEditLandModal(false);
        resetEditPropertyForm();
      }
    } catch (error) {
      console.error("Error updating land:", error);
      alert("Failed to update land. Please try again.");
    }
  }

  async function handleAddPartner(e) {
    e.preventDefault();
    const body = { partnerIds: selectedPartners };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/lands/${landId}/partners`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleAddPartner response:", response.data);
      if (response.status === 200) {
        alert("Partner Added Successfully");
        setRefreshKey((prev) => prev + 1);
        setSelectedPartners([]);
        setShowAddPartnerForm(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding partner:", error);
      alert("Failed to add partner. Please try again.");
    }
  }

  async function handleDeletePartner(partnerId) {
    if (!window.confirm("Are you sure you want to delete this partner?"))
      return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/lands/${partnerLandId}/partners/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleDeletePartner response:", response.data);
      if (response.status === 200) {
        alert("Partner Removed successfully");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Failed to delete partner. Please try again.");
    }
  }

  async function handleSubmitPartnerTransaction(e) {
    e.preventDefault();
    const body = {
      transactionDate: partnerTransaction.transactionDate,
      transactionAmount: Number.parseFloat(
        partnerTransaction.transactionAmount
      ),
      note: partnerTransaction.note,
      change: partnerTransaction.change,
      madeBy: partnerTransaction.madeBy,
      status: partnerTransaction.status,
    };
    const queryParams = new URLSearchParams({
      nextPaymentDate: partnerTransaction.nextPaymentDate || "",
      nextPaymentAmount: partnerTransaction.nextPaymentAmount || "",
      remark: partnerTransaction.nextPaymentRemark || "",
    }).toString();

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/addpayment/partner/${partnerTransactionId}/land/${partnerLandId}?${queryParams}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleSubmitPartnerTransaction response:", response.data);
      if (response.status === 201) {
        alert("Partner Transaction Added Successfully");
        setRefreshKey((prev) => prev + 1);
        resetPartnerTransaction();
        closeTransactionModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding partner transaction:", error);
      alert("Failed to add partner transaction. Please try again.");
    }
  }

  async function handleEditPartnerTransaction(id) {
    setPartnerTransaction((prev) => ({ ...prev, id }));
    setShowTransactionModal(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/landtransaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleEditPartnerTransaction response:", response.data);
      const data = response.data;
      setPartnerTransaction({
        id,
        transactionDate: data.transactionDate || "",
        transactionAmount: data.transactionAmount || "",
        note: data.note || "",
        change: data.change || "",
        madeBy: data.madeBy || "PARTNER",
        status: data.status || "",
        nextPaymentDate:
          data.nextPaymentDate || data.nextPaymentDateForPartner || "",
        nextPaymentAmount:
          data.nextPaymentAmount || data.nextPaymentAmountForPartner || "",
        nextPaymentRemark:
          data.nextPaymentRemark || data.remarkForPartner || data.remark || "",
      });
    } catch (error) {
      console.error("Error fetching partner transaction:", error);
      alert("Failed to load partner transaction data. Please try again.");
    }
  }

  async function handleUpdatePartnerTransaction(e) {
    e.preventDefault();
    const amount = Number.parseFloat(partnerTransaction.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    const body = {
      transactionDate: partnerTransaction.transactionDate,
      transactionAmount: amount,
      note: partnerTransaction.note,
      change: partnerTransaction.change,
      madeBy: partnerTransaction.madeBy,
      status: partnerTransaction.status,
      // Add partner-specific fields if role is Partner
      nextPaymentDateForPartner: partnerTransaction.nextPaymentDate || null,
      nextPaymentAmountForPartner: partnerTransaction.nextPaymentAmount || null,
      remarkForPartner: partnerTransaction.nextPaymentRemark || "",
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/editpayment/All/${partnerTransaction.id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleUpdatePartnerTransaction response:", response.data);
      if (response.status === 200) {
        alert("Partner Transaction Updated Successfully");
        setRefreshKey((prev) => prev + 1);
        resetPartnerTransaction();
        window.location.reload();
        closeTransactionModal();
      }
    } catch (error) {
      console.error("Error updating partner transaction:", error);
      alert("Failed to update partner transaction. Please try again.");
    }
  }

  async function handleDeletePartnerTransaction(id) {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/deletepayment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleDeletePartnerTransaction response:", response.data);
      if (response.status === 200) {
        alert("Partner Transaction deleted successfully");
        setRefreshKey((prev) => prev + 1);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting partner transaction:", error);
      alert("Failed to delete partner transaction. Please try again.");
    }
  }

  function handleAddPurchaserTransaction(id, landId) {
    setPurchaserLandId(landId);
    setPurchaserTransaction((prev) => ({
      ...prev,
      id: null,
      madeBy: "PURCHASER",
    }));
    setShowAddPurcheserTransaction(true);
    setPurcheserTransactionId(id);
  }

  const handleChangePurchaser = (e) => {
    const { name, value } = e.target;
    setPurchaserTransaction((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitPurchaserTransaction(e) {
    e.preventDefault();
    const amount = Number.parseFloat(purchaserTransaction.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    const body = {
      transactionDate: purchaserTransaction.transactionDate,
      transactionAmount: amount,
      note: purchaserTransaction.note,
      change: purchaserTransaction.change,
      madeBy: purchaserTransaction.madeBy,
      status: purchaserTransaction.status,
    };
    const queryParams = new URLSearchParams({
      nextPaymentDate: purchaserTransaction.nextPaymentDate || "",
      nextPaymentAmount: purchaserTransaction.nextPaymentAmount || "",
      remark: purchaserTransaction.nextPaymentRemark || "",
    }).toString();

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/addpayment/purchaser/${purcheserTransactionId}/land/${purchaserLandId}?${queryParams}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleSubmitPurchaserTransaction response:", response.data);
      if (response.status === 201) {
        alert("Purchaser Transaction Added Successfully");
        setRefreshKey((prev) => prev + 1);
        resetPurchaserTransaction();
        setShowAddPurcheserTransaction(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding purchaser transaction:", error);
      alert("Failed to add purchaser transaction. Please try again.");
    }
  }

  async function handleEditPurchaserTransaction(id, landId) {
    setPurchaserLandId(landId);
    setPurchaserTransaction((prev) => ({ ...prev, id }));
    setShowAddPurcheserTransaction(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/landtransaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleEditPurchaserTransaction response:", response.data);
      const data = response.data;
      setPurchaserTransaction({
        id,
        transactionDate: data.transactionDate || "",
        transactionAmount: data.transactionAmount || "",
        note: data.note || "",
        change: data.change || "CREDIT",
        madeBy: data.madeBy || "PURCHASER",
        status: data.status || "UPI",
        nextPaymentDate: data.nextPaymentDate || "",
        nextPaymentAmount: data.nextPaymentAmount || "",
        nextPaymentRemark: data.nextPaymentRemark || data.remark || "",
      });
    } catch (error) {
      console.error("Error fetching purchaser transaction:", error);
      alert("Failed to load purchaser transaction data. Please try again.");
    }
  }

  async function handleUpdatePurchaserTransaction(e) {
    e.preventDefault();
    const amount = Number.parseFloat(purchaserTransaction.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    const body = {
      transactionDate: purchaserTransaction.transactionDate,
      transactionAmount: amount,
      note: purchaserTransaction.note,
      change: purchaserTransaction.change,
      madeBy: purchaserTransaction.madeBy,
      status: purchaserTransaction.status,
    };
    const queryParams = new URLSearchParams({
      nextPaymentDate: purchaserTransaction.nextPaymentDate || "",
      nextPaymentAmount: purchaserTransaction.nextPaymentAmount || "",
      remark: purchaserTransaction.nextPaymentRemark || "",
    }).toString();

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/editpayment/All/${purchaserTransaction.id}?${queryParams}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleUpdatePurchaserTransaction response:", response.data);
      if (response.status === 200 && response.data?.success) {
        alert("Purchaser Transaction Updated Successfully");
        setRefreshKey((prev) => prev + 1);
        resetPurchaserTransaction();
        setShowAddPurcheserTransaction(false);
      } else {
        alert("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error updating purchaser transaction:", error);
      alert("Failed to update purchaser transaction. Please try again.");
    }
  }

  async function handleDeletePurchaserTransaction(id) {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/deletepayment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleDeletePurchaserTransaction response:", response.data);
      if (response.status === 200) {
        alert("Purchaser Transaction deleted successfully");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting purchaser transaction:", error);
      alert("Failed to delete purchaser transaction. Please try again.");
    }
  }

  function handleAddOwnerTransaction(id, landId) {
    setOwnerLandId(landId);
    setOwnerTransaction((prev) => ({ ...prev, id: null, madeBy: "OWNER" }));
    setShowOwnerTransactionModal(true);
    setOwnerTransactionId(id);
  }

  const handleChangeOwner = (e) => {
    const { name, value } = e.target;
    setOwnerTransaction((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitOwnerTransaction(e) {
    e.preventDefault();
    const amount = Number.parseFloat(ownerTransaction.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    const body = {
      transactionDate: ownerTransaction.transactionDate,
      transactionAmount: amount,
      note: ownerTransaction.note,
      change: ownerTransaction.change,
      madeBy: ownerTransaction.madeBy,
      status: ownerTransaction.status,
    };
    const queryParams = new URLSearchParams({
      nextPaymentDate: ownerTransaction.nextPaymentDate || "",
      nextPaymentAmount: ownerTransaction.nextPaymentAmount || "",
      remark: ownerTransaction.nextPaymentRemark || "",
    }).toString();

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/addpayment/owner/${OwnerTransactionId}/land/${ownerLandId}?${queryParams}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleSubmitOwnerTransaction response:", response.data);
      if (response.status === 201) {
        alert("Owner Transaction Added Successfully");
        setRefreshKey((prev) => prev + 1);
        resetOwnerTransaction();
        setShowOwnerTransactionModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding owner transaction:", error);
      alert("Failed to add owner transaction. Please try again.");
    }
  }

  async function handleEditOwnerTransaction(id) {
    setOwnerTransaction((prev) => ({ ...prev, id }));
    setShowOwnerTransactionModal(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/landtransaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleEditOwnerTransaction response:", response.data);
      const data = response.data;
      setOwnerTransaction({
        id,
        transactionDate: data.transactionDate || "",
        transactionAmount: data.transactionAmount || "",
        note: data.note || "",
        change: data.change || "",
        madeBy: data.madeBy || "OWNER",
        status: data.status || "",
        nextPaymentDate: data.nextPaymentDate || "",
        nextPaymentAmount: data.nextPaymentAmount || "",
        nextPaymentRemark: data.nextPaymentRemark || data.remark || "",
      });
    } catch (error) {
      console.error("Error fetching owner transaction:", error);
      alert("Failed to load owner transaction data. Please try again.");
    }
  }

  async function handleUpdateOwnerTransaction(e) {
    e.preventDefault();
    const amount = Number.parseFloat(ownerTransaction.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    const body = {
      transactionDate: ownerTransaction.transactionDate,
      transactionAmount: amount,
      note: ownerTransaction.note,
      change: ownerTransaction.change,
      madeBy: ownerTransaction.madeBy,
      status: ownerTransaction.status,
    };
    const queryParams = new URLSearchParams({
      nextPaymentDate: ownerTransaction.nextPaymentDate || "",
      nextPaymentAmount: ownerTransaction.nextPaymentAmount || "",
      remark: ownerTransaction.nextPaymentRemark || "",
    }).toString();

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/editpayment/All/${ownerTransaction.id}?${queryParams}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleUpdateOwnerTransaction response:", response.data);
      if (response.status === 200) {
        alert("Owner Transaction Updated Successfully");
        setRefreshKey((prev) => prev + 1);
        resetOwnerTransaction();
        setShowOwnerTransactionModal(false);
      }
    } catch (error) {
      console.error("Error updating owner transaction:", error);
      alert("Failed to update owner transaction. Please try again.");
    }
  }

  async function handleDeleteOwnerTransaction(id) {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/deletepayment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleDeleteOwnerTransaction response:", response.data);
      if (response.status === 200) {
        alert("Owner Transaction deleted successfully");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting owner transaction:", error);
      alert("Failed to delete owner transaction. Please try again.");
    }
  }

  const handleCheckboxChange = (partnerId) => {
    setSelectedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  // Reset functions
  const resetPropertyForm = () => {
    setArea("");
    setTotalAmount("");
    setTokenAmount("");
    setTokenDate("");
    setAgreementAmount("");
    setAgreementDate("");
    setRegistryAmount("");
    setRegistryDate("");
    setOwnerName("");
    setOwnerPhone("");
    setOwnerAadhar("");
    setOwnerAddress("");
    setPurchaserName("");
    setPurchaserPhone("");
    setPurchaserAadhar("");
    setPurchaserAddress("");
    setLandmark("");
    setPincode("");
    setCity("");
    setState("");
    setCountry("");
    setMuza("");
    setKhno("");
    setPlotno("");
    setPhno("");
    setPartners([]);
  };

  const resetEditPropertyForm = () => {
    setEditLandId(null);
    setEditArea("");
    setEditTotalAmount("");
    setEditTokenDate("");
    setEditTokenAmount("");
    setEditAgreementAmount("");
    setEditAgreementDate("");
    setEditRegistryAmount("");
    setEditRegistryDate("");
    setEditOwnerName("");
    setEditOwnerPhone("");
    setEditOwnerAadhar("");
    setEditOwnerAddress("");
    setEditPurchaserName("");
    setEditPurchaserPhone("");
    setEditPurchaserAadhar("");
    setEditPurchaserAddress("");
    setEditLandmark("");
    setEditPincode("");
    setEditCity("");
    setEditState("");
    setEditCountry("");
    setEditMuza("");
    setEditKhno("");
    setEditPlotno("");
    setEditPhno("");
    setEditPartners([]);
  };

  const resetPartnerTransaction = () => {
    setPartnerTransaction({
      id: null,
      transactionDate: "",
      transactionAmount: "",
      note: "",
      change: "",
      madeBy: "PARTNER",
      status: "",
      nextPaymentDate: "",
      nextPaymentAmount: "",
      nextPaymentRemark: "",
    });
  };

  const resetPurchaserTransaction = () => {
    setPurchaserTransaction({
      id: null,
      transactionDate: "",
      transactionAmount: "",
      note: "",
      change: "CREDIT",
      madeBy: "PURCHASER",
      status: "UPI",
      nextPaymentDate: "",
      nextPaymentAmount: "",
      nextPaymentRemark: "",
    });
  };

  const resetOwnerTransaction = () => {
    setOwnerTransaction({
      id: null,
      transactionDate: "",
      transactionAmount: "",
      note: "",
      change: "",
      madeBy: "OWNER",
      status: "",
      nextPaymentDate: "",
      nextPaymentAmount: "",
      nextPaymentRemark: "",
    });
  };

  return (
    <>
      <div className="land-header">
        <div className="land-header-content">
          <h1 className="land-title">Land Management System</h1>
        </div>
      </div>

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
        {role === "Admin" && (
          <button
            className="land-add-property-button"
            onClick={openAddPropertyModal}
          >
            <Plus className="land-button-icon" /> Add Property
          </button>
        )}
      </div>

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
            {role === "Admin" && (
              <button
                className="land-add-first-property"
                onClick={openAddPropertyModal}
              >
                <Plus /> Add First Property
              </button>
            )}
          </div>
        ) : (
          <div className="land-table-container">
            <div className="land-table-wrapper">
              <table className="land-table">
                <thead>
                  <tr>
                    <th>Owner</th>
                    <th>Plot No.</th>
                    <th>Area</th>
                    <th>Total Amount</th>
                    {/* <th>Status</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLandData.map((item) => {
                    const ownerName = item.owner?.name || "Unknown Owner";
                    const initials = getInitials(ownerName);
                    const avatarColor = getAvatarColor(ownerName);

                    return (
                      <tr
                        key={item.id}
                        className={
                          item.reamingAmount === 0 ? "land-completed" : ""
                        }
                      >
                        <td>
                          <div className="land-owner-info">
                            <div
                              className="land-owner-avatar"
                              style={{ backgroundColor: avatarColor }}
                            >
                              {initials}
                            </div>
                            <span className="land-owner-name">{ownerName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="land-plot-badge">
                            {item.address?.plotno || "N/A"}
                          </span>
                        </td>
                        <td>
                          <div className="land-info-item land-info-area">
                            <MapPin className="land-info-icon" />
                            <span>{item.area} sqft</span>
                          </div>
                        </td>
                        <td>
                          <div className="land-info-item land-info-price">
                            <IndianRupee className="land-info-icon" />
                            <span>₹{item.totalAmount?.toLocaleString()}</span>
                          </div>
                        </td>
                        {/* <td>
                          {item.reamingAmount === 0 ? (
                            <span className="land-status-badge land-status-completed">
                              <CheckCircle className="land-status-icon" />
                              Completed
                            </span>
                          ) : (
                            <span className="land-status-badge land-status-pending">
                              <AlertCircle className="land-status-icon" />
                              Pending
                            </span>
                          )}
                        </td> */}
                        <td>
                          <div className="land-actions-dropdown">
                            <button
                              className="land-action-btn land-ellipsis-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDropdownToggle(item.id);
                              }}
                            >
                              View
                              <EllipsisVertical className="land-info-icon" />
                            </button>
                            {openDropdownId === item.id && (
                              <div className="land-dropdown-menu">
                                <button
                                  className="land-dropdown-btn"
                                  onClick={() => openPropertyDetails(item)}
                                >
                                  <Eye className="land-btn-icon" /> View Details
                                </button>
                                {role === "Admin" && (
                                  <>
                                    <button
                                      className="land-dropdown-btn"
                                      onClick={() =>
                                        handleEditProperty(item.id)
                                      }
                                    >
                                      <Edit className="land-btn-icon" /> Edit
                                      Property
                                    </button>
                                    <button
                                      className="land-dropdown-btn land-dropdown-danger"
                                      onClick={() =>
                                        handleDeleteProperty(item.id)
                                      }
                                    >
                                      <Trash2 className="land-btn-icon" />{" "}
                                      Delete Property
                                    </button>
                                  </>
                                )}
                                <div className="land-dropdown-divider"></div>
                                <button
                                  className="land-dropdown-btn"
                                  onClick={() => openOwnerModal(item)}
                                >
                                  <User className="land-btn-icon" /> Owner
                                  Details
                                </button>
                                <button
                                  className="land-dropdown-btn"
                                  onClick={() => openPurchaserModal(item)}
                                >
                                  <User className="land-btn-icon" /> Purchaser
                                  Details
                                </button>
                                <button
                                  className="land-dropdown-btn"
                                  onClick={() => openPartnersModal(item)}
                                >
                                  <Users className="land-btn-icon" /> Partners
                                </button>
                                <button
                                  className="land-dropdown-btn"
                                  onClick={() => openAddressModal(item)}
                                >
                                  <Home className="land-btn-icon" /> Address
                                  Details
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Owner Modal */}
      {showOwnerModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowOwnerModal(null)}
        >
          <div
            className="land-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Owner Details</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowOwnerModal(null)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <div className="land-person-details">
                <div className="land-detail-item">
                  <User className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Name</span>
                    <span className="land-detail-value">
                      {showOwnerModal.owner?.name || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="land-detail-item">
                  <Phone className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Phone</span>
                    <span className="land-detail-value">
                      {showOwnerModal.owner?.phoneNumber || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="land-detail-item">
                  <CreditCard className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Aadhar</span>
                    <span className="land-detail-value">
                      {showOwnerModal.owner?.aadharNumber || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="land-detail-item">
                  <MapPin className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Address</span>
                    <span className="land-detail-value">
                      {showOwnerModal.owner?.address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              {role === "Admin" && (
                <div className="land-action-buttons">
                  <button
                    className="land-btn land-btn-secondary"
                    onClick={() =>
                      openTransactionTable(
                        showOwnerModal.owner?.landTransactions,
                        "Owner Transactions"
                      )
                    }
                  >
                    <Eye className="land-btn-icon-sm" /> Show Transactions
                  </button>
                  <button
                    className="land-btn land-btn-primary"
                    onClick={() =>
                      handleAddOwnerTransaction(
                        showOwnerModal.owner?.id,
                        showOwnerModal.id
                      )
                    }
                  >
                    <Plus className="land-btn-icon-sm" /> Add Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Purchaser Modal */}
      {showPurchaserModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowPurchaserModal(null)}
        >
          <div
            className="land-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Purchaser Details</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowPurchaserModal(null)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <div className="land-person-details">
                <div className="land-detail-item">
                  <User className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Name</span>
                    <span className="land-detail-value">
                      {showPurchaserModal.purchaser?.name || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="land-detail-item">
                  <Phone className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Phone</span>
                    <span className="land-detail-value">
                      {showPurchaserModal.purchaser?.phoneNumber || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="land-detail-item">
                  <CreditCard className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Aadhar</span>
                    <span className="land-detail-value">
                      {showPurchaserModal.purchaser?.aadharNumber || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="land-detail-item">
                  <MapPin className="land-detail-icon" />
                  <div className="land-detail-content">
                    <span className="land-detail-label">Address</span>
                    <span className="land-detail-value">
                      {showPurchaserModal.purchaser?.address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              {role === "Admin" && (
                <div className="land-action-buttons">
                  <button
                    className="land-btn land-btn-secondary"
                    onClick={() =>
                      openTransactionTable(
                        showPurchaserModal.purchaser?.landTransactions,
                        "Purchaser Transactions"
                      )
                    }
                  >
                    <Eye className="land-btn-icon-sm" /> Show Transactions
                  </button>
                  <button
                    className="land-btn land-btn-primary"
                    onClick={() =>
                      handleAddPurchaserTransaction(
                        showPurchaserModal.purchaser?.id,
                        showPurchaserModal.id
                      )
                    }
                  >
                    <Plus className="land-btn-icon-sm" /> Add Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Partners Modal */}
      {showPartnersModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowPartnersModal(null)}
        >
          <div
            className="land-modal-content land-partners-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Partners</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowPartnersModal(null)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              {role === "Admin" && (
                <div className="land-add-partner-section">
                  <button
                    className="land-btn land-btn-primary"
                    onClick={() => {
                      setLandId(showPartnersModal.id);
                      setShowAddPartnerForm(true);
                    }}
                  >
                    <Plus className="land-btn-icon-sm" /> Add Partner
                  </button>
                </div>
              )}
              {showPartnersModal.partners?.length > 0 ? (
                <div className="land-partners-grid">
                  {showPartnersModal.partners.map((partner) => (
                    <div key={partner.id} className="land-partner-card">
                      <div className="land-partner-header">
                        <h4>{partner.name || "N/A"}</h4>
                        <span className="land-partner-phone">
                          {partner.phoneNumber || "N/A"}
                        </span>
                      </div>
                      <div className="land-partner-details">
                        <div className="land-partner-detail">
                          <CreditCard className="land-detail-icon" />
                          <span>{partner.addharNumber || "N/A"}</span>
                        </div>
                        <div className="land-partner-detail">
                          <MapPin className="land-detail-icon" />
                          <span>{partner.city || "N/A"}</span>
                        </div>
                      </div>

                      <div className="land-partner-actions">
                        <button
                          className="land-btn land-btn-secondary land-btn-sm"
                          onClick={() =>
                            openTransactionTable(
                              partner.landTransactions,
                              `${partner.name} Transactions`
                            )
                          }
                        >
                          <Eye className="land-btn-icon-sm" /> Transactions
                        </button>
                        {role === "Admin" && (
                          <>
                            <button
                              className="land-btn land-btn-primary land-btn-sm"
                              onClick={() =>
                                openTransactionModal(
                                  partner.id,
                                  showPartnersModal.id
                                )
                              }
                            >
                              <Plus className="land-btn-icon-sm" /> Add
                            </button>
                            <button
                              className="land-btn land-btn-danger land-btn-sm"
                              onClick={() => handleDeletePartner(partner.id)}
                            >
                              <Trash2 className="land-btn-icon-sm" /> Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="land-no-data-small">
                  <Users className="land-no-data-icon-sm" />
                  <p>No partners available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowAddressModal(null)}
        >
          <div
            className="land-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Property Address</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowAddressModal(null)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <div className="land-address-grid">
                <div className="land-address-item">
                  <span className="land-address-label">Landmark</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.landmark || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">City</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.city || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">State</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.state || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">Pincode</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.pincode || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">KH No</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.khno || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">MUZA</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.muza || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">Plot No</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.plotno || "N/A"}
                  </span>
                </div>
                <div className="land-address-item">
                  <span className="land-address-label">PH No</span>
                  <span className="land-address-value">
                    {showAddressModal.address?.phno || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table Modal */}
      {showTransactionTableModal && (
        <div className="land-modal-overlay" onClick={closeTransactionTable}>
          <div
            className="land-modal-content land-transaction-table-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>{transactionTableTitle}</h2>
              <button
                className="land-modal-close"
                onClick={closeTransactionTable}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              {transactionTableData.length > 0 ? (
                <div className="land-transaction-table-container">
                  <div className="land-transaction-summary">
                    <div className="land-summary-item">
                      <span className="land-summary-label">
                        Total Transactions
                      </span>
                      <span className="land-summary-value">
                        {transactionTableData.length}
                      </span>
                    </div>
                    <div className="land-summary-item">
                      <span className="land-summary-label">Total Amount</span>
                      <span className="land-summary-value">
                        ₹
                        {transactionTableData
                          .reduce(
                            (sum, txn) => sum + (txn.transactionAmount || 0),
                            0
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="land-table-wrapper">
                    <table className="land-transaction-table">
                   <thead>
  <tr>
    <th>Date</th>
    <th>Amount</th>
    <th>Status</th>
    <th>Note</th>

    {transactionTableData.some(txn => txn.madeBy?.toLowerCase() === "partner") && (
      <th>Next Payment</th>
    )}

    {role === "Admin" && <th>Actions</th>}
  </tr>
</thead>
                     <tbody>
  {transactionTableData.map((txn) => (
    <tr key={txn.id}>
      <td>
        <div className="land-table-cell">
          <Calendar className="land-table-icon" />
          {txn.transactionDate || "N/A"}
        </div>
      </td>
      <td>
        <div className="land-table-cell">
          <IndianRupee className="land-table-icon" />₹
          {txn.transactionAmount?.toLocaleString() || "0"}
        </div>
      </td>
      <td>
        <span
          className={`land-status-badge ${txn.status?.toLowerCase()}`}
        >
          {txn.status || "N/A"}
        </span>
      </td>
      <td>{txn.note || "N/A"}</td>

      {transactionTableData.some(txn => txn.madeBy?.toLowerCase() === "partner") && (
        <td>
          {txn.madeBy?.toLowerCase() === "partner" &&
            (txn.nextPaymentDateForPartner || txn.nextPaymentDate ? (
              <div className="land-next-payment">
                <div>
                  {txn.nextPaymentDateForPartner || txn.nextPaymentDate}
                </div>
                <div className="land-next-amount">
                  ₹
                  {(
                    txn.nextPaymentAmountForPartner ||
                    txn.nextPaymentAmount ||
                    0
                  ).toLocaleString()}
                </div>
              </div>
            ) : null)}
        </td>
      )}

      {role === "Admin" && (
        <td>
          <div className="land-table-actions">
            <button
              className="land-action-btn land-edit-btn"
              title="Edit"
              onClick={() => {
                if (txn.madeBy === "PARTNER") {
                  handleEditPartnerTransaction(txn.id);
                } else if (txn.madeBy === "PURCHASER") {
                  handleEditPurchaserTransaction(
                    txn.id,
                    purchaserLandId
                  );
                } else if (txn.madeBy === "OWNER") {
                  handleEditOwnerTransaction(txn.id);
                }
              }}
            >
              <CiEdit />
            </button>
            <button
              className="land-action-btn land-delete-btn"
              title="Delete"
              onClick={() => {
                if (txn.madeBy === "PARTNER") {
                  handleDeletePartnerTransaction(txn.id);
                } else if (txn.madeBy === "PURCHASER") {
                  handleDeletePurchaserTransaction(
                    txn.id
                  );
                } else if (txn.madeBy === "OWNER") {
                  handleDeleteOwnerTransaction(txn.id);
                }
              }}
            >
              <MdDelete />
            </button>
          </div>
        </td>
      )}
    </tr>
  ))}
</tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="land-no-data-small">
                  <Calendar className="land-no-data-icon-sm" />
                  <p>No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                <h3>Owner Name: {selectedProperty.owner?.name || "N/A"}</h3>
                <p>
                  Plot No & Area: {selectedProperty.address?.plotno || "N/A"} /{" "}
                  {selectedProperty.area || "N/A"} sqft
                </p>
                <div className="land-property-value">
                  Total Value: ₹
                  {selectedProperty.totalAmount?.toLocaleString() || "0"}
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
                        {selectedProperty.reamingAmount?.toLocaleString() ||
                          "0"}
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
                        ₹{selectedProperty.tokenAmount?.toLocaleString() || "0"}
                      </span>
                      <span className="land-modal-payment-date">
                        {selectedProperty.tokenDate || "N/A"}
                      </span>
                    </div>
                    <div className="land-modal-payment-item">
                      <span className="land-modal-payment-label">
                        Agreement Amount
                      </span>
                      <span className="land-modal-payment-value">
                        ₹
                        {selectedProperty.agreementAmount?.toLocaleString() ||
                          "0"}
                      </span>
                      <span className="land-modal-payment-date">
                        {selectedProperty.agreementDate || "N/A"}
                      </span>
                    </div>
                    <div className="land-modal-payment-item">
                      <span className="land-modal-payment-label">
                        Registry Amount
                      </span>
                      <span className="land-modal-payment-value">
                        ₹
                        {selectedProperty.registryAmount?.toLocaleString() ||
                          "0"}
                      </span>
                      <span className="land-modal-payment-date">
                        {selectedProperty.registryDate || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Total Amount</label>
                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Token Date</label>
                      <input
                        type="date"
                        value={tokenDate}
                        onChange={(e) => setTokenDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Token Amount</label>
                      <input
                        type="number"
                        placeholder="Token Amount"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        required
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
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Agreement Date</label>
                      <input
                        type="date"
                        value={agreementDate}
                        onChange={(e) => setAgreementDate(e.target.value)}
                        required
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
                        required
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
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Phone Number</label>
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
                      <label>Aadhar Number</label>
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
                      <label>Address</label>
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
                      <label>Pincode</label>
                      <input
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>City</label>
                      <input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>State</label>
                      <input
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Country</label>
                      <input
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Muza</label>
                      <input
                        placeholder="Muza"
                        value={muza}
                        onChange={(e) => setMuza(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>KH No</label>
                      <input
                        placeholder="KHNO"
                        value={khno}
                        onChange={(e) => setKhno(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Plot No</label>
                      <input
                        placeholder="Plot No"
                        value={plotno}
                        onChange={(e) => setPlotno(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>PH No</label>
                      <input
                        placeholder="PHNO"
                        value={phno}
                        onChange={(e) => setPhno(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="land-form-actions">
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

      {/* Edit Property Modal */}
      {showEditLandModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowEditLandModal(false)}
        >
          <div
            className="land-modal-content land-add-property-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Edit Property</h2>
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
                onSubmit={handleUpdateLand}
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
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Total Amount</label>
                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={editTotalAmount}
                        onChange={(e) => setEditTotalAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Token Date</label>
                      <input
                        type="date"
                        value={editTokenDate}
                        onChange={(e) => setEditTokenDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Token Amount</label>
                      <input
                        type="number"
                        placeholder="Token Amount"
                        value={editTokenAmount}
                        onChange={(e) => setEditTokenAmount(e.target.value)}
                        required
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
                        required
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Agreement Date</label>
                      <input
                        type="date"
                        value={editAgreementDate}
                        onChange={(e) => setEditAgreementDate(e.target.value)}
                        required
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
                        required
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
                        required
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
                      <label>City</label>
                      <input
                        placeholder="City"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>State</label>
                      <input
                        placeholder="State"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>Country</label>
                      <input
                        placeholder="Country"
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Muza</label>
                      <input
                        placeholder="Muza"
                        value={editMuza}
                        onChange={(e) => setEditMuza(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>KH No</label>
                      <input
                        placeholder="KHNO"
                        value={editKhno}
                        onChange={(e) => setEditKhno(e.target.value)}
                      />
                    </div>
                    <div className="land-form-group">
                      <label>Plot No</label>
                      <input
                        placeholder="Plot No"
                        value={editPlotno}
                        onChange={(e) => setEditPlotno(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="land-form-row">
                    <div className="land-form-group">
                      <label>PH No</label>
                      <input
                        placeholder="PHNO"
                        value={editPhno}
                        onChange={(e) => setEditPhno(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="land-form-actions">
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={() => setShowEditLandModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" /> Update Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Partner Transaction Modal */}
      {showTransactionModal && (
        <div className="land-modal-overlay" onClick={closeTransactionModal}>
          <div
            className="land-modal-content land-transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>
                {partnerTransaction.id ? "Edit" : "Add"} Partner Transaction
              </h2>
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
                onSubmit={
                  partnerTransaction.id
                    ? handleUpdatePartnerTransaction
                    : handleSubmitPartnerTransaction
                }
              >
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Transaction Date</label>
                    <input
                      type="date"
                      name="transactionDate"
                      value={partnerTransaction.transactionDate}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          transactionDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="land-form-group">
                    <label>Transaction Amount</label>
                    <input
                      type="number"
                      name="transactionAmount"
                      placeholder="Amount"
                      value={partnerTransaction.transactionAmount}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          transactionAmount: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={partnerTransaction.status}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="UPI">UPI</option>
                      <option value="CASH">Cash</option>
                      <option value="RTGS">RTGS</option>
                      <option value="NEFT">NEFT</option>
                      <option value="CHEQUE">CHEQUE</option>
                    </select>
                  </div>
                  <div className="land-form-group">
                    <label>Note</label>
                    <input
                      type="text"
                      name="note"
                      placeholder="Note"
                      value={partnerTransaction.note}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Change</label>
                    <select
                      name="change"
                      value={partnerTransaction.change}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          change: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Change</option>
                      <option value="CREDIT">Credit</option>
                      <option value="DEBIT">Debit</option>
                    </select>
                  </div>
                  <div className="land-form-group">
                    <label>Next Payment Date</label>
                    <input
                      type="date"
                      name="nextPaymentDate"
                      value={partnerTransaction.nextPaymentDate}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          nextPaymentDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Next Payment Amount</label>
                    <input
                      type="number"
                      name="nextPaymentAmount"
                      placeholder="Next Payment Amount"
                      value={partnerTransaction.nextPaymentAmount}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          nextPaymentAmount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="land-form-group">
                    <label>Next Payment Remark</label>
                    <input
                      type="text"
                      name="nextPaymentRemark"
                      placeholder="Remark"
                      value={partnerTransaction.nextPaymentRemark}
                      onChange={(e) =>
                        setPartnerTransaction((prev) => ({
                          ...prev,
                          nextPaymentRemark: e.target.value,
                        }))
                      }
                    />
                  </div>
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
                    <Plus className="land-btn-icon-sm" />{" "}
                    {partnerTransaction.id ? "Update" : "Add"} Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Purchaser Transaction Modal */}
      {showAddPurcheserTransaction && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowAddPurcheserTransaction(false)}
        >
          <div
            className="land-modal-content land-transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>
                {purchaserTransaction.id ? "Edit" : "Add"} Purchaser Transaction
              </h2>
              <button
                className="land-modal-close"
                onClick={() => setShowAddPurcheserTransaction(false)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <form
                className="land-transaction-form"
                onSubmit={
                  purchaserTransaction.id
                    ? handleUpdatePurchaserTransaction
                    : handleSubmitPurchaserTransaction
                }
              >
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Transaction Date</label>
                    <input
                      type="date"
                      name="transactionDate"
                      value={purchaserTransaction.transactionDate}
                      onChange={handleChangePurchaser}
                      required
                    />
                  </div>
                  <div className="land-form-group">
                    <label>Transaction Amount</label>
                    <input
                      type="number"
                      name="transactionAmount"
                      placeholder="Amount"
                      value={purchaserTransaction.transactionAmount}
                      onChange={handleChangePurchaser}
                      required
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={purchaserTransaction.status}
                      onChange={handleChangePurchaser}
                    >
                      <option value="">Select Status</option>
                      <option value="UPI">UPI</option>
                      <option value="CASH">Cash</option>
                      <option value="RTGS">RTGS</option>
                      <option value="NEFT">NEFT</option>
                      <option value="CHEQUE">CHEQUE</option>
                    </select>
                  </div>
                  <div className="land-form-group">
                    <label>Note</label>
                    <input
                      type="text"
                      name="note"
                      placeholder="Note"
                      value={purchaserTransaction.note}
                      onChange={handleChangePurchaser}
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Change</label>
                    <select
                      name="change"
                      value={purchaserTransaction.change}
                      onChange={handleChangePurchaser}
                    >
                      <option value="">Select Change</option>
                      <option value="CREDIT">Credit</option>
                      <option value="DEBIT">Debit</option>
                    </select>
                  </div>
                  {/* <div className="land-form-group">
                    <label>Next Payment Date</label>
                    <input
                      type="date"
                      name="nextPaymentDate"
                      value={purchaserTransaction.nextPaymentDate}
                      onChange={handleChangePurchaser}
                    />
                  </div> */}
                </div>
                {/* <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Next Payment Amount</label>
                    <input
                      type="number"
                      name="nextPaymentAmount"
                      placeholder="Next Payment Amount"
                      value={purchaserTransaction.nextPaymentAmount}
                      onChange={handleChangePurchaser}
                    />
                  </div>
                  <div className="land-form-group">
                    <label>Next Payment Remark</label>
                    <input
                      type="text"
                      name="nextPaymentRemark"
                      placeholder="Remark"
                      value={purchaserTransaction.nextPaymentRemark}
                      onChange={handleChangePurchaser}
                    />
                  </div>
                </div> */}
                <div className="land-form-actions">
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={() => setShowAddPurcheserTransaction(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" />{" "}
                    {purchaserTransaction.id ? "Update" : "Add"} Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Owner Transaction Modal */}
      {showOwnerTransactionModal && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowOwnerTransactionModal(false)}
        >
          <div
            className="land-modal-content land-transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>{ownerTransaction.id ? "Edit" : "Add"} Owner Transaction</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowOwnerTransactionModal(false)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <form
                className="land-transaction-form"
                onSubmit={
                  ownerTransaction.id
                    ? handleUpdateOwnerTransaction
                    : handleSubmitOwnerTransaction
                }
              >
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Transaction Date</label>
                    <input
                      type="date"
                      name="transactionDate"
                      value={ownerTransaction.transactionDate}
                      onChange={handleChangeOwner}
                      required
                    />
                  </div>
                  <div className="land-form-group">
                    <label>Transaction Amount</label>
                    <input
                      type="number"
                      name="transactionAmount"
                      placeholder="Amount"
                      value={ownerTransaction.transactionAmount}
                      onChange={handleChangeOwner}
                      required
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={ownerTransaction.status}
                      onChange={handleChangeOwner}
                    >
                      <option value="">Select Status</option>
                      <option value="UPI">UPI</option>
                      <option value="CASH">Cash</option>
                      <option value="RTGS">RTGS</option>
                      <option value="NEFT">NEFT</option>
                      <option value="CHEQUE">CHEQUE</option>
                    </select>
                  </div>
                  <div className="land-form-group">
                    <label>Note</label>
                    <input
                      type="text"
                      name="note"
                      placeholder="Note"
                      value={ownerTransaction.note}
                      onChange={handleChangeOwner}
                    />
                  </div>
                </div>
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Change</label>
                    <select
                      name="change"
                      value={ownerTransaction.change}
                      onChange={handleChangeOwner}
                    >
                      <option value="">Select Change</option>
                      <option value="CREDIT">Credit</option>
                      <option value="DEBIT">Debit</option>
                    </select>
                  </div>
                  {/* <div className="land-form-group">
                    <label>Next Payment Date</label>
                    <input
                      type="date"
                      name="nextPaymentDate"
                      value={ownerTransaction.nextPaymentDate}
                      onChange={handleChangeOwner}
                    />
                  </div> */}
                </div>
                {/* <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Next Payment Amount</label>
                    <input
                      type="number"
                      name="nextPaymentAmount"
                      placeholder="Next Payment Amount"
                      value={ownerTransaction.nextPaymentAmount}
                      onChange={handleChangeOwner}
                    />
                  </div>
                  <div className="land-form-group">
                    <label>Next Payment Remark</label>
                    <input
                      type="text"
                      name="nextPaymentRemark"
                      placeholder="Remark"
                      value={ownerTransaction.nextPaymentRemark}
                      onChange={handleChangeOwner}
                    />
                  </div>
                </div> */}
                <div className="land-form-actions">
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={() => setShowOwnerTransactionModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" />{" "}
                    {ownerTransaction.id ? "Update" : "Add"} Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartnerForm && (
        <div
          className="land-modal-overlay"
          onClick={() => setShowAddPartnerForm(false)}
        >
          <div
            className="land-modal-content land-add-partner-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>Add Partner</h2>
              <button
                className="land-modal-close"
                onClick={() => setShowAddPartnerForm(false)}
              >
                <X />
              </button>
            </div>
            <div className="land-modal-body">
              <form
                className="land-add-partner-form"
                onSubmit={handleAddPartner}
              >
                <div className="land-form-section">
                  <h3 className="land-form-section-title">Select Partners</h3>
                  <div className="land-partner-checkbox-list">
                    {partnersData.length > 0 ? (
                      partnersData.map((partner) => (
                        <div
                          key={partner.id}
                          className="land-partner-checkbox-item"
                        >
                          <input
                            type="checkbox"
                            id={`partner-${partner.id}`}
                            checked={selectedPartners.includes(partner.id)}
                            onChange={() => handleCheckboxChange(partner.id)}
                            className="land-partner-checkbox-input"
                          />
                          <label
                            htmlFor={`partner-${partner.id}`}
                            className="land-partner-checkbox-label"
                          >
                            {partner.name} - {partner.phoneNumber}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="land-no-partners-text">
                        No partners available
                      </p>
                    )}
                  </div>
                </div>
                <div className="land-form-actions">
                  <button
                    type="button"
                    className="land-cancel-btn"
                    onClick={() => setShowAddPartnerForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="land-submit-btn"
                    disabled={selectedPartners.length === 0}
                  >
                    <Plus className="land-btn-icon-sm" /> Add Partner
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
