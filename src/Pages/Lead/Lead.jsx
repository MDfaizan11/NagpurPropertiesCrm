import { useCallback, useEffect, useState } from "react";
import "../Lead/lead.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import {
  Eye,
  Phone,
  MapPin,
  ChartNoAxesCombined,
  SquarePen,
  Trash,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const Lead = () => {
  const { ProjectId, ProjectName } = useParams();
  const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const token = userData?.token;
  const UserId = userData?.id || userData?.headId || userData?.employeeId;
  const role = userData?.role?.[0]?.roleName?.toUpperCase() || "EMPLOYEE";

  const [refreshKey, setRefreshKey] = useState(0);
  const [projectLeads, setProjectLeads] = useState([]);
  const [allLeadData, setAllLeadData] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Leads");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [area, setArea] = useState("");
  const [executedName, setExecutedName] = useState("");
  const [status, setStatus] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [siteName, setSiteName] = useState("");
  const [showAddLeadLogForm, setShowAddLeadLogForm] = useState(false);
  const [LeadLogId, setLeadLogId] = useState("");
  const [leadLogDate, setLeadLogDate] = useState("");
  const [leadLogStatus, setLeadLogStatus] = useState("");
  const [leadLogRemark, setLeadLogRemark] = useState("");
  const [updateLeadId, setUpdateLeadId] = useState("");
  const [showUpdateLeadForm, setShowUpdateLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [employeeStatus, setEmployeeStatus] = useState("WORKING");
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: UserId,
    employeeType: role,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState(null);

  const leadsPerPage = 10;
  const newId = selectedEmployee?.id || UserId;
  const employeeType = selectedEmployee?.employeeType || role;

  // Fetch employee data
  const workingEmployeeData = useCallback(async () => {
    if (role === "EMPLOYEE") {
      setEmployeeData([
        {
          id: UserId,
          employeeType: "EMPLOYEE",
          employeeName: userData.employeeName,
        },
      ]);
      setError(null);
      return;
    }

    try {
      if (!token) {
        setError("Token missing. Please log in.");
        setEmployeeData([]);
        return;
      }

      const res = await axiosInstance.get(
        `${BASE_URL}/get/employee-and-head/response/according/authorization?t=${Date.now()}`,
        {
          params: { employeeStatus },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let filteredEmployeeData = res.data || [];
      if (role === "HEAD") {
        filteredEmployeeData = filteredEmployeeData.filter(
          (emp) =>
            emp.employeeType === "HEAD" || emp.employeeType === "EMPLOYEE"
        );
      }

      setEmployeeData(filteredEmployeeData);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("NagpurProperties");
        window.location.href = "/login";
      }
      setEmployeeData([]);
      setError("Failed to fetch employee data. Please try again later.");
    }
  }, [employeeStatus, token, role, UserId, userData.employeeName]);

  useEffect(() => {
    if (UserId) {
      workingEmployeeData();
    } else {
      setError("User ID is missing. Please log in again.");
      setEmployeeData([]);
    }
  }, [workingEmployeeData]);

  // Fetch leads
  useEffect(() => {
    async function getAllLeadWithProject() {
      try {
        setIsLoading(true);
        setProjectLeads([]);
        setAllLeadData([]);
        setFilteredLeads([]);
        setCurrentPage(1);

        if (!ProjectId || !newId || !employeeType || !token) {
          setError("Missing required parameters");
          return;
        }

        const validEmployeeTypes = ["ADMIN", "HEAD", "EMPLOYEE"];
        if (!validEmployeeTypes.includes(employeeType)) {
          setError(`Invalid employee type: ${employeeType}`);
          return;
        }

        let url;
        if (role === "ADMIN") {
          url = `${BASE_URL}/get-all-lead/by/project/${ProjectId}/user/${newId}/and/${employeeType}?t=${Date.now()}`;
        } else if (role === "HEAD") {
          if (employeeType === "HEAD") {
            url = `${BASE_URL}/get-all-lead/by/project/${ProjectId}/user/${newId}/and/HEAD?t=${Date.now()}`;
          } else {
            url = `${BASE_URL}/get-all-lead/by/project/${ProjectId}/user/${newId}/and/EMPLOYEE?t=${Date.now()}`;
          }
        } else if (role === "EMPLOYEE") {
          url = `${BASE_URL}/get-all-lead/by/project/${ProjectId}/user/${UserId}/and/EMPLOYEE?t=${Date.now()}`;
        }

        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setProjectLeads(response.data || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("NagpurProperties");
          window.location.href = "/login";
        }
        setProjectLeads([]);
        setError(error.response?.data?.message || "Failed to fetch leads");
      } finally {
        setIsLoading(false);
      }
    }

    if (UserId) {
      getAllLeadWithProject();
    } else {
      setError("User ID is missing. Please log in again.");
      setIsLoading(false);
    }
  }, [newId, employeeType, ProjectId, token, refreshKey, role, UserId]);

  // Sync allLeadData and filteredLeads with projectLeads
  useEffect(() => {
    if (projectLeads) {
      setAllLeadData(projectLeads);
      setFilteredLeads(projectLeads);
      setLoading(false);
    } else {
      setAllLeadData([]);
      setFilteredLeads([]);
      setLoading(false);
    }
  }, [projectLeads]);

  // Filter leads based on search and status
  useEffect(() => {
    let filtered = allLeadData.filter((lead) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        lead.name?.toLowerCase().includes(query) ||
        lead.city?.toLowerCase().includes(query) ||
        lead.status?.toLowerCase().includes(query) ||
        lead.siteName?.toLowerCase().includes(query) ||
        lead.id?.toString().includes(query)
      );
    });

    if (activeFilter !== "All Leads") {
      const status = activeFilter.toLowerCase().replace(/\s/g, "_");
      filtered = filtered.filter(
        (lead) => lead.leadStatus?.toLowerCase() === status
      );
    }

    if (sortConfig.key && filtered.length > 0) {
      const key = sortConfig.key;
      filtered.sort((a, b) => {
        const aVal = a[key]?.toString().toLowerCase() || "";
        const bVal = b[key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [searchQuery, allLeadData, activeFilter, sortConfig]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = async (lead) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/AllLeadById/${lead.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setSelectedLeadForDetail(response.data);
        setShowDetailPopup(true);
      } else {
        setSelectedLeadForDetail(lead);
        setShowDetailPopup(true);
      }
    } catch (error) {
      console.error("Error fetching complete lead data:", error);
      setSelectedLeadForDetail(lead);
      setShowDetailPopup(true);
    }
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber) => {
    const message = encodeURIComponent(
      "Hello! I'm contacting you regarding your property inquiry."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  async function handleAddnewLead(e) {
    e.preventDefault();
    const newLead = {
      name,
      phone,
      city,
      date,
      area,
      executedName,
      status,
      leadStatus,
      siteName,
      remark,
      projectId: ProjectId,
      creatorId: UserId,
      creatorType: role,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/createLead`,
        newLead,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Lead added successfully");
        setRefreshKey((prevKey) => prevKey + 1);
        setName("");
        setPhone("");
        setCity("");
        setDate("");
        setArea("");
        setExecutedName("");
        setStatus("");
        setLeadStatus("");
        setRemark("");
        setSiteName("");
        setShowAddLeadForm(false);
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      setError(error.response?.data?.message || "Failed to add lead");
    }
  }

  function handleShowLeadLogPopup(id) {
    setLeadLogId(id);
    setShowAddLeadLogForm(true);
  }

  async function handleAddNewLeadLog(e) {
    e.preventDefault();
    const logData = [
      {
        logDate: leadLogDate,
        status: leadLogStatus,
        remark: leadLogRemark,
      },
    ];

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/${LeadLogId}/addLogs`,
        logData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Lead log added successfully");
        setRefreshKey((prevKey) => prevKey + 1);
        setShowAddLeadLogForm(false);
        setLeadLogDate("");
        setLeadLogStatus("");
        setLeadLogRemark("");

        if (selectedLeadForDetail && selectedLeadForDetail.id === LeadLogId) {
          const updatedLead = await axiosInstance.get(
            `${BASE_URL}/AllLeadById/${LeadLogId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (updatedLead.data) {
            setSelectedLeadForDetail(updatedLead.data);
          }
        }
      }
    } catch (error) {
      console.error("Error adding lead log:", error);
      setError(error.response?.data?.message || "Failed to add lead log");
    }
  }

  async function handleUpdateLead(id) {
    setUpdateLeadId(id);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/AllLeadById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setSelectedLead(response.data);
        setShowUpdateLeadForm(true);
      }
    } catch (error) {
      console.error("Error fetching lead by ID:", error);
      setError(error.response?.data?.message || "Failed to fetch lead");
    }
  }

  async function handleDeleteLead(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/deleteLead/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Lead deleted successfully");
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      setError(error.response?.data?.message || "Failed to delete lead");
    }
  }

  async function handleupdateLeadLog(e) {
    e.preventDefault();
    const parsedProjectId = Number(ProjectId);
    if (!parsedProjectId) {
      alert("Invalid Project ID");
      return;
    }

    const validLogs =
      selectedLead?.leadLogs?.map((log) => ({
        id: log.id,
        logDate: log.logDate,
        status: log.status,
        remark: log.remark,
      })) || [];

    const updatedLead = {
      projectId: parsedProjectId,
      name: selectedLead.name,
      phone: selectedLead.phone,
      city: selectedLead.city,
      date: selectedLead.date,
      area: selectedLead.area,
      executedName: selectedLead.executedName,
      status: selectedLead.status,
      leadStatus: selectedLead.leadStatus,
      siteName: selectedLead.siteName,
      budget: Number(selectedLead.budget) || 0,
      remark: selectedLead.remark,
      leadLogs: validLogs,
      creatorId: selectedLead.creatorId || UserId,
      creatorType: selectedLead.creatorType || role,
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/updateLead/${updateLeadId}`,
        updatedLead,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Lead updated successfully");
        setRefreshKey((prevKey) => prevKey + 1);
        setShowUpdateLeadForm(false);
        setSelectedLead(null);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      setError(error.response?.data?.message || "Failed to update lead");
    }
  }

  return (
    <>
      <div className="lead-wrapper">
        <div className="lead-header">
          <div className="lead-header-content">
            <h1 className="lead-title">{ProjectName} Lead Management</h1>
            <p className="lead-subtitle">
              Track and manage your property leads efficiently
            </p>
          </div>
        </div>

        <div className="lead-controls">
          <div className="lead-search-wrapper">
            <input
              type="text"
              placeholder="Search by name, ID, city, site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lead-search-input"
              aria-label="Search leads"
            />
            {/* <span className="lead-search-icon">🔍</span> */}
          </div>

          <div className="lead-view-controls">
            <div className="lead-filter-and-add">
              {role !== "EMPLOYEE" && (
                <select
                  className="lead-filter"
                  aria-label="Filter employee status"
                  value={employeeStatus}
                  onChange={(e) => {
                    setEmployeeStatus(e.target.value);
                    setSelectedEmployee({ id: UserId, employeeType: role });
                    setProjectLeads([]);
                    setAllLeadData([]);
                    setFilteredLeads([]);
                    setCurrentPage(1);
                  }}
                >
                  <option value="WORKING">WORKING</option>
                  <option value="NOT_WORKING_RESIGNED">
                    NOT_WORKING_RESIGNED
                  </option>
                  <option value="NOT_WORKING_TERMINATED">
                    NOT_WORKING_TERMINATED
                  </option>
                  <option value="NOT_WORKING_RETIRED">
                    NOT_WORKING_RETIRED
                  </option>
                </select>
              )}

              <select
                className="lead-filter"
                aria-label="Select employee"
                value={
                  selectedEmployee.id && selectedEmployee.employeeType
                    ? `${selectedEmployee.id}-${selectedEmployee.employeeType}`
                    : ""
                }
                onChange={(e) => {
                  setProjectLeads([]);
                  setAllLeadData([]);
                  setFilteredLeads([]);
                  setCurrentPage(1);
                  setIsLoading(true);
                  const value = e.target.value;
                  if (value === "") {
                    setSelectedEmployee({ id: UserId, employeeType: role });
                  } else {
                    const [id, employeeType] = value.split("-");
                    setSelectedEmployee({ id, employeeType });
                  }
                }}
                disabled={role === "EMPLOYEE"}
              >
                {role !== "EMPLOYEE" && (
                  <option value="">All Leads ({role})</option>
                )}
                {employeeData.length > 0 ? (
                  employeeData.map((item) => (
                    <option
                      key={item.id}
                      value={`${item.id}-${item.employeeType}`}
                    >
                      {item.employeeName} ({item.employeeType})
                    </option>
                  ))
                ) : (
                  <option disabled>No employees found</option>
                )}
              </select>

              <select
                className="lead-filter"
                aria-label="Filter leads"
                value={activeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option>All Leads</option>
                <option>Offline</option>
                <option>Online</option>
              </select>

              <button
                className="lead-add-lead-btn"
                onClick={() => setShowAddLeadForm(!showAddLeadForm)}
              >
                <span className="lead-btn-icon">+</span>
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="lead-loading">
            <div className="lead-loading-animation">
              <div className="lead-loading-circle"></div>
              <div className="lead-loading-circle"></div>
              <div className="lead-loading-circle"></div>
            </div>
            <p>Loading your leads...</p>
          </div>
        ) : error ? (
          <div className="lead-error">
            <div className="lead-error-icon">!</div>
            <div className="lead-error-content">
              <h4>Error Occurred</h4>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="lead-error-dismiss"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="lead-cards-container">
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <div key={lead.id} className="lead-customer-card">
                  <div className="lead-customer-card-header">
                    <div className="lead-customer-avatar">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="lead-customer-info">
                      <h3 className="lead-customer-name">{lead.name}</h3>
                      <p className="lead-customer-property">
                        {lead.siteName} • {lead.city}, {lead.area}
                      </p>
                    </div>
                    <div className="lead-customer-status">
                      <span
                        className={`lead-status-badge-new ${lead.leadStatus.toLowerCase()}`}
                      >
                        {lead.leadStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="lead-customer-card-body">
                    <div className="lead-customer-details">
                      <div className="lead-detail-row">
                        <span className="lead-detail-icon">
                          <Phone
                            style={{
                              color: "black",
                              height: "16px",
                              width: "16px",
                            }}
                          />
                        </span>
                        <span className="lead-detail-text">{lead.phone}</span>
                      </div>
                      <div className="lead-detail-row">
                        <span className="lead-detail-icon">
                          <MapPin
                            style={{
                              color: "black",
                              height: "16px",
                              width: "16px",
                            }}
                          />
                        </span>
                        <span className="lead-detail-text">
                          {lead.city}, {lead.area}
                        </span>
                      </div>
                      <div className="lead-detail-row">
                        <span className="lead-detail-icon">
                          <ChartNoAxesCombined
                            style={{
                              color: "black",
                              height: "16px",
                              width: "16px",
                            }}
                          />
                        </span>
                        <span className="lead-detail-text">{lead.status}</span>
                      </div>
                    </div>
                    <div className="lead-customer-actions">
                      <button
                        className="lead-action-btn lead-view-btn"
                        onClick={() => handleViewDetails(lead)}
                      >
                        <Eye style={{ color: "black" }} />
                      </button>
                      <button
                        className="lead-action-btn lead-call-btn"
                        onClick={() => handleCall(lead.phone)}
                      >
                        <Phone style={{ color: "black" }} />
                      </button>
                      <button
                        className="lead-action-btn lead-whatsapp-btn"
                        onClick={() => handleWhatsApp(lead.phone)}
                      >
                        <FaWhatsapp
                          style={{ fontSize: "24px", color: "black" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="lead-no-data">
                <div className="lead-no-data-content">
                  <div className="lead-no-data-icon">🔍</div>
                  <p>
                    {role === "EMPLOYEE"
                      ? "You have no leads yet. Add a new lead to get started."
                      : "No leads found matching your criteria."}
                  </p>
                  <button
                    className="lead-add-lead-btn-small"
                    onClick={() => setShowAddLeadForm(true)}
                  >
                    Add New Lead
                  </button>
                </div>
              </div>
            )}
            {/* 
            {filteredLeads.length > 0 && (
              <div className="lead-pagination-container">
                <div className="lead-pagination-info">
                  Showing {indexOfFirstLead + 1} to{" "}
                  {Math.min(indexOfLastLead, filteredLeads.length)} of{" "}
                  {filteredLeads.length} leads
                </div>
                <div className="lead-pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="lead-pagination-btn"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const pageNumber =
                      currentPage <= 2
                        ? i + 1
                        : currentPage >= totalPages - 1
                        ? totalPages - 2 + i
                        : currentPage - 1 + i;
                    if (pageNumber <= totalPages && pageNumber > 0) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`lead-pagination-btn ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="lead-pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>

      {/* Detail Popup */}
      {showDetailPopup && selectedLeadForDetail && (
        <div className="lead-detail-popup-overlay">
          <div className="lead-detail-popup-container-new">
            {/* Header */}
            <div className="lead-popup-header-new">
              <div className="lead-popup-customer-section">
                <div className="lead-popup-avatar-new">
                  {selectedLeadForDetail.name.charAt(0).toUpperCase()}
                  {selectedLeadForDetail.name.charAt(1)?.toUpperCase() || ""}
                </div>
                <div className="lead-popup-customer-details">
                  <h2 className="lead-popup-customer-name-new">
                    {selectedLeadForDetail.name}
                  </h2>
                  <p className="lead-popup-property-info">
                    {selectedLeadForDetail.siteName} •{" "}
                    {selectedLeadForDetail.city}, {selectedLeadForDetail.area}
                  </p>
                </div>
              </div>
              <div className="lead-popup-header-right">
                <div className="lead-status-badge-popup">
                  {selectedLeadForDetail.status}
                </div>
                <div className="lead-popup-action-buttons">
                  <button
                    className="lead-popup-btn lead-call-btn-new"
                    onClick={() => handleCall(selectedLeadForDetail.phone)}
                  >
                    <Phone style={{ color: "black" }} />
                  </button>
                  {/* <button
                    className="lead-popup-btn lead-email-btn-new"
                    onClick={() => handleEmail(selectedLeadForDetail.email)}
                  >
                    📧 Email
                  </button> */}
                  <button
                    className="lead-popup-btn lead-whatsapp-btn-new"
                    onClick={() => handleWhatsApp(selectedLeadForDetail.phone)}
                  >
                    <FaWhatsapp style={{ fontSize: "24px", color: "black" }} />
                  </button>
                </div>
              </div>
              <button
                className="lead-popup-close-btn-new"
                onClick={() => setShowDetailPopup(false)}
              >
                ×
              </button>
            </div>

            {/* Three Column Layout */}
            <div className="lead-popup-content-new">
              {/* Left Column */}
              <div className="lead-popup-column">
                {/* Contact Information */}
                <div className="lead-popup-section-new">
                  <div className="lead-section-header-new">
                    <span className="lead-section-icon">👤</span>
                    <h3>Contact Information</h3>
                    <button
                      className="lead-edit-icon"
                      onClick={() => {
                        setShowDetailPopup(false);
                        handleUpdateLead(selectedLeadForDetail.id);
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                  <div className="lead-contact-details">
                    <div className="lead-contact-item">
                      <span className="lead-contact-icon">📞</span>
                      <span className="lead-contact-text">
                        {selectedLeadForDetail.phone}
                      </span>
                    </div>
                    <div className="lead-contact-item">
                      <span className="lead-contact-icon">📧</span>
                      <span className="lead-contact-text">
                        {selectedLeadForDetail.email ||
                          "rajesh.sharma@email.com"}
                      </span>
                    </div>
                    <div className="lead-contact-item">
                      <span className="lead-contact-icon">📍</span>
                      <span className="lead-contact-text">
                        {selectedLeadForDetail.city},{" "}
                        {selectedLeadForDetail.area}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="lead-popup-section-new">
                  <div className="lead-section-header-new">
                    <span className="lead-section-icon">🏠</span>
                    <h3>Property Details</h3>
                  </div>
                  <div className="lead-property-details">
                    <div className="lead-property-item">
                      <span className="lead-property-icon">🏠</span>
                      <span className="lead-property-text">
                        {selectedLeadForDetail.siteName}
                      </span>
                    </div>
                    {/* <div className="lead-property-item">
                      <span className="lead-property-icon">₹</span>
                      <span className="lead-property-text">
                        {selectedLeadForDetail.budget || "20"}
                      </span>
                    </div> */}
                    <div className="lead-property-item">
                      <span className="lead-property-icon">👤</span>
                      <span className="lead-property-text">
                        Assigned to: {selectedLeadForDetail.executedName}
                      </span>
                    </div>
                    <div className="lead-property-item">
                      <span className="lead-property-icon">👤</span>
                      <span className="lead-property-text">
                        Budget :
                        {selectedLeadForDetail.budget?.toLocaleString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {/* <div className="lead-popup-section-new">
                  <div className="lead-section-header-new">
                    <span className="lead-section-icon">📅</span>
                    <h3>Timeline</h3>
                  </div>
                  <div className="lead-timeline-details">
                    <div className="lead-timeline-item-new">
                      <span className="lead-timeline-icon">🕐</span>
                      <div className="lead-timeline-content">
                        <div className="lead-timeline-title">
                          Created:{" "}
                          {new Date(
                            selectedLeadForDetail.date
                          ).toLocaleDateString("en-GB")}
                        </div>
                        <div className="lead-timeline-subtitle">
                          Lead generated
                        </div>
                      </div>
                    </div>
                    <div className="lead-timeline-item-new">
                      <span className="lead-timeline-icon">🕐</span>
                      <div className="lead-timeline-content">
                        <div className="lead-timeline-title">
                          Last Contact:{" "}
                          {new Date(
                            selectedLeadForDetail.date
                          ).toLocaleDateString("en-GB")}
                        </div>
                        <div className="lead-timeline-subtitle">
                          Last interaction
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Middle Column - Call History */}
              {/* <div className="lead-popup-column">
                <div className="lead-popup-section-new">
                  <div className="lead-section-header-new">
                    <span className="lead-section-icon">📞</span>
                    <h3>Call History</h3>
                  </div>
                  <div className="lead-call-history-section">
                    <div className="lead-call-input-group">
                      <input
                        type="text"
                        placeholder="Call duration (e.g. 15 min)"
                        className="lead-call-input"
                      />
                    </div>
                    <div className="lead-call-input-group">
                      <textarea
                        placeholder="Call notes..."
                        className="lead-call-textarea"
                        rows="3"
                      ></textarea>
                    </div>
                    <button className="lead-add-call-log-btn-new">
                      📞 Add Call Log
                    </button>
                  </div>
                </div>
              </div> */}

              {/* Right Column - Remarks & Notes */}
              <div className="lead-popup-column">
                <div className="lead-popup-section-new">
                  <div className="lead-section-header-new">
                    <span className="lead-section-icon">📝</span>
                    <h3>Remarks & Notes</h3>
                  </div>
                  <div className="lead-remarks-section-new">
                    {/* <textarea
                      placeholder="Add a remark..."
                      className="lead-remarks-textarea"
                      rows="4"
                      defaultValue={selectedLeadForDetail.remark}
                    ></textarea> */}
                    <button
                      className="lead-add-remark-btn-new"
                      onClick={() => {
                        setShowDetailPopup(false);
                        handleShowLeadLogPopup(selectedLeadForDetail.id);
                      }}
                    >
                      💬 Add Remark
                    </button>

                    {/* Lead Logs Table */}
                    <div className="lead-lead-logs-section">
                      <h4 className="lead-lead-logs-title">Lead Logs</h4>
                      {selectedLeadForDetail.leadLogs &&
                      selectedLeadForDetail.leadLogs.length > 0 ? (
                        <div className="lead-lead-logs-table-container">
                          <table className="lead-lead-logs-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Remark</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedLeadForDetail.leadLogs.map(
                                (log, index) => (
                                  <tr key={log.id || index}>
                                    <td>
                                      {new Date(log.logDate).toLocaleDateString(
                                        "en-GB"
                                      )}
                                    </td>
                                    <td>
                                      <span className="lead-log-status-badge">
                                        {log.status}
                                      </span>
                                    </td>
                                    <td className="lead-log-remark">
                                      {log.remark}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="lead-no-lead-logs">
                          No Lead Logs Found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="lead-popup-bottom-actions">
              <button
                className="lead-popup-bottom-btn lead-edit-btn-bottom"
                onClick={() => {
                  setShowDetailPopup(false);
                  handleUpdateLead(selectedLeadForDetail.id);
                }}
              >
                <SquarePen />
              </button>
              <button
                className="lead-popup-bottom-btn lead-delete-btn-bottom"
                onClick={() => {
                  setShowDetailPopup(false);
                  handleDeleteLead(selectedLeadForDetail.id);
                }}
              >
                <Trash />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Form */}
      {showAddLeadForm && (
        <div className="lead-addleadformpopup-overlay">
          <div className="lead-addleadformpopup-container">
            <h2 className="lead-addleadformpopup-title">Add New Lead</h2>
            <button
              type="button"
              className="lead-addleadformpopup-close-btn"
              onClick={() => setShowAddLeadForm(false)}
            >
              ×
            </button>
            <form
              className="lead-addleadformpopup-form"
              onSubmit={handleAddnewLead}
            >
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Executed By"
                  value={executedName}
                  onChange={(e) => setExecutedName(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Lead Status
                  </option>
                  <option value="NEW_LEAD">New Lead</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="DEMO">Demo</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="SUCCESS">Success</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div className="lead-addleadformpopup-form-group">
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="lead-addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Site Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                />
              </div>
              <div className="lead-addleadformpopup-form-group">
                <textarea
                  placeholder="Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="lead-addleadformpopup-buttons">
                <button
                  type="submit"
                  className="lead-addleadformpopup-submit-btn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Log Form (Add Remark) */}
      {showAddLeadLogForm && (
        <div className="lead-addleadlogformpopup-overlay">
          <div className="lead-addleadlogformpopup-container">
            <h2 className="lead-addleadlogformpopup-title">Add Remark</h2>
            <button
              type="button"
              className="lead-addleadlogformpopup-close-btn"
              onClick={() => setShowAddLeadLogForm(false)}
            >
              ×
            </button>
            <form
              className="lead-addleadlogformpopup-form"
              onSubmit={handleAddNewLeadLog}
            >
              <input
                type="date"
                value={leadLogDate}
                onChange={(e) => setLeadLogDate(e.target.value)}
                required
                className="lead-lead-log-input"
              />
              <select
                value={leadLogStatus}
                onChange={(e) => setLeadLogStatus(e.target.value)}
                required
                className="lead-lead-log-select"
              >
                <option value="">Select status</option>
                <option value="NEW_LEAD">New Lead</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="DEMO">Demo</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="SUCCESS">Success</option>
                <option value="INACTIVE">Inactive</option>
                <option value="FAILED">Failed</option>
              </select>
              <textarea
                placeholder="Remark"
                value={leadLogRemark}
                onChange={(e) => setLeadLogRemark(e.target.value)}
                rows={3}
                required
                className="lead-lead-log-textarea"
              />
              <div className="lead-addleadlogformpopup-buttons">
                <button
                  type="submit"
                  className="lead-addleadlogformpopup-submit-btn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Lead Form */}
      {showUpdateLeadForm && selectedLead && (
        <div className="lead-leadlogupdateform-overlay">
          <div className="lead-leadlogupdateform-container">
            <h2 className="lead-leadlogupdateform-title">Update Lead</h2>
            <button
              type="button"
              className="lead-leadlogupdateform-close-btn"
              onClick={() => setShowUpdateLeadForm(false)}
            >
              ×
            </button>
            <form onSubmit={handleupdateLeadLog}>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="lead-leadlogupdateform-input"
                value={selectedLead.name}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, name: e.target.value })
                }
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                className="lead-leadlogupdateform-input"
                value={selectedLead.phone}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, phone: e.target.value })
                }
              />
              <input
                name="city"
                type="text"
                placeholder="City"
                className="lead-leadlogupdateform-input"
                value={selectedLead.city}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, city: e.target.value })
                }
              />
              <input
                name="date"
                type="date"
                className="lead-leadlogupdateform-input"
                value={selectedLead.date}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, date: e.target.value })
                }
              />
              <input
                name="area"
                type="text"
                placeholder="Area"
                className="lead-leadlogupdateform-input"
                value={selectedLead.area}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, area: e.target.value })
                }
              />
              <input
                name="budget"
                type="number"
                placeholder="Budget"
                className="lead-leadlogupdateform-input"
                value={selectedLead.budget || ""}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, budget: e.target.value })
                }
              />
              <input
                name="executedName"
                type="text"
                placeholder="Executed Name"
                className="lead-leadlogupdateform-input"
                value={selectedLead.executedName}
                onChange={(e) =>
                  setSelectedLead({
                    ...selectedLead,
                    executedName: e.target.value,
                  })
                }
              />
              <input
                name="siteName"
                type="text"
                placeholder="Site Name"
                className="lead-leadlogupdateform-input"
                value={selectedLead.siteName}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, siteName: e.target.value })
                }
              />
              <select
                name="status"
                className="lead-leadlogupdateform-select"
                value={selectedLead.status}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, status: e.target.value })
                }
                required
              >
                <option value="">Select Status</option>
                <option value="NEW_LEAD">New Lead</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="DEMO">Demo</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="SUCCESS">Success</option>
                <option value="INACTIVE">Inactive</option>
                <option value="FAILED">Failed</option>
              </select>
              <select
                name="leadStatus"
                className="lead-leadlogupdateform-select"
                value={selectedLead.leadStatus}
                onChange={(e) =>
                  setSelectedLead({
                    ...selectedLead,
                    leadStatus: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Lead Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <textarea
                name="remark"
                className="lead-leadlogupdateform-textarea"
                placeholder="Remark"
                value={selectedLead.remark}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, remark: e.target.value })
                }
              />
              <h3 className="lead-leadlogupdateform-subtitle">Lead Logs</h3>
              {selectedLead.leadLogs?.map((log, index) => (
                <div key={log.id} className="lead-leadlogupdateform-log-entry">
                  <input
                    name="logDate"
                    type="date"
                    className="lead-leadlogupdateform-input"
                    value={log.logDate}
                    onChange={(e) => {
                      const updatedLogs = [...selectedLead.leadLogs];
                      updatedLogs[index].logDate = e.target.value;
                      setSelectedLead({
                        ...selectedLead,
                        leadLogs: updatedLogs,
                      });
                    }}
                  />
                  <select
                    name="status"
                    className="lead-leadlogupdateform-select"
                    value={log.status}
                    onChange={(e) => {
                      const updatedLogs = [...selectedLead.leadLogs];
                      updatedLogs[index].status = e.target.value;
                      setSelectedLead({
                        ...selectedLead,
                        leadLogs: updatedLogs,
                      });
                    }}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="NEW_LEAD">New Lead</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="DEMO">Demo</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="SUCCESS">Success</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="FAILED">Failed</option>
                  </select>
                  <input
                    name="remark"
                    type="text"
                    placeholder="Remark"
                    className="lead-leadlogupdateform-input"
                    value={log.remark}
                    onChange={(e) => {
                      const updatedLogs = [...selectedLead.leadLogs];
                      updatedLogs[index].remark = e.target.value;
                      setSelectedLead({
                        ...selectedLead,
                        leadLogs: updatedLogs,
                      });
                    }}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="lead-leadlogupdateform-submit-button"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Lead;
