import React, { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Inventory from "./pages/inventory";
import InvestmentStats from "./pages/investmentstats";
import AuthPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import FarmerDatabase from "./pages/FarmerDatabase";
import MilkCollection from "./pages/milkcollection";
import Payments from "./pages/payments";
import Reports from "./pages/reports";
import Settings from "./pages/settings";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [language, setLanguage] = useState("en"); // "en", "es", "fr"

  const handleAuth = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowUserMenu(false);
    setActivePage("dashboard");
  };

  // Show login/signup page first
  if (!isAuthenticated) {
    return <AuthPage onAuth={handleAuth} setUserImage={setUserImage} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#232946" : "#f8fafc" }}>
      <Header
        onMenuToggle={() => setSidebarCollapsed((prev) => !prev)}
        onDarkToggle={() => setDarkMode((d) => !d)}
        darkMode={darkMode}
        onUserClick={() => setShowUserMenu((v) => !v)}
        showUserMenu={showUserMenu}
        onLogout={handleLogout}
        userImage={userImage}
        onSelectPage={setActivePage} // <-- Add this line
        language={language}
        setLanguage={setLanguage}
      />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          darkMode={darkMode}
          onSelectPage={setActivePage}
          activePage={activePage}
          language={language}
        />
        <div
          style={{
            flex: 1,
            marginLeft: sidebarCollapsed ? 56 : 190, // Match the sidebar width above
            minHeight: "calc(100vh - 64px)",
            paddingTop: 64,
            background: darkMode ? "#232946" : "#f8fafc",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            overflowY: "auto"
          }}
        >
          {/* User menu and overlays here if needed */}
          <div style={{ width: "100%" }}>
            {activePage === "dashboard" && <Dashboard darkMode={darkMode} />}
            {activePage === "farmers" && <FarmerDatabase darkMode={darkMode} />}
            {activePage === "milkcollection" && <MilkCollection darkMode={darkMode} />}
            {activePage === "inventory" && <Inventory darkMode={darkMode} />}
            {activePage === "payments" && <Payments darkMode={darkMode} />}
            {activePage === "investmentstats" && <InvestmentStats darkMode={darkMode} />}
            {activePage === "reports" && <Reports darkMode={darkMode} />}
            {activePage === "settings" && <Settings darkMode={darkMode} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
