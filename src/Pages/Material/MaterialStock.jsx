import { useEffect, useState, useRef } from "react";
import {
  Search,
  Plus,
  Minus,
  Send,
  X,
  Edit,
  Trash2,
  Package,
  ArrowRightLeft,
  Printer,
} from "lucide-react";
import "./MaterialStock.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";

function MaterialStock() {
  const printRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  const [ShowTransferStockForm, setShowTransferStockForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [siteNameList, setSiteNameList] = useState([]);
  const [selectedSiteFrom, setSelectedSiteFrom] = useState("");
  const [selectedSiteTo, setSelectedSiteTo] = useState("");
  const [note, setNote] = useState("");
  const [orderItems, setOrderItems] = useState([
    { materialName: "", orderQty: "", unitCost: "" },
  ]);
  const [getTransferStock, setGetTransferStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSiteNames = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/purchase-orders/all-PoNumber`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSiteNameList(response.data);
      } catch (error) {
        console.error("Error fetching site names:", error);
      }
    };
    fetchSiteNames();
  }, [token]);

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { materialName: "", orderQty: "", unitCost: "" },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const handleChangeItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const resetForm = () => {
    setSelectedSiteFrom("");
    setSelectedSiteTo("");
    setNote("");
    setOrderItems([{ materialName: "", orderQty: "", unitCost: "" }]);
    setEditingTransfer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fromsite: selectedSiteFrom,
      tosite: selectedSiteTo,
      note: note.trim(),
      orderItems: orderItems.map((item) => ({
        materialName: item.materialName.trim(),
        orderQty: Number.parseInt(item.orderQty),
        unitCost: Number.parseFloat(item.unitCost),
      })),
    };

    try {
      const url = editingTransfer
        ? `${BASE_URL}/purchase-orders/stockTransfer/${editingTransfer.id}`
        : `${BASE_URL}/purchase-orders/stockTransfer`;

      const method = editingTransfer ? "put" : "post";

      const response = await axiosInstance[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert(
          `Material transfer ${
            editingTransfer ? "updated" : "submitted"
          } successfully!`
        );
        resetForm();
        setShowTransferStockForm(false);
        setShowEditForm(false);
        getAllTransferStock();
      }
    } catch (error) {
      console.error("Error submitting transfer:", error);
      alert(
        `Failed to ${editingTransfer ? "update" : "submit"} material transfer.`
      );
    }
  };

  const handleEdit = (transfer) => {
    setEditingTransfer(transfer);
    setSelectedSiteFrom(transfer.fromsite);
    setSelectedSiteTo(transfer.tosite);
    setNote(transfer.note);
    setOrderItems(
      transfer.orderItems.map((item) => ({
        materialName: item.materialName,
        orderQty: item.orderQty.toString(),
        unitCost: item.unitCost.toString(),
      }))
    );
    setShowEditForm(true);
  };

  const handleDelete = async (transferId) => {
    console.log(transferId);
    if (window.confirm("Are you sure you want to delete this transfer?")) {
      try {
        await axiosInstance.delete(
          `${BASE_URL}/purchase-orders/stockTransfer/${transferId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Transfer deleted successfully!");
        getAllTransferStock();
      } catch (error) {
        console.error("Error deleting transfer:", error);
        alert("Failed to delete transfer.");
      }
    }
  };

  async function getAllTransferStock() {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/purchase-orders/stockTransfers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setGetTransferStock(response.data);
    } catch (error) {
      console.error("Error fetching transfer stock:", error);
      alert("Failed to fetch transfer stock.");
    }
  }

  useEffect(() => {
    getAllTransferStock();
  }, [token]);

  const filteredTransferStock = getTransferStock.filter(
    (transfer) =>
      transfer.fromsite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.tosite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.todayDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateGrandTotal = () => {
    return filteredTransferStock.reduce((total, transfer) => {
      const transferTotal = transfer.orderItems.reduce((sum, item) => {
        return sum + (item.totalCost || item.orderQty * item.unitCost);
      }, 0);
      return total + transferTotal;
    }, 0);
  };

  const handlePrint = () => {
    const printableTable = printRef.current;

    if (printableTable) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Material Stock Transfer Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
            .MaterialStock-no-print { display: none; }
          </style>
        </head>
        <body>
          ${printableTable.outerHTML}
        </body>
      </html>
    `);
      printWindow.document.close();

      // Wait for the window to finish loading before printing
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  };

  return (
    <div className="MaterialStock-container">
      {/* Header Section */}
      {/* <div className="MaterialStock-header">
        <div className="MaterialStock-header-content">
          <div className="MaterialStock-header-title">
            <Package className="MaterialStock-header-icon" />
            <h1>Material Stock Transfer</h1>
          </div>
          <p className="MaterialStock-header-subtitle">
            Manage and track material transfers between sites
          </p>
        </div>
      </div> */}

      {/* Controls Section */}
      <div className="MaterialStock-controls-section">
        <div className="MaterialStock-search-container">
          <Search className="MaterialStock-search-icon" />
          <input
            type="search"
            placeholder="Search transfers..."
            className="MaterialStock-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="MaterialStock-control-buttons">
          <button
            className="MaterialStock-btn MaterialStock-btn-secondary MaterialStock-btn-sm"
            onClick={handlePrint}
          >
            <Printer className="MaterialStock-btn-icon" />
            Print Report
          </button>
          <button
            className="MaterialStock-btn MaterialStock-btn-primary MaterialStock-btn-sm"
            onClick={() => setShowTransferStockForm(true)}
          >
            <ArrowRightLeft className="MaterialStock-btn-icon" />
            Transfer Stock
          </button>
        </div>
      </div>

      {/* Transfer Form Modal */}
      {ShowTransferStockForm && (
        <div className="MaterialStock-modal-overlay">
          <div className="MaterialStock-modal-container">
            <div className="MaterialStock-modal-header">
              <h2>Create Stock Transfer</h2>
              <button
                className="MaterialStock-modal-close-btn"
                onClick={() => {
                  setShowTransferStockForm(false);
                  resetForm();
                }}
              >
                <X />
              </button>
            </div>

            <form
              className="MaterialStock-transfer-form"
              onSubmit={handleSubmit}
            >
              <div className="MaterialStock-form-grid">
                <div className="MaterialStock-form-group">
                  <label htmlFor="siteFrom">From Site</label>
                  <select
                    id="siteFrom"
                    value={selectedSiteFrom}
                    onChange={(e) => setSelectedSiteFrom(e.target.value)}
                    required
                    className="MaterialStock-form-select"
                  >
                    <option value="">Select Source Site</option>
                    {siteNameList.map((site) => (
                      <option key={site.id} value={site.siteName}>
                        {site.siteName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="MaterialStock-form-group">
                  <label htmlFor="siteTo">To Site</label>
                  <select
                    id="siteTo"
                    value={selectedSiteTo}
                    onChange={(e) => setSelectedSiteTo(e.target.value)}
                    required
                    className="MaterialStock-form-select"
                  >
                    <option value="">Select Destination Site</option>
                    {siteNameList.map((site) => (
                      <option key={site.id} value={site.siteName}>
                        {site.siteName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="MaterialStock-form-group">
                <label htmlFor="note">Transfer Note</label>
                <input
                  type="text"
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter transfer notes (optional)"
                  className="MaterialStock-form-input"
                />
              </div>

              <div className="MaterialStock-materials-section">
                <div className="MaterialStock-materials-header">
                  <h3>Materials to Transfer</h3>
                  <button
                    type="button"
                    className="MaterialStock-btn MaterialStock-btn-secondary MaterialStock-btn-xs"
                    onClick={handleAddItem}
                  >
                    <Plus className="MaterialStock-btn-icon" />
                    Add Material
                  </button>
                </div>

                <div className="MaterialStock-materials-list">
                  {orderItems.map((item, index) => (
                    <div key={index} className="MaterialStock-material-item">
                      <div className="MaterialStock-material-inputs">
                        <input
                          type="text"
                          placeholder="Material Name"
                          value={item.materialName}
                          onChange={(e) =>
                            handleChangeItem(
                              index,
                              "materialName",
                              e.target.value
                            )
                          }
                          required
                          className="MaterialStock-form-input"
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={item.orderQty}
                          onChange={(e) =>
                            handleChangeItem(index, "orderQty", e.target.value)
                          }
                          required
                          min="1"
                          className="MaterialStock-form-input"
                        />
                        <input
                          type="number"
                          placeholder="Unit Cost"
                          value={item.unitCost}
                          onChange={(e) =>
                            handleChangeItem(index, "unitCost", e.target.value)
                          }
                          required
                          min="0"
                          step="0.01"
                          className="MaterialStock-form-input"
                        />
                      </div>
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          className="MaterialStock-btn MaterialStock-btn-danger MaterialStock-btn-xs"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Minus className="MaterialStock-btn-icon" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="MaterialStock-form-actions">
                <button
                  type="button"
                  className="MaterialStock-btn MaterialStock-btn-outline MaterialStock-btn-sm"
                  onClick={() => {
                    setShowTransferStockForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="MaterialStock-btn MaterialStock-btn-primary MaterialStock-btn-sm"
                >
                  <Send className="MaterialStock-btn-icon" />
                  Submit Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="MaterialStock-modal-overlay">
          <div className="MaterialStock-modal-container">
            <div className="MaterialStock-modal-header">
              <h2>Edit Stock Transfer</h2>
              <button
                className="MaterialStock-modal-close-btn"
                onClick={() => {
                  setShowEditForm(false);
                  resetForm();
                }}
              >
                <X />
              </button>
            </div>

            <form
              className="MaterialStock-transfer-form"
              onSubmit={handleSubmit}
            >
              <div className="MaterialStock-form-grid">
                <div className="MaterialStock-form-group">
                  <label htmlFor="editSiteFrom">From Site</label>
                  <select
                    id="editSiteFrom"
                    value={selectedSiteFrom}
                    onChange={(e) => setSelectedSiteFrom(e.target.value)}
                    required
                    className="MaterialStock-form-select"
                  >
                    <option value="">Select Source Site</option>
                    {siteNameList.map((site) => (
                      <option key={site.id} value={site.siteName}>
                        {site.siteName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="MaterialStock-form-group">
                  <label htmlFor="editSiteTo">To Site</label>
                  <select
                    id="editSiteTo"
                    value={selectedSiteTo}
                    onChange={(e) => setSelectedSiteTo(e.target.value)}
                    required
                    className="MaterialStock-form-select"
                  >
                    <option value="">Select Destination Site</option>
                    {siteNameList.map((site) => (
                      <option key={site.id} value={site.siteName}>
                        {site.siteName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="MaterialStock-form-group">
                <label htmlFor="editNote">Transfer Note</label>
                <input
                  type="text"
                  id="editNote"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter transfer notes (optional)"
                  className="MaterialStock-form-input"
                />
              </div>

              <div className="MaterialStock-materials-section">
                <div className="MaterialStock-materials-header">
                  <h3>Materials to Transfer</h3>
                  <button
                    type="button"
                    className="MaterialStock-btn MaterialStock-btn-secondary MaterialStock-btn-xs"
                    onClick={handleAddItem}
                  >
                    <Plus className="MaterialStock-btn-icon" />
                    Add Material
                  </button>
                </div>

                <div className="MaterialStock-materials-list">
                  {orderItems.map((item, index) => (
                    <div key={index} className="MaterialStock-material-item">
                      <div className="MaterialStock-material-inputs">
                        <input
                          type="text"
                          placeholder="Material Name"
                          value={item.materialName}
                          onChange={(e) =>
                            handleChangeItem(
                              index,
                              "materialName",
                              e.target.value
                            )
                          }
                          required
                          className="MaterialStock-form-input"
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={item.orderQty}
                          onChange={(e) =>
                            handleChangeItem(index, "orderQty", e.target.value)
                          }
                          required
                          min="1"
                          className="MaterialStock-form-input"
                        />
                        <input
                          type="number"
                          placeholder="Unit Cost"
                          value={item.unitCost}
                          onChange={(e) =>
                            handleChangeItem(index, "unitCost", e.target.value)
                          }
                          required
                          min="0"
                          step="0.01"
                          className="MaterialStock-form-input"
                        />
                      </div>
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          className="MaterialStock-btn MaterialStock-btn-danger MaterialStock-btn-xs"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Minus className="MaterialStock-btn-icon" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="MaterialStock-form-actions">
                <button
                  type="button"
                  className="MaterialStock-btn MaterialStock-btn-outline MaterialStock-btn-sm"
                  onClick={() => {
                    setShowEditForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="MaterialStock-btn MaterialStock-btn-primary MaterialStock-btn-sm"
                >
                  <Send className="MaterialStock-btn-icon" />
                  Update Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Stock List */}
      {filteredTransferStock.length > 0 && (
        <div className="MaterialStock-transfers-section">
          <div className="MaterialStock-section-header">
            <h2>Transfer History</h2>
            <span className="MaterialStock-transfer-count">
              {filteredTransferStock.length} transfer
              {filteredTransferStock.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            className="MaterialStock-table-container"
            id="MaterialStock-printable-table"
            ref={printRef}
          >
            <table className="MaterialStock-transfers-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From Site</th>
                  <th>To Site</th>
                  <th>Note</th>
                  <th>Material Name</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Total Amount</th>
                  <th className="MaterialStock-no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransferStock.map((transfer, index) => {
                  const transferTotal = transfer.orderItems.reduce(
                    (sum, item) => {
                      return (
                        sum + (item.totalCost || item.orderQty * item.unitCost)
                      );
                    },
                    0
                  );

                  return transfer.orderItems.map((item, itemIndex) => (
                    <tr key={`${index}-${itemIndex}`}>
                      {itemIndex === 0 && (
                        <>
                          <td rowSpan={transfer.orderItems.length}>
                            <span className="MaterialStock-date-text">
                              {new Date(transfer.todayDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </td>
                          <td rowSpan={transfer.orderItems.length}>
                            <div className="MaterialStock-site-cell">
                              <span className="MaterialStock-site-name">
                                {transfer.fromsite}
                              </span>
                            </div>
                          </td>
                          <td rowSpan={transfer.orderItems.length}>
                            <div className="MaterialStock-site-cell">
                              <span className="MaterialStock-site-name">
                                {transfer.tosite}
                              </span>
                            </div>
                          </td>
                          <td rowSpan={transfer.orderItems.length}>
                            <span className="MaterialStock-note-text">
                              {transfer.note || "No notes"}
                            </span>
                          </td>
                        </>
                      )}
                      <td>
                        <span className="MaterialStock-material-name">
                          {item.materialName}
                        </span>
                      </td>
                      <td>
                        <span className="MaterialStock-qty">
                          {item.orderQty}
                        </span>
                      </td>
                      <td>
                        <span className="MaterialStock-cost">
                          ₹{item.unitCost}
                        </span>
                      </td>
                      <td>
                        <span className="MaterialStock-total">
                          ₹
                          {(
                            item.totalCost || item.orderQty * item.unitCost
                          ).toLocaleString()}
                        </span>
                      </td>
                      {itemIndex === 0 && (
                        <td
                          rowSpan={transfer.orderItems.length}
                          className="MaterialStock-no-print"
                        >
                          <div className="MaterialStock-action-buttons">
                            <button
                              className="MaterialStock-btn MaterialStock-btn-icon MaterialStock-btn-edit MaterialStock-btn-xs"
                              title="Edit"
                              onClick={() => handleEdit(transfer)}
                            >
                              <Edit />
                            </button>
                            <button
                              className="MaterialStock-btn MaterialStock-btn-icon MaterialStock-btn-delete MaterialStock-btn-xs"
                              title="Delete"
                              onClick={() => handleDelete(transfer.id)}
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          {/* <div className="MaterialStock-grand-total-section">
            <div className="MaterialStock-grand-total">
              <span className="MaterialStock-grand-total-label">
                Grand Total:
              </span>
              <span className="MaterialStock-grand-total-amount">
                ₹{calculateGrandTotal().toLocaleString()}
              </span>
            </div>
          </div> */}
        </div>
      )}

      {filteredTransferStock.length === 0 && getTransferStock.length > 0 && (
        <div className="MaterialStock-empty-state">
          <Search className="MaterialStock-empty-icon" />
          <h3>No transfers found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      {getTransferStock.length === 0 && (
        <div className="MaterialStock-empty-state">
          <Package className="MaterialStock-empty-icon" />
          <h3>No transfers yet</h3>
          <p>Create your first stock transfer to get started</p>
        </div>
      )}
    </div>
  );
}

export default MaterialStock;
