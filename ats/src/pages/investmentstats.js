import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";

// --- Advanced Styles ---
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #232946 0%, #38b6ff 100%)",
    padding: 0,
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    maxWidth: 1200,
    margin: "48px auto",
    background: "rgba(255,255,255,0.97)",
    borderRadius: 28,
    boxShadow: "0 12px 48px rgba(60,60,120,0.18), 0 2px 12px #b3e0ff",
    padding: "44px 38px 38px 38px",
    position: "relative",
    zIndex: 1,
    backdropFilter: "blur(8px)",
    color: "#232946",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 22,
    marginBottom: 38,
    justifyContent: "center",
  },
  icon: {
    background: "linear-gradient(135deg, #38b6ff 40%, #4f8cff 100%)",
    color: "#fff",
    borderRadius: "50%",
    padding: "18px 22px",
    fontSize: "2.7rem",
    boxShadow: "0 2px 16px #38b6ff",
    display: "inline-block",
  },
  title: {
    fontWeight: 900,
    fontSize: "2.5rem",
    color: "#2196f3",
    letterSpacing: "2px",
    margin: 0,
    textShadow: "0 2px 12px #e0e7ef",
  },
  statsRow: {
    display: "flex",
    gap: 38,
    margin: "38px 0",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: 180,
    background: "linear-gradient(120deg,#e3f6fd 60%,#f8fafc 100%)",
    borderRadius: 18,
    boxShadow: "0 2px 12px #e0e7ef",
    padding: 28,
    textAlign: "center",
    color: "#232946",
    fontWeight: 800,
    fontSize: 26,
    position: "relative",
    transition: "transform 0.15s",
    cursor: "pointer",
  },
  statLabel: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 8,
    color: "#2196f3",
    letterSpacing: "1px",
  },
  statValue: {
    fontSize: 32,
    fontWeight: 900,
    color: "#232946",
    marginBottom: 4,
  },
  statSub: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  chartBox: {
    margin: "44px 0 0 0",
    background: "rgba(255,255,255,0.98)",
    borderRadius: 22,
    boxShadow: "0 2px 24px rgba(60,60,120,0.13)",
    padding: "32px 24px 24px 24px",
    color: "#2196f3",
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chartTitle: {
    textAlign: "center",
    color: "#2196f3",
    fontWeight: 800,
    fontSize: "1.35rem",
    marginBottom: 18,
    letterSpacing: "1.5px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 28,
    alignItems: "end",
    marginBottom: 24,
    marginTop: 12,
    background: "linear-gradient(120deg,#e3f6fd 60%,#f8fafc 100%)",
    borderRadius: 18,
    padding: "28px 18px",
    boxShadow: "0 2px 12px #e0e7ef",
  },
  label: {
    fontWeight: 700,
    marginBottom: 4,
    display: "block",
    color: "#2196f3",
    fontSize: 15,
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: 7,
    borderRadius: 10,
    border: "1.5px solid #bfc9d1",
    fontSize: "1.09rem",
    background: "#f4f7fa",
    color: "#232946",
    marginBottom: 2,
    outline: "none",
    boxShadow: "none",
    transition: "border 0.18s",
  },
  error: {
    color: "#ef476f",
    fontSize: "0.98em",
    marginTop: 2,
    marginBottom: 0,
  },
  button: {
    gridColumn: "span 2",
    width: "100%",
    padding: 16,
    marginTop: 18,
    background: "linear-gradient(90deg, #38b6ff 60%, #4f8cff 100%)",
    color: "white",
    fontSize: 20,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: 1,
    boxShadow: "0 2px 12px rgba(79,140,255,0.13)",
    transition: "background 0.2s, transform 0.1s",
  },
  table: {
    width: "100%",
    marginTop: 44,
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "rgba(255,255,255,0.97)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(60,60,120,0.13)",
    color: "#232946",
    fontSize: "1.08rem",
  },
  th: {
    background: "#e3f6fd",
    color: "#2196f3",
    fontWeight: 800,
    padding: "14px 10px",
    fontSize: "1.08rem",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #b2fefa",
  },
  td: {
    padding: "12px 8px",
    borderBottom: "1px solid #e0e7ef",
    background: "#f8fafc",
    fontWeight: 600,
    color: "#232946",
  },
  actionBtn: {
    margin: "0 3px",
    padding: "8px 15px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "1em",
    background: "#17a2b8",
    color: "white",
    transition: "background 0.15s, color 0.15s",
    fontWeight: 700,
  },
  edit: { background: "#ffc107", color: "#1b2d44" },
  view: { background: "#17a2b8", color: "white" },
  delete: { background: "#e53935", color: "white" },
};

const initialState = {
  investmentId: "",
  investorName: "",
  investmentType: "",
  amount: "",
  date: "",
  remarks: "",
};

const investmentTypes = [
  "Equity",
  "Debt",
  "Grant",
  "Angel",
  "Venture Capital",
  "Other",
];

export default function InvestmentStats({ darkMode }) {
  const [form, setForm] = useState(initialState);
  const [investments, setInvestments] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Chart update
  useEffect(() => {
    const typeTotals = {};
    investments.forEach(inv => {
      if (!typeTotals[inv.investmentType]) typeTotals[inv.investmentType] = 0;
      typeTotals[inv.investmentType] += Number(inv.amount);
    });
    const labels = Object.keys(typeTotals);
    const data = Object.values(typeTotals);

    if (chartInstance.current) {
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = data;
      chartInstance.current.update();
    } else if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              label: "Total Amount (₹)",
              data,
              backgroundColor: [
                "#38b6ff", "#ffc107", "#17a2b8", "#e53935", "#b2fefa", "#4f8cff"
              ],
              borderRadius: 10,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true, position: "bottom" } },
        },
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [investments]);

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.investmentId) {
      errs.investmentId = "Investment ID is required.";
    } else if (!/^INVST\d{4,}$/.test(form.investmentId)) {
      errs.investmentId = "Investment ID must be in format INVST followed by 4+ digits (e.g., INVST1001).";
    }
    if (!form.investorName) {
      errs.investorName = "Investor Name is required.";
    } else if (!/^[A-Z][a-zA-Z ]{2,39}$/.test(form.investorName)) {
      errs.investorName = "Investor Name must start with a capital letter and be 3-40 letters/spaces.";
    }
    if (!form.investmentType) {
      errs.investmentType = "Please select an investment type.";
    }
    if (!form.amount) {
      errs.amount = "Amount is required.";
    } else if (!/^[1-9]\d*$/.test(form.amount)) {
      errs.amount = "Amount must be a positive number.";
    }
    if (!form.date) {
      errs.date = "Please select a valid date.";
    }
    if (form.remarks && (!/^[A-Z]/.test(form.remarks) || form.remarks.length > 120)) {
      errs.remarks = form.remarks.length > 120
        ? "Remarks must be less than 120 characters."
        : "Remarks must start with a capital letter.";
    }
    return errs;
  };

  // Handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]:
        id === "investorName" && value.length > 0
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : id === "remarks" && value.length > 0
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const entry = {
      investmentId: form.investmentId,
      investorName: form.investorName,
      investmentType: form.investmentType,
      amount: form.amount,
      date: form.date,
      remarks: form.remarks,
    };

    let updatedList;
    if (editIndex === -1) {
      updatedList = [...investments, entry];
    } else {
      updatedList = [...investments];
      updatedList[editIndex] = entry;
    }
    setInvestments(updatedList);
    setForm(initialState);
    setEditIndex(-1);
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(investments[idx]);
    setEditIndex(idx);
    setErrors({});
  };

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      setInvestments(investments.filter((_, i) => i !== idx));
      setForm(initialState);
      setEditIndex(-1);
      setErrors({});
    }
  };

  const handleView = (idx) => {
    const item = investments[idx];
    alert(
      `Investment ID: ${item.investmentId}\n` +
        `Investor Name: ${item.investorName}\n` +
        `Type: ${item.investmentType}\n` +
        `Amount: ₹${item.amount}\n` +
        `Date: ${item.date}\n` +
        `Remarks: ${item.remarks}`
    );
  };

  // Stats
  const totalInvestments = investments.length;
  const totalAmount = investments.reduce((sum, item) => sum + (parseInt(item.amount) || 0), 0);
  const avgAmount = totalInvestments ? Math.round(totalAmount / totalInvestments) : 0;
  const topType = (() => {
    const typeTotals = {};
    investments.forEach(inv => {
      if (!typeTotals[inv.investmentType]) typeTotals[inv.investmentType] = 0;
      typeTotals[inv.investmentType] += Number(inv.amount);
    });
    let maxType = "N/A", maxVal = -1;
    Object.entries(typeTotals).forEach(([type, val]) => {
      if (val > maxVal) { maxType = type; maxVal = val; }
    });
    return maxType;
  })();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>
            <i className="bi bi-piggy-bank-fill"></i>
          </span>
          <h2 style={styles.title}>Investment Stats</h2>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard} title="Total Investments">
            <div style={styles.statLabel}>
              <i className="bi bi-graph-up" style={{ marginRight: 8, color: "#2196f3" }}></i>
              Total Investments
            </div>
            <div style={styles.statValue}>{totalInvestments}</div>
            <div style={styles.statSub}>All investment records</div>
          </div>
          <div style={styles.statCard} title="Total Amount">
            <div style={styles.statLabel}>
              <i className="bi bi-currency-rupee" style={{ marginRight: 8, color: "#38b6ff" }}></i>
              Total Amount
            </div>
            <div style={styles.statValue}>₹{totalAmount}</div>
            <div style={styles.statSub}>Across all types</div>
          </div>
          <div style={styles.statCard} title="Average Amount">
            <div style={styles.statLabel}>
              <i className="bi bi-bar-chart" style={{ marginRight: 8, color: "#17a2b8" }}></i>
              Average Amount
            </div>
            <div style={styles.statValue}>₹{avgAmount}</div>
            <div style={styles.statSub}>Per investment</div>
          </div>
          <div style={styles.statCard} title="Top Investment Type">
            <div style={styles.statLabel}>
              <i className="bi bi-award" style={{ marginRight: 8, color: "#ffc107" }}></i>
              Top Type
            </div>
            <div style={styles.statValue}>{topType}</div>
            <div style={styles.statSub}>Highest total amount</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={styles.form}>
            <div>
              <label htmlFor="investmentId" style={styles.label}>Investment ID</label>
              <input
                id="investmentId"
                value={form.investmentId}
                onChange={handleChange}
                placeholder="e.g., INVST1001"
                style={{
                  ...styles.input,
                  border: errors.investmentId ? "2px solid #ef476f" : styles.input.border,
                  background: errors.investmentId ? "#ffe5e5" : styles.input.background,
                  boxShadow: errors.investmentId ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
                autoComplete="off"
              />
              {errors.investmentId && <div style={styles.error}>{errors.investmentId}</div>}
            </div>
            <div>
              <label htmlFor="investorName" style={styles.label}>Investor Name</label>
              <input
                id="investorName"
                value={form.investorName}
                onChange={handleChange}
                placeholder="e.g., Raju Sharma"
                style={{
                  ...styles.input,
                  border: errors.investorName ? "2px solid #ef476f" : styles.input.border,
                  background: errors.investorName ? "#ffe5e5" : styles.input.background,
                  boxShadow: errors.investorName ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
                autoComplete="off"
              />
              {errors.investorName && <div style={styles.error}>{errors.investorName}</div>}
            </div>
            <div>
              <label htmlFor="investmentType" style={styles.label}>Investment Type</label>
              <select
                id="investmentType"
                value={form.investmentType}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.investmentType ? "2px solid #ef476f" : styles.input.border,
                  background: errors.investmentType ? "#ffe5e5" : styles.input.background,
                  boxShadow: errors.investmentType ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              >
                <option value="">Select Type</option>
                {investmentTypes.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.investmentType && <div style={styles.error}>{errors.investmentType}</div>}
            </div>
            <div>
              <label htmlFor="amount" style={styles.label}>Amount (₹)</label>
              <input
                id="amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g., 100000"
                style={{
                  ...styles.input,
                  border: errors.amount ? "2px solid #ef476f" : styles.input.border,
                  background: errors.amount ? "#ffe5e5" : styles.input.background,
                  boxShadow: errors.amount ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
                autoComplete="off"
              />
              {errors.amount && <div style={styles.error}>{errors.amount}</div>}
            </div>
            <div>
              <label htmlFor="date" style={styles.label}>Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.date ? "2px solid #ef476f" : styles.input.border,
                  background: errors.date ? "#ffe5e5" : styles.input.background,
                  boxShadow: errors.date ? "0 0 0 2px #ef476f33" : "none"
                }}
                required
              />
              {errors.date && <div style={styles.error}>{errors.date}</div>}
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label htmlFor="remarks" style={styles.label}>Remarks</label>
              <textarea
                id="remarks"
                rows={2}
                maxLength={120}
                value={form.remarks}
                onChange={handleChange}
                placeholder="Optional: Any remarks (max 120 chars)"
                style={{
                  ...styles.input,
                  border: errors.remarks ? "2px solid #ef476f" : styles.input.border,
                  background: errors.remarks ? "#ffe5e5" : styles.input.background,
                  boxShadow: errors.remarks ? "0 0 0 2px #ef476f33" : "none",
                  minHeight: 38,
                  resize: "vertical"
                }}
              />
              {errors.remarks && <div style={styles.error}>{errors.remarks}</div>}
            </div>
            <button type="submit" style={styles.button}>
              {editIndex === -1 ? "Save Investment" : "Update Investment"}
            </button>
          </div>
        </form>

        <div style={styles.chartBox}>
          <div style={{ flex: "1 1 340px", minWidth: 340 }}>
            <div style={styles.chartTitle}>Investment Amount by Type</div>
            <canvas ref={chartRef} height={110} />
          </div>
          <div style={{
            flex: "1 1 340px",
            minWidth: 340,
            background: "#f8fafc",
            borderRadius: 18,
            boxShadow: "0 2px 12px #e0e7ef",
            padding: "24px 18px",
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "#2196f3",
              marginBottom: 10,
              letterSpacing: "1px"
            }}>
              Investment Insights
            </div>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "1.08rem",
              color: "#232946",
              width: "100%",
              textAlign: "left"
            }}>
              <li>
                <b>Total Investments:</b> {totalInvestments}
              </li>
              <li>
                <b>Total Amount:</b> ₹{totalAmount}
              </li>
              <li>
                <b>Average Amount:</b> ₹{avgAmount}
              </li>
              <li>
                <b>Top Investment Type:</b> {topType}
              </li>
              <li>
                <b>Last Entry:</b> {investments.length ? investments[investments.length - 1].investmentType : "N/A"}
              </li>
            </ul>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Investment ID</th>
              <th style={styles.th}>Investor Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount (₹)</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Remarks</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.investmentId}</td>
                <td style={styles.td}>{item.investorName}</td>
                <td style={styles.td}>{item.investmentType}</td>
                <td style={styles.td}>₹{item.amount}</td>
                <td style={styles.td}>{item.date}</td>
                <td style={styles.td}>{item.remarks}</td>
                <td style={styles.td}>
                  <button
                    className="action-btn view"
                    style={{ ...styles.actionBtn, ...styles.view }}
                    onClick={() => handleView(idx)}
                    title="View"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="action-btn edit"
                    style={{ ...styles.actionBtn, ...styles.edit }}
                    onClick={() => handleEdit(idx)}
                    title="Edit"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="action-btn delete"
                    style={{ ...styles.actionBtn, ...styles.delete }}
                    onClick={() => handleDelete(idx)}
                    title="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {investments.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#888", fontSize: "1.1em" }}>
                  No investment records found. Please add new investments above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
