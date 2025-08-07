import React, { useState, useEffect } from "react";
import "../Attendance/EmpList.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

function EmpList() {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingStatusId, setLoadingStatusId] = useState(null);

  useEffect(() => {
    // axiosInstance
    //   .get(`${BASE_URL}/get/all-employee`)
    //   .then((res) => setEmployees(res.data))
    //   .catch((err) => console.error("Error fetching employees:", err));

    async function GetAllEmp() {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/get/all-employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setEmployees(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    GetAllEmp();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id, newStatus) => {
    const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

    setLoadingStatusId(id);
    axiosInstance
      .patch(
        `${BASE_URL}/update/employee/${id}?employeeStatus=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employeeId === id ? { ...emp, employeeStatus: newStatus } : emp
          )
        );
        alert("Status successfully changed");
      })
      .catch((err) => {
        console.error("Error updating employee status:", err);
        alert("Failed to update employee status");
      })
      .finally(() => {
        setLoadingStatusId(null);
      });
  };

  return (
    <div className="EmpList-container">
      <h2 className="EmpList-title">Employee List</h2>

      <div className="EmpList-header-container">

        <div className="EmpList-controls">
          <form className="EmpList-search-form">
            <input
              type="text"
              id="employeeSearch"
              placeholder="Search by name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="EmpList-searchInput"
              aria-label="Search employees by name or code"
            />
          </form>

          <div className="empBtn">
            <button
              className="EmpList-markAttendance"
              aria-label="Mark attendance"
              onClick={() => navigate("/attentance")}
            >
              + Mark Attendance
            </button>
            <button
              className="EmpList-markAttendance"
              aria-label="Mark attendance"
              onClick={() => navigate("/monthlyReport")}
            >
              + Monthly Report
            </button>
          </div>
        </div>

      </div>

      
      {filteredEmployees.length === 0 && (
        <div className="EmpList-empty-state">
          <div className="EmpList-empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <p>
            {search ? "No employees match your search." : "No employees found."}
          </p>
        </div>
      )}
      <div className="EmpList-table-wrapper">
        <table className="EmpList-table" aria-label="Employee list table">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Designation</th>
              <th scope="col">DOB</th>
              <th scope="col">DOJ</th>
              <th scope="col">Status</th>
              <th scope="col">Department</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeCode}</td>
                <td>{emp.employeeName}</td>
                <td>{emp.emailId}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.designation}</td>
                <td>{emp.dateOfBirth}</td>
                <td>{emp.dateOfJoining}</td>
                <td>
                  <select
                    value={emp.employeeStatus}
                    onChange={(e) =>
                      handleStatusChange(emp.employeeId, e.target.value)
                    }
                    disabled={loadingStatusId === emp.employeeId}
                    className="EmpList-statusSelect"
                    aria-label={`Change status for ${emp.employeeName}`}
                  >
                    <option value="WORKING">Working</option>
                    <option value="NOT_WORKING_RESIGNED">Resigned</option>
                    <option value="NOT_WORKING_TERMINATED">Terminated</option>
                    <option value="NOT_WORKING_RETIRED">Retired</option>
                    {/* <option value="ON_LEAVE">On Leave</option> */}
                  </select>
                  {loadingStatusId === emp.employeeId && (
                    <span className="EmpList-statusUpdating">Updating...</span>
                  )}
                </td>
                <td>{emp.departmentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmpList;
