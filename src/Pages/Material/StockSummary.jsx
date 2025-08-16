import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
import "./StockSummary.css";

function StockSummary() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [activeTab, setActiveTab] = useState("Material Wise View");
  const [stockData, setStockData] = useState([]);
  const [materialWiseData, setMaterialWiseData] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const materialTableRef = useRef(null);
  const stockTableRef = useRef(null);
  const usedTableRef = useRef(null);
  const [showUsedStockForm, setShowUsedStockForm] = useState(false);
  const [materialName, setMaterialName] = useState([]);
  const [selectedMaterialName, setSelectedMaterialName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [usedFor, setUsedFor] = useState("");
  const [usedQuantity, setUsedQuantity] = useState("");
  const [allSiteName, setAllSiteName] = useState([]);
  const [usedData, setUsedData] = useState([]);
  const [usedSearchQuery, setUsedSearchQuery] = useState("");

  const [showUsedForm, setShowUsedForm] = useState(false);
  const [usedMaterialName, setUsedMaterialName] = useState("");
  const [UsedMaterialRemainingQuantity, setUsedMaterialRemainingQuantity] =
    useState("");

  const [usedQuantityNote, setUsedQuantityNote] = useState("");
  const [newusedQuantity, setNewUsedQuantity] = useState("");
  const [NewSiteName, setNewSiteName] = useState("");
  const [OldSiteName, SetOldSiteName] = useState("");
  // Fetch Stock Wise Data
  const getAllSiteData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${BASE_URL}/StockOverview`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setStockData(response.data || []);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Material Wise Data
  const getMaterialWise = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/Site-Vise-Over-View`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setMaterialWiseData(response.data || []);
    } catch (error) {
      console.error("Error fetching material wise data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Material Names
  const getAllMaterialName = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMaterialName(response.data || []);
    } catch (error) {
      console.error("Error fetching material names:", error);
    }
  };

  // Fetch All Project Names
  const getAllProjectName = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/show-AllProject`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setAllSiteName(response.data || []);
    } catch (error) {
      console.error("Error fetching project names:", error);
    }
  };

  async function getUsedSummary() {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/deliveries/used-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsedData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllSiteData();
    getMaterialWise();
    getAllMaterialName();
    getAllProjectName();
    getUsedSummary();
  }, [token]);

  // Extract unique site names
  const siteNames = Array.from(
    new Set(stockData.map((item) => item.siteName?.trim()).filter(Boolean))
  );

  // Filter stock data based on selected site
  const filteredSiteData = stockData.filter(
    (item) => item.siteName?.trim() === selectedSite
  );

  // Filter material wise data based on search query
  const filteredMaterialWiseData = materialWiseData.filter((materialItem) =>
    materialItem.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter used data based on search query
  const filteredUsedData = usedData.filter(
    (item) =>
      item.materialName.toLowerCase().includes(usedSearchQuery.toLowerCase()) ||
      item.siteName.toLowerCase().includes(usedSearchQuery.toLowerCase()) ||
      item.usedFor.toLowerCase().includes(usedSearchQuery.toLowerCase())
  );

  // Print function
  const handlePrint = (tableRef) => {
    if (tableRef.current) {
      const printContent = tableRef.current.innerHTML;
      const style = `
        <style>
          body {
            font-family: 'Inter', sans-serif;
            padding: 20px;
            color: #1a202c;
          }
          .stocksummary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .stocksummary-th, .stocksummary-td {
            border: 1px solid #e2e8f0;
            padding: 12px;
            text-align: left;
          }
          .stocksummary-th {
            background-color: #f1f5f9;
            font-weight: 600;
            color: #1a202c;
          }
          .stocksummary-tr:nth-child(even) {
            background-color: #f9fafb;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #1a202c;
          }
        </style>
      `;
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Stock Summary Report</title>
            ${style}
          </head>
          <body>
            <h2>Stock Summary Report</h2>
            <div>${printContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearUsedSearch = () => {
    setUsedSearchQuery("");
  };

  async function handleNewAddStock(e) {
    e.preventDefault();
    // Input validation
    if (!selectedMaterialName || !siteName || !usedFor || !usedQuantity) {
      alert("Please fill in all required fields.");
      return;
    }
    if (Number.parseFloat(usedQuantity) <= 0) {
      alert("Used quantity must be greater than zero.");
      return;
    }

    const body = {
      materialName: selectedMaterialName,
      siteName: siteName,
      usedFor: usedFor,
      usedQty: Number.parseFloat(usedQuantity),
    };

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/deliveries/use-stock`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Material added successfully!");
        setSelectedMaterialName("");
        setSiteName("");
        setUsedFor("");
        setUsedQuantity("");
        setShowUsedStockForm(false);
        // Refresh data
        getAllSiteData();
        getMaterialWise();
        getUsedSummary();
      }
    } catch (error) {
      console.error("Error adding used stock:", error);
      alert("Failed to add material. Please try again.");
    }
  }

  function handleAddUsedMaterial(item) {
    console.log(item);
    setShowUsedForm(true);
    setUsedMaterialName(item.materialName);
    setUsedMaterialRemainingQuantity(item.remainingQty);
    SetOldSiteName(item.siteName);
  }

  async function handleAddUsedStockData(e) {
    e.preventDefault();

    if (
      !usedMaterialName ||
      !OldSiteName ||
      !usedQuantityNote ||
      !newusedQuantity
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (Number.parseFloat(newusedQuantity) <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }
    if (UsedMaterialRemainingQuantity === 0) {
      alert("Insufficient Stock");
      return;
    }
    if (Number.parseFloat(newusedQuantity) > UsedMaterialRemainingQuantity) {
      alert("Insufficient stock. Please check remaining quantity.");
      return;
    }

    const body = {
      materialName: usedMaterialName, // make sure the state name matches exactly
      siteName: OldSiteName,
      usedFor: usedQuantityNote,
      usedQty: Number.parseFloat(newusedQuantity),
    };

    console.log("Submitting:", body);

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/deliveries/use-stock`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Used Stock Successfully");
        setShowUsedForm(false);
        // optionally reset fields
        setNewSiteName("");
        setNewUsedQuantity("");
        setUsedQuantityNote("");
      }
    } catch (error) {
      console.error("Error adding used stock:", error);
      alert("Failed to used stock. Please try again.");
    }
  }

  return (
    <div className="stocksummary-container">
      {/* Header */}
      <div className="stocksummary-header">
        <h1 className="stocksummary-title">Stock Management System</h1>
      </div>

      {/* Tabs */}
      <div className="stocksummary-tabs">
        <button
          className={`stocksummary-tab ${
            activeTab === "Material Wise View" ? "stocksummary-tab-active" : ""
          }`}
          onClick={() => setActiveTab("Material Wise View")}
        >
          Material View
        </button>
        <button
          className={`stocksummary-tab ${
            activeTab === "Stock Wise View" ? "stocksummary-tab-active" : ""
          }`}
          onClick={() => setActiveTab("Stock Wise View")}
        >
          Site View
        </button>
        <button
          className={`stocksummary-tab ${
            activeTab === "Used Material" ? "stocksummary-tab-active" : ""
          }`}
          onClick={() => setActiveTab("Used Material")}
        >
          Used Material
        </button>
      </div>

      {loading && (
        <div className="stocksummary-loading-container">
          <div className="stocksummary-loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {/* MATERIAL WISE VIEW */}
      {activeTab === "Material Wise View" && !loading && (
        <div className="stocksummary-section">
          <div className="stocksummary-top-controls">
            <div className="stocksummary-search-wrapper">
              <input
                type="search"
                className="stocksummary-search"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="stocksummary-clear-btn"
                  onClick={clearSearch}
                >
                  ×
                </button>
              )}
            </div>
            <button
              className="stocksummary-print-btn"
              onClick={() => handlePrint(materialTableRef)}
            >
              Print Report
            </button>
          </div>

          <div className="stocksummary-table-container" ref={materialTableRef}>
            <table className="stocksummary-table">
              <thead>
                <tr>
                  <th className="stocksummary-th">Material Name</th>
                  <th className="stocksummary-th">Total Order Qty</th>
                  <th className="stocksummary-th">Site Distribution</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterialWiseData.length > 0 ? (
                  filteredMaterialWiseData.map((materialItem, index) => (
                    <tr key={index} className="stocksummary-tr">
                      <td className="stocksummary-td stocksummary-material-name">
                        {/* <Layers /> */}
                        {materialItem.materialName}
                      </td>
                      <td className="stocksummary-td">
                        <span className="stocksummary-quantity-badge">
                          {materialItem.totalOrderQty}
                        </span>
                      </td>
                      <td className="stocksummary-td">
                        <div className="stocksummary-site-distribution">
                          {materialItem.siteDistribution?.map((site, idx) => (
                            <div key={idx} className="stocksummary-site-item">
                              <span className="stocksummary-site-name">
                                {site.siteName}:
                              </span>
                              <span className="stocksummary-site-quantity">
                                {site.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="stocksummary-no-data">
                      No materials found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STOCK WISE VIEW */}
      {activeTab === "Stock Wise View" && !loading && (
        <>
          <div className="stocksummary-section">
            <div className="stocksummary-top-controls">
              <div className="stocksummary-select-wrapper">
                <select
                  className="stocksummary-select"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  <option value="">Select a site</option>
                  {siteNames.map((site) => (
                    <option key={site} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
              </div>
              {selectedSite && (
                <button
                  className="stocksummary-print-btn"
                  onClick={() => handlePrint(stockTableRef)}
                >
                  Print Report
                </button>
              )}
            </div>

            {selectedSite ? (
              <div className="stocksummary-table-container" ref={stockTableRef}>
                <div className="stocksummary-site-title">
                  Site: {selectedSite}
                </div>
                <table className="stocksummary-table">
                  <thead>
                    <tr>
                      <th className="stocksummary-th">Material Name</th>
                      <th className="stocksummary-th">Total Order</th>
                      <th className="stocksummary-th">Order Received</th>
                      <th className="stocksummary-th">Transfer Received</th>
                      <th className="stocksummary-th">Total Received</th>
                      <th className="stocksummary-th">Used Qty</th>
                      <th className="stocksummary-th">Remaining</th>
                      <th className="stocksummary-th"> Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSiteData.length > 0 ? (
                      filteredSiteData.map((item) => (
                        <tr key={item.id} className="stocksummary-tr">
                          <td className="stocksummary-td stocksummary-material-name">
                            {item.materialName}
                          </td>
                          <td className="stocksummary-td">
                            <span className="stocksummary-quantity-badge">
                              {item.totalOrderQuantity}
                            </span>
                          </td>
                          <td className="stocksummary-td">
                            <span className="stocksummary-quantity-badge stocksummary-received">
                              {item.orderReceivedQty}
                            </span>
                          </td>
                          <td className="stocksummary-td">
                            <span className="stocksummary-quantity-badge stocksummary-transfer">
                              {item.transferReceivedQty}
                            </span>
                          </td>
                          <td className="stocksummary-td">
                            <span className="stocksummary-quantity-badge stocksummary-total">
                              {item.totalReceivedQty}
                            </span>
                          </td>
                          <td className="stocksummary-td">
                            <span className="stocksummary-quantity-badge stocksummary-used">
                              {item.usedQty}
                            </span>
                          </td>
                          <td className="stocksummary-td">
                            <span
                              className={`stocksummary-quantity-badge stocksummary-remaining ${
                                item.remainingQty < 10 ? "stocksummary-low" : ""
                              }`}
                            >
                              {item.remainingQty}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleAddUsedMaterial(item)}
                              className="Used_button"
                            >
                              Add Used
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="stocksummary-no-data">
                          No stock data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="stocksummary-empty-state">
                <p>Please select a site to view stock details</p>
              </div>
            )}
          </div>

          {showUsedForm && (
            <div className="stocksummary-overlay">
              <div className="stocksummary-popup">
                <form
                  className="stocksummary-form"
                  onSubmit={handleAddUsedStockData}
                >
                  <button
                    type="button"
                    className="stocksummary-close-btn"
                    onClick={() => setShowUsedForm(false)}
                  >
                    ×
                  </button>
                  <h2 className="stocksummary-title">Add Used Stock</h2>
                  <div className="stocksummary-field">
                    <label
                      className="stocksummary-label"
                      htmlFor="material-name"
                    >
                      Material Name
                    </label>
                    <input
                      id="material-name"
                      type="text"
                      className="stocksummary-input"
                      value={usedMaterialName}
                      readOnly
                    />
                  </div>
                  <div className="stocksummary-field">
                    <label className="stocksummary-label" htmlFor="site-name">
                      Site Name
                    </label>
                    {/* <select
                      id="site-name"
                      className="stocksummary-select"
                      value={NewSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                    >
                      <option value="">Select Site</option>
                      {allSiteName.length > 0 ? (
                        allSiteName.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Site Found</option>
                      )}
                    </select> */}
                    <input
                      type="text"
                      value={OldSiteName}
                      className="stocksummary-input"
                    />
                  </div>
                  <div className="stocksummary-field">
                    <label
                      className="stocksummary-label"
                      htmlFor="remaining-quantity"
                    >
                      Remaining Quantity
                    </label>
                    <input
                      id="remaining-quantity"
                      type="text"
                      className="stocksummary-input"
                      value={UsedMaterialRemainingQuantity}
                      readOnly
                    />
                  </div>
                  <div className="stocksummary-field">
                    <label
                      className="stocksummary-label"
                      htmlFor="enter-quantity"
                    >
                      Enter Quantity
                    </label>
                    <input
                      id="enter-quantity"
                      type="number"
                      min={0}
                      className="stocksummary-input"
                      value={newusedQuantity}
                      onChange={(e) => setNewUsedQuantity(e.target.value)}
                    />
                  </div>
                  <div className="stocksummary-field">
                    <label className="stocksummary-label" htmlFor="note">
                      Note
                    </label>
                    <textarea
                      id="note"
                      className="stocksummary-textarea"
                      value={usedQuantityNote}
                      onChange={(e) => setUsedQuantityNote(e.target.value)}
                    ></textarea>
                  </div>
                  <button className="stocksummary-submit-btn" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* USED MATERIAL VIEW */}
      {activeTab === "Used Material" && !loading && (
        <div className="stocksummary-section">
          <div className="stocksummary-top-controls">
            <div className="stocksummary-search-wrapper">
              <input
                type="search"
                className="stocksummary-search"
                placeholder="Search used materials..."
                value={usedSearchQuery}
                onChange={(e) => setUsedSearchQuery(e.target.value)}
              />
              {usedSearchQuery && (
                <button
                  className="stocksummary-clear-btn"
                  onClick={clearUsedSearch}
                >
                  ×
                </button>
              )}
            </div>
            <div>
              <button
                className="stocksummary-add-btn"
                onClick={() => setShowUsedStockForm(true)}
              >
                Add Used Stock
              </button>
              <button
                className="stocksummary-print-btn"
                onClick={() => handlePrint(usedTableRef)}
              >
                Print Report
              </button>
            </div>
          </div>

          {showUsedStockForm && (
            <div className="stocksummary-form-overlay">
              <form onSubmit={handleNewAddStock} className="stocksummary-form">
                <h3 className="stocksummary-form-title">Add Used Stock</h3>
                <div className="stocksummary-form-grid">
                  <div className="stocksummary-form-group">
                    <label htmlFor="materialName">Material Name</label>
                    <select
                      id="materialName"
                      className="stocksummary-form-select"
                      value={selectedMaterialName}
                      onChange={(e) => setSelectedMaterialName(e.target.value)}
                    >
                      <option value="">Select Material</option>
                      {materialName.map((item, index) => (
                        <option key={index} value={item.materialName}>
                          {item.materialName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="stocksummary-form-group">
                    <label htmlFor="siteName">Site Name</label>
                    <select
                      id="siteName"
                      className="stocksummary-form-select"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                    >
                      <option value="">Select Site</option>
                      {allSiteName.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="stocksummary-form-group">
                    <label htmlFor="usedFor">Used For</label>
                    <input
                      id="usedFor"
                      type="text"
                      className="stocksummary-form-input"
                      placeholder="Enter purpose"
                      value={usedFor}
                      onChange={(e) => setUsedFor(e.target.value)}
                    />
                  </div>
                  <div className="stocksummary-form-group">
                    <label htmlFor="usedQuantity">Used Quantity</label>
                    <input
                      id="usedQuantity"
                      type="number"
                      className="stocksummary-form-input"
                      placeholder="Enter quantity"
                      value={usedQuantity}
                      onChange={(e) => setUsedQuantity(e.target.value)}
                    />
                  </div>
                </div>
                <div className="stocksummary-form-buttons">
                  <button type="submit" className="stocksummary-submit-btn">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="stocksummary-cancel-btn"
                    onClick={() => setShowUsedStockForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="stocksummary-table-container" ref={usedTableRef}>
            <table className="stocksummary-table">
              <thead>
                <tr>
                  <th className="stocksummary-th">Material Name</th>
                  <th className="stocksummary-th">Site Name</th>
                  <th className="stocksummary-th">Total Used Qty</th>
                  <th className="stocksummary-th">Used For</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsedData.length > 0 ? (
                  filteredUsedData.map((item, index) => (
                    <tr key={index} className="stocksummary-tr">
                      <td className="stocksummary-td stocksummary-material-name">
                        {item.materialName}
                      </td>
                      <td className="stocksummary-td">{item.siteName}</td>
                      <td className="stocksummary-td">
                        <span className="stocksummary-quantity-badge stocksummary-used">
                          {item.totalUsedQty}
                        </span>
                      </td>
                      <td className="stocksummary-td">{item.usedFor}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="stocksummary-no-data">
                      No used materials found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockSummary;
