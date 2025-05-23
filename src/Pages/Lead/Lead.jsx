import { useEffect, useState } from "react";
import "./lead.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
const Lead = () => {
  const { ProjectId, ProjectName } = useParams();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectLeads, setProjectLeads] = useState([]);
  const [allLeadData, setAllLeadData] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [activeFilter, setActiveFilter] = useState("All Leads");
  const [showLeadlogs, setShowLeadLogs] = useState(false);
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
  const leadsPerPage = 10;
  useEffect(() => {
    async function getAllLeadWithProject() {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/AllLeadByProjectId/${ProjectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setProjectLeads(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllLeadWithProject();
  }, [refreshKey]);

  useEffect(() => {
    if (projectLeads.length) {
      setAllLeadData(projectLeads);
      setFilteredLeads(projectLeads);
      setLoading(false);
    }
  }, [projectLeads]);

  useEffect(() => {
    let filtered = allLeadData.filter((lead) => {
      const query = searchQuery.toLowerCase().trim();

      return (
        lead.name?.toLowerCase().includes(query) ||
        lead.city?.toLowerCase().includes(query) ||
        lead.status?.toLowerCase().includes(query) ||
        lead.siteName?.toLowerCase().includes(query) ||
        lead.id?.toString().includes(query) // Convert ID to string safely
      );
    });

    if (activeFilter !== "All Leads") {
      const status = activeFilter.toLowerCase().replace(/\s/g, "_"); // Normalize status format if needed
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

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      console.log(response.data);
      if (response.status === 200) {
        alert("Lead added successfully");
        setProjectLeads((prevLeads) => [...prevLeads, response.data]);
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
      console.log(error);
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
        setShowLeadLogs(false);
      }
    } catch (error) {
      console.log(error);
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
        setSelectedLead(response.data); // ✅ Set lead data for the form
        setShowUpdateLeadForm(true); // ✅ Open the form
      }
    } catch (error) {
      console.log("Error fetching lead by ID:", error);
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
        setProjectLeads((prevLeads) =>
          prevLeads.filter((lead) => lead.id !== id)
        );
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleupdateLeadLog(e) {
    e.preventDefault();

    // Use selectedLead.id as ProjectId, fallback or update accordingly
    const parsedProjectId = Number(ProjectId);
    if (!parsedProjectId) {
      alert("Invalid Project ID");
      return;
    }

    const validLogs =
      selectedLead.leadLogs?.map((log) => ({
        id: log.id, // optional, backend may ignore or use
        logDate: log.logDate,
        status: log.status,
        remark: log.remark,
      })) || [];

    const updatedLead = {
      id: parsedProjectId,
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
    };

    console.log("Updated Lead Data:", updatedLead);

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/updateLead/${parsedProjectId}`,
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
      alert("Failed to update lead");
    }
  }
  return (
    <>
      <div className="lead-wrapper">
        {/* Enhanced Header with Animated Background */}
        <div className="lead-header">
          <div className="lead-header-content">
            <h1 className="lead-title">{ProjectName} Lead Management</h1>
            <p className="lead-subtitle">
              Track and manage your property leads efficiently
            </p>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="lead-controls">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by name, ID, city, site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lead-search-input"
              aria-label="Search leads"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="view-controls">
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${
                  viewMode === "cards" ? "active" : ""
                }`}
                onClick={() => setViewMode("cards")}
              >
                <span className="view-icon">🃏</span>
                <span className="view-text">Cards</span>
              </button>
            </div>

            <div className="filter-and-add">
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
                className="add-lead-btn"
                onClick={() => setShowAddLeadForm(!showAddLeadForm)}
              >
                <span className="btn-icon">+</span>
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="lead-error">
            <div className="error-icon">!</div>
            <div className="error-content">
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="lead-loading">
            <div className="loading-animation">
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
              <div className="loading-circle"></div>
            </div>
            <p>Loading your leads...</p>
          </div>
        )}

        {/* Card View */}
        {!loading && !error && (
          <div
            className={`lead-card-view ${
              viewMode === "grid" ? "grid-layout" : ""
            }`}
          >
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`lead-card ${lead.leadStatus.toLowerCase()}-card`}
                >
                  <div
                    className="lead-card-header"
                    onClick={() => toggleCard(lead.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleCard(lead.id)}
                    aria-expanded={expandedCard === lead.id}
                  >
                    <div className="card-header-content">
                      <div className="lead-avatar">{lead.name.charAt(0)}</div>
                      <div className="lead-card-info">
                        <span className="lead-card-name">{lead.name}</span>
                      </div>
                    </div>
                    <div className="card-header-right">
                      <span
                        className={`status-badge ${lead.leadStatus.toLowerCase()}`}
                      >
                        {lead.leadStatus}
                      </span>
                      <span className="lead-card-toggle">
                        {expandedCard === lead.id ? "−" : "+"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`lead-card-body ${
                      expandedCard === lead.id ? "expanded" : ""
                    }`}
                  >
                    <div className="lead-card-details">
                      <div className="detail-group">
                        <h4 className="detail-group-title">
                          Contact Information
                        </h4>
                        <div className="detail-item">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">{lead.phone}</span>
                        </div>
                      </div>

                      <div className="detail-group">
                        <h4 className="detail-group-title">Property Details</h4>
                        <div className="detail-item">
                          <span className="detail-label">Location</span>
                          <span className="detail-value">
                            {lead.city}, {lead.area}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Site Name</span>
                          <span className="detail-value">{lead.siteName}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Budget</span>
                          <span className="detail-value">{lead.budget}</span>
                        </div>
                      </div>

                      <div className="detail-group">
                        <h4 className="detail-group-title">Status</h4>
                        <div className="detail-item">
                          <span className="detail-label">Lead Status</span>
                          <span className="detail-value">
                            {lead.leadStatus}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Status</span>
                          <span className="detail-value">{lead.status}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Date</span>
                          <span className="detail-value">{lead.date}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Executed By</span>
                          <span className="detail-value">
                            {lead.executedName}
                          </span>
                        </div>
                      </div>
                    </div>
                    {showLeadlogs && (
                      <div className="detail-group">
                        <h4 className="detail-group-title">Lead Logs</h4>

                        {lead.leadLogs && lead.leadLogs.length > 0 ? (
                          <table className="lead-log-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Remark</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lead.leadLogs.map((log) => (
                                <tr key={log.id}>
                                  <td>
                                    {new Date(log.logDate).toLocaleDateString(
                                      "en-GB"
                                    )}
                                  </td>
                                  <td>{log.status}</td>
                                  <td>{log.remark}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="no-lead-logs">No Lead Logs Found</p>
                        )}
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        className="card-action-btn view-btn"
                        onClick={() => setShowLeadLogs(!showLeadlogs)}
                      >
                        {showLeadlogs
                          ? "Hide Lead Log Details"
                          : "View Lead Log Details"}
                      </button>
                      <button
                        className="card-action-btn edit-btn"
                        onClick={() => handleShowLeadLogPopup(lead.id)}
                      >
                        Add Lead Log
                      </button>
                      <button
                        className="card-action-btn edit-btn"
                        onClick={() => handleUpdateLead(lead.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="card-action-btn delete-btn"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="lead-no-data">
                <div className="no-data-content">
                  <div className="no-data-icon">🔍</div>
                  <p>No leads found matching your criteria.</p>
                  <button className="add-lead-btn-small">Add New Lead</button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredLeads.length > 0 && (
              <div
                className={`pagination-container ${
                  viewMode === "grid" ? "mobile-pagination" : ""
                }`}
              >
                <div className="pagination-info">
                  Showing {indexOfFirstLead + 1} to{" "}
                  {Math.min(indexOfLastLead, filteredLeads.length)} of{" "}
                  {filteredLeads.length} leads
                </div>
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  {viewMode !== "grid" &&
                    Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
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
                            className={`pagination-btn ${
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
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddLeadForm && (
        <div className="addleadformpopup-overlay">
          <div className="addleadformpopup-container">
            <h2 className="addleadformpopup-title">Add New Lead</h2>
            <button
              type="button"
              className="addleadformpopup-close-btn"
              onClick={() => setShowAddLeadForm(false)}
            >
              ×
            </button>

            <form className="addleadformpopup-form" onSubmit={handleAddnewLead}>
              <div className="addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="addleadformpopup-form-group">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="addleadformpopup-form-group">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Executed By"
                  value={executedName}
                  onChange={(e) => setExecutedName(e.target.value)}
                  required
                />
              </div>

              <div className="addleadformpopup-form-group">
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

              <div className="addleadformpopup-form-group">
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

              <div className="addleadformpopup-form-group">
                <input
                  type="text"
                  placeholder="Site Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                />
              </div>

              <div className="addleadformpopup-form-group">
                <textarea
                  placeholder="Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="addleadformpopup-buttons">
                <button type="submit" className="addleadformpopup-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddLeadLogForm && (
        <div className="addleadlogformpopup-overlay">
          <div className="addleadlogformpopup-container">
            <h2 className="addleadlogformpopup-title">Add Lead Log</h2>
            <button
              type="button"
              className="addleadlogformpopup-close-btn"
              onClick={() => setShowAddLeadLogForm(false)}
            >
              ×
            </button>

            <form
              className="addleadlogformpopup-form"
              onSubmit={handleAddNewLeadLog}
            >
              <input
                type="date"
                value={leadLogDate}
                onChange={(e) => setLeadLogDate(e.target.value)}
                required
                className="lead_log_input"
              />
              <select
                name=""
                id=""
                value={leadLogStatus}
                onChange={(e) => setLeadLogStatus(e.target.value)}
                required
                className="lead_log_Select"
              >
                <option value=""> Select status</option>
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
                className="lead_log_textarea"
              />
              <div className="addleadlogformpopup-buttons">
                <button
                  type="submit"
                  className="addleadlogformpopup-submit-btn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateLeadForm && selectedLead && (
        <div className="leadlogupdateform-overlay">
          <div className="leadlogupdateform-container">
            <h2 className="leadlogupdateform-title">Update Lead</h2>
            <button
              type="button"
              className="leadlogupdateform-close-btn"
              onClick={() => setShowUpdateLeadForm(false)}
            >
              ×
            </button>

            <form onSubmit={handleupdateLeadLog}>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="leadlogupdateform-input"
                value={selectedLead.name}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, name: e.target.value })
                }
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                className="leadlogupdateform-input"
                value={selectedLead.phone}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, phone: e.target.value })
                }
              />
              <input
                name="city"
                type="text"
                placeholder="City"
                className="leadlogupdateform-input"
                value={selectedLead.city}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, city: e.target.value })
                }
              />
              <input
                name="date"
                type="date"
                className="leadlogupdateform-input"
                value={selectedLead.date}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, date: e.target.value })
                }
              />
              <input
                name="area"
                type="text"
                placeholder="Area"
                className="leadlogupdateform-input"
                value={selectedLead.area}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, area: e.target.value })
                }
              />
              <input
                name="budget"
                type="number"
                placeholder="Budget"
                className="leadlogupdateform-input"
                value={selectedLead.budget || ""}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, budget: e.target.value })
                }
              />
              <input
                name="executedName"
                type="text"
                placeholder="Executed Name"
                className="leadlogupdateform-input"
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
                className="leadlogupdateform-input"
                value={selectedLead.siteName}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, siteName: e.target.value })
                }
              />

              <select
                name="status"
                className="leadlogupdateform-select"
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
                className="leadlogupdateform-select"
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
                className="leadlogupdateform-textarea"
                placeholder="Remark"
                value={selectedLead.remark}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, remark: e.target.value })
                }
              />

              <h3 className="leadlogupdateform-subtitle">Lead Logs</h3>
              {selectedLead.leadLogs?.map((log, index) => (
                <div key={log.id} className="leadlogupdateform-log-entry">
                  <input
                    name="logDate"
                    type="date"
                    className="leadlogupdateform-input"
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
                    className="leadlogupdateform-select"
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
                    className="leadlogupdateform-input"
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

              <button type="submit" className="leadlogupdateform-submit-button">
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
