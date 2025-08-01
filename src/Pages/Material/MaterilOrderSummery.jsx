import "./MaterilOrderSummery.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { Pencil, Trash2, X } from "lucide-react";

function MaterialOrderSummary() {
  const { token } = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const { id, name } = useParams();
  const [materialOrderSummary, setMaterialOrderSummary] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [deliveredQty, setDeliveredQty] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function getAllMaterialOrderSummary() {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/deliveries/order-item/${id}/logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setMaterialOrderSummary(response.data);
      } catch (error) {
        console.error("Error fetching material order summary:", error);
      }
    }
    getAllMaterialOrderSummary();
  }, [id, token]);

  // Function to format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime()))
      return "Invalid Date";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");
  };

  // Function to format time to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return "Invalid Time";
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      if (isNaN(date.getTime())) return "Invalid Time";
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Time";
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    console.log(item);
    // setEditItem({
    //   id: item.id,
    //   deliveredQty: item.deliveredQty || "",
    //   vehicleNo: item.vehicleNo || "",
    // });
    setEditId(item.id);
    setVehicleNumber(item.vehicleNo || "");
    setDeliveredQty(item.deliveredQty || "");
    setIsEditModalOpen(true);
  };

  // Handle form input changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      deliveredQty: deliveredQty,
      vehicleNo: vehicleNumber,
    };
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/deliveries/delivery-log/delivery-log/${editId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setMaterialOrderSummary((prev) =>
          prev.map((item) =>
            item.id === editId
              ? { ...item, deliveredQty, vehicleNo: vehicleNumber }
              : item
          )
        );
        alert("Item updated successfully");
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle delete button click
  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/deliveries/delivery-log/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setMaterialOrderSummary((prev) =>
          prev.filter((item) => item.id !== itemId)
        );
        alert("Item deleted successfully");
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
    }
  };

  // Close modal
  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditId(null);
    setVehicleNumber("");
    setDeliveredQty("");
    setFormErrors({});
  };

  return (
    <div className="MaterialOrderSummary-container">
      <h1 className="MaterialOrderSummary-title">Order Summary for {name}</h1>
      {materialOrderSummary.length === 0 ? (
        <p className="MaterialOrderSummary-no-data">No summary found</p>
      ) : (
        <table className="MaterialOrderSummary-table">
          <thead>
            <tr>
              <th className="MaterialOrderSummary-table-header">Date</th>
              <th className="MaterialOrderSummary-table-header">Time</th>
              <th className="MaterialOrderSummary-table-header">Quantity</th>
              <th className="MaterialOrderSummary-table-header">Vehicle No</th>
              <th className="MaterialOrderSummary-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materialOrderSummary.map((item) => (
              <tr key={item.id} className="MaterialOrderSummary-table-row">
                <td className="MaterialOrderSummary-table-cell">
                  {formatDate(item.deliveredDate)}
                </td>
                <td className="MaterialOrderSummary-table-cell">
                  {formatTime(item.deliveredTime)}
                </td>
                <td className="MaterialOrderSummary-table-cell">
                  {item.deliveredQty}
                </td>
                <td className="MaterialOrderSummary-table-cell">
                  {item.vehicleNo}
                </td>
                <td className="MaterialOrderSummary-table-cell MaterialOrderSummary-actions">
                  <button
                    className="MaterialOrderSummary-action-button MaterialOrderSummary-edit-button"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="MaterialOrderSummary-action-button MaterialOrderSummary-delete-button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditModalOpen && (
        <div className="MaterialOrderSummary-modal-overlay">
          <div className="MaterialOrderSummary-modal">
            <div className="MaterialOrderSummary-modal-header">
              <h2 className="MaterialOrderSummary-modal-title">
                Edit Delivery Log
              </h2>
              <button
                className="MaterialOrderSummary-action-button MaterialOrderSummary-close-button"
                onClick={closeModal}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="MaterialOrderSummary-form">
              <div className="MaterialOrderSummary-form-group">
                <label
                  className="MaterialOrderSummary-form-label"
                  htmlFor="deliveredQty"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="deliveredQty"
                  name="deliveredQty"
                  value={deliveredQty}
                  onChange={(e) => setDeliveredQty(e.target.value)}
                  className="MaterialOrderSummary-form-input"
                  min="1"
                  required
                />
                {formErrors.deliveredQty && (
                  <span className="MaterialOrderSummary-form-error">
                    {formErrors.deliveredQty}
                  </span>
                )}
              </div>
              <div className="MaterialOrderSummary-form-group">
                <label
                  className="MaterialOrderSummary-form-label"
                  htmlFor="vehicleNo"
                >
                  Vehicle Number
                </label>
                <input
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="MaterialOrderSummary-form-input"
                  required
                />
                {formErrors.vehicleNo && (
                  <span className="MaterialOrderSummary-form-error">
                    {formErrors.vehicleNo}
                  </span>
                )}
              </div>
              <div className="MaterialOrderSummary-form-actions">
                <button
                  type="button"
                  className="MaterialOrderSummary-action-button MaterialOrderSummary-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="MaterialOrderSummary-action-button MaterialOrderSummary-submit-button"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialOrderSummary;
