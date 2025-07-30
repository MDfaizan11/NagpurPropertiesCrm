import { useEffect, useState } from "react";
import "./labour.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";

function Labour() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [partnersdata, setPartnersdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [PartnerRegistrationForm, setPartnerRegistrationForm] = useState(false);
  const [patnerName, setPatnerName] = useState("");
  const [patnerCity, setPatnerCity] = useState("");
  const [patnerPhone, setPatnerPhone] = useState("");
  const [patnerAadhar, setPatnerAadhar] = useState("");
  const [patnerEmail, setPatnerEmail] = useState("");
  const [patnerPassword, setPatnerPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editPartnerId, setEditPartnerId] = useState(null);

  function handleShowPartnerRegistration() {
    setPartnerRegistrationForm(true);
  }

  async function handleSubmitPartnerRegistration(e) {
    e.preventDefault();
    setEditPartnerId(null);
    if (
      !patnerName ||
      !patnerCity ||
      !patnerPhone ||
      !patnerAadhar ||
      !patnerEmail ||
      !patnerPassword
    ) {
      alert("Please fill all the fields");
      return;
    }
    const PartnerData = {
      name: patnerName,
      city: patnerCity,
      phoneNumber: patnerPhone,
      addharNumber: patnerAadhar,
      email: patnerEmail,
      password: patnerPassword,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/registerPartner`,
        PartnerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner registered successfully");
        setPartnerRegistrationForm(false);
        setPatnerName("");
        setPatnerCity("");
        setPatnerPhone("");
        setPatnerAadhar("");
        setPatnerEmail("");
        setPatnerPassword("");
        GetAllPartner();
      }
    } catch (error) {
      console.error("Error registering partner:", error);
      alert(
        error.response?.data?.message ||
          "Failed to register partner. Please try again."
      );
    }
  }

  async function GetAllPartner() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/AllPartner-show`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        const sorted = data.sort((a, b) => b.id - a.id);
        setPartnersdata(sorted);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      alert(
        error.response?.data?.message ||
          "Failed to fetch partners. Please try again."
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    GetAllPartner();
  }, []);

  const filteredPartners = partnersdata.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleEditPartner(partner) {
    setEditPartnerId(partner.id);
    setPatnerName(partner.name);
    setPatnerCity(partner.city);
    setPatnerPhone(partner.phoneNumber);
    setPatnerAadhar(partner.addharNumber);
    setPatnerEmail(partner.email);
    setPatnerPassword(""); // Clear password field for edit
    setPartnerRegistrationForm(true);
  }

  async function handleSubmitEditPartnerRegistration(e) {
    e.preventDefault();
    if (
      !patnerName ||
      !patnerCity ||
      !patnerPhone ||
      !patnerAadhar ||
      !patnerEmail
    ) {
      alert("Please fill all required fields");
      return;
    }
    const PartnerData = {
      name: patnerName,
      city: patnerCity,
      phoneNumber: patnerPhone,
      addharNumber: patnerAadhar,
      email: patnerEmail,
      ...(patnerPassword && { password: patnerPassword }), // Include password only if provided
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/updatePartner/${editPartnerId}`,
        PartnerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner details updated successfully");
        setPartnerRegistrationForm(false);
        setPatnerName("");
        setPatnerCity("");
        setPatnerPhone("");
        setPatnerAadhar("");
        setPatnerEmail("");
        setPatnerPassword("");
        GetAllPartner();
        setEditPartnerId(null);
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update partner. Please try again."
      );
    }
  }

  function handlepartnerBlock(partnerId) {
    const confirmBlock = window.confirm(
      "Are you sure you want to block this partner?"
    );
    if (confirmBlock) {
      axiosInstance
        .post(
          `${BASE_URL}/blockPartner/${partnerId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            alert("Partner blocked successfully");
            GetAllPartner();
          }
        })
        .catch((error) => {
          console.error("Error blocking partner:", error);
          alert(
            error.response?.data?.message ||
              "Failed to block partner. Please try again."
          );
        });
    }
  }

  function handlepartnerUnBlock(partnerId) {
    const confirmUnBlock = window.confirm(
      "Are you sure you want to unblock this partner?"
    );
    if (confirmUnBlock) {
      axiosInstance
        .post(
          `${BASE_URL}/UnblockPartner/${partnerId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            alert("Partner unblocked successfully");
            GetAllPartner();
          }
        })
        .catch((error) => {
          console.error("Error unblocking partner:", error);
          alert(
            error.response?.data?.message ||
              "Failed to unblock partner. Please try again."
          );
        });
    }
  }

  function handleClosePartnerRegistrationForm() {
    setPartnerRegistrationForm(false);
    setEditPartnerId(null);
    setPatnerName("");
    setPatnerCity("");
    setPatnerPhone("");
    setPatnerAadhar("");
    setPatnerEmail("");
    setPatnerPassword("");
  }

  return (
    <div className="partner_labour_main_container">
      <div className="partner_labour_header">
        <div className="partner_header_content">
          <h1 className="partner_labour_title">Partner Management</h1>
          <p className="partner_labour_subtitle">
            Manage and register your business partners efficiently
          </p>
        </div>
        <div className="partner_header_decoration"></div>
      </div>

      <div className="Partner_search_add_container">
        <div className="Partner_search_container">
          <div className="partner_search_input_wrapper">
            <svg
              className="partner_search_icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="search"
              placeholder="Search partners by name, city, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="partner_search_input"
            />
          </div>
        </div>
        <div className="Partner_add_container">
          <button
            className="Partner_add_button"
            onClick={handleShowPartnerRegistration}
          >
            <svg
              className="partner_add_icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Partner
          </button>
        </div>
      </div>

      {PartnerRegistrationForm && (
        <div className="Partner_registration_form_container">
          <form
            className="Partner_registration_form"
            onSubmit={
              editPartnerId
                ? handleSubmitEditPartnerRegistration
                : handleSubmitPartnerRegistration
            }
          >
            <button
              className="Partner_registration_form_close_button"
              onClick={handleClosePartnerRegistrationForm}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="partner_form_header">
              <h2 className="partner_form_title">
                {editPartnerId
                  ? "Edit Partner Details"
                  : "Register New Partner"}
              </h2>
              <p className="partner_form_subtitle">
                {editPartnerId
                  ? "Update the details of the partner"
                  : "Fill in the details to register a new partner"}
              </p>
            </div>

            <div className="form_grid_container">
              <label className="Partner_registration_form_label">
                <span className="partner_label_text">Full Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  className="Partner_registration_form_input"
                  value={patnerName}
                  onChange={(e) => setPatnerName(e.target.value)}
                  placeholder="Enter full name"
                />
              </label>

              <label className="Partner_registration_form_label">
                <span className="partner_label_text">City</span>
                <input
                  type="text"
                  name="city"
                  required
                  className="Partner_registration_form_input"
                  value={patnerCity}
                  onChange={(e) => setPatnerCity(e.target.value)}
                  placeholder="Enter city"
                />
              </label>

              <label className="Partner_registration_form_label">
                <span className="partner_label_text">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="Partner_registration_form_input"
                  value={patnerPhone}
                  onChange={(e) => setPatnerPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </label>

              <label className="Partner_registration_form_label">
                <span className="partner_label_text">Aadhar Number</span>
                <input
                  type="text"
                  name="aadhar"
                  required
                  className="Partner_registration_form_input"
                  value={patnerAadhar}
                  onChange={(e) => setPatnerAadhar(e.target.value)}
                  placeholder="Enter Aadhar number"
                />
              </label>

              <label className="Partner_registration_form_label">
                <span className="partner_label_text">Email Address</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="Partner_registration_form_input"
                  value={patnerEmail}
                  onChange={(e) => setPatnerEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </label>

              <label className="Partner_registration_form_label">
                <span className="partner_label_text">
                  Password {editPartnerId && "(Optional)"}
                </span>
                <input
                  type="password"
                  name="password"
                  required={!editPartnerId}
                  className="Partner_registration_form_input"
                  value={patnerPassword}
                  onChange={(e) => setPatnerPassword(e.target.value)}
                  placeholder={
                    editPartnerId
                      ? "Enter new password (optional)"
                      : "Enter password"
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              className="Partner_registration_submit_button"
            >
              <svg
                className="partner_submit_icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              {editPartnerId ? "Update Partner Details" : "Register Partner"}
            </button>
          </form>
        </div>
      )}

      <div className="partner_content_section">
        {loading ? (
          <div className="partner_loading_container">
            <div className="partner_loading_spinner"></div>
            <p className="partner_loading_text">Loading partners...</p>
          </div>
        ) : (
          <div className="Partner_list_container">
            {filteredPartners.length > 0 ? (
              <div className="partner_table_wrapper">
                <table className="partner_table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>City</th>
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th>Aadhar Number</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPartners.map((partner) => (
                      <tr key={partner._id}>
                        <td>{partner.name}</td>
                        <td>{partner.city}</td>
                        <td>{partner.phoneNumber}</td>
                        <td>{partner.email}</td>
                        <td>{partner.addharNumber || "N/A"}</td>
                        <td>
                          <span
                            className={`partner_status_badge ${
                              partner.partnerStatus === "BLOCK"
                                ? "blocked"
                                : "active"
                            }`}
                          >
                            {partner.partnerStatus === "BLOCK"
                              ? "Blocked"
                              : "Active"}
                          </span>
                        </td>
                        <td>
                          <div className="partner_action_buttons">
                            <button
                              className="partner_action_button partner_edit_button"
                              onClick={() => handleEditPartner(partner)}
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
                            {partner.partnerStatus === "BLOCK" ? (
                              <button
                                className="partner_action_button partner_unblock_button"
                                onClick={() =>
                                  handlepartnerUnBlock(partner._id)
                                }
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01-2.964.74 12.083 12.083 0 01-3.196-.74L12 14z"></path>
                                </svg>
                                Unblock
                              </button>
                            ) : (
                              <button
                                className="partner_action_button partner_block_button"
                                onClick={() => handlepartnerBlock(partner._id)}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="partner_no_results">
                <p>No partners found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Labour;
