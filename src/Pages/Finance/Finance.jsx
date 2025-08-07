import React, { useState, useEffect } from "react";
import "./finance.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
function Finance() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [RefreshKey, SetRefreshKey] = useState("");
  const [ShowAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [ShowEditCompanyForm, setShowEditCompanyForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmailId, setCompanyEmailId] = useState("");
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateCompany(e) {
    e.preventDefault();
    setLoading(true);

    const companyData = {
      companyName: companyName,
      address: companyAddress,
      phoneNumber: companyPhone,
      emailId: companyEmailId,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/created-company`,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Company created successfully");
        setCompanyName("");
        setCompanyAddress("");
        setCompanyPhone("");
        setCompanyEmailId("");
        SetRefreshKey(RefreshKey + 1);
        setShowAddCompanyForm(false);
      } else {
        alert("Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      alert("An error occurred while creating the company");
    } finally {
      setLoading(false);
    }
  }

  async function handleEditCompany(e) {
    e.preventDefault();
    setLoading(true);
    const companyData = {
      companyName: companyName,
      address: companyAddress,
      phoneNumber: companyPhone,
      emailId: companyEmailId,
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/company/${editCompanyId}`,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Company updated successfully");
        setCompanyName("");
        setCompanyAddress("");
        setCompanyPhone("");
        setCompanyEmailId("");
        setEditCompanyId(null);
        SetRefreshKey(RefreshKey + 1);
        setShowEditCompanyForm(false);
      } else {
        alert("Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("An error occurred while updating the company");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getAllCompanies() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${BASE_URL}/get/companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setCompanyList(response.data);
          console.log("Companies fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        alert("An error occurred while fetching companies");
      } finally {
        setLoading(false);
      }
    }

    getAllCompanies();
  }, [RefreshKey, token]);

  const filteredCompanies = companyList.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = async (id) => {
    setEditCompanyId(id);
    setShowEditCompanyForm(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        setCompanyName(response.data?.companyName);
        setCompanyAddress(response.data?.address);
        setCompanyPhone(response.data?.phoneNumber);
        setCompanyEmailId(response.data?.emailId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function handleDeleteCompany(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete it ?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Deleted Successfully");
        SetRefreshKey(RefreshKey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleViewDetailsCompany(id, name) {
    navigate(`/financeParty/${id}/${name}`);
  }
  return (
    <div className="finance-finance-container">
      {/* Header Section */}
      <div className="finance-finance-header">
        <div className="finance-finance-header-content">
          <h1 className="finance-finance-title">Finance Management</h1>
          {/* <p className="finance-finance-subtitle">
            Manage your companies and financial data
          </p> */}
        </div>
      </div>

      {/* Controls Section */}
      <div className="finance-finance-controls">
        <div className="finance-finance-search-container">
          <div className="finance-search-input-wrapper">
            <svg
              className="finance-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="search"
              className="finance-finance-search-input"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button
          className="finance-finance-add-btn"
          onClick={() => setShowAddCompanyForm(true)}
        >
          <svg
            className="finance-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Company
        </button>
      </div>

      {/* Add Company Modal */}
      {ShowAddCompanyForm && (
        <div className="finance-modal-overlay">
          <div className="finance-modal-container">
            <div className="finance-modal-header">
              <h2 className="finance-modal-title">Add New Company</h2>
              <button
                className="finance-modal-close-btn"
                onClick={() => setShowAddCompanyForm(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form
              className="finance-company-form"
              onSubmit={handleCreateCompany}
            >
              <div className="finance-form-group">
                <label className="finance-form-label">Company Name</label>
                <input
                  type="text"
                  className="finance-form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="finance-form-group">
                <label className="finance-form-label">Company Address</label>
                <textarea
                  className="finance-form-textarea"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Enter company address"
                  rows="3"
                  required
                />
              </div>

              <div className="finance-form-row">
                <div className="finance-form-group">
                  <label className="finance-form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="finance-form-input"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="finance-form-group">
                  <label className="finance-form-label">Email Address</label>
                  <input
                    type="email"
                    className="finance-form-input"
                    value={companyEmailId}
                    onChange={(e) => setCompanyEmailId(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="finance-form-actions">
                <button
                  type="button"
                  className="finance-btn-secondary"
                  onClick={() => setShowAddCompanyForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="finance-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {ShowEditCompanyForm && (
        <div className="finance-modal-overlay">
          <div className="finance-modal-container">
            <div className="finance-modal-header">
              <h2 className="finance-modal-title">Edit Company</h2>
              <button
                className="finance-modal-close-btn"
                onClick={() => {
                  setShowEditCompanyForm(false);
                  setCompanyName("");
                  setCompanyAddress("");
                  setCompanyPhone("");
                  setCompanyEmailId("");
                  setEditCompanyId(null);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form className="finance-company-form" onSubmit={handleEditCompany}>
              <div className="finance-form-group">
                <label className="finance-form-label">Company Name</label>
                <input
                  type="text"
                  className="finance-form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="finance-form-group">
                <label className="finance-form-label">Company Address</label>
                <textarea
                  className="finance-form-textarea"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Enter company address"
                  rows="3"
                  required
                />
              </div>

              <div className="finance-form-row">
                <div className="finance-form-group">
                  <label className="finance-form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="finance-form-input"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="finance-form-group">
                  <label className="finance-form-label">Email Address</label>
                  <input
                    type="email"
                    className="finance-form-input"
                    value={companyEmailId}
                    onChange={(e) => setCompanyEmailId(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="finance-form-actions">
                <button
                  type="button"
                  className="finance-btn-secondary"
                  onClick={() => {
                    setShowEditCompanyForm(false);
                    setCompanyName("");
                    setCompanyAddress("");
                    setCompanyPhone("");
                    setCompanyEmailId("");
                    setEditCompanyId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="finance-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Companies Grid */}
      <div className="finance-companies-section">
        {loading ? (
          <div className="finance-loading-container">
            <div className="finance-loading-spinner"></div>
            <p>Loading companies...</p>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <>
            <div className="finance-companies-header">
              <h3 className="finance-companies-title">
                Companies ({filteredCompanies.length})
              </h3>
            </div>
            <div className="finance-companies-grid">
              {filteredCompanies.map((company, index) => (
                <div key={index} className="finance-company-card">
                  <div className="finance-company-card-header">
                    <div className="finance-company-avatar">
                      {company.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div className="finance-company-info">
                      <h4 className="finance-company-name">
                        {company.companyName}
                      </h4>
                      <p className="finance-company-email">{company.emailId}</p>
                    </div>
                  </div>

                  <div className="finance-company-details">
                    <div className="finance-detail-item">
                      <svg
                        className="finance-detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{company.phoneNumber}</span>
                    </div>

                    <div className="finance-detail-item">
                      <svg
                        className="finance-detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{company.address}</span>
                    </div>
                  </div>

                  <div className="finance-company-actions">
                    <button
                      className="finance-action-btn finance-edit-btn"
                      onClick={() => handleEditClick(company.companyId)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      {/* Edit */}
                    </button>

                    <button
                      className="finance-action-btn finance-view-btn"
                      onClick={() =>
                        handleViewDetailsCompany(
                          company.companyId,
                          company.companyName
                        )
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {/* View */}
                    </button>

                    <button
                      className="finance-action-btn finance-delete-btn"
                      onClick={() => handleDeleteCompany(company.companyId)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      {/* Delete */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="finance-empty-state">
            <div className="finance-empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <h3>No Companies Found</h3>
            <p>
              {searchTerm
                ? `No companies match "${searchTerm}"`
                : "Start by adding your first company"}
            </p>
            {!searchTerm && (
              <button
                className="finance-btn-primary"
                onClick={() => setShowAddCompanyForm(true)}
              >
                Add Your First Company
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Finance;
