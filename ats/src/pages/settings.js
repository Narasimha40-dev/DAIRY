import React, { useState } from "react";

const initialState = {
  username: "",
  email: "",
  password: "",
  language: "",
  theme: "",
  notifications: "",
  phone: "",         // Added
  address: "",       // Added
  organization: "",  // Added
};

const languageOptions = ["English", "हिन्दी", "తెలుగు", "Other"];
const themeOptions = ["Light", "Dark", "System Default"];
const notificationOptions = ["Enabled", "Disabled"];

export default function Settings({ darkMode }) {
  const [form, setForm] = useState(initialState);
  const [settingsList, setSettingsList] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.username) {
      errs.username = "Username is required.";
    } else if (!/^[A-Z][A-Za-z0-9]{4,19}$/.test(form.username)) {
      errs.username = "Username must start with a capital letter and be 5-20 letters/numbers.";
    }
    if (!form.email) {
      errs.email = "Email is required.";
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      errs.password = "Password must be at least 8 characters, include 1 uppercase letter and 1 number.";
    }
    if (!form.language) {
      errs.language = "Please select a language.";
    }
    if (!form.theme) {
      errs.theme = "Please select a theme.";
    }
    if (!form.notifications) {
      errs.notifications = "Please select notification preference.";
    }
    if (!form.phone) {
      errs.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phone)) {
      errs.phone = "Enter a valid 10-digit phone number.";
    }
    if (!form.address) {
      errs.address = "Address is required.";
    }
    if (!form.organization) {
      errs.organization = "Organization is required.";
    }
    return errs;
  };

  // Handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const entry = {
      username: form.username,
      email: form.email,
      language: form.language,
      theme: form.theme,
      notifications: form.notifications,
      phone: form.phone,
      address: form.address,
      organization: form.organization,
    };

    let updatedList;
    if (editIndex === -1) {
      updatedList = [...settingsList, entry];
    } else {
      updatedList = [...settingsList];
      updatedList[editIndex] = entry;
    }
    setSettingsList(updatedList);
    setForm(initialState);
    setEditIndex(-1);
    setErrors({});
  };

  const handleEdit = (idx) => {
    const entry = settingsList[idx];
    setForm({
      ...entry,
      password: "",
    });
    setEditIndex(idx);
    setErrors({});
  };

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this settings entry?")) {
      const updatedList = settingsList.filter((_, i) => i !== idx);
      setSettingsList(updatedList);
      setForm(initialState);
      setEditIndex(-1);
      setErrors({});
    }
  };

  const handleView = (idx) => {
    const item = settingsList[idx];
    alert(
      `Username: ${item.username}\n` +
      `Email: ${item.email}\n` +
      `Phone: ${item.phone}\n` +
      `Address: ${item.address}\n` +
      `Organization: ${item.organization}\n` +
      `Language: ${item.language}\n` +
      `Theme: ${item.theme}\n` +
      `Notifications: ${item.notifications}`
    );
  };

  // --- Dark mode styles ---
  const styles = {
    bg: {
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg, #232946 0%, #16161a 100%)"
        : "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
      position: "relative",
      overflowX: "hidden",
    },
    bgImg: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,
      pointerEvents: "none",
      opacity: darkMode ? 0.10 : 0.12,
      background: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat",
      filter: darkMode ? "blur(2.5px) grayscale(0.15)" : "blur(2.5px) grayscale(0.09)",
    },
    container: {
      maxWidth: 1000,
      margin: "0 auto 40px auto",
      background: darkMode ? "rgba(35,41,70,0.97)" : "rgba(255,255,255,0.97)",
      borderRadius: 24,
      boxShadow: darkMode
        ? "0 8px 32px rgba(35,41,70,0.30), 0 2px 12px #232946"
        : "0 8px 32px rgba(67,198,172,0.13), 0 2px 12px #f8ffae",
      padding: "38px 32px 28px 32px",
      position: "relative",
      zIndex: 1,
      backdropFilter: "blur(6px)",
      color: darkMode ? "#fff" : "#232946",
    },
    heading: {
      textAlign: "center",
      color: darkMode ? "#b2fefa" : "#43c6ac",
      marginBottom: 28,
      letterSpacing: "1.2px",
      fontSize: "2rem",
      fontWeight: 800,
      textShadow: darkMode ? "0 2px 12px #232946" : "0 2px 12px #f8ffae",
    },
    iconCircle: {
      background: darkMode
        ? "linear-gradient(135deg, #232946 40%, #393e6e 100%)"
        : "linear-gradient(135deg, #43c6ac 40%, #f8ffae 100%)",
      color: "#fff",
      borderRadius: "50%",
      padding: "13px 17px",
      fontSize: "2.2rem",
      marginBottom: 8,
      boxShadow: darkMode ? "0 2px 12px #232946" : "0 2px 12px #f8ffae",
      display: "inline-block",
    },
    input: {
      width: "100%",
      padding: "11px",
      marginTop: 6,
      borderRadius: 9,
      border: darkMode ? "1.5px solid #393e6e" : "1.5px solid #bfc9d1",
      fontSize: "1.05rem",
      background: darkMode ? "#16161a" : "#f6fbe7",
      color: darkMode ? "#fff" : "#232946",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
      boxShadow: darkMode
        ? "0 1px 6px rgba(35,41,70,0.10)"
        : "0 1px 6px rgba(67,198,172,0.06)",
      resize: "none",
      marginBottom: 2,
    },
    error: {
      color: "#e53935",
      fontSize: "0.97em",
      marginTop: 2,
      marginBottom: 0,
    },
    button: {
      width: "100%",
      padding: 13,
      marginTop: 28,
      background: darkMode
        ? "linear-gradient(90deg, #393e6e 60%, #232946 100%)"
        : "linear-gradient(90deg, #43c6ac 60%, #f8ffae 100%)",
      color: darkMode ? "#fff" : "#1b2d44",
      fontSize: 18,
      border: "none",
      borderRadius: 9,
      cursor: "pointer",
      fontWeight: 700,
      letterSpacing: 1,
      boxShadow: darkMode
        ? "0 2px 12px rgba(35,41,70,0.13)"
        : "0 2px 12px rgba(67,198,172,0.13)",
      transition: "background 0.2s, transform 0.1s",
    },
    settingsSection: {
      margin: "30px 0 0 0",
      background: darkMode ? "rgba(35,41,70,0.98)" : "rgba(255,255,255,0.98)",
      borderRadius: 14,
      boxShadow: darkMode
        ? "0 2px 12px rgba(35,41,70,0.20)"
        : "0 2px 12px rgba(67,198,172,0.10)",
      padding: "18px 14px 10px 14px",
    },
    settingsTitle: {
      textAlign: "center",
      color: darkMode ? "#b2fefa" : "#43c6ac",
      fontWeight: 700,
      fontSize: "1.1rem",
      marginBottom: 8,
      letterSpacing: "1px",
    },
    table: {
      width: "100%",
      marginTop: 30,
      borderCollapse: "separate",
      borderSpacing: 0,
      background: darkMode ? "rgba(35,41,70,0.97)" : "rgba(255,255,255,0.97)",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: darkMode
        ? "0 2px 12px rgba(35,41,70,0.20)"
        : "0 2px 12px rgba(67,198,172,0.10)",
      color: darkMode ? "#fff" : "#232946",
    },
    actionBtn: {
      margin: "0 3px",
      padding: "7px 12px",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: "1em",
      transition: "background 0.15s, color 0.15s",
    },
    edit: { background: "#ffc107", color: darkMode ? "#232946" : "#1b2d44" },
    view: { background: "#17a2b8", color: "#fff" },
    delete: { background: "#e53935", color: "#fff" },
  };

  return (
    <div style={styles.bg}>
      <div className="settings-bg" style={styles.bgImg}></div>
      <div style={styles.container}>
        <div style={{ textAlign: "center" }}>
          <span style={styles.iconCircle}>
            <i className="bi bi-gear-fill"></i>
          </span>
        </div>
        <h2 style={styles.heading}>Settings</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={handleChange}
            placeholder="e.g., Nani123"
            required
            style={styles.input}
          />
          {errors.username && <div style={styles.error}>{errors.username}</div>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g., abcde@example.com"
            required
            style={styles.input}
          />
          {errors.email && <div style={styles.error}>{errors.email}</div>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters, 1 number, 1 uppercase"
            required
            style={styles.input}
          />
          {errors.password && <div style={styles.error}>{errors.password}</div>}

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g., 9876543210"
            required
            style={styles.input}
            maxLength={10}
          />
          {errors.phone && <div style={styles.error}>{errors.phone}</div>}

          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g., 123 Main St, Hyderabad"
            required
            style={styles.input}
          />
          {errors.address && <div style={styles.error}>{errors.address}</div>}

          <label htmlFor="organization">Organization</label>
          <input
            id="organization"
            type="text"
            value={form.organization}
            onChange={handleChange}
            placeholder="e.g., Astrolite Dairy"
            required
            style={styles.input}
          />
          {errors.organization && <div style={styles.error}>{errors.organization}</div>}

          <label htmlFor="language">Preferred Language</label>
          <select
            id="language"
            value={form.language}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Language</option>
            {languageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.language && <div style={styles.error}>{errors.language}</div>}

          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={form.theme}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Theme</option>
            {themeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.theme && <div style={styles.error}>{errors.theme}</div>}

          <label htmlFor="notifications">Notifications</label>
          <select
            id="notifications"
            value={form.notifications}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Option</option>
            {notificationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.notifications && <div style={styles.error}>{errors.notifications}</div>}

          <button type="submit" style={styles.button}>
            {editIndex === -1 ? "Save Settings" : "Update Settings"}
          </button>
        </form>

        {settingsList.length > 0 && (
          <div style={styles.settingsSection}>
            <div style={styles.settingsTitle}>Saved Settings</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Organization</th>
                  <th>Language</th>
                  <th>Theme</th>
                  <th>Notifications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingsList.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.organization}</td>
                    <td>{item.language}</td>
                    <td>{item.theme}</td>
                    <td>{item.notifications}</td>
                    <td>
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
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
    position: "relative",
    overflowX: "hidden",
  },
  bgImg: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    pointerEvents: "none",
    opacity: 0.12,
    background: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat",
    filter: "blur(2.5px) grayscale(0.09)",
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto 40px auto", // Removed top margin to eliminate gap below header
    background: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    boxShadow: "0 8px 32px rgba(67,198,172,0.13), 0 2px 12px #f8ffae",
    padding: "38px 32px 28px 32px",
    position: "relative",
    zIndex: 1,
    backdropFilter: "blur(6px)",
  },
  heading: {
    textAlign: "center",
    color: "#43c6ac",
    marginBottom: 28,
    letterSpacing: "1.2px",
    fontSize: "2rem",
    fontWeight: 800,
    textShadow: "0 2px 12px #f8ffae",
  },
  iconCircle: {
    background: "linear-gradient(135deg, #43c6ac 40%, #f8ffae 100%)",
    color: "#fff",
    borderRadius: "50%",
    padding: "13px 17px",
    fontSize: "2.2rem",
    marginBottom: 8,
    boxShadow: "0 2px 12px #f8ffae",
    display: "inline-block",
  },
  input: {
    width: "100%",
    padding: "11px",
    marginTop: 6,
    borderRadius: 9,
    border: "1.5px solid #bfc9d1",
    fontSize: "1.05rem",
    background: "#f6fbe7",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    boxShadow: "0 1px 6px rgba(67,198,172,0.06)",
    resize: "none",
    marginBottom: 2,
  },
  error: {
    color: "#e53935",
    fontSize: "0.97em",
    marginTop: 2,
    marginBottom: 0,
  },
  button: {
    width: "100%",
    padding: 13,
    marginTop: 28,
    background: "linear-gradient(90deg, #43c6ac 60%, #f8ffae 100%)",
    color: "#1b2d44",
    fontSize: 18,
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 1,
    boxShadow: "0 2px 12px rgba(67,198,172,0.13)",
    transition: "background 0.2s, transform 0.1s",
  },
  settingsSection: {
    margin: "30px 0 0 0",
    background: "rgba(255,255,255,0.98)",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(67,198,172,0.10)",
    padding: "18px 14px 10px 14px",
  },
  settingsTitle: {
    textAlign: "center",
    color: "#43c6ac",
    fontWeight: 700,
    fontSize: "1.1rem",
    marginBottom: 8,
    letterSpacing: "1px",
  },
  table: {
    width: "100%",
    marginTop: 30,
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "rgba(255,255,255,0.97)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(67,198,172,0.10)",
  },
  actionBtn: {
    margin: "0 3px",
    padding: "7px 12px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "1em",
    transition: "background 0.15s, color 0.15s",
  },
  edit: { background: "#ffc107", color: "#1b2d44" },
  view: { background: "#17a2b8", color: "#fff" },
  delete: { background: "#e53935", color: "#fff" },
};