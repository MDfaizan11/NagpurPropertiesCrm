import { useState, useEffect } from "react";
import "./Maintainance.css";
import axiosInstance from "../../utils/axiosInstance.js";
import { BASE_URL } from "../../config.js";
import { Edit, Trash } from "lucide-react";

function Maintainance() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [ShowAddMaintainanceForm, setShowAddMaintainanceForm] = useState(false);

  // states
  const [machines, setMachines] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [id, setId] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [cost, setCost] = useState("");
  const [technicianName, setTechnicianName] = useState("");

  // fetch all machines
  useEffect(() => {
    if (ShowAddMaintainanceForm) {
      const fetchMachines = async () => {
        try {
          const res = await axiosInstance.get(
            `${BASE_URL}/machines/singleMechine`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (Array.isArray(res.data)) setMachines(res.data);
          else setMachines([res.data]);
        } catch (err) {
          console.error("Error fetching machines:", err);
        }
      };
      fetchMachines();
    }
  }, [ShowAddMaintainanceForm, token]);

  // fetch all maintenance
  const fetchMaintenances = async () => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaintenances(res.data);
    } catch (err) {
      console.error("Error fetching maintenance:", err);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  // handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      machineName,
      serviceType,
      description,
      scheduledDate,
      cost,
      technicianName,
    };

    try {
      if (id) {
        await axiosInstance.put(`${BASE_URL}/maintenance/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Maintenance record updated successfully!");
      } else {
        await axiosInstance.post(`${BASE_URL}/maintenance`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Maintenance record added successfully!");
      }

      resetForm();
      fetchMaintenances();
    } catch (err) {
      console.error("Error saving maintenance record:", err);
      alert("Failed to save record");
    }
  };

  // delete maintenance
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axiosInstance.delete(`${BASE_URL}/maintenance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Record deleted successfully!");
      fetchMaintenances();
    } catch (err) {
      console.error("Error deleting maintenance:", err);
    }
  };

  // edit maintenance
  const handleEdit = (record) => {
    setId(record.id);
    setMachineName(record.machineName);
    setServiceType(record.serviceType);
    setDescription(record.description);
    setScheduledDate(record.scheduledDate);
    setCost(record.cost);
    setTechnicianName(record.technicianName);
    setShowAddMaintainanceForm(true);
  };

  // reset form
  const resetForm = () => {
    setId(null);
    setMachineName("");
    setServiceType("");
    setDescription("");
    setScheduledDate("");
    setCost("");
    setTechnicianName("");
    setShowAddMaintainanceForm(false);
  };

  // filter records by search term
  const filteredMaintenances = maintenances.filter((m) =>
    m.machineName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="MaintainanceContainer">
      <div className="MaintainanceHeader">
        <h1 className="MaintainanceTitle">Maintenance Management</h1>
      </div>

      <div className="MaintainanceControls">
        <div className="MaintainanceSearchWrapper">
          <input
            type="search"
            className="MaintainanceSearchInput"
            placeholder=" Search by Machine Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="MaintainanceAddButton"
          onClick={() => setShowAddMaintainanceForm(true)}
        >
          <span className="MaintainanceButtonIcon">+</span>
          Add Maintenance
        </button>
      </div>

      {ShowAddMaintainanceForm && (
        <div className="MaintainanceFormOverlay">
          <div className="MaintainanceFormContainer">
            <div className="MaintainanceFormHeader">
              <h2 className="MaintainanceFormTitle">
                {id
                  ? "Update Maintenance Record"
                  : "Add New Maintenance Record"}
              </h2>
              <button
                className="MaintainanceCloseButton"
                onClick={resetForm}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="MaintainanceForm" onSubmit={handleSubmit}>
              <div className="MaintainanceFormGrid">
                <div className="MaintainanceFormGroup">
                  <label className="MaintainanceLabel">Select Machine</label>
                  <select
                    className="MaintainanceSelect"
                    value={machineName}
                    onChange={(e) => setMachineName(e.target.value)}
                    required
                  >
                    <option value="">-- Select Machine --</option>
                    {machines.map((m, index) => (
                      <option key={index} value={m.machineName}>
                        {m.machineName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="MaintainanceFormGroup">
                  <label className="MaintainanceLabel">Service Type</label>
                  <input
                    type="text"
                    className="MaintainanceInput"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder="e.g., Preventive, Corrective, Emergency"
                    required
                  />
                </div>

                <div className="MaintainanceFormGroup">
                  <label className="MaintainanceLabel">Scheduled Date</label>
                  <input
                    type="date"
                    className="MaintainanceInput"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div className="MaintainanceFormGroup">
                  <label className="MaintainanceLabel">Cost ($)</label>
                  <input
                    type="number"
                    // step="0.01"
                    min={0}
                    className="MaintainanceInput"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="MaintainanceFormGroup">
                  <label className="MaintainanceLabel">Technician Name</label>
                  <input
                    type="text"
                    className="MaintainanceInput"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    placeholder="Enter technician name"
                    required
                  />
                </div>

                <div className="MaintainanceFormGroup MaintainanceFormGroupFull">
                  <label className="MaintainanceLabel">Description</label>
                  <textarea
                    className="MaintainanceTextarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the maintenance work to be performed..."
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="MaintainanceFormActions">
                <button type="submit" className="MaintainanceSaveButton">
                  <span className="MaintainanceButtonIcon">
                    {/* {id ? "✓" : "💾"} */}
                  </span>
                  {id ? "Update Record" : "Save Record"}
                </button>
                <button
                  type="button"
                  className="MaintainanceCancelButton"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="MaintainanceTableContainer">
        {/* <div className="MaintainanceTableHeader">
          <h3 className="MaintainanceTableTitle">Maintenance Records</h3>
        </div> */}

        <div className="MaintainanceTableWrapper">
          <table className="MaintainanceTable">
            <thead className="MaintainanceTableHead">
              <tr className="MaintainanceTableRow">
                <th className="MaintainanceTableHeader">sr.no</th>
                <th className="MaintainanceTableHeader">Machine</th>
                <th className="MaintainanceTableHeader">Service Type</th>
                <th className="MaintainanceTableHeader">Description</th>
                <th className="MaintainanceTableHeader">Date</th>
                <th className="MaintainanceTableHeader">Cost</th>
                <th className="MaintainanceTableHeader">Technician</th>
                <th className="MaintainanceTableHeader">Actions</th>
              </tr>
            </thead>
            <tbody className="MaintainanceTableBody">
              {filteredMaintenances.map((m, index) => (
                <tr key={m.id} className="MaintainanceTableRow">
                  <td className="MaintainanceTableCell MaintainanceTableCellIndex">
                    {index + 1}
                  </td>
                  <td className="MaintainanceTableCell MaintainanceTableCellMachine">
                    {m.machineName}
                  </td>
                  <td className="MaintainanceTableCell">
                    <span className="MaintainanceServiceBadge">
                      {m.serviceType}
                    </span>
                  </td>
                  <td className="MaintainanceTableCell MaintainanceTableCellDescription">
                    {m.description}
                  </td>
                  <td className="MaintainanceTableCell MaintainanceTableCellDate">
                    {new Date(m.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="MaintainanceTableCell MaintainanceTableCellCost">
                    {Number.parseFloat(m.cost).toFixed(2)}
                  </td>
                  <td className="MaintainanceTableCell">{m.technicianName}</td>
                  <td className="MaintainanceTableCell MaintainanceTableCellActions">
                    <button
                      className="MaintainanceEditButton"
                      onClick={() => handleEdit(m)}
                      title="Edit Record"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="MaintainanceDeleteButton"
                      onClick={() => handleDelete(m.id)}
                      title="Delete Record"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMaintenances.length === 0 && (
                <tr className="MaintainanceTableRow">
                  <td
                    colSpan="8"
                    className="MaintainanceTableCell MaintainanceTableCellEmpty"
                  >
                    <div className="MaintainanceEmptyState">
                      <span className="MaintainanceEmptyIcon">📋</span>
                      <p>No maintenance records found</p>
                      {searchTerm && (
                        <p className="MaintainanceEmptySubtext">
                          Try adjusting your search criteria
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Maintainance;
