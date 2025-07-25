import "./MaterilOrderSummery.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import { Pencil, Trash2 } from "lucide-react";

function MaterialOrderSummary() {
  const { token } = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const { id, name } = useParams();
  const [materialOrderSummary, setMaterialOrderSummary] = useState([]);

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
        setMaterialOrderSummary(response.data);
      } catch (error) {
        console.error("Error fetching material order summary:", error);
      }
    }
    getAllMaterialOrderSummary();
  }, [id]);

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
  const handleEdit = (itemId) => {
    console.log(`Edit item with ID: ${itemId}`);
    // Add your edit logic here (e.g., open a modal or navigate to an edit page)
  };

  // Handle delete button click
  const handleDelete = (itemId) => {
    console.log(`Delete item with ID: ${itemId}`);
    // Add your delete logic here (e.g., API call to delete the item)
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
                    onClick={() => handleEdit(item.id)}
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
    </div>
  );
}

export default MaterialOrderSummary;
