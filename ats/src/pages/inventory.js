import React, { useState } from "react";

// Inventory categories and units
const categoryOptions = [
  { label: "Raw Material", icon: "bi bi-droplet", img: "https://cdn-icons-png.flaticon.com/512/616/616494.png" },
  { label: "Packaging", icon: "bi bi-box", img: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png" },
  { label: "Machinery", icon: "bi bi-gear", img: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png" },
  { label: "Cleaning", icon: "bi bi-bucket", img: "https://cdn-icons-png.flaticon.com/512/809/809957.png" },
  { label: "Other", icon: "bi bi-grid", img: "https://cdn-icons-png.flaticon.com/512/565/565547.png" },
];

const unitOptions = [
  { label: "Kg", icon: "bi bi-bag" },
  { label: "Litre", icon: "bi bi-cup-straw" },
  { label: "Piece", icon: "bi bi-puzzle" },
  { label: "Packet", icon: "bi bi-envelope" },
  { label: "Box", icon: "bi bi-box-seam" },
];

const supplierOptions = [
  { label: "DairySupplies Ltd.", img: "https://cdn-icons-png.flaticon.com/512/2921/2921826.png" },
  { label: "Farmers Co.", img: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
  { label: "AgroMart", img: "https://cdn-icons-png.flaticon.com/512/2921/2921823.png" },
  { label: "Local Vendor", img: "https://cdn-icons-png.flaticon.com/512/2921/2921824.png" },
];

const locationOptions = [
  "Main Store",
  "Cold Storage",
  "Packing Unit",
  "Machinery Shed",
  "Other"
];

const initialState = {
  itemId: "",
  itemName: "",
  category: "",
  quantity: "",
  unit: "",
  supplier: "",
  location: "",
  expiry: "",
  receivedDate: "",
  status: "",
};

export default function Inventory({ darkMode }) {
  const [form, setForm] = useState(initialState);
  const [inventory, setInventory] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    // Item ID: must start with 'INV' followed by 4+ digits
    if (!/^INV\d{4,}$/.test(form.itemId)) {
      errs.itemId = "Item ID must start with 'INV' followed by at least 4 digits (e.g., INV1001).";
    }
    // Item Name: must start with capital letter, only letters/numbers/spaces, 3-40 chars
    if (!/^[A-Z][a-zA-Z0-9 \-]{2,39}$/.test(form.itemName)) {
      errs.itemName = "Item Name must start with a capital letter and be 3-40 letters/numbers/spaces.";
    }
    if (!form.category) {
      errs.category = "Please select a category.";
    }
    if (!/^[1-9]\d*$/.test(form.quantity)) {
      errs.quantity = "Quantity must be a positive integer.";
    }
    if (!form.unit) {
      errs.unit = "Please select a unit.";
    }
    if (!form.supplier) {
      errs.supplier = "Please select a supplier.";
    }
    if (!form.location) {
      errs.location = "Please select a location.";
    }
    if (form.expiry && new Date(form.expiry) < new Date(form.receivedDate || Date.now())) {
      errs.expiry = "Expiry date must be after received date.";
    }
    if (!form.receivedDate) {
      errs.receivedDate = "Please select received date.";
    }
    if (!form.status) {
      errs.status = "Please select status.";
    }
    return errs;
  };

  // Handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: id === "itemName" && value.length > 0
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const entry = { ...form };
    let updatedList;
    if (editIndex === -1) {
      updatedList = [...inventory, entry];
    } else {
      updatedList = [...inventory];
      updatedList[editIndex] = entry;
    }
    setInventory(updatedList);
    setForm(initialState);
    setEditIndex(-1);
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(inventory[idx]);
    setEditIndex(idx);
    setErrors({});
  };

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setInventory(inventory.filter((_, i) => i !== idx));
      setForm(initialState);
      setEditIndex(-1);
      setErrors({});
    }
  };

  const handleView = (idx) => {
    const item = inventory[idx];
    alert(
      `Item ID: ${item.itemId}\n` +
      `Name: ${item.itemName}\n` +
      `Category: ${item.category}\n` +
      `Quantity: ${item.quantity}\n` +
      `Unit: ${item.unit}\n` +
      `Supplier: ${item.supplier}\n` +
      `Location: ${item.location}\n` +
      `Received: ${item.receivedDate}\n` +
      `Expiry: ${item.expiry}\n` +
      `Notes: ${item.notes}`
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(120deg, #232946 0%, #16161a 100%)"
        : "linear-gradient(120deg, #f8fafc 0%, #e0e7ef 40%, #e3f6fd 100%)",
      position: "relative",
      overflowX: "hidden",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      {/* Decorative background image */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.10,
        background: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat",
        filter: "blur(2px) grayscale(0.1)",
      }} />
      <div style={{
        maxWidth: 1150,
        margin: "0 auto 40px auto",
        background: darkMode ? "rgba(35,41,70,0.97)" : "rgba(255,255,255,0.92)",
        borderRadius: 22,
        boxShadow: darkMode
          ? "0 8px 32px rgba(60,60,120,0.25), 0 1.5px 8px #232946"
          : "0 8px 32px rgba(60,60,120,0.13), 0 1.5px 8px #b3e0ff",
        padding: "40px 38px 32px 38px",
        position: "relative",
        zIndex: 1,
        backdropFilter: "blur(6px)",
        color: darkMode ? "#fff" : "#232946",
      }}>
        {/* Header with icon and image */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 18 }}>
          <span style={{
            background: darkMode
              ? "linear-gradient(135deg, #232946 40%, #393e6e 100%)"
              : "linear-gradient(135deg, #38b6ff 40%, #4f8cff 100%)",
            color: "#fff",
            borderRadius: "50%",
            padding: "13px 17px",
            fontSize: "2.2rem",
            boxShadow: darkMode ? "0 2px 8px #232946" : "0 2px 8px #b3e0ff",
            display: "inline-block",
          }}>
            <i className="bi bi-box-seam"></i>
          </span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
            alt="Inventory"
            style={{ width: 52, height: 52, borderRadius: "50%", boxShadow: "0 2px 8px #e0e7ef" }}
          />
          <h2 style={{
            margin: 0,
            fontSize: "2.2rem",
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: darkMode ? "#b2fefa" : "#1b2d44",
            textShadow: darkMode ? "0 2px 8px #232946" : "0 2px 8px #e0e7ef",
          }}>
            Inventory Management
          </h2>
        </div>

        {/* Category quick view */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32 }}>
          {categoryOptions.map(cat => (
            <div key={cat.label} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: darkMode ? "#232946" : "#f4f7fa",
              borderRadius: 14,
              boxShadow: "0 2px 8px #e0e7ef",
              padding: "12px 18px",
              minWidth: 90,
            }}>
              <img src={cat.img} alt={cat.label} style={{ width: 38, height: 38, marginBottom: 6 }} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Cards below header: Inventory summary */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 32 }}>
          {/* Total Items Card */}
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "linear-gradient(120deg,#e0eafc 60%,#f8f9fa 100%)",
            borderRadius: 16,
            boxShadow: "0 2px 8px #e0e7ef",
            padding: 22,
            textAlign: "left",
            color: "#232946",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 22,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              <i className="bi bi-box-seam" style={{ marginRight: 8, color: "#38b6ff" }}></i>
              Total Items
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {inventory.length}
            </div>
            <div style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
              All inventory records
            </div>
          </div>
          {/* Total Quantity Card */}
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "linear-gradient(120deg,#e3f6fd 60%,#f8fafc 100%)",
            borderRadius: 16,
            boxShadow: "0 2px 8px #e0e7ef",
            padding: 22,
            textAlign: "left",
            color: "#232946",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 22,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              <i className="bi bi-graph-up" style={{ marginRight: 8, color: "#2196f3" }}></i>
              Total Quantity
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {inventory.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}
            </div>
            <div style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
              Across all units
            </div>
          </div>
          {/* Expiring Soon Card */}
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "linear-gradient(120deg,#ffe5e5 60%,#fff 100%)",
            borderRadius: 16,
            boxShadow: "0 2px 8px #e0e7ef",
            padding: 22,
            textAlign: "left",
            color: "#232946",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 22,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              <i className="bi bi-exclamation-triangle" style={{ marginRight: 8, color: "#ef476f" }}></i>
              Expiring Soon
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {
                inventory.filter(item => {
                  if (!item.expiry) return false;
                  const days = (new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24);
                  return days >= 0 && days <= 7;
                }).length
              }
            </div>
            <div style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
              Items expiring in 7 days
            </div>
          </div>
          {/* Out of Stock Card */}
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "linear-gradient(120deg,#fbbf24 60%,#fff 100%)",
            borderRadius: 16,
            boxShadow: "0 2px 8px #e0e7ef",
            padding: 22,
            textAlign: "left",
            color: "#232946",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 22,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              <i className="bi bi-x-circle" style={{ marginRight: 8, color: "#ef476f" }}></i>
              Out of Stock
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>
              {inventory.filter(item => parseInt(item.quantity) === 0).length}
            </div>
            <div style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
              Items with zero quantity
            </div>
          </div>
        </div>

        {/* Form: Data entry fields in grid format with full validation */}
        <form onSubmit={handleSubmit} autoComplete="off" style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
              alignItems: "end",
              marginBottom: 8,
            }}
          >
            {/* Item ID */}
            <div>
              <label htmlFor="itemId" style={{ fontWeight: 600 }}>Item ID</label>
              <input
                id="itemId"
                value={form.itemId}
                onChange={handleChange}
                placeholder="e.g., INV1001"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.itemId ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.itemId ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.itemId ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
                autoComplete="off"
              />
              {errors.itemId && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.itemId}</div>}
            </div>
            {/* Item Name */}
            <div>
              <label htmlFor="itemName" style={{ fontWeight: 600 }}>Item Name</label>
              <input
                id="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g., Milk Can"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.itemName ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.itemName ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.itemName ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
                autoComplete="off"
              />
              {errors.itemName && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.itemName}</div>}
            </div>
            {/* Category */}
            <div>
              <label htmlFor="category" style={{ fontWeight: 600 }}>Category</label>
              <select
                id="category"
                value={form.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.category ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.category ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.category ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
              {errors.category && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.category}</div>}
            </div>
            {/* Quantity */}
            <div>
              <label htmlFor="quantity" style={{ fontWeight: 600 }}>Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g., 100"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.quantity ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.quantity ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.quantity ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
                autoComplete="off"
              />
              {errors.quantity && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.quantity}</div>}
            </div>
            {/* Unit */}
            <div>
              <label htmlFor="unit" style={{ fontWeight: 600 }}>Unit</label>
              <select
                id="unit"
                value={form.unit}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.unit ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.unit ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.unit ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              >
                <option value="">Select Unit</option>
                {unitOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
              {errors.unit && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.unit}</div>}
            </div>
            {/* Supplier */}
            <div>
              <label htmlFor="supplier" style={{ fontWeight: 600 }}>Supplier</label>
              <select
                id="supplier"
                value={form.supplier}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.supplier ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.supplier ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.supplier ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              >
                <option value="">Select Supplier</option>
                {supplierOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>{opt.label}</option>
                ))}
              </select>
              {errors.supplier && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.supplier}</div>}
            </div>
            {/* Location */}
            <div>
              <label htmlFor="location" style={{ fontWeight: 600 }}>Location</label>
              <select
                id="location"
                value={form.location}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.location ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.location ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.location ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              >
                <option value="">Select Location</option>
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.location && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.location}</div>}
            </div>
            {/* Received Date */}
            <div>
              <label htmlFor="receivedDate" style={{ fontWeight: 600 }}>Received Date</label>
              <input
                id="receivedDate"
                type="date"
                value={form.receivedDate}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.receivedDate ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.receivedDate ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.receivedDate ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              />
              {errors.receivedDate && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.receivedDate}</div>}
            </div>
            {/* Expiry Date */}
            <div>
              <label htmlFor="expiry" style={{ fontWeight: 600 }}>Expiry Date</label>
              <input
                id="expiry"
                type="date"
                value={form.expiry}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.expiry ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.expiry ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.expiry ? "0 0 0 2px #ef476f33" : "none"
                }}
              />
              {errors.expiry && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.expiry}</div>}
            </div>
            {/* Status */}
            <div>
              <label htmlFor="status" style={{ fontWeight: 600 }}>Status</label>
              <select
                id="status"
                value={form.status}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 7,
                  borderRadius: 8,
                  border: errors.status ? "2px solid #ef476f" : "1.5px solid #bfc9d1",
                  fontSize: "1.07rem",
                  background: errors.status ? "#ffe5e5" : "#f4f7fa",
                  color: "#232946",
                  marginBottom: 2,
                  outline: "none",
                  boxShadow: errors.status ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Used">Used</option>
                <option value="Expired">Expired</option>
              </select>
              {errors.status && <div style={{ color: "#ef476f", fontSize: "0.98em", marginTop: 2 }}>{errors.status}</div>}
            </div>
          </div>
          <button type="submit" style={{
            width: "100%",
            padding: 14,
            marginTop: 30,
            background: "linear-gradient(90deg, #38b6ff 60%, #4f8cff 100%)",
            color: "white",
            fontSize: 18,
            border: "none",
            borderRadius: 9,
            cursor: "pointer",
            fontWeight: 600,
            letterSpacing: 1,
            boxShadow: darkMode
              ? "0 2px 8px rgba(35,41,70,0.10)"
              : "0 2px 8px rgba(79,140,255,0.10)",
            transition: "background 0.2s, transform 0.1s",
          }}>
            {editIndex === -1 ? "Save Item" : "Update Item"}
          </button>
        </form>

        {/* Inventory Table */}
        <table style={{
          width: "100%",
          marginTop: 38,
          borderCollapse: "separate",
          borderSpacing: 0,
          background: darkMode ? "rgba(35,41,70,0.92)" : "rgba(255,255,255,0.92)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: darkMode
            ? "0 2px 12px rgba(35,41,70,0.20)"
            : "0 2px 12px rgba(60,60,120,0.10)",
          color: darkMode ? "#fff" : "#232946",
        }}>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Supplier</th>
              <th>Location</th>
              <th>Received</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => {
              const cat = categoryOptions.find(c => c.label === item.category);
              const unit = unitOptions.find(u => u.label === item.unit);
              const supplier = supplierOptions.find(s => s.label === item.supplier);
              return (
                <tr key={idx} style={{ borderBottom: "1px solid #e0e7ef" }}>
                  <td>{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>
                    {cat && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src={cat.img} alt={cat.label} style={{ width: 22, height: 22 }} />
                        {cat.label}
                      </span>
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    {unit && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <i className={unit.icon}></i>
                        {unit.label}
                      </span>
                    )}
                  </td>
                  <td>
                    {supplier && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src={supplier.img} alt={supplier.label} style={{ width: 22, height: 22 }} />
                        {supplier.label}
                      </span>
                    )}
                  </td>
                  <td>{item.location}</td>
                  <td>{item.receivedDate}</td>
                  <td>{item.expiry}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className="action-btn view"
                      style={{
                        margin: "0 3px",
                        padding: "7px 13px",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                        fontSize: "1em",
                        background: "#17a2b8",
                        color: "white"
                      }}
                      onClick={() => handleView(idx)}
                      title="View"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="action-btn edit"
                      style={{
                        margin: "0 3px",
                        padding: "7px 13px",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                        fontSize: "1em",
                        background: "#ffc107",
                        color: darkMode ? "#232946" : "#1b2d44"
                      }}
                      onClick={() => handleEdit(idx)}
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="action-btn delete"
                      style={{
                        margin: "0 3px",
                        padding: "7px 13px",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                        fontSize: "1em",
                        background: "#e53935",
                        color: "white"
                      }}
                      onClick={() => handleDelete(idx)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}