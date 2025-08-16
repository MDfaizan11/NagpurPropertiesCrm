"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Calendar,
  MapPin,
  User,
  Wrench,
  Factory,
  Hash,
  DollarSign,
  Fuel,
  FileText,
  Settings,
  TrendingUp,
  Filter,
  Download,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { BASE_URL } from "../../config.js";
import "./machine.css";

function Machine() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [showAddMachineForm, setShowAddMachineForm] = useState(false);
  const [machines, setMachines] = useState([]);
  const [editId, setEditId] = useState(null);
  const [viewMachine, setViewMachine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [machineName, setMachineName] = useState("");
  const [mechinetype, setMechinetype] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [manufactureringYear, setManufactureringYear] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [fuleCapacity, setFuleCapacity] = useState("");
  const [description, setDescription] = useState("");

  // Fetch all machines
  const fetchMachines = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${BASE_URL}/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMachines(res.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // Reset form
  const resetForm = () => {
    setMachineName("");
    setMechinetype("");
    setManufacturer("");
    setModel("");
    setManufactureringYear("");
    setSerialNumber("");
    setPurchaseDate("");
    setPurchasePrice("");
    setCurrentLocation("");
    setOperatorName("");
    setFuleCapacity("");
    setDescription("");
    setEditId(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const machineData = {
      machineName,
      mechinetype,
      manufacturer,
      model,
      manufactureringYear,
      serialNumber,
      purchaseDate,
      purchasePrice: Number.parseFloat(purchasePrice),
      currentLocation,
      operatorName,
      fuleCapacity,
      description,
    };

    try {
      if (editId) {
        await axiosInstance.put(`${BASE_URL}/machines/${editId}`, machineData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Machine updated successfully!");
      } else {
        await axiosInstance.post(`${BASE_URL}/machines`, machineData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Machine added successfully!");
      }
      setShowAddMachineForm(false);
      resetForm();
      fetchMachines();
    } catch (error) {
      console.error("Error saving machine:", error);
      alert("Error saving machine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit machine
  const handleEditClick = (machine) => {
    setEditId(machine.id);
    setMachineName(machine.machineName);
    setMechinetype(machine.mechinetype);
    setManufacturer(machine.manufacturer);
    setModel(machine.model);
    setManufactureringYear(machine.manufactureringYear);
    setSerialNumber(machine.serialNumber);
    setPurchaseDate(machine.purchaseDate?.split("T")[0] || "");
    setPurchasePrice(machine.purchasePrice);
    setCurrentLocation(machine.currentLocation);
    setOperatorName(machine.operatorName);
    setFuleCapacity(machine.fuleCapacity);
    setDescription(machine.description);
    setShowAddMachineForm(true);
  };

  // Delete machine
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this machine?")) {
      setLoading(true);
      try {
        await axiosInstance.delete(`${BASE_URL}/machines/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMachines();
      } catch (error) {
        console.error("Error deleting machine:", error);
        alert("Error deleting machine. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // View machine
  const handleViewClick = (machine) => {
    setViewMachine(machine);
  };

  // Filter machines based on search
  const filteredMachines = machines.filter(
    (machine) =>
      machine.machineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.mechinetype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="MachineContainer">
      {/* <div className="MachineHeader">
        <div className="MachineHeaderContainer">
          <div className="MachineHeaderContent">
            <div className="MachineTitleSection">
              <div className="MachineTitleIcon">
                <Settings />
              </div>
              <div>
                <h1 className="MachineTitle">
                  Optimize Your Machine Performance
                </h1>
                <p className="MachineSubtitle">
                  Real-time insights for informed decision-making
                </p>
              </div>
            </div>

            <div className="MachineStatsCard">
              <div className="MachineStatsContent">
                <TrendingUp />
                <div>
                  <p className="MachineStatsText">Total Machines</p>
                  <p className="MachineStatsNumber">{machines.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="MachineMainContent">
        {/* Action Bar */}
        <div className="MachineActionBar">
          <div className="MachineActionBarContent">
            {/* Search */}
            <div className="MachineSearchContainer">
              <Search className="MachineSearchIcon" />
              <input
                type="text"
                placeholder="Search machines by name, type, or manufacturer..."
                className="MachineSearchInput"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="MachineActionButtons">
              <button className="MachineButton MachineButtonSecondary">
                <Filter />
                Filter
              </button>
              <button className="MachineButton MachineButtonSecondary">
                <Download />
                Export
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddMachineForm(true);
                }}
                className="MachineButton MachineButtonPrimary"
              >
                <Plus />
                Add Machine
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="MachineLoading">
            <div className="MachineLoadingContent">
              <div className="MachineSpinner"></div>
              <p className="MachineLoadingText">Loading machines...</p>
            </div>
          </div>
        )}

        {/* Machine Table - Desktop */}
        <div className="MachineTableContainer">
          <table className="MachineTable">
            <thead className="MachineTableHeader">
              <tr>
                <th className="MachineTableHeaderCell">Machine Details</th>
                <th className="MachineTableHeaderCell">Specifications</th>
                <th className="MachineTableHeaderCell">Purchase Info</th>
                <th className="MachineTableHeaderCell">Location</th>
                <th className="MachineTableHeaderCell">Actions</th>
              </tr>
            </thead>
            <tbody className="MachineTableBody">
              {filteredMachines.map((machine) => (
                <tr key={machine.id} className="MachineTableRow">
                  <td className="MachineTableCell">
                    <div className="MachineCellContent">
                      <div className="MachineCellIcon">
                        <Wrench />
                      </div>
                      <div>
                        <p className="MachineCellTitle">
                          {machine.machineName}
                        </p>
                        <p className="MachineCellSubtitle">
                          {machine.mechinetype}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="MachineTableCell">
                    <div>
                      <p className="MachineCellTitle">{machine.manufacturer}</p>
                      <p className="MachineCellSubtitle">
                        Model: {machine.model}
                      </p>
                    </div>
                  </td>
                  <td className="MachineTableCell">
                    <div>
                      <p className="MachineCellTitle">
                        ${machine.purchasePrice?.toLocaleString()}
                      </p>
                      <p className="MachineCellSubtitle">
                        {machine.purchaseDate}
                      </p>
                    </div>
                  </td>
                  <td className="MachineTableCell">
                    <div className="MachineLocationContent">
                      <MapPin className="MachineLocationIcon" />
                      <span className="MachineLocationText">
                        {machine.currentLocation}
                      </span>
                    </div>
                  </td>
                  <td className="MachineTableCell">
                    <div className="MachineActionCell">
                      <button
                        onClick={() => handleViewClick(machine)}
                        className="MachineActionButton MachineActionButtonView"
                      >
                        <Eye style={{ height: "18px" }} />
                      </button>
                      <button
                        onClick={() => handleEditClick(machine)}
                        className="MachineActionButton MachineActionButtonEdit"
                      >
                        <Edit style={{ height: "18px" }} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(machine.id)}
                        className="MachineActionButton MachineActionButtonDelete"
                      >
                        <Trash2 style={{ height: "18px" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Machine Cards - Mobile */}
        <div className="MachineMobileContainer">
          {filteredMachines.map((machine) => (
            <div key={machine.id} className="MachineMobileCard">
              <div className="MachineMobileCardHeader">
                <div className="MachineMobileCardTitle">
                  <div className="MachineCellIcon">
                    <Wrench />
                  </div>
                  <div>
                    <h3 className="MachineCellTitle">{machine.machineName}</h3>
                    <p className="MachineCellSubtitle">{machine.mechinetype}</p>
                  </div>
                </div>
                <div className="MachineMobileCardActions">
                  <button
                    onClick={() => handleViewClick(machine)}
                    className="MachineActionButton MachineActionButtonView"
                  >
                    <Eye />
                  </button>
                  <button
                    onClick={() => handleEditClick(machine)}
                    className="MachineActionButton MachineActionButtonEdit"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(machine.id)}
                    className="MachineActionButton MachineActionButtonDelete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              <div className="MachineMobileCardGrid">
                <div className="MachineMobileCardField">
                  <p className="MachineMobileCardLabel">Manufacturer</p>
                  <p className="MachineMobileCardValue">
                    {machine.manufacturer}
                  </p>
                </div>
                <div className="MachineMobileCardField">
                  <p className="MachineMobileCardLabel">Model</p>
                  <p className="MachineMobileCardValue">{machine.model}</p>
                </div>
                <div className="MachineMobileCardField">
                  <p className="MachineMobileCardLabel">Purchase Price</p>
                  <p className="MachineMobileCardValue">
                    ${machine.purchasePrice?.toLocaleString()}
                  </p>
                </div>
                <div className="MachineMobileCardField">
                  <p className="MachineMobileCardLabel">Location</p>
                  <p className="MachineMobileCardValue">
                    {machine.currentLocation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredMachines.length === 0 && (
          <div className="MachineEmptyState">
            <div className="MachineEmptyIcon">
              <Settings />
            </div>
            <h3 className="MachineEmptyTitle">No machines found</h3>
            <p className="MachineEmptyDescription">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first machine"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowAddMachineForm(true);
                }}
                className="MachineButton MachineButtonPrimary"
              >
                <Plus />
                Add Your First Machine
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddMachineForm && (
        <div className="MachineModalOverlay">
          <div className="MachineModal">
            <div className="MachineModalHeader">
              <div className="MachineModalHeaderContent">
                <h2 className="MachineModalTitle">
                  {editId ? "Update Machine" : "Add New Machine"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddMachineForm(false);
                    resetForm();
                  }}
                  className="MachineModalClose"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="MachineModalContent">
              <form onSubmit={handleSubmit} className="MachineForm">
                <div className="MachineFormGrid">
                  {/* Machine Name */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Wrench />
                      Machine Name
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={machineName}
                      onChange={(e) => setMachineName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Machine Type */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Factory />
                      Machine Type
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={mechinetype}
                      onChange={(e) => setMechinetype(e.target.value)}
                      required
                    />
                  </div>

                  {/* Manufacturer */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Factory />
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      required
                    />
                  </div>

                  {/* Model */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Hash />
                      Model
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>

                  {/* Manufacturing Year */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Calendar />
                      Manufacturing Year
                    </label>
                    <input
                      type="number"
                      className="MachineFormInput"
                      value={manufactureringYear}
                      onChange={(e) => setManufactureringYear(e.target.value)}
                      required
                    />
                  </div>

                  {/* Serial Number */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Hash />
                      Serial Number
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      required
                    />
                  </div>

                  {/* Purchase Date */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Calendar />
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      className="MachineFormInput"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Purchase Price */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <DollarSign />
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      className="MachineFormInput"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      required
                    />
                  </div>

                  {/* Current Location */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <MapPin />
                      Current Location
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      required
                    />
                  </div>

                  {/* Operator Name */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <User />
                      Operator Name
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Fuel Capacity */}
                  <div className="MachineFormField">
                    <label className="MachineFormLabel">
                      <Fuel />
                      Fuel Capacity
                    </label>
                    <input
                      type="text"
                      className="MachineFormInput"
                      value={fuleCapacity}
                      onChange={(e) => setFuleCapacity(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="MachineFormField MachineFormFieldFull">
                    <label className="MachineFormLabel">
                      <FileText />
                      Description
                    </label>
                    <textarea
                      className="MachineFormTextarea"
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="MachineFormActions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMachineForm(false);
                      resetForm();
                    }}
                    className="MachineFormCancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="MachineFormSubmit"
                  >
                    <Save />
                    {editId ? "Update Machine" : "Save Machine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Machine Modal */}
      {viewMachine && (
        <div className="MachineModalOverlay">
          <div className="MachineModal">
            <div className="MachineModalHeader">
              <div className="MachineModalHeaderContent">
                <div className="MachineViewHeader">
                  <div className="MachineViewIcon">
                    <Wrench />
                  </div>
                  <h2 className="MachineModalTitle">
                    {viewMachine.machineName}
                  </h2>
                </div>
                <button
                  onClick={() => setViewMachine(null)}
                  className="MachineModalClose"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="MachineModalContent">
              <div className="MachineViewGrid">
                {/* Machine Details */}
                <div className="MachineViewSection MachineViewSectionGreen">
                  <div className="MachineViewSectionHeader">
                    <Factory />
                    <h3 className="MachineViewSectionTitle">Machine Details</h3>
                  </div>
                  <div className="MachineViewSectionContent">
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Type</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.mechinetype}
                      </p>
                    </div>
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Manufacturer</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.manufacturer}
                      </p>
                    </div>
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Model</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.model}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="MachineViewSection MachineViewSectionBlue">
                  <div className="MachineViewSectionHeader">
                    <Hash />
                    <h3 className="MachineViewSectionTitle">Specifications</h3>
                  </div>
                  <div className="MachineViewSectionContent">
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">
                        Manufacturing Year
                      </p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.manufactureringYear}
                      </p>
                    </div>
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Serial Number</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.serialNumber}
                      </p>
                    </div>
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Fuel Capacity</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.fuleCapacity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="MachineViewSection MachineViewSectionAmber">
                  <div className="MachineViewSectionHeader">
                    <DollarSign />
                    <h3 className="MachineViewSectionTitle">
                      Purchase Information
                    </h3>
                  </div>
                  <div className="MachineViewSectionContent">
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Purchase Date</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.purchaseDate}
                      </p>
                    </div>
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Purchase Price</p>
                      <p className="MachineViewFieldValue">
                        ${viewMachine.purchasePrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="MachineViewSection MachineViewSectionPurple">
                  <div className="MachineViewSectionHeader">
                    <MapPin />
                    <h3 className="MachineViewSectionTitle">
                      Location & Operation
                    </h3>
                  </div>
                  <div className="MachineViewSectionContent">
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Current Location</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.currentLocation}
                      </p>
                    </div>
                    <div className="MachineViewField">
                      <p className="MachineViewFieldLabel">Operator Name</p>
                      <p className="MachineViewFieldValue">
                        {viewMachine.operatorName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="MachineViewSection MachineViewSectionGray MachineFormFieldFull">
                  <div className="MachineViewSectionHeader">
                    <FileText />
                    <h3 className="MachineViewSectionTitle">Description</h3>
                  </div>
                  <p className="MachineViewDescription">
                    {viewMachine.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Machine;
