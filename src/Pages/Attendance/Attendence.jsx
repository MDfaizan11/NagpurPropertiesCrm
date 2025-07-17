"use client";

import { useState, useEffect } from "react";
import "../Attendance/Attendence.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";

function Attendence() {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [marked, setMarked] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get(`${BASE_URL}/get-all-department`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to load departments", err);
        setError("Failed to load departments.");
      }
    };

    fetchDepartments();
  }, [token]);

  const calculateAttendanceSummary = (empList) => {
    const summary = { PRESENT: 0, ABSENT: 0, HALF_DAY: 0 };
    empList.forEach((emp) => {
      if (emp.attendanceStatus) {
        summary[emp.attendanceStatus]++;
      }
    });
    setAttendanceSummary(summary);
  };

  const fetchEmployees = async () => {
    if (!selectedDeptId || !selectedDate) {
      setError("Please select both department and date.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `${BASE_URL}/get/employee-attendance`,
        {
          attendanceDate: selectedDate,
          departmentId: Number.parseInt(selectedDeptId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const empList = res.data.map((emp) => ({
        ...emp,
        attendanceStatus: emp.attendanceStatus || "",
      }));

      setEmployees(empList);
      calculateAttendanceSummary(empList);
      setMarked(false);
      setError(null);
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        "An error occurred while fetching employee data.";

      setError(serverMessage);
      alert(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === id ? { ...emp, attendanceStatus: status } : emp
      )
    );

    // Recalculate summary
    const updatedEmployees = employees.map((emp) =>
      emp.employeeId === id ? { ...emp, attendanceStatus: status } : emp
    );
    calculateAttendanceSummary(updatedEmployees);
  };

  const submitAttendance = async () => {
    const attendanceEmpDetails = employees
      .filter((e) => e.attendanceStatus)
      .map((e) => ({
        employeeId: e.employeeId,
        attendanceStatus: e.attendanceStatus,
      }));

    if (attendanceEmpDetails.length === 0) {
      setError("Please mark attendance for at least one employee.");
      return;
    }

    console.log([selectedDeptId, attendanceEmpDetails, selectedDate]);
    setLoading(true);
    try {
      await axiosInstance.post(
        `${BASE_URL}/mark-employee-attendance`,
        {
          departmentId: Number.parseInt(selectedDeptId),
          attendanceDate: selectedDate,
          attendanceEmpDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setError(null);
      setMarked(true);
      fetchMarkedAttendance();

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className = "Attendence-success-message";
      successMsg.textContent = "Attendance marked successfully!";
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    } catch (err) {
      console.error("Error submitting attendance", err);
      setError("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarkedAttendance = async () => {
    try {
      const res = await axiosInstance.post(
        `${BASE_URL}/get/employee-attendance`,
        {
          attendanceDate: selectedDate,
          departmentId: Number.parseInt(selectedDeptId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updated = res.data.filter((emp) => emp.attendanceStatus);
      setEmployees(updated);
      calculateAttendanceSummary(updated);
    } catch (err) {
      console.error("Error fetching marked attendance", err);
    }
  };

  return (
    <>
      {/* <div className="Attendence-page-header">
        <p className="Attendence-page-title">Attendance Management</p>
        <div className="Attendence-page-subtitle">
          Track and manage employee attendance efficiently
        </div>
      </div> */}

      <div className="Attendence-container">
        <div className="Attendence-header-container">
          <div className="Attendence-header-content">
            <h2 className="Attendence-header">Employee Attendance</h2>
            <div className="Attendence-header-decoration"></div>
          </div>

          <div className="Attendence-controls">
            <div className="Attendence-form-group">
              <label className="Attendence-label" htmlFor="departmentSelect">
                <span className="Attendence-label-icon">🏢</span>
                Department
              </label>
              <div className="Attendence-select-wrapper">
                <select
                  id="departmentSelect"
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="Attendence-select"
                  aria-label="Select department"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="Attendence-form-group">
              <label className="Attendence-label" htmlFor="dateSelect">
                <span className="Attendence-label-icon">📅</span>
                Date
              </label>
              <input
                type="date"
                id="dateSelect"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="Attendence-date-input"
                aria-label="Select date"
              />
            </div>

            <button
              className={`Attendence-button Attendence-button-load ${
                loading ? "Attendence-loading" : ""
              }`}
              onClick={fetchEmployees}
              disabled={loading}
              aria-label={marked ? "Refresh attendance" : "Load employees"}
            >
              {loading ? (
                <>
                  <span className="Attendence-spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span className="Attendence-button-icon">👥</span>
                  {marked ? "Refresh Attendance" : "Load Employees"}
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="Attendence-error-message">
            <span className="Attendence-error-icon">⚠️</span>
            <span className="Attendence-error-text">{error}</span>
            <button
              className="Attendence-error-close"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {employees.length > 0 && (
          <div className="Attendence-table-wrapper">
            <div className="Attendence-summary">
              <div className="Attendence-summary-card Attendence-present">
                <div className="Attendence-icon">✅</div>
                <div className="Attendence-info">
                  <h4>Present</h4>
                  <p>{attendanceSummary?.PRESENT || 0}</p>
                </div>
                <div className="Attendence-card-percentage">
                  {employees.length > 0 &&
                    `${Math.round(
                      ((attendanceSummary?.PRESENT || 0) / employees.length) *
                        100
                    )}%`}
                </div>
                <div className="Attendence-card-bg"></div>
              </div>

              <div className="Attendence-summary-card Attendence-absent">
                <div className="Attendence-icon">❌</div>
                <div className="Attendence-info">
                  <h4>Absent</h4>
                  <p>{attendanceSummary?.ABSENT || 0}</p>
                </div>
                <div className="Attendence-card-percentage">
                  {employees.length > 0 &&
                    `${Math.round(
                      ((attendanceSummary?.ABSENT || 0) / employees.length) *
                        100
                    )}%`}
                </div>
                <div className="Attendence-card-bg"></div>
              </div>

              <div className="Attendence-summary-card Attendence-half-day">
                <div className="Attendence-icon">🌓</div>
                <div className="Attendence-info">
                  <h4>Half Day</h4>
                  <p>{attendanceSummary?.HALF_DAY || 0}</p>
                </div>
                <div className="Attendence-card-percentage">
                  {employees.length > 0 &&
                    `${Math.round(
                      ((attendanceSummary?.HALF_DAY || 0) / employees.length) *
                        100
                    )}%`}
                </div>
                <div className="Attendence-card-bg"></div>
              </div>
            </div>

            <div className="Attendence-table-container">
              <table
                className="Attendence-table"
                aria-label="Employee attendance table"
              >
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr
                      key={emp.employeeId}
                      className={`Attendence-table-row ${
                        index % 2 === 0
                          ? "Attendence-row-even"
                          : "Attendence-row-odd"
                      }`}
                    >
                      <td>
                        <span className="Attendence-employee-code">
                          {emp.employeeCode}
                        </span>
                      </td>
                      <td>
                        <div className="Attendence-employee-name">
                          <span className="Attendence-name-text">
                            {emp.employeeName}
                          </span>
                        </div>
                      </td>
                      <td className="Attendence-phone-number">
                        {emp.phoneNumber}
                      </td>
                      <td>
                        <span className="Attendence-designation-badge">
                          {emp.designation}
                        </span>
                      </td>
                      <td>
                        {marked ? (
                          <span
                            className={`Attendence-status-badge Attendence-status-${emp.attendanceStatus
                              ?.toLowerCase()
                              .replace("_", "-")}`}
                          >
                            {emp.attendanceStatus?.replace("_", " ")}
                          </span>
                        ) : (
                          <div className="Attendence-status-wrapper">
                            <select
                              value={emp.attendanceStatus}
                              onChange={(e) =>
                                handleStatusChange(
                                  emp.employeeId,
                                  e.target.value
                                )
                              }
                              className="Attendence-status-select"
                              aria-label={`Select attendance status for ${emp.employeeName}`}
                            >
                              <option value="">-- Select --</option>
                              <option value="PRESENT">Present</option>
                              <option value="ABSENT">Absent</option>
                              <option value="HALF_DAY">Half Day</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!marked && (
              <div className="Attendence-submit-section">
                <button
                  className={`Attendence-button Attendence-button-submit ${
                    loading ? "Attendence-loading" : ""
                  }`}
                  onClick={submitAttendance}
                  disabled={loading}
                  aria-label="Submit attendance"
                >
                  {loading ? (
                    <>
                      <span className="Attendence-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="Attendence-button-icon">💾</span>
                      Submit Attendance
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Attendence;
