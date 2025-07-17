import React, { useState } from "react";

export default function Header({
  onMenuToggle,
  onDarkToggle,
  darkMode,
  onUserClick,
  showUserMenu,
  onLogout,
  userImage,
  onSelectPage,
  language,
  setLanguage,
}) {
  const [search, setSearch] = useState("");

  const searchFields = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Farmers", key: "farmers" },
    { label: "Milk Collection", key: "milkcollection" },
    { label: "Inventory", key: "inventory" },
    { label: "Payments", key: "payments" },
    { label: "Investment Stats", key: "investmentstats" },
    { label: "Reports", key: "reports" },
    { label: "Settings", key: "settings" },
  ];

  function handleSearch(e) {
    e.preventDefault();
    const found = searchFields.find(
      (f) =>
        f.label.toLowerCase() === search.trim().toLowerCase() ||
        f.label.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (found && onSelectPage) {
      onSelectPage(found.key);
      setSearch("");
    }
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: darkMode ? "#232946" : "#f5e9da", // Light brown for light mode
        padding: "0 32px 0 0",
        height: 72,
        boxSizing: "border-box",
        boxShadow: "0 4px 16px rgba(44,41,99,0.10)",
        borderBottom: darkMode ? "1px solid #232946" : "1px solid #e0e7ef",
      }}
    >
      {/* Left: Logo and Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 0 }}>
        <img
          src={process.env.PUBLIC_URL + "/wallpaper.png"}
          alt="Astrolite Logo"
          style={{
            width: 110,
            height: 54,
            background: "#fff",
            borderRadius: 10,
            padding: 4,
            objectFit: "contain",
            boxShadow: "0 2px 8px #43c6ac33",
            border: "2px solid #43c6ac",
            marginLeft: 0, // No gap on left
          }}
        />
        <button
          onClick={onMenuToggle}
          style={{
            background: darkMode ? "#232946" : "#43c6ac",
            border: "none",
            fontSize: 28,
            color: "#fff",
            cursor: "pointer",
            borderRadius: 8,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #43c6ac33",
            marginLeft: 8,
          }}
          title="Menu"
        >
          &#9776;
        </button>
      </div>

      {/* Center: Search Bar */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <form
          style={{
            background: darkMode ? "#232946" : "#fff",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            width: 400,
            boxShadow: "0 2px 8px rgba(67,198,172,0.13)",
            border: darkMode ? "1px solid #6366f1" : "1px solid #43c6ac",
            transition: "border 0.2s",
          }}
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search modules, pages..."
            style={{
              border: "none",
              outline: "none",
              padding: "12px 0",
              flex: 1,
              background: "transparent",
              color: darkMode ? "#fff" : "#232946",
              fontSize: 16,
              letterSpacing: 0.5,
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            list="dashboard-fields"
          />
          <datalist id="dashboard-fields">
            {searchFields.map((f) => (
              <option key={f.key} value={f.label} />
            ))}
          </datalist>
          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              color: "#43c6ac",
              fontSize: 22,
              cursor: "pointer",
              padding: 0,
              marginLeft: 8,
              transition: "color 0.2s",
            }}
            title="Search"
          >
            <span role="img" aria-label="search">
              &#128269;
            </span>
          </button>
        </form>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Notification */}
        <span
          title="Notifications"
          style={{
            fontSize: 22,
            color: "#fff",
            cursor: "pointer",
            background: darkMode ? "#232946" : "#43c6ac",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #43c6ac33",
          }}
        >
          &#128276;
        </span>
        {/* Dark Mode */}
        <span
          title="Toggle Dark Mode"
          style={{
            fontSize: 22,
            color: "#fff",
            cursor: "pointer",
            background: darkMode ? "#6366f1" : "#43c6ac",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #43c6ac33",
          }}
          onClick={onDarkToggle}
        >
          {darkMode ? "🌞" : "🌙"}
        </span>
        {/* User */}
        <div style={{ position: "relative" }}>
          <button
            className="user-icon-btn"
            onClick={onUserClick}
            style={{
              background: darkMode ? "#232946" : "#43c6ac",
              border: "none",
              cursor: "pointer",
              fontSize: 24,
              marginLeft: 8,
              padding: 0,
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px #43c6ac33",
            }}
            title="User"
          >
            {userImage ? (
              <img
                src={userImage}
                alt="Profile"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #43c6ac",
                  background: "#fff",
                }}
              />
            ) : (
              <span role="img" aria-label="user">
                👤
              </span>
            )}
          </button>
          {showUserMenu && (
            <div
              className="user-menu-dropdown"
              style={{
                position: "absolute",
                right: 0,
                top: 44,
                background: darkMode ? "#232946" : "#fff",
                color: darkMode ? "#fff" : "#232946",
                border: "1px solid #e0e7ef",
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(44,41,99,0.13)",
                zIndex: 1000,
                minWidth: 140,
              }}
            >
              <button
                onClick={onLogout}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "12px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "inherit",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                <span role="img" aria-label="logout" style={{ marginRight: 8 }}>
                  🚪
                </span>
                Logout
              </button>
            </div>
          )}
        </div>
        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            borderRadius: 16,
            border: "none",
            padding: "6px 16px",
            fontSize: 15,
            background: darkMode ? "#434190" : "#fff",
            color: darkMode ? "#fff" : "#333",
            appearance: "none",
            backgroundImage:
              darkMode &&
              "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"%23ffffff\" class=\"bi bi-chevron-down\"><path fill-rule=\"evenodd\" d=\"M1.5 4a.5.5 0 0 1 .854-.354L8 8.293l5.646-4.646A.5.5 0 0 1 14.5 4h-13z\"/></svg>')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "12px 12px",
          }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </header>
  );
}