import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { Edit, Trash2 } from "lucide-react";
import "./vendor.css";

function Vendor() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [vendorName, setVendorName] = useState("");
  const [vendorNumber, setVendorNumber] = useState("");
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [filteredVendorList, setFilteredVendorList] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getAllVendor() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${BASE_URL}/showAllvendor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setVendorList(response.data);
        setFilteredVendorList(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        alert("Error fetching vendors");
      } finally {
        setLoading(false);
      }
    }
    getAllVendor();
  }, []);

  useEffect(() => {
    // Filter vendors based on search query
    const filtered = vendorList.filter(
      (vendor) =>
        vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.phoneNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVendorList(filtered);
  }, [searchQuery, vendorList]);

  async function handleAddVendor(e) {
    e.preventDefault();
    setLoading(true);
    const body = {
      vendorName: vendorName,
      phoneNo: vendorNumber,
    };

    try {
      const url = editingVendor
        ? `${BASE_URL}/updateVendor/${editingVendor.id}`
        : `${BASE_URL}/createVendor`;
      const method = editingVendor ? "put" : "post";

      const response = await axiosInstance[method](url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert(
          editingVendor
            ? "Vendor Updated Successfully"
            : "Vendor Added Successfully"
        );
        setVendorName("");
        setVendorNumber("");
        setShowVendorForm(false);
        setEditingVendor(null);
        // Refresh vendor list
        const updatedList = await axiosInstance.get(
          `${BASE_URL}/showAllvendor`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVendorList(updatedList.data);
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
      alert("Error saving vendor");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVendor(id) {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setLoading(true);
      try {
        await axiosInstance.delete(`${BASE_URL}/vendors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setVendorList(vendorList.filter((vendor) => vendor.id !== id));
        alert("Vendor Deleted Successfully");
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Error deleting vendor");
      } finally {
        setLoading(false);
      }
    }
  }

  function handleEditVendor(vendor) {
    setEditingVendor(vendor);
    setVendorName(vendor.vendorName);
    setVendorNumber(vendor.phoneNo);
    setShowVendorForm(true);
  }

  return (
    <div className="vendor-container">
      <h2 className="vendor-title">Vendor Management</h2>

      <div className="vendor-controls">
        <input
          type="search"
          placeholder="Search vendors..."
          className="vendor-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => {
            setShowVendorForm(true);
            setEditingVendor(null);
            setVendorName("");
            setVendorNumber("");
          }}
          className="vendor-add-button"
          disabled={loading}
        >
          Add Vendor
        </button>
      </div>

      {showVendorForm && (
        <div className="vendor-form-popup">
          <div className="vendor-form-container">
            <h3 className="vendor-form-title">
              {editingVendor ? "Edit Vendor" : "Add Vendor"}
            </h3>
            <form onSubmit={handleAddVendor} className="vendor-form">
              <input
                type="text"
                placeholder="Enter Vendor Name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="vendor-name-input"
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Enter Vendor Number"
                value={vendorNumber}
                onChange={(e) => setVendorNumber(e.target.value)}
                className="vendor-number-input"
                required
                disabled={loading}
              />
              <div className="vendor-form-buttons">
                <button
                  type="submit"
                  className="vendor-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="vendor-loading-spinner"></span>
                  ) : editingVendor ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVendorForm(false);
                    setEditingVendor(null);
                    setVendorName("");
                    setVendorNumber("");
                  }}
                  className="vendor-cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="vendor-table-container">
        {loading ? (
          <div className="vendor-loading-container">
            <span className="vendor-loading-spinner"></span>
            <p>Loading...</p>
          </div>
        ) : filteredVendorList.length > 0 ? (
          <table className="vendor-table">
            <thead>
              <tr className="vendor-table-header">
                <th className="vendor-table-th">Vendor Name</th>
                <th className="vendor-table-th">Phone Number</th>
                <th className="vendor-table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendorList.map((vendor) => (
                <tr key={vendor._id} className="vendor-table-row">
                  <td className="vendor-table-td">{vendor.vendorName}</td>
                  <td className="vendor-table-td">{vendor.phoneNo}</td>
                  <td className="vendor-table-td">
                    <button
                      onClick={() => handleEditVendor(vendor)}
                      className="vendor-edit-button"
                      disabled={loading}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="vendor-delete-button"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="vendor-no-data">No Vendors Found</p>
        )}
      </div>
    </div>
  );
}

export default Vendor;
