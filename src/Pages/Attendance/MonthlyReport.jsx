import React, { useEffect, useState, useRef } from "react";
import "./MonthlyReport.css";
import { BASE_URL } from "../../config";
import axiosInstance from "../../utils/axiosInstance";

const MonthlyReport = () => {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [monthStartDate, setMonthStartDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthDates, setMonthDates] = useState([]);
  const [monthLabel, setMonthLabel] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref for the printable/exportable area
  const reportRef = useRef();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get(`${BASE_URL}/get-all-department`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setDepartments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepartments();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monthStartDate || !selectedDeptId) {
      alert("Please select both department and date.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/get/employee/monthly-report`,
        {
          params: {
            monthStartDate,
            departmentId: parseInt(selectedDeptId),
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data || [];
      setAttendanceData(data);

      if (data.length && data[0].attendance) {
        const allDates = data[0].attendance.map((a) => a.date);
        setMonthDates(allDates);

        const dateObj = new Date(allDates[0]);
        const monthText = dateObj.toLocaleString("default", { month: "long" });
        const year = dateObj.getFullYear();
        setMonthLabel(`${monthText} ${year}`);
      } else {
        setMonthDates([]);
        setMonthLabel("");
      }
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.departmentId === parseInt(id));
    return dept ? dept.departmentName : "N/A";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PRESENT":
        return "MonthlyReport-present-status";
      case "ABSENT":
        return "MonthlyReport-absent-status";
      case "HALF_DAY":
        return "MonthlyReport-halfday-status";
      default:
        return "MonthlyReport-na-status";
    }
  };

  const getDayWiseCounts = (status) => {
    return monthDates.map((date, i) => {
      let count = 0;
      attendanceData.forEach((emp) => {
        const attendance = emp.attendance[i];
        if (attendance && attendance.attendanceStatus === status) {
          count++;
        }
      });
      return count;
    });
  };

  const handlePrint = () => {
    const printContents = reportRef.current.innerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Monthly Attendance Report</title>
          <style>
            ${document.querySelector("style")?.innerHTML || ""}
            body { font-family: Arial, sans-serif; padding: 5px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 5px; text-align: center; }
            .MonthlyReport-present-status { background-color: #c8e6c9; }
            .MonthlyReport-absent-status { background-color: #ffcdd2; }
            .MonthlyReport-halfday-status { background-color: #fff9c4; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  };

  const handleDownloadPDF = () => {
    import("html2pdf.js").then((html2pdf) => {
      const opt = {
        // margin: [0.1, 0.1, 0.1, 0.1],
        filename: `Monthly_Report_${monthLabel || "report"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a3",
          orientation: "landscape",
        },
      };

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "visible";

      html2pdf
        .default()
        .from(reportRef.current)
        .set(opt)
        .save()
        .then(() => {
          document.body.style.overflow = originalOverflow;
        });
    });
  };

  return (
    <div className="MonthlyReport-report-wrapper">
      <h2 className="MonthlyReport-report-heading">
        Monthly Attendance Report
      </h2>

      <form className="MonthlyReport-filter-form" onSubmit={handleSubmit}>
        <div className="MonthlyReport-form-group">
          <label>Department</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="MonthlyReport-form-group">
          <label>Month Start Date</label>
          <input
            type="date"
            value={monthStartDate}
            onChange={(e) => setMonthStartDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="MonthlyReport-btn-submit">
          Generate Report
        </button>
      </form>

      {loading && (
        <p className="MonthlyReport-loading-text">Loading attendance data...</p>
      )}

      {attendanceData.length > 0 && (
        <>
          <div className="MonthlyReport-actions">
            <button className="MonthlyReport-btn-print" onClick={handlePrint}>
              Print Report
            </button>
            <button
              className="MonthlyReport-btn-pdf"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
          </div>

          <div ref={reportRef}>
            <div className="MonthlyReport-summary-header">
              <h4>
                Month: <strong>{monthLabel}</strong> | Department:{" "}
                <strong>{getDepartmentName(selectedDeptId)}</strong>
              </h4>
            </div>

            <div
              className="MonthlyReport-table-scroll"
              style={{ overflow: "visible" }}
            >
              <table className="MonthlyReport-monthly-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    {monthDates.map((date, idx) => (
                      <th key={idx}>{new Date(date).getDate()}</th>
                    ))}
                    <th>Present</th>
                    <th>Leaves</th>
                    <th>Half Days</th>
                    <th>Total Marked</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((emp) => {
                    const halfDayCount = emp.attendance.filter(
                      (a) => a.attendanceStatus === "HALF_DAY"
                    ).length;

                    return (
                      <tr key={emp.employeeId}>
                        <td className="MonthlyReport-emp-name">
                          <strong>{emp.employeeName}</strong>
                          <br />
                          <span>{emp.designation}</span>
                        </td>
                        {emp.attendance.map((a, i) => (
                          <td key={i}>
                            <span
                              className={`MonthlyReport-status-cell ${getStatusClass(
                                a.attendanceStatus
                              )}`}
                            >
                              {a.attendanceStatus ? a.attendanceStatus[0] : "-"}
                            </span>
                          </td>
                        ))}
                        <td>
                          <strong>{emp.presentDay}</strong>
                        </td>
                        <td>{emp.leaves}</td>
                        <td>{halfDayCount}</td>
                        <td>{emp.attendanceMarkedDay}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="MonthlyReport-summary-row MonthlyReport-present-row">
                    <td>
                      <strong>Present</strong>
                    </td>
                    {getDayWiseCounts("PRESENT").map((count, i) => (
                      <td
                        key={`present-${i}`}
                        className="MonthlyReport-present-status"
                      >
                        {count}
                      </td>
                    ))}
                    <td colSpan="4"></td>
                  </tr>
                  <tr className="MonthlyReport-summary-row MonthlyReport-absent-row">
                    <td>
                      <strong>Absent</strong>
                    </td>
                    {getDayWiseCounts("ABSENT").map((count, i) => (
                      <td
                        key={`absent-${i}`}
                        className="MonthlyReport-absent-status"
                      >
                        {count}
                      </td>
                    ))}
                    <td colSpan="4"></td>
                  </tr>
                  <tr className="MonthlyReport-summary-row MonthlyReport-halfday-row">
                    <td>
                      <strong>Half Day</strong>
                    </td>
                    {getDayWiseCounts("HALF_DAY").map((count, i) => (
                      <td
                        key={`half-${i}`}
                        className="MonthlyReport-halfday-status"
                      >
                        {count}
                      </td>
                    ))}
                    <td colSpan="4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyReport;
