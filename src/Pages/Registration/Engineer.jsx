import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./Engineer.css";

function Engineer() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  const [engineerRegistrationForm, setEngineerRegistrationForm] =
    useState(false);
  const [engineerName, setEngineerName] = useState("");
  const [engineerEmail, setEngineerEmail] = useState("");
  const [engineerPhone, setEngineerPhone] = useState("");
  const [engineerPassword, setEngineerPassword] = useState("");
  const [engineerList, setEngineerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editEngineerId, setEditEngineerId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function handleAddEngineer(e) {
    e.preventDefault();
    if (
      !engineerName ||
      !engineerEmail ||
      !engineerPhone ||
      !engineerPassword
    ) {
      alert("Please fill all the fields");
      return;
    }
    const enggBody = {
      name: engineerName,
      email: engineerEmail,
      phoneNo: engineerPhone,
      password: engineerPassword,
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/registerEngineer`,
        enggBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Engineer registered successfully");
        setEngineerName("");
        setEngineerEmail("");
        setEngineerPhone("");
        setEngineerPassword("");
        setEngineerRegistrationForm(false);
        getEngineerList();
      }
    } catch (error) {
      console.error("Error registering engineer:", error);
      alert(
        error.response?.data?.message ||
          "Failed to register engineer. Please try again."
      );
    }
  }

  async function handleEditEngineerRegistration(e) {
    e.preventDefault();
    if (!engineerName || !engineerEmail || !engineerPhone) {
      alert("Please fill all required fields");
      return;
    }
    const enggBody = {
      name: engineerName,
      email: engineerEmail,
      phoneNo: engineerPhone,
      ...(engineerPassword && { password: engineerPassword }),
    };

    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/updateEngineer/${editEngineerId}`,
        enggBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Engineer details updated successfully");
        setEngineerRegistrationForm(false);
        setEngineerName("");
        setEngineerEmail("");
        setEngineerPhone("");
        setEngineerPassword("");
        setEditEngineerId(null);
        getEngineerList();
      }
    } catch (error) {
      console.error("Error updating engineer:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update engineer. Please try again."
      );
    }
  }

  async function handleBlockEngineer(engineerId) {
    const confirmBlock = window.confirm(
      "Are you sure you want to block this engineer?"
    );
    if (confirmBlock) {
      try {
        const response = await axiosInstance.post(
          `${BASE_URL}/blockEngineer/${engineerId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Engineer blocked successfully");
          getEngineerList();
        }
      } catch (error) {
        console.error("Error blocking engineer:", error);
        alert(
          error.response?.data?.message ||
            "Failed to block engineer. Please try again."
        );
      }
    }
  }

  async function handleUnblockEngineer(engineerId) {
    const confirmUnBlock = window.confirm(
      "Are you sure you want to unblock this engineer?"
    );
    if (confirmUnBlock) {
      try {
        const response = await axiosInstance.post(
          `${BASE_URL}/unblockEngineer/${engineerId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Engineer unblocked successfully");
          getEngineerList();
        }
      } catch (error) {
        console.error("Error unblocking engineer:", error);
        alert(
          error.response?.data?.message ||
            "Failed to unblock engineer. Please try again."
        );
      }
    }
  }

  async function getEngineerList() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/allEngineers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      const sortedData = data.sort((a, b) => b.id - a.id);
      setEngineerList(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching engineers:", error);
      alert(
        error.response?.data?.message ||
          "Failed to fetch engineers. Please try again."
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    getEngineerList();
  }, []);

  function handleEditEngineer(engineer) {
    setEditEngineerId(engineer.id);
    setEngineerName(engineer.name);
    setEngineerEmail(engineer.email);
    setEngineerPhone(engineer.phoneNo);
    setEngineerPassword("");
    setEngineerRegistrationForm(true);
  }

  function handleCloseEngineerRegistrationForm() {
    setEngineerRegistrationForm(false);
    setEditEngineerId(null);
    setEngineerName("");
    setEngineerEmail("");
    setEngineerPhone("");
    setEngineerPassword("");
  }

  const filteredEngineers = engineerList.filter(
    (engineer) =>
      engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="engineer_main_container">
      <div className="engineer_header">
        <div className="engineer_header_content">
          <h1 className="engineer_title">Engineer Management</h1>
        </div>
      </div>

      <div className="engineer_search_add_container">
        <div className="engineer_search_container">
          <div className="engineer_search_input_wrapper">
            <svg
              className="engineer_search_icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="search"
              placeholder="Search engineers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="engineer_search_input"
            />
          </div>
        </div>
        <div className="engineer_add_container">
          <button
            className="engineer_add_button"
            onClick={() => setEngineerRegistrationForm(true)}
          >
            <svg
              className="engineer_add_icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Engineer
          </button>
        </div>
      </div>

      {engineerRegistrationForm && (
        <div className="engineer_registration_form_container">
          <form
            className="engineer_registration_form"
            onSubmit={
              editEngineerId
                ? handleEditEngineerRegistration
                : handleAddEngineer
            }
          >
            <button
              className="engineer_registration_form_close_button"
              onClick={handleCloseEngineerRegistrationForm}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="engineer_form_header">
              <h2 className="engineer_form_title">
                {editEngineerId
                  ? "Edit Engineer Details"
                  : "Register New Engineer"}
              </h2>
              <p className="engineer_form_subtitle">
                {editEngineerId
                  ? "Update the details of the engineer"
                  : "Fill in the details to register a new engineer"}
              </p>
            </div>

            <div className="engineer_form_grid_container">
              <label className="engineer_registration_form_label">
                <span className="engineer_label_text">Full Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  className="engineer_registration_form_input"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  placeholder="Enter full name"
                />
              </label>

              <label className="engineer_registration_form_label">
                <span className="engineer_label_text">Email Address</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="engineer_registration_form_input"
                  value={engineerEmail}
                  onChange={(e) => setEngineerEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </label>

              <label className="engineer_registration_form_label">
                <span className="engineer_label_text">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="engineer_registration_form_input"
                  value={engineerPhone}
                  onChange={(e) => setEngineerPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </label>

              <label className="engineer_registration_form_label">
                <span className="engineer_label_text">
                  Password {editEngineerId && "(Optional)"}
                </span>
                <input
                  type="password"
                  name="password"
                  required={!editEngineerId}
                  className="engineer_registration_form_input"
                  value={engineerPassword}
                  onChange={(e) => setEngineerPassword(e.target.value)}
                  placeholder={
                    editEngineerId
                      ? "Enter new password (optional)"
                      : "Enter password"
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              className="engineer_registration_submit_button"
            >
              <svg
                className="engineer_submit_icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              {editEngineerId ? "Update Engineer Details" : "Register Engineer"}
            </button>
          </form>
        </div>
      )}

      <div className="engineer_content_section">
        {loading ? (
          <div className="engineer_loading_container">
            <div className="engineer_loading_spinner"></div>
            <p className="engineer_loading_text">Loading engineers...</p>
          </div>
        ) : (
          <div className="engineer_list_container">
            {filteredEngineers.length > 0 ? (
              <div className="engineer_table_wrapper">
                <table className="engineer_table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEngineers.map((engineer) => (
                      <tr key={engineer.id}>
                        <td>{engineer.name}</td>
                        <td>{engineer.email}</td>
                        <td>{engineer.phoneNo}</td>
                        <td>
                          <span
                            className={`engineer_status_badge ${
                              engineer.status === "BLOCK" ? "blocked" : "active"
                            }`}
                          >
                            {engineer.status === "BLOCK" ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td>
                          <div className="engineer_action_buttons">
                            <button
                              className="engineer_action_button engineer_edit_button"
                              onClick={() => handleEditEngineer(engineer)}
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
                            {engineer.status === "BLOCK" ? (
                              <button
                                className="engineer_action_button engineer_unblock_button"
                                onClick={() =>
                                  handleUnblockEngineer(engineer.id)
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
                                className="engineer_action_button engineer_block_button"
                                onClick={() => handleBlockEngineer(engineer.id)}
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
              <div className="engineer_no_results">
                <p>No engineers found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Engineer;
