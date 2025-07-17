import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"; // Add icons
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from "chart.js";

// Regex: first letter capital, only alphabets and spaces
const nameRegex = /^[A-Z][a-zA-Z\s]*$/;

const initialMilkTypeTotals = { Cow: 0, Buffalo: 0, Goat: 0, Mixed: 0 };

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function MilkCollection({ darkMode }) {
  // State
  const [activeTab, setActiveTab] = useState("cow");
  const [entries, setEntries] = useState([]);
  const [buffaloEntries, setBuffaloEntries] = useState([]);
  const [unsoldEntries, setUnsoldEntries] = useState([]);
  const [milkTypeTotals, setMilkTypeTotals] = useState({ ...initialMilkTypeTotals });
  const [totalMilkSold, setTotalMilkSold] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [buffaloQtySum, setBuffaloQtySum] = useState(0);
  const [buffaloEarningsSum, setBuffaloEarningsSum] = useState(0);
  const [unsoldStockTotal, setUnsoldStockTotal] = useState(0);

  // Form states
  const [form, setForm] = useState({
    name: "",
    village: "",
    milkType: "",
    quantity: "",
    rate: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [buffaloForm, setBuffaloForm] = useState({
    name: "",
    village: "",
    quantity: "",
    rate: "",
  });
  const [buffaloFormErrors, setBuffaloFormErrors] = useState({});

  const [unsoldForm, setUnsoldForm] = useState({
    date: "",
    quantity: "",
  });
  const [unsoldFormErrors, setUnsoldFormErrors] = useState({});

  // Edit state for entries
  const [editIdx, setEditIdx] = useState(null);
  const [editBuffaloIdx, setEditBuffaloIdx] = useState(null);

  // --- Validation helpers ---
  function validateForm() {
    const errors = {};
    // Name: required, first letter capital, only alphabets/spaces
    if (!form.name.trim()) errors.name = "Name is required";
    else if (!nameRegex.test(form.name.trim())) errors.name = "First letter must be capital; alphabets only";
    // Village: required, first letter capital, only alphabets/spaces
    if (!form.village.trim()) errors.village = "Village is required";
    else if (!nameRegex.test(form.village.trim())) errors.village = "First letter must be capital; alphabets only";
    // Milk Type
    if (!form.milkType) errors.milkType = "Please select a milk type.";
    // Quantity
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0)
      errors.quantity = "Please enter a quantity greater than 0.";
    // Rate
    if (!form.rate || isNaN(form.rate) || Number(form.rate) <= 0)
      errors.rate = "Please enter a rate greater than 0.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }
  function validateBuffaloForm() {
    const errors = {};
    if (!buffaloForm.name.trim()) errors.name = "Name is required";
    else if (!nameRegex.test(buffaloForm.name.trim())) errors.name = "First letter must be capital; alphabets only";
    if (!buffaloForm.village.trim()) errors.village = "Village is required";
    else if (!nameRegex.test(buffaloForm.village.trim())) errors.village = "First letter must be capital; alphabets only";
    if (!buffaloForm.quantity || isNaN(buffaloForm.quantity) || Number(buffaloForm.quantity) <= 0)
      errors.quantity = "Please enter a quantity greater than 0.";
    if (!buffaloForm.rate || isNaN(buffaloForm.rate) || Number(buffaloForm.rate) <= 0)
      errors.rate = "Please enter a rate greater than 0.";
    setBuffaloFormErrors(errors);
    return Object.keys(errors).length === 0;
  }
  function validateUnsoldForm() {
    const errors = {};
    if (!unsoldForm.date) errors.date = "Please select a valid date.";
    if (!unsoldForm.quantity || isNaN(unsoldForm.quantity) || Number(unsoldForm.quantity) <= 0)
      errors.quantity = "Please enter a quantity greater than 0.";
    setUnsoldFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // --- Handlers ---
  function handleFormChange(e) {
    const { id, value } = e.target;
    // For name/village, only allow alphabets/spaces, capitalize first letter
    if (id === "name" || id === "village") {
      let formatted = value.replace(/[^a-zA-Z\s]/g, "");
      if (formatted.length > 0) {
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      }
      setForm({ ...form, [id]: formatted });
    } else {
      setForm({ ...form, [id]: value });
    }
  }
  function handleBuffaloFormChange(e) {
    const { id, value } = e.target;
    // For name/village, only allow alphabets/spaces, capitalize first letter
    if (id === "buffaloCustomer" || id === "buffaloVillage") {
      let key = id === "buffaloCustomer" ? "name" : "village";
      let formatted = value.replace(/[^a-zA-Z\s]/g, "");
      if (formatted.length > 0) {
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      }
      setBuffaloForm({ ...buffaloForm, [key]: formatted });
    } else if (id === "buffaloQty") {
      setBuffaloForm({ ...buffaloForm, quantity: value });
    } else if (id === "buffaloRate") {
      setBuffaloForm({ ...buffaloForm, rate: value });
    }
  }
  function handleUnsoldFormChange(e) {
    const { id, value } = e.target;
    if (id === "unsoldDate") {
      setUnsoldForm({ ...unsoldForm, date: value });
    } else if (id === "unsoldQuantity") {
      setUnsoldForm({ ...unsoldForm, quantity: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    const quantity = Number(form.quantity);
    const rate = Number(form.rate);
    if (editIdx !== null) {
      // Update existing entry
      const old = entries[editIdx];
      const updated = {
        name: form.name.trim(),
        village: form.village.trim(),
        milkType: form.milkType,
        quantity,
        rate,
        total: quantity * rate,
      };
      const newEntries = [...entries];
      newEntries[editIdx] = updated;
      // Update totals
      setTotalMilkSold(totalMilkSold - Number(old.quantity) + quantity);
      setTotalEarnings(totalEarnings - Number(old.total) + quantity * rate);
      setMilkTypeTotals({
        ...milkTypeTotals,
        [old.milkType]: milkTypeTotals[old.milkType] - Number(old.quantity),
        [form.milkType]: (milkTypeTotals[form.milkType] || 0) + quantity,
      });
      setEntries(newEntries);
      setEditIdx(null);
    } else {
      setEntries([
        ...entries,
        {
          name: form.name.trim(),
          village: form.village.trim(),
          milkType: form.milkType,
          quantity,
          rate,
          total: quantity * rate,
        },
      ]);
      setTotalMilkSold(totalMilkSold + quantity);
      setTotalEarnings(totalEarnings + quantity * rate);
      setMilkTypeTotals({
        ...milkTypeTotals,
        [form.milkType]: milkTypeTotals[form.milkType] + quantity,
      });
    }
    setForm({ name: "", village: "", milkType: "", quantity: "", rate: "" });
    setFormErrors({});
  }

  function handleBuffaloSubmit(e) {
    e.preventDefault();
    if (!validateBuffaloForm()) return;
    const quantity = Number(buffaloForm.quantity);
    const rate = Number(buffaloForm.rate);
    if (editBuffaloIdx !== null) {
      // Update existing buffalo entry
      const old = buffaloEntries[editBuffaloIdx];
      const updated = {
        name: buffaloForm.name.trim(),
        village: buffaloForm.village.trim(),
        quantity,
        rate,
        total: quantity * rate,
      };
      const newBuffaloEntries = [...buffaloEntries];
      newBuffaloEntries[editBuffaloIdx] = updated;
      setBuffaloQtySum(buffaloQtySum - Number(old.quantity) + quantity);
      setBuffaloEarningsSum(buffaloEarningsSum - Number(old.total) + quantity * rate);
      setTotalMilkSold(totalMilkSold - Number(old.quantity) + quantity);
      setTotalEarnings(totalEarnings - Number(old.total) + quantity * rate);
      setMilkTypeTotals({
        ...milkTypeTotals,
        Buffalo: milkTypeTotals.Buffalo - Number(old.quantity) + quantity,
      });
      setBuffaloEntries(newBuffaloEntries);
      setEditBuffaloIdx(null);
    } else {
      setBuffaloEntries([
        ...buffaloEntries,
        {
          name: buffaloForm.name.trim(),
          village: buffaloForm.village.trim(),
          quantity,
          rate,
          total: quantity * rate,
        },
      ]);
      setBuffaloQtySum(buffaloQtySum + quantity);
      setBuffaloEarningsSum(buffaloEarningsSum + quantity * rate);
      setTotalMilkSold(totalMilkSold + quantity);
      setTotalEarnings(totalEarnings + quantity * rate);
      setMilkTypeTotals({
        ...milkTypeTotals,
        Buffalo: milkTypeTotals.Buffalo + quantity,
      });
    }
    setBuffaloForm({ name: "", village: "", quantity: "", rate: "" });
    setBuffaloFormErrors({});
  }

  // Delete handlers
  function handleDelete(idx) {
    const removed = entries[idx];
    setTotalMilkSold(totalMilkSold - Number(removed.quantity));
    setTotalEarnings(totalEarnings - Number(removed.total));
    setMilkTypeTotals({
      ...milkTypeTotals,
      [removed.milkType]: milkTypeTotals[removed.milkType] - Number(removed.quantity),
    });
    setEntries(entries.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  }
  function handleDeleteBuffalo(idx) {
    const removed = buffaloEntries[idx];
    setBuffaloQtySum(buffaloQtySum - Number(removed.quantity));
    setBuffaloEarningsSum(buffaloEarningsSum - Number(removed.total));
    setTotalMilkSold(totalMilkSold - Number(removed.quantity));
    setTotalEarnings(totalEarnings - Number(removed.total));
    setMilkTypeTotals({
      ...milkTypeTotals,
      Buffalo: milkTypeTotals.Buffalo - Number(removed.quantity),
    });
    setBuffaloEntries(buffaloEntries.filter((_, i) => i !== idx));
    if (editBuffaloIdx === idx) setEditBuffaloIdx(null);
  }

  // --- Add these handlers if missing ---

  // For Unsold Stock form submit
  function handleUnsoldSubmit(e) {
    e.preventDefault();
    if (!validateUnsoldForm()) return;
    const quantity = Number(unsoldForm.quantity);
    setUnsoldEntries([
      ...unsoldEntries,
      {
        date: unsoldForm.date,
        quantity,
      },
    ]);
    setUnsoldStockTotal(unsoldStockTotal + quantity);
    setUnsoldForm({ date: "", quantity: "" });
    setUnsoldFormErrors({});
  }

  // For editing cow entries from table
  function handleEdit(idx) {
    const entry = entries[idx];
    setForm({
      name: entry.name,
      village: entry.village,
      milkType: entry.milkType,
      quantity: entry.quantity,
      rate: entry.rate,
    });
    setEditIdx(idx);
    setFormErrors({});
    setActiveTab("cow");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // For editing buffalo entries from table
  function handleEditBuffalo(idx) {
    const entry = buffaloEntries[idx];
    setBuffaloForm({
      name: entry.name,
      village: entry.village,
      quantity: entry.quantity,
      rate: entry.rate,
    });
    setEditBuffaloIdx(idx);
    setBuffaloFormErrors({});
    setActiveTab("buffalo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- Derived values ---
  const avgPrice = totalMilkSold > 0 ? totalEarnings / totalMilkSold : 0;
  const highDemandType =
    Object.entries(milkTypeTotals).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ["N/A", -1]
    )[0] || "N/A";

  // --- Derived values for charts ---
  const milkTypeLabels = ["Cow", "Buffalo", "Goat", "Mixed"];
  const milkTypeData = milkTypeLabels.map(type => milkTypeTotals[type] || 0);

  const barData = {
    labels: milkTypeLabels,
    datasets: [
      {
        label: "Total Milk Sold (L)",
        data: milkTypeData,
        backgroundColor: ["#43c6ac", "#8e54e9", "#ff9800", "#11998e"],
        borderRadius: 8,
        barThickness: 38,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#232946", font: { size: 13 } } },
      y: { grid: { color: "#e0e7ef" }, ticks: { color: "#232946", font: { size: 13 } } },
    },
  };

  const pieData = {
    labels: milkTypeLabels,
    datasets: [
      {
        label: "Milk Type Share",
        data: milkTypeData,
        backgroundColor: ["#43c6ac", "#8e54e9", "#ff9800", "#11998e"],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#232946", font: { size: 14 } } },
      tooltip: { enabled: true },
    },
  };

  // --- UI ---
  return (
    <div
      style={{
        background: darkMode
          ? "linear-gradient(120deg, #232946 0%, #16161a 100%)"
          : "linear-gradient(120deg, #f8fafc 0%, #e0f7fa 100%)",
        color: darkMode ? "#fff" : "#232946",
        minHeight: "100vh",
        padding: 32,
      }}
    >
      <style>{`
        .milk-card {
          background: ${darkMode ? "#232946" : "#fff"};
          color: ${darkMode ? "#fff" : "#232946"};
          border-radius: 18px;
          box-shadow: 0 2px 8px #43c6ac22;
          padding: 28px 20px;
          margin-bottom: 24px;
        }
        .milk-table th {
          background-color: ${darkMode ? "#393e6e" : "#43c6ac"};
          color: #fff;
        }
        .milk-table td {
          background: ${darkMode ? "#232946" : "#fff"};
          color: ${darkMode ? "#fff" : "#232946"};
        }
      `}</style>
      {/* Header */}
      <header
        className="d-flex flex-column align-items-center justify-content-center py-4 mb-4"
        style={{
          background: "linear-gradient(90deg, #43c6ac 0%, #4776e6 100%)",
          borderRadius: "0 0 2rem 2rem",
          boxShadow: "0 4px 24px #43c6ac33",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#fff",
            fontWeight: 800,
            fontSize: "2.2rem",
            letterSpacing: 1,
            textShadow: "0 2px 8px #4776e655",
          }}
        >
          <i className="bi bi-cup-straw" style={{ fontSize: "2.5rem", color: "#fff" }}></i>
          <span>Milk Collection</span>
          <i className="bi bi-droplet-half" style={{ fontSize: "2.5rem", color: "#fff" }}></i>
        </div>
        <div
          style={{
            color: "#e0f7fa",
            fontWeight: 500,
            fontSize: "1.1rem",
            marginTop: 8,
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          <i className="bi bi-calendar2-week" style={{ marginRight: 8, color: "#b2fefa" }}></i>
          Daily &amp; Monthly Milk Collection Dashboard
        </div>
      </header>

      <div className="container">
        {/* Tabs */}
        <div className="row mb-4" id="topTabs">
          <div className="col-md-4 mb-2">
            <button
              className={`w-100 tab-btn ${activeTab === "cow" ? "active" : ""}`}
              style={{
                background: "linear-gradient(90deg,#43c6ac,#8e1474)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "1.2rem",
                border: "none",
                padding: "1.1rem 0",
                fontSize: "1.2rem",
                boxShadow: "0 2px 8px #43c6ac33",
              }}
              onClick={() => setActiveTab("cow")}
            >
              Cow Milk
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button
              className={`w-100 tab-btn ${activeTab === "buffalo" ? "active" : ""}`}
              style={{
                background: "linear-gradient(90deg,#8e54e9,#4776e6)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "1.2rem",
                border: "none",
                padding: "1.1rem 0",
                fontSize: "1.2rem",
                boxShadow: "0 2px 8px #8e54e933",
              }}
              onClick={() => setActiveTab("buffalo")}
            >
              Buffalo Milk
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button
              className={`w-100 tab-btn ${activeTab === "unsold" ? "active" : ""}`}
              style={{
                background: "linear-gradient(90deg,#11998e,#38ef7d)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "1.2rem",
                border: "none",
                padding: "1.1rem 0",
                fontSize: "1.2rem",
                boxShadow: "0 2px 8px #11998e33",
              }}
              onClick={() => setActiveTab("unsold")}
            >
              Unsold Stock
            </button>
          </div>
        </div>

        {/* Cow Milk Section */}
        {activeTab === "cow" && (
          <>
            <div className="modern-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingTop: "1.5rem" }}>
              <h2>
                <i className="bi bi-graph-up"></i> Cow Milk{" "}
                <span style={{ fontSize: "1.2rem", fontWeight: 400, color: "#43c6ac" }}>
                  (Modern View)
                </span>
              </h2>
              <span className="subtitle" style={{ fontSize: "1.2rem", color: "#fc5c7d", fontWeight: 500 }}>
                All your cow milk data at a glance
              </span>
            </div>
            {/* Summary Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3 col-6">
                <div
                  className="modern-summary-card"
                  style={{
                    borderRadius: "1.5rem",
                    background: "rgba(255,255,255,0.35)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 18,
                      fontSize: "2.7rem",
                      color: "#43c6ac22",
                      zIndex: 0,
                    }}
                  >
                    <i className="bi bi-droplet-half"></i>
                  </span>
                  <div
                    style={{
                      fontSize: "2.1rem",
                      color: "#43c6ac",
                      marginBottom: 8,
                      zIndex: 1,
                    }}
                  >
                    <i className="bi bi-droplet-half"></i>
                  </div>
                  <h5 style={{ fontWeight: 700, color: "#232946", zIndex: 1 }}>Total Milk Sold</h5>
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: "#43c6ac", margin: 0, zIndex: 1 }}>
                    {totalMilkSold.toFixed(2)} L
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div
                  className="modern-summary-card"
                  style={{
                    borderRadius: "1.5rem",
                    background: "rgba(255,255,255,0.35)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 18,
                      fontSize: "2.7rem",
                      color: "#fc5c7d22",
                      zIndex: 0,
                    }}
                  >
                    <i className="bi bi-currency-rupee"></i>
                  </span>
                  <div
                    style={{
                      fontSize: "2.1rem",
                      color: "#fc5c7d",
                      marginBottom: 8,
                      zIndex: 1,
                    }}
                  >
                    <i className="bi bi-currency-rupee"></i>
                  </div>
                  <h5 style={{ fontWeight: 700, color: "#232946", zIndex: 1 }}>Avg. Market Price</h5>
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: "#fc5c7d", margin: 0, zIndex: 1 }}>
                    ₹{avgPrice.toFixed(2)}/L
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div
                  className="modern-summary-card"
                  style={{
                    borderRadius: "1.5rem",
                    background: "rgba(255,255,255,0.35)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 18,
                      fontSize: "2.7rem",
                      color: "#ff980022",
                      zIndex: 0,
                    }}
                  >
                    <i className="bi bi-fire"></i>
                  </span>
                  <div
                    style={{
                      fontSize: "2.1rem",
                      color: "#ff9800",
                      marginBottom: 8,
                      zIndex: 1,
                    }}
                  >
                    <i className="bi bi-fire"></i>
                  </div>
                  <h5 style={{ fontWeight: 700, color: "#232946", zIndex: 1 }}>High Demand</h5>
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: "#ff9800", margin: 0, zIndex: 1 }}>
                    {highDemandType}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div
                  className="modern-summary-card"
                  style={{
                    borderRadius: "1.5rem",
                    background: "rgba(255,255,255,0.35)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 18,
                      fontSize: "2.7rem",
                      color: "#f4433622",
                      zIndex: 0,
                    }}
                  >
                    <i className="bi bi-exclamation-triangle"></i>
                  </span>
                  <div
                    style={{
                      fontSize: "2.1rem",
                      color: "#f44336",
                      marginBottom: 8,
                      zIndex: 1,
                    }}
                  >
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <h5 style={{ fontWeight: 700, color: "#232946", zIndex: 1 }}>Unsold Stock</h5>
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: "#f44336", margin: 0, zIndex: 1 }}>
                    {unsoldStockTotal.toFixed(2)} L
                  </p>
                </div>
              </div>
            </div>
            {/* Customer Milk Sale Form */}
            <div className="modern-section">
              <h5 className="mb-3"><i className="bi bi-person-plus"></i> Enter Customer Milk Sale</h5>
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="name" className="form-label">Customer Name</label>
                    <input type="text" className="form-control" id="name" value={form.name} onChange={handleFormChange} required />
                    <div className="error">{formErrors.name}</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="village" className="form-label">Village</label>
                    <input type="text" className="form-control" id="village" value={form.village} onChange={handleFormChange} required />
                    <div className="error">{formErrors.village}</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="milkType" className="form-label">Milk Type</label>
                    <select id="milkType" className="form-select" value={form.milkType} onChange={handleFormChange} required>
                      <option value="">Choose...</option>
                      <option value="Cow">Cow</option>
                      <option value="Buffalo">Buffalo</option>
                      <option value="Goat">Goat</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                    <div className="error">{formErrors.milkType}</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="quantity" className="form-label">Quantity (Litres)</label>
                    <input type="number" className="form-control" id="quantity" value={form.quantity} onChange={handleFormChange} required />
                    <div className="error">{formErrors.quantity}</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="rate" className="form-label">Rate (₹ per Litre)</label>
                    <input type="number" className="form-control" id="rate" value={form.rate} onChange={handleFormChange} required />
                    <div className="error">{formErrors.rate}</div>
                  </div>
                  <div className="col-md-4 d-grid align-items-end">
                    <button type="submit" className="btn btn-primary mt-4">Add Entry</button>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Buffalo Milk Section */}
        {activeTab === "buffalo" && (
          <>
            <div className="modern-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingTop: "1.5rem" }}>
              <h2>
                <i className="bi bi-droplet"></i> Buffalo Milk{" "}
                <span style={{ fontSize: "1.2rem", fontWeight: 400, color: "#8e54e9" }}>
                  (Modern View)
                </span>
              </h2>
              <span className="subtitle" style={{ fontSize: "1.2rem", color: "#fc5c7d", fontWeight: 500 }}>
                All your buffalo milk data at a glance
              </span>
            </div>
            <div className="modern-section">
              <h5 className="mb-3"><i className="bi bi-droplet"></i> Buffalo Milk - High Demand Entry</h5>
              <form onSubmit={handleBuffaloSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="buffaloCustomer" className="form-label">Customer Name</label>
                    <input type="text" className="form-control" id="buffaloCustomer" value={buffaloForm.name} onChange={handleBuffaloFormChange} required />
                    <div className="error">{buffaloFormErrors.name}</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="buffaloVillage" className="form-label">Village</label>
                    <input type="text" className="form-control" id="buffaloVillage" value={buffaloForm.village} onChange={handleBuffaloFormChange} required />
                    <div className="error">{buffaloFormErrors.village}</div>
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="buffaloQty" className="form-label">Quantity (L)</label>
                    <input type="number" className="form-control" id="buffaloQty" value={buffaloForm.quantity} onChange={handleBuffaloFormChange} required />
                    <div className="error">{buffaloFormErrors.quantity}</div>
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="buffaloRate" className="form-label">Rate (₹)</label>
                    <input type="number" className="form-control" id="buffaloRate" value={buffaloForm.rate} onChange={handleBuffaloFormChange} required />
                    <div className="error">{buffaloFormErrors.rate}</div>
                  </div>
                  <div className="col-md-12 d-grid mt-3">
                    <button type="submit" className="btn btn-dark">Add Buffalo Milk Entry</button>
                  </div>
                </div>
              </form>
              <div className="mt-4">
                <h6>Total Buffalo Milk Sold: <span>{buffaloQtySum.toFixed(2)} L</span></h6>
                <h6>Total Earnings from Buffalo Milk: <span>₹{buffaloEarningsSum.toFixed(2)}</span></h6>
              </div>
            </div>
          </>
        )}

        {/* Unsold Stock Section */}
        {activeTab === "unsold" && (
          <>
            <div className="modern-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingTop: "1.5rem" }}>
              <h2>
                <i className="bi bi-archive"></i> Unsold Stock{" "}
                <span style={{ fontSize: "1.2rem", fontWeight: 400, color: "#11998e" }}>
                  (Modern View)
                </span>
              </h2>
              <span className="subtitle" style={{ fontSize: "1.2rem", color: "#fc5c7d", fontWeight: 500 }}>
                All your unsold stock data at a glance
              </span>
            </div>
            <div className="modern-section">
              <h5 className="mb-3"><i className="bi bi-archive"></i> Enter Unsold Milk Stock</h5>
              <form onSubmit={handleUnsoldSubmit} noValidate>
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label htmlFor="unsoldDate" className="form-label">Date</label>
                    <input type="date" className="form-control" id="unsoldDate" value={unsoldForm.date} onChange={handleUnsoldFormChange} required />
                    <div className="error">{unsoldFormErrors.date}</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="unsoldQuantity" className="form-label">Unsold Quantity (L)</label>
                    <input type="number" className="form-control" id="unsoldQuantity" value={unsoldForm.quantity} onChange={handleUnsoldFormChange} required />
                    <div className="error">{unsoldFormErrors.quantity}</div>
                  </div>
                  <div className="col-md-4 d-grid">
                    <button type="submit" className="btn btn-secondary">Add Unsold Stock</button>
                  </div>
                </div>
              </form>
              <div className="mt-4">
                <h6>Total Unsold Stock Added via this Form: <span>{unsoldStockTotal.toFixed(2)} L</span></h6>
              </div>
            </div>
          </>
        )}

        {/* Customer Entries Table */}
        <div
          className="modern-table-section"
          style={{
            background: "linear-gradient(120deg, #fff 80%, #f7e8ff 100%)",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 12px #6a82fb22",
            marginBottom: "2rem",
            padding: "2rem 1.5rem",
            marginTop: "2.5rem",
          }}
        >
          <h5 className="mb-3"><i className="bi bi-table"></i> Customer Entries</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Village</th>
                  <th>Milk Type</th>
                  <th>Quantity (L)</th>
                  <th>Rate (₹)</th>
                  <th>Total (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.name}</td>
                    <td>{row.village}</td>
                    <td>{row.milkType}</td>
                    <td>{row.quantity}</td>
                    <td>₹{row.rate}</td>
                    <td>₹{row.total.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        title="Edit"
                        onClick={() => handleEdit(idx)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-1"
                        title="Delete"
                        onClick={() => handleDelete(idx)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        title="View"
                        onClick={() => alert(
                          `Name: ${row.name}\nVillage: ${row.village}\nMilk Type: ${row.milkType}\nQuantity: ${row.quantity}\nRate: ₹${row.rate}\nTotal: ₹${row.total.toFixed(2)}`
                        )}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
                {buffaloEntries.map((row, idx) => (
                  <tr key={`buffalo-${idx}`}>
                    <td>{row.name}</td>
                    <td>{row.village}</td>
                    <td>Buffalo</td>
                    <td>{row.quantity}</td>
                    <td>₹{row.rate}</td>
                    <td>₹{row.total.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        title="Edit"
                        onClick={() => handleEditBuffalo(idx)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-1"
                        title="Delete"
                        onClick={() => handleDeleteBuffalo(idx)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        title="View"
                        onClick={() => alert(
                          `Name: ${row.name}\nVillage: ${row.village}\nMilk Type: Buffalo\nQuantity: ${row.quantity}\nRate: ₹${row.rate}\nTotal: ₹${row.total.toFixed(2)}`
                        )}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milk Collection Trends Graphs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2.5rem",
            justifyContent: "center",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div style={{
            flex: "1 1 320px",
            background: "#fff",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 12px #43c6ac22",
            padding: "2rem 1.5rem",
            minWidth: 320,
            maxWidth: 480,
          }}>
            <h5 style={{ fontWeight: 700, color: "#232946", marginBottom: 18 }}>
              <i className="bi bi-bar-chart-line" style={{ color: "#43c6ac", marginRight: 8 }}></i>
              Milk Type Distribution (Bar)
            </h5>
            <Bar data={barData} options={barOptions} height={220} />
          </div>
          <div style={{
            flex: "1 1 320px",
            background: "#fff",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 12px #8e54e922",
            padding: "2rem 1.5rem",
            minWidth: 320,
            maxWidth: 480,
          }}>
            <h5 style={{ fontWeight: 700, color: "#232946", marginBottom: 18 }}>
              <i className="bi bi-pie-chart" style={{ color: "#8e54e9", marginRight: 8 }}></i>
              Milk Type Share (Pie)
            </h5>
            <Pie data={pieData} options={pieOptions} height={220} />
          </div>
        </div>
      </div>
    </div>
  );
}