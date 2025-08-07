"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  X,
  Filter,
  CalendarDays,
  Search,
  Trash2,
  Edit,
} from "lucide-react";
import "./Holiday.css";
import { BASE_URL } from "../../config";
import axiosInstance from "../../utils/axiosInstance";

function Holiday() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayDetails, setHolidayDetails] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);

  async function handleAddHoliday(e) {
    e.preventDefault();
    const data = {
      date: holidayDate,
      description: holidayDetails,
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/add-holiday`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setHolidayDate("");
        setHolidayDetails("");
        setShowHolidayForm(false);
        alert("Holiday added successfully");
        fetchAllHolidays();
      }
    } catch (error) {
      console.error("Error adding holiday:", error);
      alert("Failed to add holiday. Please try again.");
    }
  }

  async function handleEditHoliday(e) {
    e.preventDefault();
    const data = {
      date: holidayDate,
      description: holidayDetails,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/update/holiday/${editingHoliday.holidayId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setHolidayDate("");
        setHolidayDetails("");
        setShowEditForm(false);
        setEditingHoliday(null);
        alert("Holiday updated successfully");
        fetchAllHolidays();
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
      alert("Failed to update holiday. Please try again.");
    }
  }

  async function handleDeleteHoliday(holidayId) {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        const response = await axiosInstance.delete(
          `${BASE_URL}/delete/holiday/${holidayId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          alert("Holiday deleted successfully");
          fetchAllHolidays();
        }
      } catch (error) {
        console.error("Error deleting holiday:", error);
        alert("Failed to delete holiday. Please try again.");
      }
    }
  }

  async function fetchHolidaysByMonth(month) {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/holiday/month/${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHolidays(response.data);
    } catch (err) {
      console.error("Error fetching holidays by month:", err);
    }
  }

  async function fetchHolidaysByYear(year) {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/holiday/year/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHolidays(response.data);
    } catch (err) {
      console.error("Error fetching holidays by year:", err);
    }
  }

  async function fetchAllHolidays() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/All/holiday`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setHolidays(response.data);
    } catch (err) {
      console.error("Error fetching all holidays:", err);
    }
  }

  const handleMonthChange = (e) => {
    const monthValue = e.target.value;
    setSelectedMonth(monthValue);
    setSelectedYear("");
    if (monthValue) {
      fetchHolidaysByMonth(monthValue);
    } else {
      fetchAllHolidays();
    }
  };

  const handleYearChange = (e) => {
    const yearValue = e.target.value;
    setSelectedYear(yearValue);
    setSelectedMonth("");
    if (yearValue) {
      fetchHolidaysByYear(yearValue);
    } else {
      fetchAllHolidays();
    }
  };

  const handleEditClick = (holiday) => {
    console.log(holiday);
    setEditingHoliday(holiday);
    setHolidayDate(holiday.date);
    setHolidayDetails(holiday.description);
    setShowEditForm(true);
  };

  const resetForm = () => {
    setHolidayDate("");
    setHolidayDetails("");
    setEditingHoliday(null);
  };

  const filteredHolidays = holidays.filter(
    (holiday) =>
      holiday.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.date.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchAllHolidays();
  }, []);

  return (
    <div className="Holiday-container">
      {/* Header Section */}
      <div className="Holiday-header">
        <div className="Holiday-header-content">
          <div className="Holiday-header-title">
            {/* <Calendar className="Holiday-header-icon" /> */}
            <h1 className="Holiday-title">Holiday Management</h1>
          </div>
          {/* <p className="Holiday-header-subtitle">
            Manage company holidays and special events
          </p> */}
        </div>
      </div>

      {/* Controls Section */}
      <div className="Holiday-controls-section">
        <div className="Holiday-search-container">
          <Search className="Holiday-search-icon" />
          <input
            type="search"
            placeholder="Search holidays..."
            className="Holiday-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="Holiday-add-btn Holiday-btn Holiday-btn-primary"
          onClick={() => setShowHolidayForm(true)}
        >
          <Plus className="Holiday-btn-icon" />
          Add Holiday
        </button>
      </div>

      {/* Add Holiday Form Modal */}
      {showHolidayForm && (
        <div className="Holiday-modal-overlay">
          <div className="Holiday-modal-container">
            <div className="Holiday-modal-header">
              <h2 className="Holiday-form-title">Add New Holiday</h2>
              <button
                className="Holiday-modal-close-btn"
                onClick={() => {
                  setShowHolidayForm(false);
                  resetForm();
                }}
              >
                <X />
              </button>
            </div>
            <form className="Holiday-form-content" onSubmit={handleAddHoliday}>
              <div className="Holiday-form-group">
                <label className="Holiday-form-label">Holiday Date</label>
                <input
                  className="Holiday-date-input Holiday-form-input"
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  required
                />
              </div>
              <div className="Holiday-form-group">
                <label className="Holiday-form-label">
                  Holiday Description
                </label>
                <textarea
                  className="Holiday-details-textarea Holiday-form-textarea"
                  placeholder="Enter holiday description..."
                  rows="4"
                  value={holidayDetails}
                  onChange={(e) => setHolidayDetails(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="Holiday-form-actions">
                <button
                  type="button"
                  className="Holiday-btn Holiday-btn-outline Holiday-btn-sm"
                  onClick={() => {
                    setShowHolidayForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="Holiday-submit-btn Holiday-btn Holiday-btn-primary Holiday-btn-sm"
                  type="submit"
                >
                  <Plus className="Holiday-btn-icon" />
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Holiday Form Modal */}
      {showEditForm && (
        <div className="Holiday-modal-overlay">
          <div className="Holiday-modal-container">
            <div className="Holiday-modal-header">
              <h2 className="Holiday-form-title">Edit Holiday</h2>
              <button
                className="Holiday-modal-close-btn"
                onClick={() => {
                  setShowEditForm(false);
                  resetForm();
                }}
              >
                <X />
              </button>
            </div>
            <form className="Holiday-form-content" onSubmit={handleEditHoliday}>
              <div className="Holiday-form-group">
                <label className="Holiday-form-label">Holiday Date</label>
                <input
                  className="Holiday-date-input Holiday-form-input"
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  required
                />
              </div>
              <div className="Holiday-form-group">
                <label className="Holiday-form-label">
                  Holiday Description
                </label>
                <textarea
                  className="Holiday-details-textarea Holiday-form-textarea"
                  placeholder="Enter holiday description..."
                  rows="4"
                  value={holidayDetails}
                  onChange={(e) => setHolidayDetails(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="Holiday-form-actions">
                <button
                  type="button"
                  className="Holiday-btn Holiday-btn-outline Holiday-btn-sm"
                  onClick={() => {
                    setShowEditForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="Holiday-submit-btn Holiday-btn Holiday-btn-primary Holiday-btn-sm"
                  type="submit"
                >
                  <Edit className="Holiday-btn-icon" />
                  Update Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="Holiday-filter-section">
        <div className="Holiday-filter-header">
          <Filter className="Holiday-filter-icon" />
          <h3 className="Holiday-filter-title">Filter Holidays</h3>
        </div>
        <div className="Holiday-filter-controls">
          <div className="Holiday-filter-group">
            <label className="Holiday-filter-label">Filter by Month:</label>
            <input
              className="Holiday-month-input Holiday-filter-input"
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>
          <div className="Holiday-filter-group">
            <label className="Holiday-filter-label">Filter by Year:</label>
            <input
              className="Holiday-year-input Holiday-filter-input"
              type="number"
              value={selectedYear}
              placeholder="YYYY"
              min="2020"
              max="2030"
              onChange={handleYearChange}
            />
          </div>
          <button
            className="Holiday-btn Holiday-btn-outline Holiday-btn-sm"
            onClick={() => {
              setSelectedMonth("");
              setSelectedYear("");
              fetchAllHolidays();
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Holiday List Section */}
      <div className="Holiday-list-section">
        <div className="Holiday-list-header">
          <div className="Holiday-list-title-container">
            <CalendarDays className="Holiday-list-icon" />
            <h3 className="Holiday-list-title">Holidays</h3>
          </div>
          <span className="Holiday-count-badge">
            {filteredHolidays.length} holiday
            {filteredHolidays.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredHolidays.length > 0 ? (
          <div className="Holiday-list-container">
            <div className="Holiday-list-grid">
              {filteredHolidays.map((holiday, index) => (
                <div className="Holiday-card" key={index}>
                  <div className="Holiday-card-header">
                    <div className="Holiday-date-container">
                      <Calendar className="Holiday-card-icon" />
                      <div className="Holiday-date-info">
                        <span className="Holiday-date">
                          {formatDate(holiday.date)}
                        </span>
                        <span className="Holiday-date-short">
                          {holiday.date}
                        </span>
                      </div>
                    </div>
                    <div className="Holiday-card-actions">
                      <button
                        className="Holiday-btn Holiday-btn-icon Holiday-btn-edit Holiday-btn-xs"
                        onClick={() => handleEditClick(holiday)}
                        title="Edit Holiday"
                      >
                        <Edit />
                      </button>
                      <button
                        className="Holiday-btn Holiday-btn-icon Holiday-btn-delete Holiday-btn-xs"
                        onClick={() => handleDeleteHoliday(holiday.holidayId)}
                        title="Delete Holiday"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                  <div className="Holiday-card-body">
                    <p className="Holiday-description">{holiday.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="Holiday-empty-state">
            <Calendar className="Holiday-empty-icon" />
            <h3>No holidays found</h3>
            <p className="Holiday-no-holidays">
              {searchTerm || selectedMonth || selectedYear
                ? "Try adjusting your search or filter criteria"
                : "Add your first holiday to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Holiday;
