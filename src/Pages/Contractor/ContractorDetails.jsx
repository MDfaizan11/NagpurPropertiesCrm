import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2, Search, Plus, X } from "lucide-react";
import { BASE_URL } from "../../config";
import "./ContractorDetails.css";

const ContractorDetails = () => {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("");
  const [refreshkey, setRefreshKey] = useState(0);
  const [contractors, setContractors] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editContractorId, setEditContractorId] = useState(null);
  const [formData, setFormData] = useState({
    contractorName: "",
    sideName: "",
    type: "",
    total: "",
    contractorPaidAmount: "",
    addedOn: "",
  });
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [contractorData, setContractorData] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    contractorId: "",
    amount: "",
    contractorPayDate: "",
    contractorPayStatus: "",
    remark: "",
  });
  const [showEditPaymentForm, setShowEditPaymentForm] = useState(false);
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [InstallMentId, setInstallMentId] = useState("");
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const fetchContractors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${BASE_URL}/${projectId}/Contractor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
      );
      setContractors(sortedData);
      setFilteredContractors(sortedData);
    } catch (error) {
      console.error("Error fetching contractors:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId, token]);

  const fetchProjectName = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/show-AllProject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allProjects = response.data || [];
      const matchedProject = allProjects.find(
        (project) => project.id?.toString() === projectId?.toString()
      );
      setProjectName(matchedProject ? matchedProject.name : "Project");
    } catch (error) {
      console.error("Error fetching project details:", error);
      setProjectName("Project");
    }
  }, [projectId, token]);

  useEffect(() => {
    fetchContractors();
    fetchProjectName();
  }, [fetchContractors, fetchProjectName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = contractors.filter((c) =>
      c.contractorName?.toLowerCase().includes(query)
    );
    setFilteredContractors(filtered);
  };

  const handleCloseForm = () => {
    setFormData({
      contractorName: "",
      sideName: "",
      type: "",
      total: "",
      contractorPaidAmount: "",
      addedOn: "",
    });
    setEditContractorId(null);
    setShowForm(false);
    setError("");
  };

  const handleSaveContractor = async () => {
    const {
      contractorName,
      sideName,
      type,
      total,
      contractorPaidAmount,
      addedOn,
    } = formData;

    if (
      !contractorName ||
      !sideName ||
      !type ||
      !total ||
      !contractorPaidAmount ||
      !addedOn
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      if (editContractorId) {
        await axiosInstance.put(
          `${BASE_URL}/contractor/${editContractorId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axiosInstance.post(
          `${BASE_URL}/contractor/${projectId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      alert("Contractor Added Successfully");
      fetchContractors();
      handleCloseForm();
    } catch (err) {
      console.error("Error saving contractor:", err);
      setError("Failed to save contractor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditContractor = async (id) => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/Contractor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const c = res.data;
      setFormData({
        contractorName: c.contractorName || "",
        sideName: c.sideName || "",
        type: c.type || "",
        total: c.total || "",
        contractorPaidAmount: c.contractorPaidAmount || "",
        addedOn: c.addedOn || "",
      });
      setEditContractorId(id);
      setShowForm(true);
    } catch (err) {
      console.error("Error fetching contractor:", err);
    }
  };

  const handleDeleteContractor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contractor?"))
      return;

    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/deleteContractor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        alert("Deleted Successfully");
        fetchContractors();
      }
    } catch (err) {
      console.error("Error deleting contractor:", err);
    }
  };

  const handleViewContractor = async (id) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/Contractor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContractorData(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching contractor details:", error);
    }
  };

  const handleAddPayment = (id) => {
    setPaymentFormData({
      contractorId: id,
      amount: "",
      contractorPayDate: new Date().toISOString().split("T")[0],
      contractorPayStatus: "",
      remark: "",
    });
    setShowPaymentForm(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    const {
      contractorId,
      amount,
      contractorPayDate,
      contractorPayStatus,
      remark,
    } = paymentFormData;

    if (!amount || !contractorPayStatus) {
      setError("Please fill all required payment fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        `${BASE_URL}/${contractorId}/contractorInstallment`,
        [
          {
            amount,
            contractorPayDate,
            contractorPayStatus,
            remark,
          },
        ],
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Payment Added Successfully");
      setShowPaymentForm(false);
      setShowPopup(false);
      fetchContractors();
      setError("");
    } catch (error) {
      console.error("Error adding payment:", error);
      setError("Failed to add payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayment = async (id) => {
    setInstallMentId(id);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/getSingleInstallmentById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { amount, contractorPayDate, contractorPayStatus, remark } =
        response.data;
      setPaymentFormData({
        contractorId: contractorData.id,
        amount,
        contractorPayDate,
        contractorPayStatus,
        remark,
      });
      setEditPaymentId(id);
      setShowEditPaymentForm(true);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    const {
      // contractorId,
      amount,
      contractorPayDate,
      contractorPayStatus,
      remark,
    } = paymentFormData;

    if (!amount || !contractorPayStatus) {
      setError("Please fill all required payment fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(
        `${BASE_URL}/contractorInstallments/${InstallMentId}`,
        {
          id: editPaymentId,
          amount,
          contractorPayDate,
          contractorPayStatus,
          remark,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowEditPaymentForm(false);
      setShowPopup(false);
      fetchContractors();
      setError("");
    } catch (error) {
      console.error("Error updating payment:", error);
      setError("Failed to update payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    try {
      await axiosInstance.delete(
        `${BASE_URL}/deleteContractorInstallment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleViewContractor(contractorData.id);
      alert("Delete Successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const EditIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  return (
    <div className="ContractorDetails-contractor-details-wrapper">
      <div className="ContractorDetails-contractor-details-header">
        <div className="ContractorDetails-header-content">
          <h1 className="ContractorDetails-contractor-details-title">
            Project : {projectName}
          </h1>
          <p className="ContractorDetails-contractor-details-subtitle">
            Contractor list of Project
          </p>
        </div>
      </div>

      <div className="ContractorDetails-contractor-details-controls">
        <div className="ContractorDetails-search-container">
          <Search className="ContractorDetails-search-icon" />
          <input
            type="search"
            placeholder="Search contractors by name..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          className="ContractorDetails-add-project-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus className="ContractorDetails-btn-icon" /> Add Contractor
        </button>
      </div>

      {loading ? (
        <div className="ContractorDetails-loader-center">
          <Loader2 className="ContractorDetails-loader-spin" size={32} />
        </div>
      ) : (
        <div className="ContractorDetails-contractor-table-container">
          {filteredContractors.length === 0 ? (
            <div className="ContractorDetails-no-contractors">
              <p>No contractors found.</p>
            </div>
          ) : (
            <table className="ContractorDetails-contractor-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Site</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContractors.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="ContractorDetails-contractor-name">
                        {c.contractorName}
                      </div>
                    </td>
                    <td>{c.sideName}</td>
                    <td>
                      <span className="ContractorDetails-type-badge">
                        {c.type}
                      </span>
                    </td>
                    <td className="ContractorDetails-amount-cell">
                      ₹{Number(c.total).toLocaleString()}
                    </td>
                    <td className="ContractorDetails-amount-cell">
                      ₹{Number(c.contractorPaidAmount).toLocaleString()}
                    </td>
                    <td>{new Date(c.addedOn).toLocaleDateString("en-GB")}</td>
                    <td>
                      <div className="ContractorDetails-action-buttons">
                        <button
                          className="ContractorDetails-add_payment_button"
                          onClick={() => handleAddPayment(c.id)}
                        >
                          Add Payment
                        </button>
                        <button
                          className="ContractorDetails-view-btn"
                          onClick={() => handleViewContractor(c.id)}
                        >
                          View
                        </button>
                        {/* <button
                          className="ContractorDetails-view-btn"
                          onClick={() => handleEditContractor(c.id)}
                        >
                          Edit
                        </button> */}
                        <button
                          className="ContractorDetails-contractor_delete_button"
                          onClick={() => handleDeleteContractor(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Contractor Form */}
      {showForm && (
        <div className="ContractorDetails-contractor-modal">
          <div className="ContractorDetails-contractor-modal-content">
            <div className="ContractorDetails-modal-header">
              <h2>{editContractorId ? "Edit Contractor" : "Add Contractor"}</h2>
              <button onClick={handleCloseForm}>
                <X size={18} />
              </button>
            </div>
            {error && <p className="ContractorDetails-error-text">{error}</p>}
            <div className="ContractorDetails-form-grid">
              <input
                type="text"
                name="contractorName"
                placeholder="Contractor Name"
                value={formData.contractorName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="sideName"
                placeholder="Site Name"
                value={formData.sideName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                value={formData.type}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="total"
                placeholder="Total Amount"
                value={formData.total}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="contractorPaidAmount"
                placeholder="Paid Amount"
                value={formData.contractorPaidAmount}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="addedOn"
                value={formData.addedOn}
                onChange={handleInputChange}
              />
            </div>
            <div className="ContractorDetails-modal-actions">
              <button onClick={handleSaveContractor} disabled={loading}>
                {editContractorId ? "Update" : "Save"}
              </button>
              <button onClick={handleCloseForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Popup */}
      {showPopup && contractorData && (
        <div className="ContractorDetails-contractor_popup">
          <div className="ContractorDetails-contractor_popup_content">
            <div className="ContractorDetails-popup-header">
              <button
                onClick={() => handleAddPayment(contractorData.id)}
                className="ContractorDetails-add_payment_button"
              >
                Add Payment
              </button>
              <span
                className="ContractorDetails-contractor_popup_close"
                onClick={() => setShowPopup(false)}
              >
                ×
              </span>
            </div>
            <div className="ContractorDetails-contractor-info">
              <h2> Contractor Name :{contractorData.contractorName}</h2>
              <div className="ContractorDetails-info-grid">
                <div className="ContractorDetails-info-item">
                  <strong>Site Name:</strong> {contractorData.sideName}
                </div>
                <div className="ContractorDetails-info-item">
                  <strong>Type:</strong>
                  <span className="ContractorDetails-type-badge">
                    {contractorData.type}
                  </span>
                </div>
                <div className="ContractorDetails-info-item">
                  <strong>Added On:</strong>{" "}
                  {new Date(contractorData.addedOn).toLocaleDateString("en-GB")}
                </div>
                <div className="ContractorDetails-info-item">
                  <strong>Total Amount:</strong>
                  <span className="ContractorDetails-amount-highlight">
                    ₹{Number(contractorData.total).toLocaleString()}
                  </span>
                </div>
                <div className="ContractorDetails-info-item">
                  <strong>Paid Amount:</strong>
                  <span className="ContractorDetails-amount-highlight ContractorDetails-paid">
                    ₹
                    {Number(
                      contractorData.contractorPaidAmount
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="ContractorDetails-info-item">
                  <strong>Remaining Amount:</strong>
                  <span className="ContractorDetails-amount-highlight ContractorDetails-remaining">
                    ₹
                    {Number(
                      contractorData.total - contractorData.contractorPaidAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <h3>Installments</h3>
            <div className="ContractorDetails-installment_table_wrapper">
              <table className="ContractorDetails-installment_table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Payment Method</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contractorData.contractorInstallments?.length > 0 ? (
                    contractorData.contractorInstallments.map((installment) => (
                      <tr key={installment.id}>
                        <td className="ContractorDetails-amount-cell">
                          ₹{Number(installment.amount).toLocaleString()}
                        </td>
                        <td>
                          {new Date(
                            installment.contractorPayDate
                          ).toLocaleDateString("en-GB")}
                        </td>
                        <td>
                          <span className="ContractorDetails-payment-method">
                            {installment.contractorPayStatus}
                          </span>
                        </td>
                        <td>{installment.remark}</td>
                        <td>
                          <div className="ContractorDetails-action-buttons">
                            <button
                              className="ContractorDetails-view-btn"
                              onClick={() => handleEditPayment(installment.id)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className="ContractorDetails-contractor_delete_button"
                              onClick={() =>
                                handleDeletePayment(installment.id)
                              }
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="ContractorDetails-no-data">
                        No Installments Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Form */}
      {showPaymentForm && (
        <div className="ContractorDetails-contractor_form_overlay">
          <div className="ContractorDetails-contractor_form_wrapper">
            <form
              className="ContractorDetails-contractor_payment_form"
              onSubmit={handleSavePayment}
            >
              <button
                type="button"
                className="ContractorDetails-contractor_payment_close_button"
                onClick={() => setShowPaymentForm(false)}
              >
                ×
              </button>
              <h3>Add Payment</h3>
              {error && <p className="ContractorDetails-error-text">{error}</p>}
              <input
                type="date"
                name="contractorPayDate"
                value={paymentFormData.contractorPayDate}
                onChange={handlePaymentInputChange}
              />
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={paymentFormData.amount}
                onChange={handlePaymentInputChange}
              />
              <select
                name="contractorPayStatus"
                value={paymentFormData.contractorPayStatus}
                onChange={handlePaymentInputChange}
              >
                <option value="">Select Payment Method</option>
                <option value="CASH">CASH</option>
                <option value="CHEQUE">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="RTGS">RTGS</option>
                <option value="NEFT">NEFT</option>
              </select>
              <input
                type="text"
                name="remark"
                placeholder="Note..."
                value={paymentFormData.remark}
                onChange={handlePaymentInputChange}
              />
              <button
                type="submit"
                className="ContractorDetails-contractor_payment_submit_button"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Form */}
      {showEditPaymentForm && (
        <div className="ContractorDetails-contractor_form_overlay">
          <div className="ContractorDetails-contractor_form_wrapper">
            <form
              className="ContractorDetails-contractor_payment_form"
              onSubmit={handleUpdatePayment}
            >
              <button
                type="button"
                className="ContractorDetails-contractor_payment_close_button"
                onClick={() => setShowEditPaymentForm(false)}
              >
                ×
              </button>
              <h3>Edit Payment</h3>
              {error && <p className="ContractorDetails-error-text">{error}</p>}
              <input
                type="date"
                name="contractorPayDate"
                value={paymentFormData.contractorPayDate}
                onChange={handlePaymentInputChange}
              />
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={paymentFormData.amount}
                onChange={handlePaymentInputChange}
              />
              <select
                name="contractorPayStatus"
                value={paymentFormData.contractorPayStatus}
                onChange={handlePaymentInputChange}
              >
                <option value="">Select Payment Method</option>
                <option value="CASH">CASH</option>
                <option value="CHECK">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="RTGS">RTGS</option>
                <option value="NEFT">NEFT</option>
              </select>
              <input
                type="text"
                name="remark"
                placeholder="Note..."
                value={paymentFormData.remark}
                onChange={handlePaymentInputChange}
              />
              <button
                type="submit"
                className="ContractorDetails-contractor_payment_submit_button"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorDetails;
