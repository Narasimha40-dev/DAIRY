import React, { useState } from "react";
import { FaRupeeSign, FaCheckCircle, FaHourglassHalf, FaUser, FaCreditCard, FaWallet, FaUniversity, FaMoneyBillWave, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";

// Utility for status badge color
const statusColors = {
  COMPLETED: "#28a745",
  PENDING: "#ffc107",
  PROCESSING: "#17a2b8",
  FAILED: "#dc3545",
  CANCELLED: "#6c757d",
};

const initialPayments = []; // Remove initial 4 records, start with empty array

const paymentMethods = [
  { label: "CREDIT CARD", icon: <FaCreditCard /> },
  { label: "DEBIT CARD", icon: <FaCreditCard /> },
  { label: "NET BANKING", icon: <FaUniversity /> },
  { label: "UPI", icon: <FaMoneyBillWave /> },
  { label: "DIGITAL WALLET", icon: <FaWallet /> },
  { label: "CASH", icon: <FaRupeeSign /> },
  { label: "CHEQUE", icon: <FaUniversity /> },
  { label: "BANK TRANSFER", icon: <FaUniversity /> },
];

const statusOptions = [
  { label: "COMPLETED", icon: <FaCheckCircle /> },
  { label: "PENDING", icon: <FaHourglassHalf /> },
  { label: "PROCESSING", icon: <FaHourglassHalf /> },
  { label: "FAILED", icon: <FaTimesCircle /> },
  { label: "CANCELLED", icon: <FaTimesCircle /> },
];

export default function Payments({ darkMode }) {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    payerName: "",
    amount: "",
    paymentMethod: "",
    status: "",
    description: "",
    payerEmail: "",
    payerPhone: "",
    referenceNumber: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);

  // Stats
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const completedPayments = payments.filter((p) => p.status === "COMPLETED").length;
  const successRate = totalPayments ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0;
  const pendingPayments = payments.filter((p) => p.status === "PENDING" || p.status === "PROCESSING").length;

  // Filtered table
  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId.toUpperCase().includes(search.toUpperCase()) ||
      p.payerName.toUpperCase().includes(search.toUpperCase()) ||
      p.status.toUpperCase().includes(search.toUpperCase())
  );

  // Validation
  function validate() {
    const errors = {};
    if (!form.payerName.trim()) errors.payerName = "Payer name is required";
    else if (!/^[A-Z][A-Z\s]*$/.test(form.payerName.trim()))
      errors.payerName = "Name must start with a capital letter and contain only letters/spaces";
    if (!form.amount || Number(form.amount) <= 0) errors.amount = "Amount must be greater than 0";
    if (!form.paymentMethod) errors.paymentMethod = "Payment method is required";
    if (!form.status) errors.status = "Status is required";
    if (form.payerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.payerEmail))
      errors.payerEmail = "Invalid email";
    if (form.payerPhone && !/^\d{10}$/.test(form.payerPhone))
      errors.payerPhone = "Phone must be 10 digits";
    return errors;
  }

  // Handle form change
  function handleChange(e) {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: id === "payerName" || id === "description" || id === "payerEmail" || id === "referenceNumber"
        ? value.toUpperCase()
        : value,
    }));
  }

  // Handle submit
  function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editId) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                ...form,
                amount: Number(form.amount),
                date: new Date().toLocaleDateString(),
              }
            : p
        )
      );
    } else {
      const newId = payments.length > 0 ? Math.max(...payments.map((p) => p.id)) + 1 : 1;
      setPayments((prev) => [
        ...prev,
        {
          ...form,
          id: newId,
          transactionId: `TXN${(newId).toString().padStart(3, "0")}`,
          amount: Number(form.amount),
          date: new Date().toLocaleDateString(),
        },
      ]);
    }
    setForm({
      payerName: "",
      amount: "",
      paymentMethod: "",
      status: "",
      description: "",
      payerEmail: "",
      payerPhone: "",
      referenceNumber: "",
    });
    setEditId(null);
    setFormErrors({});
  }

  // Edit
  function handleEdit(id) {
    const payment = payments.find((p) => p.id === id);
    if (payment) {
      setForm({
        payerName: payment.payerName,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        description: payment.description || "",
        payerEmail: payment.payerEmail || "",
        payerPhone: payment.payerPhone || "",
        referenceNumber: payment.referenceNumber || "",
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Delete
  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({
          payerName: "",
          amount: "",
          paymentMethod: "",
          status: "",
          description: "",
          payerEmail: "",
          payerPhone: "",
          referenceNumber: "",
        });
      }
    }
  }

  // Clear form
  function handleClear() {
    setForm({
      payerName: "",
      amount: "",
      paymentMethod: "",
      status: "",
      description: "",
      payerEmail: "",
      payerPhone: "",
      referenceNumber: "",
    });
    setEditId(null);
    setFormErrors({});
  }

  const styles = {
    bg: {
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(120deg, #232946 0%, #16161a 100%)"
        : "linear-gradient(120deg, #f8fafc 0%, #e0e7ef 40%, #e3f6fd 100%)",
      color: darkMode ? "#fff" : "#232946",
    },
    container: {
      maxWidth: 1400,
      margin: "0 auto",
      background: darkMode ? "#1e1e2e" : "rgba(255,255,255,0.95)",
      borderRadius: 20,
      boxShadow: darkMode ? "0 4px 15px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    header: {
      background: darkMode
        ? "linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)"
        : "linear-gradient(90deg, #007bff 0%, #00c6ff 100%)",
      color: "white",
      padding: 18,
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "1.7rem",
      marginBottom: 6,
      textShadow: darkMode ? "0 2px 4px rgba(255,255,255,0.1)" : "0 2px 4px rgba(0,0,0,0.12)",
    },
    statCard: {
      background: darkMode ? "#2c2c3e" : "white",
      padding: 25,
      borderRadius: 15,
      boxShadow: darkMode ? "0 4px 15px rgba(0,0,0,0.3)" : "0 8px 25px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    statTitle: {
      color: darkMode ? "#00c6ff" : "#2c3e50",
      marginBottom: 10,
      fontSize: "1.2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    statValue: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: darkMode ? "#00c6ff" : "#007bff",
      marginBottom: 5,
    },
    th: {
      background: darkMode ? "#2c2c3e" : "#34495e",
      color: "white",
      padding: 15,
      textAlign: "left",
      fontWeight: 600,
      textTransform: "uppercase",
      fontSize: "0.9rem",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    btn: {
      padding: "12px 25px",
      border: "none",
      borderRadius: 8,
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      textTransform: "uppercase",
      marginRight: 10,
      marginBottom: 10,
      background: darkMode ? "#007bff" : "#007bff",
      color: "white",
      transition: "background 0.3s, transform 0.3s",
    },
    btnSm: {
      padding: "6px 12px",
      fontSize: "0.8rem",
      border: "none",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      textTransform: "uppercase",
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: darkMode ? "#007bff" : "#007bff",
      color: "white",
      transition: "background 0.3s, transform 0.3s",
    },
    input: (error) => ({
      width: "100%",
      padding: "12px 15px",
      border: `2px solid ${error ? "#e74c3c" : "#e0e0e0"}`,
      borderRadius: 8,
      fontSize: "1rem",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxShadow: error
        ? "0 0 0 3px rgba(231, 76, 60, 0.1)"
        : undefined,
      outline: "none",
      background: darkMode ? "#2c2c3e" : "white",
      color: darkMode ? "white" : "#232946",
    }),
    formGroup: {
      marginBottom: 20,
    },
    label: {
      display: "block",
      marginBottom: 8,
      color: darkMode ? "#ccc" : "#2c3e50",
      fontWeight: 600,
      textTransform: "uppercase",
      fontSize: "0.9rem",
    },
    errorMessage: {
      color: "#e74c3c",
      fontSize: "0.9rem",
      marginTop: 5,
      display: "block",
    },
    tableHeader: {
      background: darkMode ? "#2c2c3e" : "#2c3e50",
      color: "white",
      padding: "20px 30px",
    },
    tableContainer: {
      overflowX: "auto",
      maxHeight: 600,
      overflowY: "auto",
    },
    noRecords: {
      textAlign: "center",
      color: "#888",
      padding: 30,
    },
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FaRupeeSign style={{ marginRight: 8, verticalAlign: "middle" }} />
            PAYMENTS MANAGEMENT DASHBOARD
          </h1>
          <p style={{ letterSpacing: 1, fontSize: "1rem" }}>Comprehensive Payment Tracking & Processing System</p>
        </div>

        {/* Stats - single row, scrollable on small screens */}
        <div style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: 20,
          padding: 30,
          background: darkMode ? "#121212" : "#f8f9fa"
        }}>
          <div className="stat-card" style={{ ...styles.statCard, minWidth: 220 }}>
            <h3 style={styles.statTitle}><FaUser style={{ marginRight: 8, color: "#007bff" }} />TOTAL PAYMENTS</h3>
            <div style={styles.statValue}>{totalPayments}</div>
            <p>TRANSACTION COUNT</p>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, minWidth: 220 }}>
            <h3 style={styles.statTitle}><FaRupeeSign style={{ marginRight: 8, color: "#28a745" }} />TOTAL AMOUNT</h3>
            <div style={styles.statValue}>₹{totalAmount.toLocaleString()}</div>
            <p>PROCESSED AMOUNT</p>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, minWidth: 220 }}>
            <h3 style={styles.statTitle}><FaCheckCircle style={{ marginRight: 8, color: "#28a745" }} />SUCCESS RATE</h3>
            <div style={styles.statValue}>{successRate}%</div>
            <p>COMPLETION RATE</p>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, minWidth: 220 }}>
            <h3 style={styles.statTitle}><FaHourglassHalf style={{ marginRight: 8, color: "#ffc107" }} />PENDING PAYMENTS</h3>
            <div style={styles.statValue}>{pendingPayments}</div>
            <p>AWAITING PROCESSING</p>
          </div>
        </div>

        {/* Add New Payment Form */}
        <div style={{
          maxWidth: 600,
          margin: "0 auto 40px auto",
          background: darkMode ? "#1e1e2e" : "white",
          padding: 30,
          borderRadius: 15,
          boxShadow: darkMode ? "0 4px 15px rgba(0,0,0,0.3)" : "0 8px 25px rgba(0,0,0,0.08)",
        }}>
          <h2 style={{
            color: darkMode ? "#00c6ff" : "#2c3e50",
            marginBottom: 25,
            fontSize: "1.5rem",
            borderBottom: `3px solid ${darkMode ? "#007bff" : "#007bff"}`,
            paddingBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center"
          }}>
            <FaCreditCard />
            {editId ? "EDIT PAYMENT" : "ADD NEW PAYMENT"}
          </h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={styles.formGroup}>
              <label htmlFor="payerName" style={styles.label}>
                <FaUser style={{ marginRight: 8, verticalAlign: "middle" }} />
                PAYER NAME *
              </label>
              <input
                id="payerName"
                type="text"
                value={form.payerName}
                onChange={handleChange}
                style={styles.input(formErrors.payerName)}
                required
              />
              {formErrors.payerName && (
                <div className="error-message" style={styles.errorMessage}>{formErrors.payerName}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="amount" style={styles.label}>
                <FaRupeeSign style={{ marginRight: 8, verticalAlign: "middle" }} />
                AMOUNT (₹) *
              </label>
              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                style={styles.input(formErrors.amount)}
                required
              />
              {formErrors.amount && (
                <div className="error-message" style={styles.errorMessage}>{formErrors.amount}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="paymentMethod" style={styles.label}>
                <FaCreditCard style={{ marginRight: 8, verticalAlign: "middle" }} />
                PAYMENT METHOD *
              </label>
              <select
                id="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                style={styles.input(formErrors.paymentMethod)}
                required
              >
                <option value="">SELECT PAYMENT METHOD</option>
                {paymentMethods.map((method) => (
                  <option key={method.label} value={method.label}>
                    {method.icon} {method.label}
                  </option>
                ))}
              </select>
              {formErrors.paymentMethod && (
                <div className="error-message" style={styles.errorMessage}>{formErrors.paymentMethod}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="status" style={styles.label}>
                <FaCheckCircle style={{ marginRight: 8, verticalAlign: "middle" }} />
                STATUS *
              </label>
              <select
                id="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input(formErrors.status)}
                required
              >
                <option value="">SELECT STATUS</option>
                {statusOptions.map((status) => (
                  <option key={status.label} value={status.label}>
                    {status.icon} {status.label}
                  </option>
                ))}
              </select>
              {formErrors.status && (
                <div className="error-message" style={styles.errorMessage}>{formErrors.status}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.label}>
                <FaWallet style={{ marginRight: 8, verticalAlign: "middle" }} />
                DESCRIPTION
              </label>
              <input
                id="description"
                type="text"
                value={form.description}
                onChange={handleChange}
                style={styles.input()}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="payerEmail" style={styles.label}>
                <FaUser style={{ marginRight: 8, verticalAlign: "middle" }} />
                PAYER EMAIL
              </label>
              <input
                id="payerEmail"
                type="email"
                value={form.payerEmail}
                onChange={handleChange}
                style={styles.input(formErrors.payerEmail)}
              />
              {formErrors.payerEmail && (
                <div className="error-message" style={styles.errorMessage}>{formErrors.payerEmail}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="payerPhone" style={styles.label}>
                <FaUser style={{ marginRight: 8, verticalAlign: "middle" }} />
                PAYER PHONE
              </label>
              <input
                id="payerPhone"
                type="tel"
                value={form.payerPhone}
                onChange={handleChange}
                style={styles.input(formErrors.payerPhone)}
              />
              {formErrors.payerPhone && (
                <div className="error-message" style={styles.errorMessage}>{formErrors.payerPhone}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="referenceNumber" style={styles.label}>
                <FaCreditCard style={{ marginRight: 8, verticalAlign: "middle" }} />
                REFERENCE NUMBER
              </label>
              <input
                id="referenceNumber"
                type="text"
                value={form.referenceNumber}
                onChange={handleChange}
                style={styles.input()}
              />
            </div>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button type="submit" className="btn btn-primary" style={styles.btn}>
                {editId ? "UPDATE PAYMENT" : "SAVE PAYMENT"}
              </button>
              {editId && (
                <button type="button" className="btn btn-secondary" style={styles.btn} onClick={handleClear}>
                  CANCEL
                </button>
              )}
              <button type="button" className="btn btn-secondary" style={styles.btn} onClick={handleClear}>
                CLEAR FORM
              </button>
            </div>
          </form>
        </div>

        {/* Payment Records Table */}
        <div style={{
          background: darkMode ? "#1e1e2e" : "white",
          borderRadius: 15,
          boxShadow: darkMode ? "0 4px 15px rgba(0,0,0,0.3)" : "0 8px 25px rgba(0,0,0,0.1)",
          overflow: "hidden",
          margin: "0 30px 30px 30px"
        }}>
          <div className="table-header" style={styles.tableHeader}>
            <h2 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: 10 }}>
              <FaWallet style={{ marginRight: 4, verticalAlign: "middle" }} />
              PAYMENT RECORDS
            </h2>
          </div>
          <div className="search-filter" style={{
            background: darkMode ? "#2c2c3e" : "white",
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <input
              type="text"
              placeholder="SEARCH BY TRANSACTION ID, PAYER NAME, OR STATUS..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #e0e0e0",
                borderRadius: 8,
                fontSize: "1rem",
                background: darkMode ? "#2c2c3e" : "white",
                color: darkMode ? "white" : "#232946",
              }}
            />
          </div>
          <div className="table-container" style={styles.tableContainer}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.th}>TRANSACTION ID</th>
                  <th style={styles.th}>PAYER NAME</th>
                  <th style={styles.th}>AMOUNT</th>
                  <th style={styles.th}>PAYMENT METHOD</th>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.th}>DATE</th>
                  <th style={styles.th}>DESCRIPTION</th>
                  <th style={styles.th}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id} style={{ transition: "background-color 0.3s" }}>
                    <td><strong>{p.transactionId}</strong></td>
                    <td>{p.payerName}</td>
                    <td style={{ fontWeight: "bold", color: "#28a745" }}>₹{Number(p.amount).toLocaleString()}</td>
                    <td>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        background: "#f8f9fa",
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                        {paymentMethods.find(m => m.label === p.paymentMethod)?.icon}
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: p.status === "PENDING" ? "#000" : "#fff",
                        background: statusColors[p.status] || "#6c757d",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}>
                        {statusOptions.find(s => s.label === p.status)?.icon}
                        {p.status}
                      </span>
                    </td>
                    <td>{p.date}</td>
                    <td>{p.description || "-"}</td>
                    <td style={{ display: "flex", gap: 5 }}>
                      <button
                        className="btn btn-warning btn-sm"
                        style={styles.btnSm}
                        onClick={() => handleEdit(p.id)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        style={styles.btnSm}
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={8} style={styles.noRecords}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components and Styles ---

function FormGroup({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  options,
  icon,
  ...rest
}) {
  return (
    <div className="form-group" style={{ marginBottom: 20 }}>
      <label htmlFor={id} style={{
        display: "block",
        marginBottom: 8,
        color: "#2c3e50",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.9rem"
      }}>
        {icon && <span style={{ marginRight: 6, verticalAlign: "middle" }}>{icon}</span>}
        {label}
      </label>
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          style={inputStyle(error)}
          {...rest}
        >
          <option value="">SELECT {label.replace("*", "").trim().toUpperCase()}</option>
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.label} value={opt.label}>{opt.label}</option>
            )
          )}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          style={inputStyle(error)}
          {...rest}
        />
      )}
      {error && (
        <div className="error-message" style={{
          color: "#e74c3c",
          fontSize: "0.9rem",
          marginTop: 5,
          display: "block"
        }}>{error}</div>
      )}
    </div>
  );
}

// --- Inline Styles ---
const statCardStyle = {
  background: "white",
  padding: 25,
  borderRadius: 15,
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
  transition: "transform 0.3s, box-shadow 0.3s",
};
const statTitleStyle = {
  color: "#2c3e50",
  marginBottom: 10,
  fontSize: "1.2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};
const statValueStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#007bff",
  marginBottom: 5,
};
const thStyle = {
  background: "#34495e",
  color: "white",
  padding: 15,
  textAlign: "left",
  fontWeight: 600,
  textTransform: "uppercase",
  fontSize: "0.9rem",
  position: "sticky",
  top: 0,
  zIndex: 10,
};
const btnStyle = {
  padding: "12px 25px",
  border: "none",
  borderRadius: 8,
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  textTransform: "uppercase",
  marginRight: 10,
  marginBottom: 10,
};
const btnSmStyle = {
  padding: "6px 12px",
  fontSize: "0.8rem",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: 4,
};

function inputStyle(error) {
  return {
    width: "100%",
    padding: "12px 15px",
    border: `2px solid ${error ? "#e74c3c" : "#e0e0e0"}`,
    borderRadius: 8,
    fontSize: "1rem",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxShadow: error
      ? "0 0 0 3px rgba(231, 76, 60, 0.1)"
      : undefined,
    outline: "none",
  };
}