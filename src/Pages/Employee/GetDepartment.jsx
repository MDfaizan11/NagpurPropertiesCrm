import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../Employee/GetDepartment.css";
import { BASE_URL } from "../../config";
import axiosInstance from "../../utils/axiosInstance";

const GetDepartment = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [refreshKey, setRefreshKey] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showEmployees, setShowEmployees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getAllDepartment() {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/get-all-department`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Departments API Response:", response.data);
        setDepartments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("Failed to fetch departments. Please try again.");
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    }
    getAllDepartment();
  }, [refreshKey, token]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && (editModalOpen || addModalOpen)) {
        setEditModalOpen(false);
        setAddModalOpen(false);
        setError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editModalOpen, addModalOpen]);

  const handleEditClick = (dept) => {
    setSelectedDept(dept);
    setUpdatedName(dept.departmentName);
    setEditModalOpen(true);
    setError("");
    setSearchQuery("");
  };

  const handleDeleteClick = async (dept) => {
    if (
      window.confirm(`Are you sure you want to delete ${dept.departmentName}?`)
    ) {
      setLoading(true);
      setError("");
      try {
        const response = await axios.delete(
          `${BASE_URL}/delete/department/${dept.departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          console.log("Department deleted successfully");
          setRefreshKey(refreshKey + 1);
        }
      } catch (error) {
        setError("Failed to delete department. Please try again.");
        console.error("Error deleting department:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedName.trim()) {
      setError("Department name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.put(
        `${BASE_URL}/update/department/${selectedDept.departmentId}`,
        { departmentName: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Department updated successfully");
        setRefreshKey(refreshKey + 1);
        setEditModalOpen(false);
        setSearchQuery("");
      }
    } catch (error) {
      setError("Failed to update department. Please try again.");
      console.error("Error updating department:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      setError("Department name is required.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = {
      departmentName: newDepartmentName,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/create-department`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Department added successfully");
        setNewDepartmentName("");
        setRefreshKey(refreshKey + 1);
        setAddModalOpen(false);
        setSearchQuery("");
      }
    } catch (error) {
      setError("Failed to create department. Please try again.");
      console.error("Error creating department:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (dept) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${BASE_URL}/department/${dept.departmentId}/employee-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Employees API Response:", response.data);
      setSelectedDept(dept);
      setEmployees(Array.isArray(response.data) ? response.data : []);
      setShowEmployees(true);
    } catch (error) {
      setError("Failed to fetch employees. Please try again.");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = (id) => {
    navigate(`/registerEmploye/${id}`);
  };

  const handleCloseEmployeeView = () => {
    setShowEmployees(false);
    setEmployees([]);
    setSelectedDept(null);
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="getdepartment-department-wrapper">
      <h2 className="getdepartment-header-title">Departments</h2>
      <div className="getdepartment-header-container">
        <form className="getdepartment-search-form">
          {/* <label
            className="getdepartment-search-label"
            htmlFor="departmentSearch"
          >
            Search
          </label> */}
          <input
            type="text"
            id="departmentSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="getdepartment-search-input"
            placeholder="Enter department name"
            aria-label="Search departments by name"
          />
        </form>
        <button
          className="getdepartment-open-modal-button"
          onClick={() => setAddModalOpen(true)}
          disabled={loading}
          aria-label="Add new department"
        >
          Add Department
        </button>
      </div>

      {error && <div className="getdepartment-error-message">{error}</div>}

      {loading && (
        <div className="getdepartment-loading-container">
          <div className="getdepartment-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="getdepartment-department-grid">
        {filteredDepartments.length === 0 && !loading && (
          <div className="getdepartment-empty-state">
            <div className="getdepartment-empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <p>
              {searchQuery
                ? "No departments match your search."
                : "No departments found."}
            </p>
          </div>
        )}
        {filteredDepartments.map((dept) => (
          <div
            key={dept.departmentId}
            className="getdepartment-department-card"
            onClick={() => handleCardClick(dept)}
            aria-label={`View employees in ${dept.departmentName}`}
          >
            <div className="getdepartment-card-actions">
              <FaEdit
                className="getdepartment-edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(dept);
                }}
                aria-label={`Edit ${dept.departmentName}`}
              />
              <FaTrash
                className="getdepartment-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(dept);
                }}
                aria-label={`Delete ${dept.departmentName}`}
              />
            </div>
            <div className="getdepartment-card-content">
              <h3>{dept.departmentName}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Employee List */}
      {showEmployees && selectedDept && (
        <div className="getdepartment-employee-section">
          <div className="getdepartment-employee-header">
            <h3>Employees in {selectedDept.departmentName}</h3>
            <div className="getdepartment-employee-header-buttons">
              <button
                className="getdepartment-add-button"
                onClick={() => handleAddEmployee(selectedDept.departmentId)}
                disabled={loading}
                aria-label={`Add employee to ${selectedDept.departmentName}`}
              >
                + Add Employee
              </button>
              <button
                className="getdepartment-cancel-button"
                onClick={handleCloseEmployeeView}
                aria-label="Close employee list"
              >
                Close
              </button>
            </div>
          </div>
          {employees.length === 0 ? (
            <div className="getdepartment-empty-state">
              <div className="getdepartment-empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p>No employees found in this department.</p>
            </div>
          ) : (
            <div className="getdepartment-table-wrapper">
              <table
                className="getdepartment-employee-table"
                aria-label={`Employee list for ${selectedDept.departmentName}`}
              >
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employeeId}>
                      <td>{emp.employeeCode}</td>
                      <td>{emp.employeeName}</td>
                      <td>{emp.emailId}</td>
                      <td>{emp.phoneNumber}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <span
                          className={`getdepartment-status-badge getdepartment-status-${emp.employeeStatus.toLowerCase()}`}
                        >
                          {emp.employeeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Department Modal */}
      {editModalOpen && (
        <div className="getdepartment-modal-overlay">
          <div className="getdepartment-modal-box">
            <h3>Edit Department</h3>
            {error && (
              <div className="getdepartment-error-message">{error}</div>
            )}
            <form onSubmit={handleUpdate}>
              <label
                className="getdepartment-modal-label"
                htmlFor="editDepartmentName"
              >
                Department Name
              </label>
              <input
                type="text"
                id="editDepartmentName"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="getdepartment-modal-input"
                placeholder="Enter department name"
                required
                aria-label="Edit department name"
              />
              <div className="getdepartment-modal-actions">
                <button
                  className="getdepartment-modal-button"
                  type="submit"
                  disabled={loading}
                  aria-label="Update department"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  className="getdepartment-cancel-button"
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setError("");
                  }}
                  disabled={loading}
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {addModalOpen && (
        <div className="getdepartment-modal-overlay">
          <div className="getdepartment-modal-box">
            <h3>Create Department</h3>
            {error && (
              <div className="getdepartment-error-message">{error}</div>
            )}
            <form onSubmit={handleAddDepartment}>
              <label
                className="getdepartment-modal-label"
                htmlFor="newDepartmentName"
              >
                Department Name
              </label>
              <input
                type="text"
                id="newDepartmentName"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                className="getdepartment-modal-input"
                placeholder="Enter department name"
                required
                aria-label="New department name"
              />
              <div className="getdepartment-modal-actions">
                <button
                  className="getdepartment-modal-button"
                  type="submit"
                  disabled={loading}
                  aria-label="Create department"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  className="getdepartment-cancel-button"
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    setError("");
                  }}
                  disabled={loading}
                  aria-label="Cancel create"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetDepartment;
