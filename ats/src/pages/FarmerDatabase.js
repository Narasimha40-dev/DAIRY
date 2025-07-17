import React, { useState } from "react";
import { FaUser, FaHome, FaChartBar, FaMoneyBillWave, FaTruck, FaPlus } from "react-icons/fa";

// Remove dummy data, start with empty farmers array
const initialFarmers = [];

export default function FarmerDatabase({ darkMode = false }) {
  // Set default page to "dashboard"
  const [page, setPage] = useState("dashboard");
  const [farmers, setFarmers] = useState(initialFarmers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    village: "",
    phone: "",
    cows: "",
    milk: "",
    joined: "",
  });
  const [errors, setErrors] = useState({});

  // Milk Tracking State
  const [milkTracking, setMilkTracking] = useState([]);
  const [showMilkForm, setShowMilkForm] = useState(false);
  const [milkForm, setMilkForm] = useState({
    farmer: "",
    date: "",
    quantity: "",
    status: "",
  });
  const [milkErrors, setMilkErrors] = useState({});

  // Payments State
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    farmer: "",
    amount: "",
    date: "",
    status: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  // Validation function for farmers
  const validate = (data) => {
    const errs = {};
    if (!/^[A-Z][a-zA-Z ]*$/.test(data.name)) {
      errs.name = "Name must start with a capital letter and contain only alphabets.";
    }
    if (!/^[A-Z][a-zA-Z ]*$/.test(data.village)) {
      errs.village = "Village must start with a capital letter and contain only alphabets.";
    }
    if (!/^\d{10}$/.test(data.phone)) {
      errs.phone = "Phone must be a 10-digit number.";
    }
    if (data.cows && !/^\d+$/.test(data.cows)) {
      errs.cows = "No. of Cows must be a number.";
    }
    if (data.milk && !/^[A-Z][a-zA-Z ]*$/.test(data.milk)) {
      errs.milk = "Milk Breed must start with a capital letter and contain only alphabets.";
    }
    return errs;
  };

  // Validation for milk tracking
  const validateMilk = (data) => {
    const errs = {};
    if (!data.farmer || !/^[A-Z][a-zA-Z ]*$/.test(data.farmer)) {
      errs.farmer = "Farmer name must start with a capital letter and contain only alphabets.";
    }
    if (!data.date) {
      errs.date = "Date is required.";
    }
    if (!data.quantity || isNaN(data.quantity) || Number(data.quantity) <= 0) {
      errs.quantity = "Quantity must be a positive number.";
    }
    if (!data.status || !["Delivered", "Pending"].includes(data.status)) {
      errs.status = "Status must be Delivered or Pending.";
    }
    return errs;
  };

  // Validation for payments
  const validatePayment = (data) => {
    const errs = {};
    if (!data.farmer || !/^[A-Z][a-zA-Z ]*$/.test(data.farmer)) {
      errs.farmer = "Farmer name must start with a capital letter and contain only alphabets.";
    }
    if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) {
      errs.amount = "Amount must be a positive number.";
    }
    if (!data.date) {
      errs.date = "Date is required.";
    }
    if (!data.status || !["Paid", "Pending"].includes(data.status)) {
      errs.status = "Status must be Paid or Pending.";
    }
    return errs;
  };

  // Add Farmer
  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setFarmers([
      ...farmers,
      { ...formData, id: Date.now() }
    ]);
    setShowForm(false);
    setFormData({
      name: "",
      village: "",
      phone: "",
      cows: "",
      milk: "",
      joined: "",
    });
    setErrors({});
  };

  // Add Milk Tracking Entry
  const handleMilkSubmit = e => {
    e.preventDefault();
    const errs = validateMilk(milkForm);
    setMilkErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setMilkTracking([
      ...milkTracking,
      { ...milkForm, id: Date.now() }
    ]);
    setShowMilkForm(false);
    setMilkForm({ farmer: "", date: "", quantity: "", status: "" });
    setMilkErrors({});
  };

  // Add Payment Entry
  const handlePaymentSubmit = e => {
    e.preventDefault();
    const errs = validatePayment(paymentForm);
    setPaymentErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setPayments([
      ...payments,
      { ...paymentForm, id: Date.now() }
    ]);
    setShowPaymentForm(false);
    setPaymentForm({ farmer: "", amount: "", date: "", status: "" });
    setPaymentErrors({});
  };

  // Dashboard summary
  const totalFarmers = farmers.length;
  const totalCows = farmers.reduce((sum, f) => sum + Number(f.cows || 0), 0);
  const villages = [...new Set(farmers.map(f => f.village))].length;

  // Header navigation
  const navBtnStyle = (active) => ({
    background: active ? "#38b6ff" : "#e0e7ef",
    color: active ? "#fff" : "#232946",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
    boxShadow: active ? "0 2px 8px #38b6ff33" : "none"
  });

  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(120deg, #232946 0%, #16161a 100%)"
        : "linear-gradient(120deg, #e0eafc 0%, #f8f9fa 100%)",
      minHeight: "100vh",
      padding: "32px 0",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        background: darkMode ? "rgba(35,41,70,0.97)" : "#fff",
        borderRadius: 18,
        boxShadow: darkMode ? "0 2px 12px #232946" : "0 2px 12px #e0e7ef",
        padding: 32,
        color: darkMode ? "#fff" : "#232946"
      }}>
        {/* Header Navigation */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
          <button style={navBtnStyle(page === "dashboard")} onClick={() => setPage("dashboard")}>
            <FaChartBar /> Dashboard
          </button>
          <button style={navBtnStyle(page === "farmers")} onClick={() => setPage("farmers")}>
            <FaUser /> Farmers
          </button>
          <button style={navBtnStyle(page === "villages")} onClick={() => setPage("villages")}>
            <FaHome /> Villages
          </button>
          <button style={navBtnStyle(page === "milktracking")} onClick={() => setPage("milktracking")}>
            <FaTruck /> Milk Tracking
          </button>
          <button style={navBtnStyle(page === "payments")} onClick={() => setPage("payments")}>
            <FaMoneyBillWave /> Payments
          </button>
        </div>

        {/* Dashboard Page */}
        {page === "dashboard" && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 26, color: "#232946", marginBottom: 24 }}>Farmer Dashboard</h2>
            <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
              <div style={{
                flex: 1,
                background: "#2196f3",
                color: "#fff",
                borderRadius: 14,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: 700,
                fontSize: 22,
                boxShadow: "0 2px 8px #2196f333"
              }}>
                <FaUser size={36} style={{ marginBottom: 8 }} />
                <div>{totalFarmers}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>Total Farmers</div>
              </div>
              <div style={{
                flex: 1,
                background: "#fbbf24",
                color: "#fff",
                borderRadius: 14,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: 700,
                fontSize: 22,
                boxShadow: "0 2px 8px #fbbf2433"
              }}>
                <FaTruck size={36} style={{ marginBottom: 8 }} />
                <div>{milkTracking.length}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>Milk Tracking Entries</div>
              </div>
              <div style={{
                flex: 1,
                background: "#ef476f",
                color: "#fff",
                borderRadius: 14,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: 700,
                fontSize: 22,
                boxShadow: "0 2px 8px #ef476f33"
              }}>
                <FaMoneyBillWave size={36} style={{ marginBottom: 8 }} />
                <div>{payments.length}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>Payments</div>
              </div>
              <div style={{
                flex: 1,
                background: "#e0eafc",
                color: "#232946",
                borderRadius: 14,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: 700,
                fontSize: 22,
                boxShadow: "0 2px 8px #e0e7ef"
              }}>
                <FaHome size={36} style={{ marginBottom: 8, color: "#2196f3" }} />
                <div>{villages}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>Villages</div>
              </div>
              <div style={{
                flex: 1,
                background: "#b2fefa",
                color: "#232946",
                borderRadius: 14,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: 700,
                fontSize: 22,
                boxShadow: "0 2px 8px #b2fefa33"
              }}>
                <FaChartBar size={36} style={{ marginBottom: 8, color: "#2196f3" }} />
                <div>{totalCows}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>Total Cows</div>
              </div>
            </div>
            <div style={{
              background: "#e0eafc",
              borderRadius: 14,
              padding: 24,
              color: "#232946",
              fontWeight: 500,
              fontSize: 18,
              marginBottom: 12
            }}>
              Welcome to the Farmer Dashboard. Use the header to navigate between pages.
            </div>
          </div>
        )}

        {/* Farmers Page */}
        {page === "farmers" && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 26, color: "#232946", marginBottom: 24 }}>
              <FaUser style={{ marginRight: 10, color: "#2196f3" }} />
              Farmers
              <button
                style={{
                  marginLeft: 18,
                  background: "#38d9a9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer"
                }}
                onClick={() => setShowForm(true)}
              >
                <FaPlus style={{ marginRight: 6 }} /> Add Farmer
              </button>
            </h2>
            {showForm && (
              <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: darkMode ? "rgba(35,41,70,0.60)" : "rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
              }}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    background: darkMode ? "#232946" : "#fff",
                    borderRadius: 14,
                    boxShadow: darkMode ? "0 2px 12px #232946" : "0 2px 12px #e0e7ef",
                    padding: 32,
                    minWidth: 340,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    color: darkMode ? "#fff" : "#232946"
                  }}
                >
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#232946" }}>
                    Add Farmer
                  </h2>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: errors.name ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {errors.name && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{errors.name}</div>}
                  <input
                    type="text"
                    placeholder="Village"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: errors.village ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {errors.village && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{errors.village}</div>}
                  <input
                    type="tel"
                    pattern="\d*"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phone: val });
                    }}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: errors.phone ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {errors.phone && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{errors.phone}</div>}
                  <input
                    type="number"
                    placeholder="No. of Cows"
                    value={formData.cows}
                    onChange={e => setFormData({ ...formData, cows: e.target.value })}
                    style={{ padding: "8px 12px", borderRadius: 8, border: errors.cows ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {errors.cows && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{errors.cows}</div>}
                  <input
                    type="text"
                    placeholder="Milk Breed"
                    value={formData.milk}
                    onChange={e => setFormData({ ...formData, milk: e.target.value })}
                    style={{ padding: "8px 12px", borderRadius: 8, border: errors.milk ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {errors.milk && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{errors.milk}</div>}
                  <input
                    type="date"
                    placeholder="Joined Date"
                    value={formData.joined}
                    onChange={e => setFormData({ ...formData, joined: e.target.value })}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button
                      type="submit"
                      style={{
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "#e0e7ef",
                        color: "#232946",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          name: "",
                          village: "",
                          phone: "",
                          cows: "",
                          milk: "",
                          joined: "",
                        });
                        setErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 16,
              background: darkMode ? "rgba(35,41,70,0.92)" : "#f8fafc",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: darkMode ? "0 1px 4px #232946" : "0 1px 4px #e0e7ef",
              color: darkMode ? "#fff" : "#232946"
            }}>
              <thead>
                <tr style={{ background: "#e0eafc", color: "#232946" }}>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Name</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Village</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Phone</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>No. of Cows</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Milk Breed</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {farmers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                      No farmers found.
                    </td>
                  </tr>
                ) : (
                  farmers.map(farmer => (
                    <tr key={farmer.id} style={{ borderBottom: "1px solid #e0e7ef" }}>
                      <td style={{ padding: "10px 8px" }}>{farmer.name}</td>
                      <td style={{ padding: "10px 8px" }}>{farmer.village}</td>
                      <td style={{ padding: "10px 8px" }}>{farmer.phone}</td>
                      <td style={{ padding: "10px 8px" }}>{farmer.cows}</td>
                      <td style={{ padding: "10px 8px" }}>{farmer.milk}</td>
                      <td style={{ padding: "10px 8px" }}>{farmer.joined}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Villages Page */}
        {page === "villages" && (
          <div>
            <h2 style={{
              fontWeight: 700,
              fontSize: 26,
              color: darkMode ? "#b2fefa" : "#232946",
              marginBottom: 24
            }}>Villages Overview</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {Array.from(new Set(farmers.map(f => f.village))).map((village, idx) => {
                const villageFarmers = farmers.filter(f => f.village === village);
                return (
                  <div key={village} style={{
                    flex: "1 1 220px",
                    background: "#e0eafc",
                    borderRadius: 14,
                    boxShadow: "0 2px 8px #e0e7ef",
                    padding: 24,
                    marginBottom: 18,
                    color: "#232946"
                  }}>
                    <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                      <FaHome style={{ marginRight: 8, color: "#2196f3" }} />
                      {village}
                    </h3>
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      Farmers: <b>{villageFarmers.length}</b>
                    </div>
                    <div style={{ fontSize: 15 }}>
                      Total Cows: <b>{villageFarmers.reduce((sum, f) => sum + Number(f.cows || 0), 0)}</b>
                    </div>
                    <div style={{ fontSize: 15 }}>
                      Milk Breed: <b>{[...new Set(villageFarmers.map(f => f.milk))].join(", ")}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Milk Tracking Page */}
        {page === "milktracking" && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 26, color: "#232946", marginBottom: 24 }}>
              <FaTruck style={{ marginRight: 10, color: "#38b6ff" }} />
              Milk Tracking
              <button
                style={{
                  marginLeft: 18,
                  background: "#38d9a9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer"
                }}
                onClick={() => setShowMilkForm(true)}
              >
                <FaPlus style={{ marginRight: 6 }} /> Add Milk Tracking
              </button>
            </h2>
            {showMilkForm && (
              <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: darkMode ? "rgba(35,41,70,0.60)" : "rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
              }}>
                <form
                  onSubmit={handleMilkSubmit}
                  style={{
                    background: darkMode ? "#232946" : "#fff",
                    borderRadius: 14,
                    boxShadow: darkMode ? "0 2px 12px #232946" : "0 2px 12px #e0e7ef",
                    padding: 32,
                    minWidth: 340,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    color: darkMode ? "#fff" : "#232946"
                  }}
                >
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#232946" }}>
                    Add Milk Tracking
                  </h2>
                  <input
                    type="text"
                    placeholder="Farmer Name"
                    value={milkForm.farmer}
                    onChange={e => setMilkForm({ ...milkForm, farmer: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: milkErrors.farmer ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {milkErrors.farmer && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{milkErrors.farmer}</div>}
                  <input
                    type="date"
                    placeholder="Date"
                    value={milkForm.date}
                    onChange={e => setMilkForm({ ...milkForm, date: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: milkErrors.date ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {milkErrors.date && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{milkErrors.date}</div>}
                  <input
                    type="number"
                    placeholder="Quantity (L)"
                    value={milkForm.quantity}
                    onChange={e => setMilkForm({ ...milkForm, quantity: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: milkErrors.quantity ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {milkErrors.quantity && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{milkErrors.quantity}</div>}
                  <select
                    value={milkForm.status}
                    onChange={e => setMilkForm({ ...milkForm, status: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: milkErrors.status ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  >
                    <option value="">Select Status</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                  </select>
                  {milkErrors.status && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{milkErrors.status}</div>}
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button
                      type="submit"
                      style={{
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "#e0e7ef",
                        color: "#232946",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        setShowMilkForm(false);
                        setMilkForm({ farmer: "", date: "", quantity: "", status: "" });
                        setMilkErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 16,
              background: darkMode ? "rgba(35,41,70,0.92)" : "#f8fafc",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: darkMode ? "0 1px 4px #232946" : "0 1px 4px #e0e7ef",
              color: darkMode ? "#fff" : "#232946"
            }}>
              <thead>
                <tr style={{ background: "#e0eafc", color: "#232946" }}>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Farmer</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Quantity (L)</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {milkTracking.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                      No milk tracking data found.
                    </td>
                  </tr>
                ) : (
                  milkTracking.map(entry => (
                    <tr key={entry.id} style={{ borderBottom: "1px solid #e0e7ef" }}>
                      <td style={{ padding: "10px 8px" }}>{entry.farmer}</td>
                      <td style={{ padding: "10px 8px" }}>{entry.date}</td>
                      <td style={{ padding: "10px 8px" }}>{entry.quantity}</td>
                      <td style={{ padding: "10px 8px" }}>{entry.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments Page */}
        {page === "payments" && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 26, color: "#232946", marginBottom: 24 }}>
              <FaMoneyBillWave style={{ marginRight: 10, color: "#38b6ff" }} />
              Payments
              <button
                style={{
                  marginLeft: 18,
                  background: "#38d9a9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer"
                }}
                onClick={() => setShowPaymentForm(true)}
              >
                <FaPlus style={{ marginRight: 6 }} /> Add Payment
              </button>
            </h2>
            {showPaymentForm && (
              <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: darkMode ? "rgba(35,41,70,0.60)" : "rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
              }}>
                <form
                  onSubmit={handlePaymentSubmit}
                  style={{
                    background: darkMode ? "#232946" : "#fff",
                    borderRadius: 14,
                    boxShadow: darkMode ? "0 2px 12px #232946" : "0 2px 12px #e0e7ef",
                    padding: 32,
                    minWidth: 340,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    color: darkMode ? "#fff" : "#232946"
                  }}
                >
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#232946" }}>
                    Add Payment
                  </h2>
                  <input
                    type="text"
                    placeholder="Farmer Name"
                    value={paymentForm.farmer}
                    onChange={e => setPaymentForm({ ...paymentForm, farmer: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: paymentErrors.farmer ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {paymentErrors.farmer && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{paymentErrors.farmer}</div>}
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: paymentErrors.amount ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {paymentErrors.amount && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{paymentErrors.amount}</div>}
                  <input
                    type="date"
                    placeholder="Date"
                    value={paymentForm.date}
                    onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: paymentErrors.date ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  />
                  {paymentErrors.date && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{paymentErrors.date}</div>}
                  <select
                    value={paymentForm.status}
                    onChange={e => setPaymentForm({ ...paymentForm, status: e.target.value })}
                    required
                    style={{ padding: "8px 12px", borderRadius: 8, border: paymentErrors.status ? "2px solid #ef476f" : "1px solid #e0e7ef", fontSize: 15 }}
                  >
                    <option value="">Select Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                  {paymentErrors.status && <div style={{ color: "#ef476f", fontSize: "0.98em" }}>{paymentErrors.status}</div>}
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button
                      type="submit"
                      style={{
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "#e0e7ef",
                        color: "#232946",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        setShowPaymentForm(false);
                        setPaymentForm({ farmer: "", amount: "", date: "", status: "" });
                        setPaymentErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 16,
              background: darkMode ? "rgba(35,41,70,0.92)" : "#f8fafc",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: darkMode ? "0 1px 4px #232946" : "0 1px 4px #e0e7ef",
              color: darkMode ? "#fff" : "#232946"
            }}>
              <thead>
                <tr style={{ background: "#e0eafc", color: "#232946" }}>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Farmer</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Amount (₹)</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "12px 10px", fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map(entry => (
                    <tr key={entry.id} style={{ borderBottom: "1px solid #e0e7ef" }}>
                      <td style={{ padding: "10px 8px" }}>{entry.farmer}</td>
                      <td style={{ padding: "10px 8px" }}>{entry.amount}</td>
                      <td style={{ padding: "10px 8px" }}>{entry.date}</td>
                      <td style={{ padding: "10px 8px" }}>{entry.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}