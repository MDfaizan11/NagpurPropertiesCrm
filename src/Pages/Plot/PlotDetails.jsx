import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  Search,
  User,
  FileText,
  Edit,
  Trash2,
  XCircle,
  ChevronUp,
  ChevronDown,
  X,
  Filter,
  Timer,
  Eye,
} from "lucide-react";

import "./plotDetails.css";
import { useRef } from "react";
import * as html2pdf from "html2pdf.js";

function PlotDetails() {
  const { ProjectId, ProjectName } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [refreshKey, setrefreshKey] = useState(0);
  const [plotData, setPlotData] = useState([]);
  const [PlotType, setPlotType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filteredData, setFilteredData] = useState([]);
  const [addQuatationId, setAddQuatationId] = useState("");
  const [ShowAddQuatationForm, setShowAddQuatationForm] = useState(false);
  const [addQuatationDate, setAddQuatationDate] = useState("");
  const [addQuatationCustomerName, setAddQuatationCustomerName] = useState("");
  const [addQuatationProjectName, setAddQuatationProjectName] = useState("");
  const [addQuatationMouza, setAddQuatationMouza] = useState("");
  const [addQuatationPlotNo, setAddQuatationPlotNo] = useState("");
  const [addQuatationArea, setAddQuatationArea] = useState("");
  const [addQuatationRate, setAddQuatationRate] = useState("");
  const [addQuatationTotalCost, setAddQuatationTotalCost] = useState("");
  const [addQuatationBookingAmount, setAddQuatationBookingAmount] =
    useState("");
  const [addQuatationBalanceAmount, setAddQuatationBalanceAmount] =
    useState("");
  const [addQuatationDownPayment, setAddQuatationDownPayment] = useState("");
  const [addQuatationRemainingAmount, setAddQuatationRemainingAmount] =
    useState("");
  const [addQuatationNoOfEMI, setAddQuatationNoOfEMI] = useState("");
  const [addQuatationMonthlyEMI, setAddQuatationMonthlyEMI] = useState("");
  const [addQuatationBankFinance, setAddQuatationBankFinance] = useState("No");
  const [addQuatationStampDuty, setAddQuatationStampDuty] = useState("");
  const [addQuatationRegistrationFees, setAddQuatationRegistrationFees] =
    useState("");
  const [addQuatationAnySpecialCondition, setAddQuatationAnySpecialCondition] =
    useState("");
  const [addQuatationBpName, setAddQuatationBpName] = useState("");
  const [addQuatationDirectorSign, setAddQuatationDirectorSign] = useState("");

  const [plotBookCustomerId, setplotBookCustomerId] = useState("");
  const [ShowAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    dob: "",
    age: "",
    anniversary: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
    contactNo: "",
    email: "",
    nominee: "",
    nomineeAge: "",
    relation: "",
    plotno: "",
    khNo: "",
    mouza: "",
    phno: "",
    size: "",
    sqmtr: "",
    sqft: "",
    projectName: "",
    rate: "",
    totalAmount: "",
    tokenDate: "",
    dpDate: "",
    dpAmount: "",
    installmentDate: "",
    installmentAmount: "",
    noOfInstallment: "",
    anySpecialCondition: "",
    layoutId: plotBookCustomerId,
  });

  const [ShowAddNewPlotForm, setShowAddNewPlotForm] = useState(false);
  const [addplotNo, setAddplotNo] = useState("");
  const [addplotSize, setAddplotSize] = useState("");
  const [addplotAreaSqMt, setAddplotAreaSqMt] = useState("");
  const [plotEditId, setPlotEditId] = useState("");
  const [ShowPlotEditForm, setShowPlotEditForm] = useState(false);
  const [editaddplotNo, seteditAddplotNo] = useState("");
  const [editaddplotSize, seteditAddplotSize] = useState("");
  const [editaddplotAreaSqMt, seteditAddplotAreaSqMt] = useState("");
  const [editCustomerBookedId, seteditCustomerBookedId] = useState("");
  const [BookedPLotId, setBookedPLotId] = useState("");
  const [showEditCustomerForm, setShowEditCustomerForm] = useState(false);
  const [bookedCustomerData, setbookedCustomerData] = useState({});
  const [formDataa, setFormDataa] = useState({});

  useEffect(() => {
    async function getAllPlots() {
      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }
        setLoading(true);
        const response = await axiosInstance.get(
          `${BASE_URL}/layouts/project/${ProjectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setPlotData(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch plot details:", error);
        setError("Failed to load plot details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getAllPlots();
  }, [ProjectId, token, refreshKey]);

  useEffect(() => {
    if (!plotData.length) return setFilteredData([]);

    let filtered = [...plotData];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.layoutStatus === statusFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        String(item.plotNo).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [plotData, searchTerm, statusFilter]);

  const toggleCardExpansion = (plotNo) => {
    setExpandedCards((prev) => ({
      ...prev,
      [plotNo]: !prev[plotNo],
    }));
  };

  const handleViewCustomer = async (plot) => {
    setBookedPLotId(plot.id);
    // const customerData =
    //   plot.bookings && plot.bookings.length > 0 ? plot.bookings[0] : null;
    // if (customerData) {
    //   setSelectedCustomer(customerData);
    //   setShowCustomerPopup(true);
    // } else {
    //   alert("No customer data available for this plot.");
    // }
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/bookings/layout/${plot.id}/booked`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      const customerData =
        Array.isArray(response.data) && response.data.length > 0
          ? response.data[0]
          : null;

      if (customerData) {
        setSelectedCustomer(customerData);
        setShowCustomerPopup(true);
      } else {
        alert("No customer data available for this plot.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddCustomer = (plotNo) => {
    setplotBookCustomerId(plotNo);
    setShowAddCustomerForm(true);
  };

  const handleAddQuotation = (plotId) => {
    setAddQuatationId(plotId);
    setShowAddQuatationForm(true);
  };

  const handleViewQuotation = async (plotId) => {
    navigate(`/plotQuatation/${plotId}`);
  };

  const handleEditPlot = async (plotId) => {
    setPlotEditId(plotId);
    setShowPlotEditForm(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/show-layout/${plotId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      seteditAddplotNo(response.data?.plotNo);
      seteditAddplotSize(response.data?.size);
      seteditAddplotAreaSqMt(response.data?.plotAreaSqMt);
    } catch (error) {
      console.log(error);
    }
  };

  async function handleupdatePlotDetail(e) {
    e.preventDefault();
    const bodyData = {
      id: plotEditId,
      plotNo: editaddplotNo,
      size: editaddplotSize,
      plotAreaSqMt: editaddplotAreaSqMt,
      projectId: ProjectId,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/layouts/${plotEditId}`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("plot Details Update Successfully");
        setrefreshKey(refreshKey + 1);
        setShowPlotEditForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeletePlot = async (id) => {
    const mydelete = plotData.find((item) => item.id === id);
    console.log(mydelete);
    if (mydelete && mydelete.layoutStatus === "BOOKED") {
      alert("Plot is booked. Please cancel the bookings before proceeding.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this plot?"
    );
    if (!confirmation) return;

    try {
      await axiosInstance.delete(`${BASE_URL}/layouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPlotData((prevData) => prevData.filter((item) => item.plotNo !== id));
      alert("Plot deleted successfully");
    } catch (error) {
      console.error("Failed to delete plot:", error);
      alert("Failed to delete plot");
    }
  };

  const handleCancelPlot = async (Id) => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel this plot booking?"
    );
    if (!confirmation) return;

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/cancelled-booking/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Plot booking cancelled successfully");
        setPlotData((prevData) =>
          prevData.map((item) =>
            item.bookings && item.bookings[0]?.id === Id
              ? { ...item, layoutStatus: "AVAILABLE" }
              : item
          )
        );
        setrefreshKey(refreshKey + 1);
      }
    } catch (error) {
      console.error("Failed to cancel plot:", error);
      alert("Failed to cancel plot");
    }
  };

  const getAvailablePlotsCount = () => {
    return plotData.filter((item) => item.layoutStatus === "AVAILABLE").length;
  };

  const getBookedPlotsCount = () => {
    return plotData.filter((item) => item.layoutStatus === "BOOKED").length;
  };

  const closeCustomerPopup = () => {
    setShowCustomerPopup(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      date: addQuatationDate,
      coustomerName: addQuatationCustomerName,
      projectName: addQuatationProjectName,
      mouza: addQuatationMouza,
      plotno: addQuatationPlotNo,
      area: addQuatationArea,
      rate: addQuatationRate,
      totalCost: addQuatationTotalCost,
      bookingAmount: addQuatationBookingAmount,
      balanceAmount: addQuatationBalanceAmount,
      downPayment: addQuatationDownPayment,
      remainingAmount: addQuatationRemainingAmount,
      noOfEMI: addQuatationNoOfEMI,
      monthlyEMI: addQuatationMonthlyEMI,
      bankFinance: addQuatationBankFinance,
      stampDuty: addQuatationStampDuty,
      registrationFess: addQuatationRegistrationFees,
      anyspecialConduction: addQuatationAnySpecialCondition,
      bPname: addQuatationBpName,
      directorsign: addQuatationDirectorSign,
      layoutId: addQuatationId,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/quotation/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Quatation Added Successfully");
        setShowAddQuatationForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, layoutId: plotBookCustomerId }));
  }, [plotBookCustomerId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleaddPlotCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/createBooking`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Customer Added Successfully");
        setrefreshKey(refreshKey + 1);
        setFormData({
          customerName: "",
          dob: "",
          age: "",
          anniversary: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          occupation: "",
          contactNo: "",
          email: "",
          nominee: "",
          nomineeAge: "",
          relation: "",
          plotno: "",
          khNo: "",
          mouza: "",
          phno: "",
          size: "",
          sqmtr: "",
          sqft: "",
          projectName: "",
          rate: "",
          totalAmount: "",
          tokenDate: "",
          dpDate: "",
          dpAmount: "",
          installmentDate: "",
          installmentAmount: "",
          noOfInstallment: "",
          anySpecialCondition: "",
          layoutId: plotBookCustomerId,
        });
        setShowAddCustomerForm(false);
      }
    } catch (error) {}
  };

  function handleAddNewPlot() {
    setShowAddNewPlotForm(true);
  }
  async function handleSubmitAddNewPlot(e) {
    e.preventDefault();
    const bodyDeta = {
      plotNo: addplotNo,
      size: addplotSize,
      plotAreaSqMt: addplotAreaSqMt,
      plotType: PlotType,
      projectId: ProjectId,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/createLayout`,
        bodyDeta,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Plot Added Successfully");
        setAddplotNo("");
        setAddplotSize("");
        setAddplotAreaSqMt("");
        setrefreshKey(refreshKey + 1);
        setShowAddNewPlotForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePrint = () => {
    const element = printRef.current;
    if (!element) return;
    const clone = element.cloneNode(true);
    clone.style.maxHeight = "none";
    clone.style.height = "auto";
    clone.style.overflow = "visible";
    clone.style.padding = "20px";
    clone.style.background = "#fff";
    clone.style.color = "#000";
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "-9999px";
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin: 0.1,
      filename: `${selectedCustomer.customerName || "Customer"}-Details.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(container);
      })
      .catch((err) => {
        console.error("PDF Generation Failed", err);
        document.body.removeChild(container);
      });
  };

  async function handleEditBookedCustomer(id) {
    seteditCustomerBookedId(id);
    setShowEditCustomerForm(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/booking/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setbookedCustomerData(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (bookedCustomerData && Object.keys(bookedCustomerData).length > 0) {
      setFormDataa(bookedCustomerData);
    }
  }, [bookedCustomerData]);
  const handleChangee = (e) => {
    const { name, value } = e.target;
    setFormDataa((prev) => ({ ...prev, [name]: value }));
  };

  async function handleupdateBookedCustomer(e) {
    e.preventDefault();
    const bodydeta = {
      ...formDataa,
      layoutId: BookedPLotId,
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/updateBooking/${editCustomerBookedId}`,
        bodydeta,
        {
          headers: {
            Authorization: `Bearer${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Customer Update Successfully");
        setrefreshKey(refreshKey + 1);
        setShowEditCustomerForm(false);
        setShowCustomerPopup(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleShowCancelBookingHistory(id) {
    navigate(`/history/${id}`);
  }
  return (
    <>
      <div className="plotDetailsWrapper">
        <div className="plotDetailsHeader">
          <div className="plotDetailsHeaderContent">
            <h1 className="plotDetailsTitle">{ProjectName} Plot Details</h1>
            <p className="plotDetailsSubtitle">
              View and manage all plots for this development
            </p>
          </div>
        </div>
        <div className="plotDetailsStatsBar">
          <div className="plotDetailsPlotStats">
            <div className="plotDetailsStatItem plotDetailsAvailable">
              <span className="plotDetailsStatValue">
                {getAvailablePlotsCount()}
              </span>
              <span className="plotDetailsStatLabel">Available Plots</span>
            </div>
            <div className="plotDetailsStatItem plotDetailsBooked">
              <span className="plotDetailsStatValue">
                {getBookedPlotsCount()}
              </span>
              <span className="plotDetailsStatLabel">Booked Plots</span>
            </div>
            <div className="plotDetailsStatItem plotDetailsTotal">
              <span className="plotDetailsStatValue">{plotData.length}</span>
              <span className="plotDetailsStatLabel">Total Plots</span>
            </div>
          </div>
        </div>
        <div className="plotDetailsFilters">
          <div className="plotDetailsSearchContainer">
            <Search className="plotDetailsSearchIcon" />
            <input
              type="text"
              placeholder="Search by plot number..."
              className="plotDetailsSearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="plotDetailsClearSearch"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="plotDetailsFilterContainer">
            <Filter className="plotDetailsFilterIcon" />
            <select
              className="plotDetailsFilterSelect"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Plots</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="BOOKED">Booked Only</option>
            </select>
          </div>
          <div>
            <button
              className="plotDetailsAddPlotsButton"
              onClick={handleAddNewPlot}
            >
              Add Plots
            </button>
          </div>
        </div>
        <div className="plotDetailsContainer">
          {loading ? (
            <div className="plotDetailsLoading">
              <div className="plotDetailsLoadingSpinner">
                <Loader2 className="plotDetailsLoadingIcon" />
              </div>
              <p>Loading plot details...</p>
            </div>
          ) : error ? (
            <div className="plotDetailsError">
              <div className="plotDetailsErrorIcon">
                <AlertCircle />
              </div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button
                className="plotDetailsRetryBtn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : plotData.length === 0 ? (
            <div className="plotDetailsEmpty">
              <div className="plotDetailsEmptyIllustration"></div>
              <h3>No plots available</h3>
              <p>No plots found for this development.</p>
            </div>
          ) : (
            <>
              {filteredData.length === 0 ? (
                <div className="plotDetailsNoResults">
                  <div className="plotDetailsNoResultsIcon">
                    <Search />
                  </div>
                  <h3>No matching plots found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button
                    className="plotDetailsResetFiltersBtn"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="plotDetailsGrid">
                  {filteredData.map((item, index) => (
                    <div key={index} className="plotDetailsCard">
                      <div
                        className={`plotDetailsStatusBadge ${
                          item.layoutStatus === "BOOKED"
                            ? "plotDetailsStatusBooked"
                            : "plotDetailsStatusAvailable"
                        }`}
                      >
                        <span className="plotDetailsStatusDot"></span>
                        {item.layoutStatus === "BOOKED"
                          ? "BOOKED"
                          : "AVAILABLE"}
                      </div>
                      <h3 className="plotDetailsName">Plot {item.plotNo}</h3>
                      <div className="plotDetailsInfo">
                        <div className="plotDetailsDetailItem">
                          <span className="plotDetailsDetailLabel">Size:</span>
                          <span>{item.size || "N/A"}</span>
                        </div>
                        <div className="plotDetailsDetailItem">
                          <span className="plotDetailsDetailLabel">
                            Area (sq.mt):
                          </span>
                          <span>{item.plotAreaSqMt || "N/A"}</span>
                        </div>
                      </div>

                      <div className="plotDetailsButtonContainer">
                        {item.layoutStatus === "BOOKED" ? (
                          <button
                            className="plotDetailsActionBtn plotDetailsViewCustomerBtn"
                            onClick={() => handleViewCustomer(item)}
                            title="View Customer"
                          >
                            <Eye className="plotDetailsBtnIcon" />
                          </button>
                        ) : (
                          <button
                            className="plotDetailsActionBtn plotDetailsAddCustomerBtn"
                            onClick={() => handleAddCustomer(item.id)}
                            title="Add Customer"
                          >
                            <User className="plotDetailsBtnIcon" />
                          </button>
                        )}
                        <button
                          className="plotDetailsShowMoreBtn"
                          onClick={() => toggleCardExpansion(item.plotNo)}
                        >
                          {expandedCards[item.plotNo] ? (
                            <ChevronUp className="plotDetailsBtnIcon" />
                          ) : (
                            <ChevronDown className="plotDetailsBtnIcon" />
                          )}
                        </button>
                      </div>

                      {expandedCards[item.plotNo] && (
                        <div className="plotDetailsActionPopup">
                          <button
                            className="plotDetailsActionBtn plotDetailsAddQuotationBtn"
                            onClick={() => handleAddQuotation(item.id)}
                            title="Add Quatation"
                          >
                            <FileText className="plotDetailsBtnIcon" />
                          </button>
                          <button
                            className="plotDetailsActionBtn plotDetailsViewQuotationBtn"
                            onClick={() => handleViewQuotation(item.id)}
                            title=" View
                            Quotation"
                          >
                            <Eye className="plotDetailsBtnIcon" />
                          </button>
                          <button
                            className="plotDetailsActionBtn plotDetailsEditBtn"
                            onClick={() => handleEditPlot(item.id)}
                            title=" Edit"
                          >
                            <Edit className="plotDetailsBtnIcon" />
                          </button>
                          <button
                            className="plotDetailsActionBtn plotDetailsDeleteBtn"
                            onClick={() => handleDeletePlot(item.id)}
                            title="Delete"
                          >
                            <Trash2 className="plotDetailsBtnIcon" />
                          </button>
                          {item.layoutStatus === "BOOKED" && (
                            <button
                              className="plotDetailsActionBtn plotDetailsCancelBtn"
                              onClick={() =>
                                handleCancelPlot(
                                  item?.bookings[item.bookings.length - 1]?.id
                                )
                              }
                              title="Cancel
                              Plot"
                            >
                              <XCircle className="plotDetailsBtnIcon" />
                            </button>
                          )}
                          <button
                            className="plotDetailsActionBtn plotDetailsEditBtn"
                            onClick={() =>
                              handleShowCancelBookingHistory(item.id)
                            }
                            title="   Booking History"
                          >
                            <Timer className="plotDetailsBtnIcon" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {/* Customer Details Popup */}
        {showCustomerPopup && selectedCustomer && (
          <div className="plotDetailsCustomerPopupOverlay">
            <div className="plotDetailsCustomerPopup">
              <div className="plotDetailsPopupHeader">
                <h2>Customer Details</h2>
                <button
                  className="plotDetailsClosePopup"
                  onClick={closeCustomerPopup}
                >
                  <X className="plotDetailsCloseIcon" />
                </button>
              </div>
              <div className="plotDetailsPopupContent" ref={printRef}>
                <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                  {ProjectName} - Customer Details
                </h2>

                <div className="plotDetailsCustomerInfoGrid">
                  <div className="plotDetailsCustomerSection">
                    <h3>Personal Information</h3>
                    <div className="plotDetailsInfoGroup">
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Name:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.customerName || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Age:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.age || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Occupation:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.occupation || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Date of Birth:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.dob || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Anniversary:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.anniversary || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="plotDetailsCustomerSection">
                    <h3>Contact Information</h3>
                    <div className="plotDetailsInfoGroup">
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Address:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.address || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">City:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.city || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">State:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.state || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Pincode:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.pincode || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Contact:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.contactNo || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Email:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.email || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="plotDetailsCustomerSection">
                    <h3>Nominee Details</h3>
                    <div className="plotDetailsInfoGroup">
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Nominee Name:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.nominee || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Nominee Age:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.nomineeAge || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Relation:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.relation || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Special Condition:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.anySpecialConduction || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="plotDetailsCustomerSection">
                    <h3>Plot Details</h3>
                    <div className="plotDetailsInfoGroup">
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Project:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.projectName || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Plot No:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.plotno || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">KH No:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.khNo || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Mouza:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.mouza || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Size:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.size || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Sq.ft:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.sqft || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Sq.mtr:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.sqmtr || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="plotDetailsCustomerSection">
                    <h3>Payment Details</h3>
                    <div className="plotDetailsInfoGroup">
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">Rate:</span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.rate
                            ? `₹${selectedCustomer.rate.toLocaleString(
                                "en-IN"
                              )}`
                            : "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Total Amount:
                        </span>
                        <span className="plotDetailsInfoValue">
                          ₹{selectedCustomer.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Down Payment:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.dpAmount
                            ? `₹${selectedCustomer.dpAmount.toLocaleString(
                                "en-IN"
                              )}`
                            : "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Down Payment Date:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.dpDate || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Token Date:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.tokenDate || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Installment Amount:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.installmentAmount
                            ? `₹${selectedCustomer.installmentAmount.toLocaleString(
                                "en-IN"
                              )}`
                            : "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          Installment Date:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.installmentDate || "-"}
                        </span>
                      </div>
                      <div className="plotDetailsInfoItem">
                        <span className="plotDetailsInfoLabel">
                          No. of Installments:
                        </span>
                        <span className="plotDetailsInfoValue">
                          {selectedCustomer.noOfInstallment || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="plotDetailsPopupFooter">
                <button
                  className="plotDetailsPopupBtn plotDetailsPrintBtn"
                  onClick={() => handleEditBookedCustomer(selectedCustomer.id)}
                >
                  Edit Customer
                </button>
                <button
                  className="plotDetailsPopupBtn plotDetailsPrintBtn"
                  onClick={handlePrint}
                >
                  Print Details
                </button>
                <button
                  className="plotDetailsPopupBtn plotDetailsCloseBtn"
                  onClick={closeCustomerPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {ShowAddQuatationForm && (
        <>
          <div className="plotDetailsAddplotQuationOverlay">
            <div className="plotDetailsAddplotQuationPopup">
              <div className="plotDetailsAddplotQuationHeader">
                <h2 className="plotDetailsAddplotQuationTitle">
                  Add Plot Quotation
                </h2>
                <button
                  className="plotDetailsAddplotQuationCloseBtn"
                  onClick={() => setShowAddQuatationForm(false)}
                >
                  <X className="plotDetailsAddplotQuationCloseIcon" />
                </button>
              </div>
              <form
                className="plotDetailsAddplotQuationForm"
                onSubmit={handleSubmit}
              >
                <div className="plotDetailsAddplotQuationFormGrid">
                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationDate"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="addQuatationDate"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationDate}
                      onChange={(e) => setAddQuatationDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationCustomerName"
                    >
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="addQuatationCustomerName"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationCustomerName}
                      onChange={(e) =>
                        setAddQuatationCustomerName(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationProjectName"
                    >
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="addQuatationProjectName"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationProjectName}
                      onChange={(e) =>
                        setAddQuatationProjectName(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationMouza"
                    >
                      Mouza
                    </label>
                    <input
                      type="text"
                      id="addQuatationMouza"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationMouza}
                      onChange={(e) => setAddQuatationMouza(e.target.value)}
                      required
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationPlotNo"
                    >
                      Plot No
                    </label>
                    <input
                      type="text"
                      id="addQuatationPlotNo"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationPlotNo}
                      onChange={(e) => setAddQuatationPlotNo(e.target.value)}
                      required
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationArea"
                    >
                      Area
                    </label>
                    <input
                      type="text"
                      id="addQuatationArea"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationArea}
                      onChange={(e) => setAddQuatationArea(e.target.value)}
                      required
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationRate"
                    >
                      Rate (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationRate"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationRate}
                      onChange={(e) => setAddQuatationRate(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plot.padDetailsAddplotQuationLabel"
                      htmlFor="addQuatationTotalCost"
                    >
                      Total Cost (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationTotalCost"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationTotalCost}
                      onChange={(e) => setAddQuatationTotalCost(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationBookingAmount"
                    >
                      Booking Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationBookingAmount"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationBookingAmount}
                      onChange={(e) =>
                        setAddQuatationBookingAmount(e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationBalanceAmount"
                    >
                      Balance Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationBalanceAmount"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationBalanceAmount}
                      onChange={(e) =>
                        setAddQuatationBalanceAmount(e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationDownPayment"
                    >
                      Down Payment (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationDownPayment"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationDownPayment}
                      onChange={(e) =>
                        setAddQuatationDownPayment(e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationRemainingAmount"
                    >
                      Remaining Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationRemainingAmount"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationRemainingAmount}
                      onChange={(e) =>
                        setAddQuatationRemainingAmount(e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationNoOfEMI"
                    >
                      No. of EMI
                    </label>
                    <input
                      type="number"
                      id="addQuatationNoOfEMI"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationNoOfEMI}
                      onChange={(e) => setAddQuatationNoOfEMI(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationMonthlyEMI"
                    >
                      Monthly EMI (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationMonthlyEMI"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationMonthlyEMI}
                      onChange={(e) =>
                        setAddQuatationMonthlyEMI(e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationBankFinance"
                    >
                      Bank Finance
                    </label>
                    <select
                      id="addQuatationBankFinance"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationBankFinance}
                      onChange={(e) =>
                        setAddQuatationBankFinance(e.target.value)
                      }
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationStampDuty"
                    >
                      Stamp Duty (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationStampDuty"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationStampDuty}
                      onChange={(e) => setAddQuatationStampDuty(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationRegistrationFees"
                    >
                      Registration Fees (₹)
                    </label>
                    <input
                      type="number"
                      id="addQuatationRegistrationFees"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationRegistrationFees}
                      onChange={(e) =>
                        setAddQuatationRegistrationFees(e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationAnySpecialCondition"
                    >
                      Any Special Condition
                    </label>
                    <input
                      type="text"
                      id="addQuatationAnySpecialCondition"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationAnySpecialCondition}
                      onChange={(e) =>
                        setAddQuatationAnySpecialCondition(e.target.value)
                      }
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationBpName"
                    >
                      Broker Name
                    </label>
                    <input
                      type="text"
                      id="addQuatationBpName"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationBpName}
                      onChange={(e) => setAddQuatationBpName(e.target.value)}
                    />
                  </div>

                  <div className="plotDetailsAddplotQuationFormGroup">
                    <label
                      className="plotDetailsAddplotQuationLabel"
                      htmlFor="addQuatationDirectorSign"
                    >
                      Director Sign
                    </label>
                    <input
                      type="text"
                      id="addQuatationDirectorSign"
                      className="plotDetailsAddplotQuationInput"
                      value={addQuatationDirectorSign}
                      onChange={(e) =>
                        setAddQuatationDirectorSign(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="plotDetailsAddplotQuationFormActions">
                  <button
                    type="submit"
                    className="plotDetailsAddplotQuationSubmitBtn"
                  >
                    Submit Quotation
                  </button>
                  <button
                    type="button"
                    className="plotDetailsAddplotQuationCancelBtn"
                    onClick={() => setShowAddQuatationForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/*  add customer form */}

      {ShowAddCustomerForm && (
        <div className="plotDetailsAddcustomerPlotOverlay">
          <div className="plotDetailsAddcustomerPlotPopup">
            <form
              className="plotDetailsAddcustomerPlotForm"
              onSubmit={handleaddPlotCustomer}
            >
              <button
                type="button"
                className="plotDetailsAddcustomerPlotCloseBtn"
                onClick={() => setShowAddCustomerForm(false)}
              >
                ×
              </button>
              <h2 className="plotDetailsAddcustomerPlotTitle">
                Add Customer & Plot Quotation
              </h2>

              {/* Personal Details */}
              <div className="plotDetailsAddcustomerPlotSection">
                <h3 className="plotDetailsAddcustomerPlotSectionTitle">
                  Personal Details
                </h3>
                <div className="plotDetailsAddcustomerPlotGrid">
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Anniversary
                    </label>
                    <input
                      type="date"
                      name="anniversary"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.anniversary}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Contact No
                    </label>
                    <input
                      type="tel"
                      name="contactNo"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.contactNo}
                      onChange={handleChange}
                      placeholder="Enter contact number"
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="plotDetailsAddcustomerPlotSection">
                <h3 className="plotDetailsAddcustomerPlotSectionTitle">
                  Address Details
                </h3>
                <div className="plotDetailsAddcustomerPlotGrid">
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      pattern="[0-9]{5,6}"
                    />
                  </div>
                </div>
              </div>

              {/* Nominee Details */}
              <div className="plotDetailsAddcustomerPlotSection">
                <h3 className="plotDetailsAddcustomerPlotSectionTitle">
                  Nominee Details
                </h3>
                <div className="plotDetailsAddcustomerPlotGrid">
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Nominee Name
                    </label>
                    <input
                      type="text"
                      name="nominee"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.nominee}
                      onChange={handleChange}
                      placeholder="Enter nominee name"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Nominee Age
                    </label>
                    <input
                      type="number"
                      name="nomineeAge"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.nomineeAge}
                      onChange={handleChange}
                      placeholder="Enter nominee age"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Relation
                    </label>
                    <input
                      type="text"
                      name="relation"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.relation}
                      onChange={handleChange}
                      placeholder="Enter relation"
                    />
                  </div>
                </div>
              </div>

              {/* Plot Details */}
              <div className="plotDetailsAddcustomerPlotSection">
                <h3 className="plotDetailsAddcustomerPlotSectionTitle">
                  Plot Details
                </h3>
                <div className="plotDetailsAddcustomerPlotGrid">
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Plot No
                    </label>
                    <input
                      type="text"
                      name="plotno"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.plotno}
                      onChange={handleChange}
                      placeholder="Enter plot number"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Khasra No
                    </label>
                    <input
                      type="text"
                      name="khNo"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.khNo}
                      onChange={handleChange}
                      placeholder="Enter khasra number"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Mouza
                    </label>
                    <input
                      type="text"
                      name="mouza"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.mouza}
                      onChange={handleChange}
                      placeholder="Enter mouza"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Phone No
                    </label>
                    <input
                      type="tel"
                      name="phno"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.phno}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Size (sq.ft)
                    </label>
                    <input
                      type="number"
                      name="size"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.size}
                      onChange={handleChange}
                      placeholder="Enter size in sq.ft"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Square Meters
                    </label>
                    <input
                      type="number"
                      name="sqmtr"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.sqmtr}
                      onChange={handleChange}
                      placeholder="Enter size in sq.m"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      name="sqft"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.sqft}
                      onChange={handleChange}
                      placeholder="Enter size in sq.ft"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="Enter project name"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="plotDetailsAddcustomerPlotSection">
                <h3 className="plotDetailsAddcustomerPlotSectionTitle">
                  Financial Details
                </h3>
                <div className="plotDetailsAddcustomerPlotGrid">
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Rate (per sq.ft)
                    </label>
                    <input
                      type="number"
                      name="rate"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.rate}
                      onChange={handleChange}
                      placeholder="Enter rate"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      placeholder="Enter total amount"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Token Date
                    </label>
                    <input
                      type="date"
                      name="tokenDate"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.tokenDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Down Payment Date
                    </label>
                    <input
                      type="date"
                      name="dpDate"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.dpDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Down Payment Amount
                    </label>
                    <input
                      type="number"
                      name="dpAmount"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.dpAmount}
                      onChange={handleChange}
                      placeholder="Enter down payment amount"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Installment Date
                    </label>
                    <input
                      type="date"
                      name="installmentDate"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.installmentDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Installment Amount
                    </label>
                    <input
                      type="number"
                      name="installmentAmount"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.installmentAmount}
                      onChange={handleChange}
                      placeholder="Enter installment amount"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      No of Installments
                    </label>
                    <input
                      type="number"
                      name="noOfInstallment"
                      className="plotDetailsAddcustomerPlotInput"
                      value={formData.noOfInstallment}
                      onChange={handleChange}
                      placeholder="Enter number of installments"
                    />
                  </div>
                  <div className="plotDetailsAddcustomerPlotField">
                    <label className="plotDetailsAddcustomerPlotLabel">
                      Special Conditions
                    </label>
                    <textarea
                      name="anySpecialCondition"
                      className="plotDetailsAddcustomerPlotInput plotDetailsAddcustomerPlotTextarea"
                      value={formData.anySpecialCondition}
                      onChange={handleChange}
                      placeholder="Enter any special conditions"
                    />
                  </div>
                </div>
              </div>

              <div className="plotDetailsAddcustomerPlotButtonGroup">
                <button
                  type="submit"
                  className="plotDetailsAddcustomerPlotSubmitBtn"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="plotDetailsAddcustomerPlotCancelBtn"
                  onClick={() => setShowAddCustomerForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ShowAddNewPlotForm && (
        <>
          <div className="plotDetailsAddPlotFormPopupOverlay">
            <form
              onSubmit={handleSubmitAddNewPlot}
              className="plotDetailsAddPlotForm"
            >
              <h2 style={{ textAlign: "center" }}> Add Plot Details</h2>

              <button
                type="button"
                onClick={() => setShowAddNewPlotForm(false)}
                className="plotDetailsAddPlotFormCloseButton"
              >
                X
              </button>
              <label htmlFor="plotNo" className="plotDetailsAddPlotFormLabel">
                Plot No
              </label>
              <input
                id="plotNo"
                type="text"
                className="plotDetailsAddPlotFormInput"
                value={addplotNo}
                onChange={(e) => setAddplotNo(e.target.value)}
                required
              />
              <label htmlFor="plotSize" className="plotDetailsAddPlotFormLabel">
                Plot Size
              </label>
              <input
                id="plotSize"
                type="text"
                className="plotDetailsAddPlotFormInput"
                value={addplotSize}
                onChange={(e) => setAddplotSize(e.target.value)}
                required
              />
              <label htmlFor="plotArea" className="plotDetailsAddPlotFormLabel">
                Plot Area SqMt
              </label>
              <input
                id="plotArea"
                type="text"
                className="plotDetailsAddPlotFormInput"
                value={addplotAreaSqMt}
                onChange={(e) => setAddplotAreaSqMt(e.target.value)}
                required
              />
              <label htmlFor="plotArea" className="plotDetailsAddPlotFormLabel">
                Plot Type
              </label>
              <select
                name=""
                id=""
                className="plotDetailsAddPlotFormInput"
                value={PlotType}
                onChange={(e) => setPlotType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Plot Type
                </option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
              </select>
              <button
                type="submit"
                className="plotDetailsAddPlotFormSubmitButton"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}

      {ShowPlotEditForm && (
        <>
          <div className="plotDetailsAddPlotFormPopupOverlay">
            <form
              className="plotDetailsAddPlotForm"
              onSubmit={handleupdatePlotDetail}
            >
              <h2 style={{ textAlign: "center" }}> Edit Plot Details</h2>

              <button
                type="button"
                onClick={() => setShowPlotEditForm(false)}
                className="plotDetailsAddPlotFormCloseButton"
              >
                X
              </button>
              <label htmlFor="plotNo" className="plotDetailsAddPlotFormLabel">
                Plot No
              </label>
              <input
                id="plotNo"
                type="text"
                className="plotDetailsAddPlotFormInput"
                required
                value={editaddplotNo}
                onChange={(e) => seteditAddplotNo(e.target.value)}
              />
              <label htmlFor="plotSize" className="plotDetailsAddPlotFormLabel">
                Plot Size
              </label>
              <input
                id="plotSize"
                type="text"
                className="plotDetailsAddPlotFormInput"
                required
                value={editaddplotSize}
                onChange={(e) => seteditAddplotSize(e.target.value)}
              />
              <label htmlFor="plotArea" className="plotDetailsAddPlotFormLabel">
                Plot Area SqMt
              </label>
              <input
                id="plotArea"
                type="text"
                className="plotDetailsAddPlotFormInput"
                value={editaddplotAreaSqMt}
                onChange={(e) => seteditAddplotAreaSqMt(e.target.value)}
                required
              />
              <label htmlFor="plotType" className="plotDetailsAddPlotFormLabel">
                Plot Type
              </label>
              <select
                name=""
                id=""
                className="plotDetailsAddPlotFormInput"
                value={PlotType}
                onChange={(e) => setPlotType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Plot Type
                </option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
              </select>
              <button
                type="submit"
                className="plotDetailsAddPlotFormSubmitButton"
              >
                Update
              </button>
            </form>
          </div>
        </>
      )}

      {showEditCustomerForm && (
        <>
          <div className="editbookedcustomer-overlay">
            <div className="editbookedcustomer-container">
              <form
                className="editbookedcustomer"
                onSubmit={handleupdateBookedCustomer}
              >
                <div className="editbookedcustomer-header">
                  <h2>Edit Customer Details</h2>
                  <button
                    type="button"
                    onClick={() => setShowEditCustomerForm(false)}
                    className="editbookedcustomer-close"
                  >
                    X
                  </button>
                </div>
                <div className="editbookedcustomer-grid">
                  <div>
                    <label className="editbookedcustomer-label">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formDataa.customerName}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formDataa.dob}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formDataa.age}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Anniversary
                    </label>
                    <input
                      type="date"
                      name="anniversary"
                      value={formDataa.anniversary}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formDataa.address}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formDataa.city}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formDataa.state}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formDataa.pincode}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formDataa.occupation}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Contact No
                    </label>
                    <input
                      type="tel"
                      name="contactNo"
                      value={formDataa.contactNo}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formDataa.email}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Nominee</label>
                    <input
                      type="text"
                      name="nominee"
                      value={formDataa.nominee}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Nominee Age
                    </label>
                    <input
                      type="number"
                      name="nomineeAge"
                      value={formDataa.nomineeAge}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Relation</label>
                    <input
                      type="text"
                      name="relation"
                      value={formDataa.relation}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Plot No</label>
                    <input
                      type="text"
                      name="plotno"
                      value={formDataa.plotno}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Kh No</label>
                    <input
                      type="text"
                      name="kh,no"
                      value={formDataa.khNo}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Mouza</label>
                    <input
                      type="text"
                      name="mouza"
                      value={formDataa.mouza}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Phone No</label>
                    <input
                      type="tel"
                      name="phno"
                      value={formDataa.phno}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formDataa.size}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Square Meters
                    </label>
                    <input
                      type="text"
                      name="sqmtr"
                      value={formDataa.sqmtr}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Square Feet
                    </label>
                    <input
                      type="text"
                      name="sqft"
                      value={formDataa.sqft}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formDataa.projectName}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">Rate</label>
                    <input
                      type="text"
                      name="rate"
                      value={formDataa.rate}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Total Amount
                    </label>
                    <input
                      type="text"
                      name="totalAmount"
                      value={formDataa.totalAmount}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Token Date
                    </label>
                    <input
                      type="date"
                      name="tokenDate"
                      value={formDataa.tokenDate}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">DP Date</label>
                    <input
                      type="date"
                      name="dpDate"
                      value={formDataa.dpDate}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      DP Amount
                    </label>
                    <input
                      type="text"
                      name="dpAmount"
                      value={formDataa.dpAmount}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Installment Date
                    </label>
                    <input
                      type="date"
                      name="installmentDate"
                      value={formDataa.installmentDate}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Installment Amount
                    </label>
                    <input
                      type="text"
                      name="installmentAmount"
                      value={formDataa.installmentAmount}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      No of Installments
                    </label>
                    <input
                      type="number"
                      name="noOfInstallment"
                      value={formDataa.noOfInstallment}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                  <div>
                    <label className="editbookedcustomer-label">
                      Any Special Condition
                    </label>
                    <input
                      type="text"
                      name="anySpecialConduction"
                      value={formDataa.anySpecialConduction}
                      onChange={handleChangee}
                      className="editbookedcustomer-input"
                    />
                  </div>
                </div>
                <div className="editbookedcustomer-buttons">
                  <button
                    type="button"
                    onClick={() => setShowEditCustomerForm(false)}
                    className="editbookedcustomer-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="editbookedcustomer-submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PlotDetails;
