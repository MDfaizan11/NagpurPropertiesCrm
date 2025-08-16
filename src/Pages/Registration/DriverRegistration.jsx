import { useState, useEffect } from "react";
import "./DriverRegistration.css";
import axiosInstance from "../../utils/axiosInstance.js";
import { BASE_URL } from "../../config.js";
import { Lock, Unlock, Plus } from "lucide-react";

function DriverRegistration() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [showForm, setShowForm] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // fetch all drivers
  const fetchDrivers = async () => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/Driver/show-All`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(res.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // handle form submit (add driver)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, email, password };

    try {
      await axiosInstance.post(`${BASE_URL}/Driver/registerDriver`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Driver registered successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      fetchDrivers();
    } catch (err) {
      console.error("Error registering driver:", err);
      alert("Failed to register driver");
    }
  };

  // toggle driver status (BLOCK <-> ACTIVE)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "BLOCK" ? "ACTIVE" : "BLOCK";
    try {
      await axiosInstance.put(
        `${BASE_URL}/Driver/${id}/status?status=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(
        `Driver is now ${newStatus === "ACTIVE" ? "Unblocked" : "Blocked"}`
      );
      fetchDrivers();
    } catch (err) {
      console.error("Error changing status:", err);
      alert("Failed to update status");
    }
  };

  // filter drivers by search term
  const filteredDrivers = drivers.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="DriverRegistrationContainer">
      <div className="DriverRegistrationHeader">
        <h1 className="DriverRegistrationTitle">Driver Registration</h1>
      </div>

      <div className="DriverRegistrationControls">
        <div className="DriverRegistrationSearchWrapper">
          <input
            type="search"
            className="DriverRegistrationSearchInput"
            placeholder=" Search by Driver Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="DriverRegistrationAddButton"
          onClick={() => setShowForm(true)}
        >
          <span className="DriverRegistrationButtonIcon">
            <Plus size={18} />
          </span>
          Add Driver
        </button>
      </div>

      {showForm && (
        <div className="DriverRegistrationFormOverlay">
          <div className="DriverRegistrationFormContainer">
            <div className="DriverRegistrationFormHeader">
              <h2 className="DriverRegistrationFormTitle">
                Register New Driver
              </h2>
              <button
                className="DriverRegistrationCloseButton"
                onClick={() => setShowForm(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="DriverRegistrationForm" onSubmit={handleSubmit}>
              <div className="DriverRegistrationFormGrid">
                <div className="DriverRegistrationFormGroup">
                  <label className="DriverRegistrationLabel">Name</label>
                  <input
                    type="text"
                    className="DriverRegistrationInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter driver name"
                    required
                  />
                </div>

                <div className="DriverRegistrationFormGroup">
                  <label className="DriverRegistrationLabel">Email</label>
                  <input
                    type="email"
                    className="DriverRegistrationInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter driver email"
                    required
                  />
                </div>

                <div className="DriverRegistrationFormGroup">
                  <label className="DriverRegistrationLabel">Password</label>
                  <input
                    type="password"
                    className="DriverRegistrationInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="DriverRegistrationFormActions">
                <button type="submit" className="DriverRegistrationSaveButton">
                  Register Driver
                </button>
                <button
                  type="button"
                  className="DriverRegistrationCancelButton"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="DriverRegistrationTableContainer">
        <div className="DriverRegistrationTableWrapper">
          <table className="DriverRegistrationTable">
            <thead className="DriverRegistrationTableHead">
              <tr className="DriverRegistrationTableRow">
                <th className="DriverRegistrationTableHeader">ID</th>
                <th className="DriverRegistrationTableHeader">Name</th>
                <th className="DriverRegistrationTableHeader">Email</th>
                <th className="DriverRegistrationTableHeader">Status</th>
                <th className="DriverRegistrationTableHeader">Action</th>
              </tr>
            </thead>
            <tbody className="DriverRegistrationTableBody">
              {filteredDrivers.map((d, index) => (
                <tr key={d.id} className="DriverRegistrationTableRow">
                  <td className="DriverRegistrationTableCell DriverRegistrationTableCellIndex">
                    {index + 1}
                  </td>
                  <td className="DriverRegistrationTableCell DriverRegistrationTableCellName">
                    {d.name}
                  </td>
                  <td className="DriverRegistrationTableCell">{d.email}</td>
                  <td className="DriverRegistrationTableCell">
                    <span className="DriverRegistrationStatusBadge">
                      {d.driverStatus}
                    </span>
                  </td>
                  <td className="DriverRegistrationTableCell DriverRegistrationTableCellActions">
                    <button
                      className="DriverRegistrationStatusButton"
                      onClick={() => toggleStatus(d.id, d.driverStatus)}
                      title={
                        d.driverStatus === "BLOCK"
                          ? "Unblock Driver"
                          : "Block Driver"
                      }
                    >
                      {d.driverStatus === "BLOCK" ? (
                        <Unlock size={18} />
                      ) : (
                        <Lock size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDrivers.length === 0 && (
                <tr className="DriverRegistrationTableRow">
                  <td
                    colSpan="5"
                    className="DriverRegistrationTableCell DriverRegistrationTableCellEmpty"
                  >
                    <div className="DriverRegistrationEmptyState">
                      <span className="DriverRegistrationEmptyIcon">📋</span>
                      <p>No drivers found</p>
                      {searchTerm && (
                        <p className="DriverRegistrationEmptySubtext">
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

export default DriverRegistration;
