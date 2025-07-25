import { useEffect, useState } from "react";
import "../labour/labour.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";

function Labour() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [partnersdata, setPartnersdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [PartnerRegistrationFrom, setPartnerRegistrationForm] = useState(false);
  const [patnerName, setPatnerName] = useState("");
  const [patnerCity, setPatnerCity] = useState("");
  const [patnerPhone, setPatnerPhone] = useState("");
  const [patnerAadhar, setPatnerAadhar] = useState("");
  const [patnerEmail, setPatnerEmail] = useState("");
  const [patnerPassword, setPatnerPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editPartnerId, setEditPartnerId] = useState(null);
  const [BlockStatus, setBlockStatus] = useState("");
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
      console.log(error);
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

  const filteredPartners = partnersdata.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleEdirtPartner(partner) {
    console.log(partner);
    setEditPartnerId(partner.id);
    setPatnerName(partner.name);
    setPatnerCity(partner.city);
    setPatnerPhone(partner.phoneNumber);
    setPatnerAadhar(partner.addharNumber);
    setPatnerEmail(partner.email);
    setPatnerPassword(partner.password);
    setPartnerRegistrationForm(true);
  }

  function handleSubmitEditPartnerRegistration(e) {
    e.preventDefault();
    const PartnerData = {
      name: patnerName,
      city: patnerCity,
      phoneNumber: patnerPhone,
      addharNumber: patnerAadhar,
      email: patnerEmail,
      password: patnerPassword,
    };
    axiosInstance
      .put(`${BASE_URL}/updatePartner/${editPartnerId}`, PartnerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
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
          setPartnerRegistrationForm(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handlepartnerBlock(partnerId) {
    const confirmBlock = window.confirm(
      "Are you sure you want to block this partner."
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
          console.log(response.data.partnerStatus);
          setBlockStatus(response.data.partnerStatus);
          if (response.status === 200) {
            alert("Partner blocked successfully");
            GetAllPartner();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function handlepartnerUnBlock(partnerId) {
    const confirmUnBlock = window.confirm(
      "Are you sure you want to unblock this partner."
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
          console.log(error);
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

      {PartnerRegistrationFrom && (
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
              // onClick={() => setPartnerRegistrationForm(false)}
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
                <span className="partner_label_text">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  className="Partner_registration_form_input"
                  value={patnerPassword}
                  onChange={(e) => setPatnerPassword(e.target.value)}
                  placeholder="Enter password"
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
          <>
            <div className="Partner_list_container">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <div key={partner._id} className="Partner_card">
                    <div className="partner_card_header">
                      <div className="partner_avatar">
                        {partner.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="partner_status_badge">Active</div>
                    </div>

                    <div className="partner_card_body">
                      <h3 className="partner_name">{partner.name}</h3>

                      <div className="partner_info_grid">
                        <div className="partner_info_item">
                          <svg
                            className="partner_info_icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span className="partner_info_text">
                            {partner.city}
                          </span>
                        </div>

                        <div className="partner_info_item">
                          <svg
                            className="partner_info_icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <span className="partner_info_text">
                            {partner.phoneNumber}
                          </span>
                        </div>

                        <div className="partner_info_item partner_email_item">
                          <svg
                            className="partner_info_icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <span className="partner_info_text">
                            {partner.email}
                          </span>
                        </div>

                        <div className="partner_info_item">
                          <svg
                            className="partner_info_icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span className="partner_info_text">
                            {partner.addharNumber
                              ? ` ${partner.addharNumber}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="partner_card_footer">
                      <button
                        className="partner_action_button partner_edit_button"
                        onClick={() => handleEdirtPartner(partner)}
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
                          onClick={() => handlepartnerUnBlock(partner.id)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Unblock
                        </button>
                      ) : (
                        <button
                          className="partner_action_button partner_block_button"
                          onClick={() => handlepartnerBlock(partner.id)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Block
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="partner_no_results">
                  <p>No partners found matching your search criteria.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Labour;
