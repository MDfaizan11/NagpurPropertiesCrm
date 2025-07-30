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
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
function Land() {
  const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const token = userData?.token;
  const role = userData?.role?.[0]?.roleName || "Partner";
  const userId = userData?.id;
  const partnerLandData = userData?.lands;

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

  const [patnerTransactionId, setpatnerTransactionId] = useState("");
  const [madeBy, setMadeBy] = useState("PARTNER");
  const [transactionType, setTransactionType] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [note, setNote] = useState("");

  const [PurcheserId, setPurcheserId] = useState("");
  const [ShowAddPurcheserTransaction, setShowAddPurcheserTransaction] =
    useState(false);
  const [purchaserTransaction, setPurchaserTransaction] = useState({
    transactionDate: "",
    transactionAmount: "",
    note: "",
    change: "CREDIT",
    madeBy: "PURCHASER",
    status: "UPI",
  });

  const [ownerTransactionId, setOwnerTransactionId] = useState(null);
  const [showOwnerTransactionModal, setShowOwnerTransactionModal] =
    useState(false);
  const [OwnerMadeBy, setOwnerMadeBy] = useState("OWNER");
  const [OwnerLandId, setOwnerLandId] = useState("");

  const [OwnerTransactionEditId, setOwnerTransactionEditId] = useState(null);

  const [purchaserLandId, setPurchaserLandId] = useState("");
  const [partnerLandId, setPartnerLandId] = useState("");

  const [PurchaserTransactionEditId, setPurchaserTransactionEditId] =
    useState(null);

  const [partnerTransactionEditId, setPartnerTransactionEditId] =
    useState(null);

  const [partnersdata, setPartnersdata] = useState([]);
  const [SelectedPartner, setSelectedPartner] = useState([]);
  console.log(SelectedPartner);
  useEffect(() => {
    async function getAllLand() {
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
          setLandData(response.data);
        } else if (role === "Partner" && partnerLandData) {
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

    getAllLand();
  }, [token, userId, role, refreshKey]);

  const toggle = (key) => {
    const isTxnToggle = key.includes("-txn");

    setToggleSection((prev) => {
      if (isTxnToggle) {
        return {
          ...prev,
          [key]: !prev[key],
        };
      } else {
        // If clicking the same open section, close it
        const isAlreadyOpen = prev[key];
        return isAlreadyOpen ? {} : { [key]: true };
      }
    });
  };

  const filteredLandData =
    role === "Partner"
      ? partnerLandData
      : landData.filter((item) => {
          const matchesSearch =
            item.owner?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
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
    setpatnerTransactionId(id);
    setShowTransactionModal(true);
    setTransactionDate("");
    setTransactionAmount("");
    setNote("");
    setTransactionType("");
    setPaymentMethod("");
    setMadeBy("PARTNER");
    setPartnerTransactionEditId(null);
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

  async function GetAllPartner() {
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
      console.log(response.data);
      if (response.status === 200) {
        setPartnersdata(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetAllPartner();
  }, []);

  function handleShowAddpatnerForm(id) {
    setLandId(id);
    setShowAddPatnerForm(true);
  }

  const handleAddPatner = async (e) => {
    e.preventDefault();
    const newPatnerData = {
      partnerIds: SelectedPartner,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/lands/${LandId}/partners`,
        newPatnerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        alert("Patner Added Successfully");
        setRefreshKey(refreshKey + 1);
        setSelectedPartner([]);
        setShowAddPatnerForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function handleDeletePatner(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this partner?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/lands/${partnerLandId}/partners/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner Remove successfully");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
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
        `${BASE_URL}/addpayment/partner/${patnerTransactionId}/land/${partnerLandId}`,
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

  function handleAddPurchesTransaction(id) {
    setPurcheserId(id);
    setShowAddPurcheserTransaction(true);
    setPurchaserTransaction({
      transactionDate: "",
      transactionAmount: "",
      note: "",
      change: "",
      madeBy: "PURCHASER",
      status: "",
    });
    setPurchaserTransactionEditId(null);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaserTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPurcheserTransacton = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", purchaserTransaction);
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/addpayment/purchaser/${PurcheserId}/land/${purchaserLandId}`,
        purchaserTransaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Purchaser Transactions Added Successfully");
        setRefreshKey(refreshKey + 1);
        setPurchaserTransaction({
          transactionDate: "",
          transactionAmount: "",
          note: "",
          change: "",
          madeBy: "",
          status: "",
        });
        setShowAddPurcheserTransaction(false);
      }
    } catch (error) {}
  };

  function openTransactionOwnerModal(id) {
    setOwnerTransactionEditId(null);
    setOwnerTransactionId(id);
    setTransactionDate("");
    setTransactionAmount("");
    setNote("");
    setTransactionType("");
    setPaymentMethod("");
    setShowOwnerTransactionModal(true);
  }
  async function handleSubmitOwnerTransaction(e) {
    e.preventDefault();
    const body = {
      transactionDate,
      transactionAmount: parseFloat(transactionAmount),
      note,
      change: transactionType,
      madeBy: OwnerMadeBy,
      status: paymentMethod,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/addpayment/owner/${ownerTransactionId}/land/${OwnerLandId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        alert("Owner Transaction Added Successfully");
        setRefreshKey((prev) => prev + 1);
        setTransactionDate("");
        setTransactionAmount("");
        setNote("");
        setTransactionType("");
        setPaymentMethod("");
        setShowOwnerTransactionModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function OwnerTransactionEdit(id) {
    setOwnerTransactionEditId(id);
    setShowOwnerTransactionModal(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/landtransaction/${id}`,
        {
          headers: {
            Authorization: `Bearer${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      const data = response.data;
      setTransactionDate(data.transactionDate);
      setTransactionAmount(data.transactionAmount);
      setNote(data.note);
      setTransactionType(data.change);
      setOwnerMadeBy(data.madeBy);
      setPaymentMethod(data.status);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateOwnerTransaction(e) {
    e.preventDefault();
    const body = {
      transactionDate,
      transactionAmount: parseFloat(transactionAmount),
      note,
      change: transactionType,
      madeBy: OwnerMadeBy,
      status: paymentMethod,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/editpayment/All/${OwnerTransactionEditId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Owner Transaction Updated Successfully");
        setRefreshKey((prev) => prev + 1);
        setTransactionDate("");
        setTransactionAmount("");
        setNote("");
        setTransactionType("");
        setPaymentMethod("");
        closeTransactionModal();
        setShowOwnerTransactionModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeleteOwnerTransaction(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;
    try {
      axiosInstance
        .delete(`${BASE_URL}/deletepayment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert("Transaction deleted successfully");
            setRefreshKey((prev) => prev + 1);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEditPurchaserTransaction(id) {
    setPurchaserTransactionEditId(id);
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
      console.log(response.data);
      const data = response.data;
      setPurchaserTransaction({
        transactionDate: data.transactionDate,
        transactionAmount: data.transactionAmount,
        note: data.note,
        change: data.change,
        madeBy: data.madeBy,
        status: data.status,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdatePurchaserTransacton(e) {
    e.preventDefault();
    const body = {
      transactionDate: purchaserTransaction.transactionDate,
      transactionAmount: parseFloat(purchaserTransaction.transactionAmount),
      note: purchaserTransaction.note,
      change: purchaserTransaction.change,
      madeBy: purchaserTransaction.madeBy,
      status: purchaserTransaction.status,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/editpayment/All/${PurchaserTransactionEditId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Purchaser Transaction Updated Successfully");
        setRefreshKey((prev) => prev + 1);
        setPurchaserTransaction({
          transactionDate: "",
          transactionAmount: "",
          note: "",
          change: "",
          madeBy: "",
          status: "",
        });
        setShowAddPurcheserTransaction(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeletePurchaserTransaction(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;
    try {
      axiosInstance
        .delete(`${BASE_URL}/deletepayment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert("Transaction deleted successfully");
            setRefreshKey((prev) => prev + 1);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEditPartnerTransaction(id) {
    setPartnerTransactionEditId(id);
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
      console.log(response.data);
      const data = response.data;
      setTransactionDate(data.transactionDate);
      setTransactionAmount(data.transactionAmount);
      setNote(data.note);
      setTransactionType(data.change);
      setMadeBy(data.madeBy);
      setPaymentMethod(data.status);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdatePartnerTransaction(e) {
    e.preventDefault();
    const body = {
      transactionDate,
      transactionAmount: parseFloat(transactionAmount),
      note,
      change: transactionType,
      madeBy,
      status: paymentMethod,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/editpayment/All/${partnerTransactionEditId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner Transaction Updated Successfully");
        setRefreshKey((prev) => prev + 1);
        setTransactionDate("");
        setTransactionAmount("");
        setNote("");
        setTransactionType("");
        setMadeBy("");
        setPaymentMethod("");
        closeTransactionModal();
        setShowTransactionModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeletePartnerTransaction(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;
    try {
      axiosInstance
        .delete(`${BASE_URL}/deletepayment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert("Transaction deleted successfully");
            setRefreshKey((prev) => prev + 1);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  const handleCheckboxChange = (partnerId) => {
    setSelectedPartner((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };
  return (
    <>
      {/* Header Section */}
      <div className="land-header">
        <div className="land-header-content">
          <h1 className="land-title">Land Management System</h1>
          {/* <p className="land-subtitle">
            Comprehensive property management with advanced analytics and
            seamless tracking
          </p> */}
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
        {role === "Admin" && (
          <button
            className="land-add-property-button"
            onClick={openAddPropertyModal}
          >
            <Plus className="land-button-icon" />
            Add Property
          </button>
        )}
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
                  <div className="land-card-header">
                    <div className="land-card-title">
                      <h3>{item.owner?.name || "Unknown Owner"}</h3>
                      <span className="land-plot-number">
                        Plot # {item.address?.plotno || "N/A"}
                      </span>
                    </div>

                    {role === "Admin" && (
                      <>
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
                      </>
                    )}
                  </div>

                  <div className="land-card-content">
                    <div className="land-property-info">
                      <div className="land-info-item land-info-area">
                        <MapPin className="land-info-icon" />
                        <span> Plot Area : {item.area} sqft</span>
                      </div>
                      <div className="land-info-item land-info-price">
                        <IndianRupee className="land-info-icon" />
                        <span>
                          Total Amount : ₹ {item.totalAmount?.toLocaleString()}
                        </span>
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
                          setOwnerLandId(item.id);
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
                          setPurchaserLandId(item.id);
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
                          setPartnerLandId(item.id);
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

                        {role === "Admin" && (
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
                              onClick={() =>
                                openTransactionOwnerModal(item.owner.id)
                              }
                            >
                              Add Transaction
                            </button>
                          </div>
                        )}

                        {toggleSection[`${baseKey}-owner-txn`] && (
                          <div className="land-transactions">
                            {item.owner.landTransactions?.length > 0 ? (
                              <>
                                {/* Total Transaction Amount */}
                                <div className="land-transaction-total">
                                  <strong>
                                    Total: ₹
                                    {item.owner.landTransactions
                                      .reduce(
                                        (sum, txn) =>
                                          sum + txn.transactionAmount,
                                        0
                                      )
                                      .toLocaleString()}
                                  </strong>
                                </div>

                                {/* Transaction List */}
                                {item.owner.landTransactions.map((txn, i) => (
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
                                      ₹{txn.transactionAmount.toLocaleString()}
                                    </div>
                                    <div className="land-transaction-note">
                                      {txn.status}
                                    </div>
                                    <div className="land-transaction-note">
                                      {txn.note}
                                    </div>
                                    <div className="land-transaction-note">
                                      <CiEdit
                                        style={{
                                          fontSize: "30px",
                                          color: "blue",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          OwnerTransactionEdit(txn.id)
                                        }
                                      />
                                    </div>
                                    <div className="land-transaction-note">
                                      <MdDelete
                                        style={{
                                          fontSize: "30px",
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleDeleteOwnerTransaction(txn.id)
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                              </>
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

                          {role === "Admin" && (
                            <div className="land-transaction-controls">
                              <button
                                className="land-transaction-btn"
                                onClick={() =>
                                  toggle(`${baseKey}-purchaser-txn`)
                                }
                              >
                                {toggleSection[`${baseKey}-purchaser-txn`]
                                  ? "Hide"
                                  : "Show"}{" "}
                                Transactions
                              </button>
                              <button
                                className="land-add-transaction-btn"
                                onClick={() =>
                                  handleAddPurchesTransaction(item.purchaser.id)
                                }
                              >
                                <Plus className="land-btn-icon-sm" /> Add
                                Transaction
                              </button>
                            </div>
                          )}

                          {toggleSection[`${baseKey}-purchaser-txn`] && (
                            <div className="land-transactions">
                              {item.purchaser.landTransactions?.length > 0 ? (
                                <>
                                  {/* Total Amount Calculation */}
                                  <div className="land-transaction-total">
                                    <strong>
                                      Total: ₹
                                      {item.purchaser.landTransactions
                                        .reduce(
                                          (sum, txn) =>
                                            sum + txn.transactionAmount,
                                          0
                                        )
                                        .toLocaleString()}
                                    </strong>
                                  </div>

                                  {/* List of Transactions */}
                                  {item.purchaser.landTransactions.map(
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
                                          ₹
                                          {txn.transactionAmount.toLocaleString()}
                                        </div>
                                        <div className="land-transaction-note">
                                          {txn.status}
                                        </div>
                                        <div className="land-transaction-note">
                                          {txn.note}
                                        </div>
                                        <div className="land-transaction-note">
                                          <CiEdit
                                            style={{
                                              fontSize: "30px",
                                              color: "blue",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleEditPurchaserTransaction(
                                                txn.id
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="land-transaction-note">
                                          <MdDelete
                                            style={{
                                              fontSize: "30px",
                                              color: "red",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleDeletePurchaserTransaction(
                                                txn.id
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </>
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
                        <div className="land-section-title_container">
                          <h4 className="land-section-title"> Partners</h4>
                          {role === "Admin" && (
                            <button
                              className="land-add-partner-btn"
                              onClick={() => handleShowAddpatnerForm(item.id)}
                            >
                              <Plus className="land-btn-icon-sm" /> Add Partner
                            </button>
                          )}
                        </div>

                        {item.partners?.length > 0 ? (
                          item.partners.map((partner, pIndex) => {
                            const partnerKey = `${baseKey}-partner-${pIndex}`;
                            const totalAmount =
                              partner.landTransactions?.reduce(
                                (sum, txn) => sum + txn.transactionAmount,
                                0
                              );

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
                                    <span>{partner.addharNumber}</span>
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

                                  {role === "Admin" && (
                                    <>
                                      <button
                                        className="land-add-transaction-btn"
                                        onClick={() =>
                                          openTransactionModal(partner.id)
                                        }
                                      >
                                        <Plus className="land-btn-icon-sm" />{" "}
                                        Add Transaction
                                      </button>
                                      <button
                                        className="land-transaction-btn"
                                        onClick={() =>
                                          handleDeletePatner(partner.id)
                                        }
                                      >
                                        Remove Partner
                                      </button>
                                    </>
                                  )}
                                </div>

                                {toggleSection[`${partnerKey}-txn`] && (
                                  <div className="land-transactions">
                                    {partner.landTransactions?.length > 0 ? (
                                      <>
                                        <div className="land-transaction-total">
                                          <strong>
                                            Total: ₹
                                            {totalAmount.toLocaleString()}
                                          </strong>
                                        </div>
                                        {partner.landTransactions.map(
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
                                                ₹
                                                {txn.transactionAmount.toLocaleString()}
                                              </div>
                                              <div className="land-transaction-note">
                                                {txn.note}
                                              </div>
                                              <div className="land-transaction-note">
                                                {txn.status}
                                              </div>

                                              {role === "Admin" && (
                                                <>
                                                  <div className="land-transaction-note">
                                                    <CiEdit
                                                      style={{
                                                        fontSize: "30px",
                                                        color: "blue",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleEditPartnerTransaction(
                                                          txn.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <div className="land-transaction-note">
                                                    <MdDelete
                                                      style={{
                                                        fontSize: "30px",
                                                        color: "red",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleDeletePartnerTransaction(
                                                          txn.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </>
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
                <h3> Owner Name : {selectedProperty.owner?.name}</h3>
                <p>
                  Plot No & Area : {selectedProperty.address?.plotno} /
                  {selectedProperty.area} sqft
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
              {/* <button
                className="land-modal-btn land-modal-edit-btn"
                onClick={() => handleShowAddpatnerForm(selectedProperty.id)}
              >
                <Edit className="land-modal-btn-icon" /> Add Patner
              </button> */}
              {/* <button
                className="land-modal-btn land-modal-transaction-btn"
                onClick={openTransactionModal}
              >
                <Plus className="land-modal-btn-icon" /> Add Transaction
              </button> */}
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
                        placeholder="Token Date"
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
                        placeholder="Agreement Date"
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

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="land-modal-overlay" onClick={closeTransactionModal}>
          <div
            className="land-modal-content land-transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="land-modal-header">
              <h2>
                {partnerTransactionEditId
                  ? "Edit Transaction"
                  : "Add Transaction"}
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
                // onSubmit={handleSubmitpatnerTransaction}
                onSubmit={
                  partnerTransactionEditId
                    ? handleUpdatePartnerTransaction
                    : handleSubmitpatnerTransaction
                }
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
                    <Plus className="land-btn-icon-sm" />{" "}
                    {partnerTransactionEditId
                      ? "Update Transaction"
                      : "Add Transaction"}
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
            {/* <form className="Add_newPatner_form" onSubmit={handleAddPatner}>
              <button
                type="button"
                onClick={() => setShowAddPatnerForm(false)}
                className="Add_newPatner_popup_form_close_button"
              >
                X
              </button>
              <h2 className="Add_newPatner_form_title">Add New Patner</h2>
              <label htmlFor="patnerName">Patner Name</label>
              <select
                className="Add_newPatner_form_input"
                value={SelectedPartner}
                onChange={(e) =>
                  setSelectedPartner(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                id="patnerName"
                multiple
                required
              >
                <option disabled value="">
                  Select Partner(s)
                </option>
                {partnersdata.map((partner, index) => (
                  <option key={index} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>

              <button
                className="Add_newPatner_form_submit_button"
                type="submit"
              >
                Add Patner
              </button>
            </form> */}

            <form className="Add_newPatner_form" onSubmit={handleAddPatner}>
              <button
                type="button"
                onClick={() => setShowAddPatnerForm(false)}
                className="Add_newPatner_popup_form_close_button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <h2 className="Add_newPatner_form_title">Add New Partner</h2>
              <div className="partner_checkbox_container">
                <label className="partner_checkbox_label">
                  Select Partner(s)
                </label>
                <div className="partner_checkbox_list">
                  {partnersdata.length > 0 ? (
                    partnersdata.map((partner) => (
                      <label key={partner.id} className="partner_checkbox_item">
                        <input
                          type="checkbox"
                          value={partner.id}
                          checked={SelectedPartner.includes(partner.id)}
                          onChange={() => handleCheckboxChange(partner.id)}
                          className="partner_checkbox_input"
                        />
                        <span className="partner_checkbox_text">
                          {partner.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="no_partners_text">No partners available</p>
                  )}
                </div>
              </div>
              <button
                className="Add_newPatner_form_submit_button"
                type="submit"
              >
                Add Partner
              </button>
            </form>
          </div>
        </>
      )}

      {/* show add purcheser transaction form */}
      {ShowAddPurcheserTransaction && (
        <div className="popup-overlay landaddpurchesTransactionform-overlay">
          <form
            className="landaddpurchesTransactionform"
            onSubmit={
              PurchaserTransactionEditId
                ? handleUpdatePurchaserTransacton
                : handleSubmitPurcheserTransacton
            }
            // onSubmit={handleSubmitPurcheserTransacton}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setShowAddPurcheserTransaction(false)}
            >
              X
            </button>

            <h2>
              {PurchaserTransactionEditId
                ? "Edit Purchaser Transaction"
                : "Add Purchaser Transaction"}
            </h2>

            <label htmlFor="transactionDate">Transaction Date</label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={purchaserTransaction.transactionDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="transactionAmount">Transaction Amount</label>
            <input
              type="number"
              id="transactionAmount"
              name="transactionAmount"
              value={purchaserTransaction.transactionAmount}
              onChange={handleChange}
              required
            />

            <label htmlFor="change">Type</label>
            <select
              id="change"
              name="change"
              value={purchaserTransaction.change}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="CREDIT">CREDIT</option>
              <option value="DEBIT">DEBIT</option>
            </select>

            <label htmlFor="status">Payment Method</label>
            <select
              id="status"
              name="status"
              value={purchaserTransaction.status}
              onChange={handleChange}
            >
              <option value="">Select method</option>
              <option value="CASH">CASH</option>
              <option value="CHECK">CHEQUE</option>
              <option value="UPI">UPI</option>
              <option value="RTGS">RTGS</option>
              <option value="NEFT">NEFT</option>
            </select>
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              name="note"
              rows="3"
              value={purchaserTransaction.note}
              onChange={handleChange}
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      )}

      {/* ************** */}
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
              <h2>
                {OwnerTransactionEditId
                  ? "Edit Owner Transaction"
                  : "Add Owner Transaction"}
              </h2>
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
                  OwnerTransactionEditId
                    ? handleUpdateOwnerTransaction
                    : handleSubmitOwnerTransaction
                }
              >
                <div className="land-form-row">
                  <div className="land-form-group">
                    <label>Made By</label>
                    <input
                      type="text"
                      value={OwnerMadeBy}
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
                    onClick={() => setShowOwnerTransactionModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="land-submit-btn">
                    <Plus className="land-btn-icon-sm" />{" "}
                    {OwnerTransactionEditId
                      ? "Update Transaction"
                      : "Add Transaction "}
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
