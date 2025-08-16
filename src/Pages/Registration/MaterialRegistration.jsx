import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";
import axiosInstance from "../../utils/axiosInstance";
import "./MaterialRegistration.css";

function MaterialRegistration() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [materialName, setMaterialName] = useState("");
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all materials
  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${BASE_URL}/materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch materials");
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // Add or update material
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!materialName.trim()) {
      alert("Please enter a material name.");
      return;
    }
    const body = { materialName };
    try {
      setLoading(true);
      const url = editingMaterial
        ? `${BASE_URL}/materials/${editingMaterial.id}`
        : `${BASE_URL}/materials`;
      const response = await axiosInstance[editingMaterial ? "put" : "post"](
        url,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert(
          editingMaterial
            ? "Material updated successfully!"
            : "Material added successfully!"
        );
        setMaterialName("");
        setShowMaterialForm(false);
        setEditingMaterial(null);
        fetchMaterials();
      }
    } catch (error) {
      console.error(
        `Error ${editingMaterial ? "updating" : "adding"} material:`,
        error
      );
      alert(`Failed to ${editingMaterial ? "update" : "add"} material.`);
    } finally {
      setLoading(false);
    }
  };

  // Delete material
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    try {
      setLoading(true);
      await axiosInstance.delete(`${BASE_URL}/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Material deleted successfully!");
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      alert("Failed to delete material.");
    } finally {
      setLoading(false);
    }
  };

  // Edit material
  const handleEdit = (material) => {
    setMaterialName(material.materialName);
    setEditingMaterial(material);
    setShowMaterialForm(true);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filter materials based on search query
  const filteredMaterials = materials.filter((mat) =>
    mat.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <h2 className="MaterialRegistration-title">Material Registration</h2>
      <div className="MaterialRegistration-controls">
        <input
          type="search"
          placeholder="Search materials..."
          className="MaterialRegistration-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="MaterialRegistration-add-btn"
          onClick={() => {
            setMaterialName("");
            setEditingMaterial(null);
            setShowMaterialForm(true);
          }}
        >
          Add Material
        </button>
      </div>

      {/* Table */}
      <div className="MaterialRegistration-table-container">
        <table className="MaterialRegistration-table">
          <thead>
            <tr>
              <th>Sr.no</th>
              <th>Material Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((mat, index) => (
                <tr key={mat.id || index}>
                  <td>{index + 1}</td>
                  <td>{mat.materialName}</td>
                  <td>
                    <button
                      className="MaterialRegistration-edit-btn"
                      onClick={() => handleEdit(mat)}
                    >
                      Edit
                    </button>
                    <button
                      className="MaterialRegistration-delete-btn"
                      onClick={() => handleDelete(mat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="MaterialRegistration-no-data">
                  No materials found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Overlay Form */}
      {showMaterialForm && (
        <div className="MaterialRegistration-overlay">
          <div className="MaterialRegistration-form-container">
            <button
              className="MaterialRegistration-close-btn"
              onClick={() => setShowMaterialForm(false)}
            >
              &times;
            </button>
            <h3 className="MaterialRegistration-form-title">
              {editingMaterial ? "Edit Material" : "Add Material"}
            </h3>
            <form onSubmit={handleSubmit} className="MaterialRegistration-form">
              <input
                type="text"
                placeholder="Enter Material Name"
                className="MaterialRegistration-input"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
              />
              <button
                type="submit"
                className="MaterialRegistration-submit-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : editingMaterial ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MaterialRegistration;
