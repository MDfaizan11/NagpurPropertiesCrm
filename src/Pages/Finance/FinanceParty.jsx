import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Finance/FinanceParty.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
function FinanceParty() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [createPartFormShow, setCreatePartFormShow] = useState(false);
  const [editPartFormShow, setEditPartFormShow] = useState(false);

  const [editPartyId, setEditPartyId] = useState(null);

  const [accountName, setAccountName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [gstnNo, setGstnNo] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [emailId, setEmailId] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountIFSC, setAccountIFSC] = useState("");
  const [accountBranch, setAccountBranch] = useState("");
  const [partyList, setPartyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState("");

  const resetForm = () => {
    setAccountName("");
    setAccountHolder("");
    setAccountAddress("");
    setGstnNo("");
    setContactNo("");
    setEmailId("");
    setBankName("");
    setBankAccount("");
    setAccountType("");
    setAccountIFSC("");
    setAccountBranch("");
  };

  const handleCreateParty = async (e) => {
    e.preventDefault();
    setLoading(true);

    const partyData = {
      accountName,
      accountHolder,
      accountAddress,
      gstnNo,
      contactNo,
      emailId,
      bankName,
      bankAccount,
      accountType,
      accountIFSC,
      accountBranch,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/company/${id}/created-party`,
        partyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Party created successfully");
        resetForm();
        setCreatePartFormShow(false);
        setRefreshKey(refreshKey + 1);
      } else {
        alert("Failed to create party");
      }
    } catch (error) {
      console.error("Error creating party:", error);
      alert("An error occurred while creating the party");
    } finally {
      setLoading(false);
    }
  };

  const handleEditParty = async (e) => {
    e.preventDefault();
    setLoading(true);

    const partyData = {
      accountName,
      accountHolder,
      accountAddress,
      gstnNo,
      contactNo,
      emailId,
      bankName,
      bankAccount,
      accountType,
      accountIFSC,
      accountBranch,
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/party/${editPartyId}`,
        partyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Party updated successfully");
        resetForm();
        setEditPartFormShow(false);
        setEditPartyId(null);
        setRefreshKey(refreshKey + 1);
      } else {
        alert("Failed to update party");
      }
    } catch (error) {
      console.error("Error updating party:", error);
      alert("An error occurred while updating the party");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getAllParties() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/company/${id}/get-parties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setPartyList(response.data);
          console.log("Parties fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch parties");
        }
      } catch (error) {
        console.error("Error fetching parties:", error);
        alert("An error occurred while fetching parties");
      } finally {
        setLoading(false);
      }
    }

    getAllParties();
  }, [refreshKey, token]);

  const filteredParties = partyList.filter(
    (party) =>
      party.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = async (id) => {
    setEditPartyId(id);
    setEditPartFormShow(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/party/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setAccountName(response.data?.accountName);
        setAccountHolder(response.data?.accountHolder);
        setAccountAddress(response.data?.accountAddress);
        setGstnNo(response.data?.gstnNo);
        setContactNo(response.data?.contactNo);
        setEmailId(response.data?.emailId);
        setBankName(response.data?.bankName);
        setBankAccount(response.data?.bankAccount);
        setAccountType(response.data?.accountType);
        setAccountIFSC(response.data?.accountIFSC);
        setAccountBranch(response.data?.accountBranch);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong? ");
    }
  };

  const handleViewClick = (id, name) => {
    navigate(`/partyDetails/${id}/${name}`);
  };

  const handleDeleteClick = async (partyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete it ?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/party/${partyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("deleted sucessfully");
        setRefreshKey(refreshKey + 1);
      }
    } catch (error) {
      console.log(error);
      alert("something went wrong please check it ?");
    }
  };

  function handleViewTransaction(id) {}
  return (
    <div className="financeparty-container">
      <div className="financeparty-header">
        <h1 className="financeparty-title">Finance Party: {name}</h1>
      </div>

      <div className="financeparty-upper-search-container">
        <div className="financeparty-search">
          <div className="financeparty-search-input-wrapper">
            <svg
              className="financeparty-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="search"
              className="financeparty-search-input"
              placeholder="Search parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="financeparty-addpart-button">
          <button
            className="financeparty-add-btn"
            onClick={() => {
              resetForm();
              setCreatePartFormShow(true);
            }}
          >
            <svg
              className="financeparty-btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Party
          </button>
          <button
            className="financeparty-add-btn"
            style={{ marginLeft: "5px" }}
            onClick={() => navigate(`/companyTransaction/${id}/${name}`)}
          >
            <svg
              className="financeparty-btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>{" "}
            View Transaction
          </button>
        </div>
      </div>

      {/* Create Party Modal */}
      {createPartFormShow && (
        <div className="financeparty-modal-overlay">
          <div className="financeparty-modal-container">
            <div className="financeparty-modal-header">
              <h2 className="financeparty-modal-title">Add New Party</h2>
              <button
                className="financeparty-modal-close-btn"
                onClick={() => {
                  setCreatePartFormShow(false);
                  resetForm();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form
              className="financeparty-party-form"
              onSubmit={handleCreateParty}
            >
              <div className="financeparty-form-group">
                <label className="financeparty-form-label">Account Name</label>
                <input
                  type="text"
                  className="financeparty-form-input"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div className="financeparty-form-group">
                <label className="financeparty-form-label">
                  Account Holder
                </label>
                <input
                  type="text"
                  className="financeparty-form-input"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div className="financeparty-form-group">
                <label className="financeparty-form-label">
                  Account Address
                </label>
                <textarea
                  className="financeparty-form-textarea"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  placeholder="Enter account address"
                  rows="3"
                  required
                />
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={gstnNo}
                    onChange={(e) => setGstnNo(e.target.value)}
                    placeholder="Enter GSTIN number"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    className="financeparty-form-input"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="financeparty-form-input"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">Bank Name</label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Enter bank account number"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Account Type
                  </label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    placeholder="Enter account type"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={accountIFSC}
                    onChange={(e) => setAccountIFSC(e.target.value)}
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">Bank Branch</label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={accountBranch}
                    onChange={(e) => setAccountBranch(e.target.value)}
                    placeholder="Enter bank branch"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-actions">
                <button
                  type="button"
                  className="financeparty-btn-secondary"
                  onClick={() => {
                    setCreatePartFormShow(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="financeparty-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Party"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Party Modal */}
      {editPartFormShow && (
        <div className="financeparty-modal-overlay">
          <div className="financeparty-modal-container">
            <div className="financeparty-modal-header">
              <h2 className="financeparty-modal-title">Edit Party</h2>
              <button
                className="financeparty-modal-close-btn"
                onClick={() => {
                  setEditPartFormShow(false);
                  resetForm();
                  setEditPartyId(null);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form
              className="financeparty-party-form"
              onSubmit={handleEditParty}
            >
              <div className="financeparty-form-group">
                <label className="financeparty-form-label">Account Name</label>
                <input
                  type="text"
                  className="financeparty-form-input"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div className="financeparty-form-group">
                <label className="financeparty-form-label">
                  Account Holder
                </label>
                <input
                  type="text"
                  className="financeparty-form-input"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div className="financeparty-form-group">
                <label className="financeparty-form-label">
                  Account Address
                </label>
                <textarea
                  className="financeparty-form-textarea"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  placeholder="Enter account address"
                  rows="3"
                  required
                />
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={gstnNo}
                    onChange={(e) => setGstnNo(e.target.value)}
                    placeholder="Enter GSTIN number"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    className="financeparty-form-input"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="financeparty-form-input"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">Bank Name</label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Enter bank account number"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">
                    Account Type
                  </label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    placeholder="Enter account type"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-row">
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={accountIFSC}
                    onChange={(e) => setAccountIFSC(e.target.value)}
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
                <div className="financeparty-form-group">
                  <label className="financeparty-form-label">Bank Branch</label>
                  <input
                    type="text"
                    className="financeparty-form-input"
                    value={accountBranch}
                    onChange={(e) => setAccountBranch(e.target.value)}
                    placeholder="Enter bank branch"
                    required
                  />
                </div>
              </div>

              <div className="financeparty-form-actions">
                <button
                  type="button"
                  className="financeparty-btn-secondary"
                  onClick={() => {
                    setEditPartFormShow(false);
                    resetForm();
                    setEditPartyId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="financeparty-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Party"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parties List */}
      <div className="financeparty-parties-section">
        {loading ? (
          <div className="financeparty-loading-container">
            <div className="financeparty-loading-spinner"></div>
            <p>Loading parties...</p>
          </div>
        ) : filteredParties.length > 0 ? (
          <>
            <div className="financeparty-parties-header">
              <h3 className="financeparty-parties-title">
                Parties ({filteredParties.length})
              </h3>
            </div>
            <div className="financeparty-parties-grid">
              {filteredParties.map((party, index) => (
                <div key={index} className="financeparty-party-card">
                  <div className="financeparty-party-card-header">
                    <div className="financeparty-party-avatar">
                      {party.accountName.charAt(0).toUpperCase()}
                    </div>
                    <div className="financeparty-party-info">
                      <h4 className="financeparty-party-name">
                        {party.accountName}
                      </h4>
                      <p className="financeparty-party-email">
                        {party.emailId}
                      </p>
                    </div>
                  </div>

                  <div className="financeparty-party-details">
                    <div className="financeparty-detail-item">
                      <svg
                        className="financeparty-detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 Umb 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{party.contactNo}</span>
                    </div>
                    <div className="financeparty-detail-item">
                      <svg
                        className="financeparty-detail-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{party.accountAddress}</span>
                    </div>
                  </div>

                  <div className="financeparty-party-actions">
                    <button
                      className="financeparty-action-btn financeparty-edit-btn"
                      onClick={() => handleEditClick(party.partyId)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      className="financeparty-action-btn financeparty-view-btn"
                      onClick={() =>
                        handleViewClick(party.partyId, party.accountName)
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
                      View
                    </button>
                    <button
                      className="financeparty-action-btn financeparty-delete-btn"
                      onClick={() => handleDeleteClick(party.partyId)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="financeparty-empty-state">
            <div className="financeparty-empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <h3>No Parties Found</h3>
            <p>
              {searchTerm
                ? `No parties match "${searchTerm}"`
                : "Start by adding your first party"}
            </p>
            {!searchTerm && (
              <button
                className="financeparty-btn-primary"
                onClick={() => {
                  resetForm();
                  setCreatePartFormShow(true);
                }}
              >
                Add Your First Party
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FinanceParty;
