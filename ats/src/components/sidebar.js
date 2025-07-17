import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const labels = {
	dashboard: { en: "Dashboard", es: "Tablero", fr: "Tableau de bord" },
	farmers: { en: "Farmers", es: "Agricultores", fr: "Agriculteurs" },
	milk: { en: "Milk Collection", es: "Recolección de leche", fr: "Collecte de lait" },
	inventory: { en: "Inventory", es: "Inventario", fr: "Inventaire" },
	payments: { en: "Payments", es: "Pagos", fr: "Paiements" },
	investmentstats: { en: "Investment Stats", es: "Estadísticas de inversión", fr: "Statistiques d'investissement" },
	reports: { en: "Reports", es: "Informes", fr: "Rapports" },
	settings: { en: "Settings", es: "Configuración", fr: "Paramètres" },
	// Add more if needed
};

const menuSections = [
	{
		heading: "Main",
		icon: "bi bi-house-door",
		items: [
			{ icon: "bi bi-speedometer2", label: "Dashboard", page: "dashboard", color: "#43c6ac" },
			{ icon: "bi bi-people", label: "Farmers", page: "farmers", color: "#2196f3" },
			{ icon: "bi bi-cup-straw", label: "Milk Collection", page: "milkcollection", color: "#f4c430" },
			{ icon: "bi bi-box-seam", label: "Inventory", page: "inventory", color: "#8e44ad" },
			// { icon: "bi bi-check2-circle", label: "Quality", page: "quality", color: "#f4c430" }, // Removed
		],
	},
	{
		heading: "Management",
		icon: "bi bi-briefcase",
		items: [
			{ icon: "bi bi-currency-rupee", label: "Payments", page: "payments", color: "#ff7043" },
			{ icon: "bi bi-graph-up-arrow", label: "Investment Stats", page: "investmentstats", color: "#009688" },
			{ icon: "bi bi-bar-chart-line", label: "Reports", page: "reports", color: "#7e57c2" },
			{ icon: "bi bi-gear", label: "Settings", page: "settings", color: "#3faffa" },
		],
	},
];

function Sidebar({
	collapsed = false,
	darkMode = false,
	onSelectPage,
	activePage = "dashboard",
	user = { name: "Narasimha", role: "Manager", avatar: "" },
	language = "en",
}) {
	return (
		<aside className={`modern-sidebar${collapsed ? " collapsed" : ""}${darkMode ? " dark" : ""}`}>
			<div className="sidebar-profile">
				<div className="sidebar-avatar">
					{user.avatar ? (
						<img src={user.avatar} alt="avatar" />
					) : (
						user.name[0]
					)}
				</div>
				{!collapsed && (
					<div>
						<div className="sidebar-username">{user.name}</div>
						<div className="sidebar-role">{user.role}</div>
					</div>
				)}
			</div>
			<div className="sidebar-menu">
				{menuSections.map((section, idx) => (
					<div key={section.heading} className="sidebar-section">
						<div className="sidebar-section-heading">
							<i className={section.icon} />
							{!collapsed && <span style={{ marginLeft: 6 }}>{section.heading}</span>}
						</div>
						<div className="sidebar-items">
							{section.items.map((item) => (
								<div
									key={item.label}
									className={`sidebar-link${activePage === item.page ? " active" : ""}`}
									onClick={() => onSelectPage(item.page)}
									title={item.label}
								>
									<span
										className="sidebar-link-icon"
										style={{
											color: item.color,
											background: activePage === item.page ? item.color + "22" : "transparent",
										}}
									>
										<i className={item.icon} />
									</span>
									{!collapsed && (
										<span className="sidebar-link-label">
											{labels[item.page] && labels[item.page][language]
												? labels[item.page][language]
												: item.label}
										</span>
									)}
								</div>
							))}
						</div>
						{/* Logout directly after Settings */}
						{/*
                        {section.heading === "Management" && (
                            <>
                                <div className="sidebar-logout" style={{ padding: "10px 10px" }}>
                                    <div className="sidebar-link" style={{ color: "#e74c3c" }}>
                                        <span className="sidebar-link-icon" style={{ color: "#e74c3c", background: "#e74c3c22" }}>
                                            <i className="bi bi-box-arrow-right" />
                                        </span>
                                        {!collapsed && <span className="sidebar-link-label">Logout</span>}
                                    </div>
                                </div>
                            </>
                        )}
                        */}
						{idx < menuSections.length - 1 && <div className="sidebar-divider" />}
					</div>
				))}
			</div>
			<style>{`
  .modern-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 190px;
    height: 100vh;
    background: linear-gradient(135deg, #e0f7fa 0%,rgb(157, 163, 161) 100%);
    background-blend-mode: overlay;
    backdrop-filter: blur(18px) saturate(1.2);
    box-shadow: 0 8px 32px 0 rgba(44,41,99,0.13), 2px 0 24px 0 rgba(44,41,99,0.10);
    border-right: 1.5px solidrgb(121, 123, 123);
    display: flex;
    flex-direction: column;
    transition: width 0.3s;
    z-index: 100;
    overflow: hidden;
  }
  .modern-sidebar.collapsed {
    width: 56px;
  }
  .modern-sidebar.dark {
    background: linear-gradient(135deg, #232946 0%, #16161a 100%);
    color: #fff;
    border-right: 1.5px solid #232946;
  }
  .modern-sidebar.dark,
  .modern-sidebar.dark .sidebar-section-heading,
  .modern-sidebar.dark .sidebar-link,
  .modern-sidebar.dark .sidebar-link-label,
  .modern-sidebar.dark .sidebar-profile,
  .modern-sidebar.dark .sidebar-role,
  .modern-sidebar.dark .sidebar-username {
    color: #fff !important;
  }
  .modern-sidebar.dark .sidebar-link-icon {
    background: #232946 !important;
    color: #fff !important;
  }
  .modern-sidebar.dark .sidebar-link.active,
  .modern-sidebar.dark .sidebar-link:hover {
    background: rgba(67,198,172,0.18) !important;
    color: #fff !important;
  }
  .modern-sidebar.dark .sidebar-link.active .sidebar-link-icon,
  .modern-sidebar.dark .sidebar-link:hover .sidebar-link-icon {
    background: #16161a !important;
    color: #fff !important;
  }
  .sidebar-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 12px 8px 12px; /* Reduced top and bottom padding */
    border-bottom: 1.5px solid #e5e7eb;
    min-height: 44px; /* Reduced min-height */
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(8px);
  }
  .modern-sidebar.collapsed .sidebar-profile {
    justify-content: center;
    padding: 18px 0 12px 0;
  }
  .sidebar-avatar {
    width: 38px;
    height: 38px;
    font-size: 18px;
    background: #e0e0e0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #232946;
    font-weight: bold;
  }
  .sidebar-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .sidebar-username {
    font-size: 17px;
    font-weight: 700;
    color: #232946;
    margin-bottom: 2px;
    letter-spacing: 1px; /* Match dashboard style */
    text-align: left;    /* Consistent alignment */
  }
  .sidebar-role {
    font-size: 13px;
    color: #888;
    letter-spacing: 1px; /* Match dashboard style */
    text-align: left;
  }
  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
    padding-top: 12px;
  }
  .sidebar-section {
    margin-bottom: 16px;
  }
  .sidebar-section-heading {
    font-size: 15px; /* Match dashboard title size */
    padding: 0 12px 8px 12px;
    gap: 8px;
    color:rgb(189, 23, 23);
    font-weight: 700;
    display: flex;
    align-items: center;
    letter-spacing: 1px; /* Match dashboard style */
    text-align: left;
  }
  .modern-sidebar.collapsed .sidebar-section-heading {
    justify-content: center;
    padding: 0 0 6px 0;
  }
  .sidebar-section-heading i {
    font-size: 18px;
    color:rgb(88, 156, 239);
  }
  .sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sidebar-link {
    font-size: 17px;
    padding: 10px 18px 10px 14px;
    border-radius: 12px;
    min-height: 38px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    position: relative;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    letter-spacing: 1px;
    font-weight: 700;
    text-align: left;
    background: #fff;
    box-shadow: 0 2px 8px #b2fefa44;
    margin-bottom: 8px;
    border: 1.5px solid #e0e7ef;
  }
  .modern-sidebar.dark .sidebar-link {
    background: #232946;
    color: #fff;
    box-shadow: 0 2px 8px #23294655;
    border: 1.5px solid #393e6e;
  }
  .sidebar-link.active,
  .sidebar-link:hover {
    background: #e0f7fa;
    color: #232946;
    font-weight: 700;
    box-shadow: 0 4px 16px #43c6ac33;
    border: 1.5px solidrgb(202, 212, 210);
  }
  .modern-sidebar.dark .sidebar-link.active,
  .modern-sidebar.dark .sidebar-link:hover {
    background: #16161a;
    color: #fff;
    box-shadow: 0 4px 16px #43c6ac33;
    border: 1.5px solidrgb(196, 202, 201);
  }
  .sidebar-link-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    transition: background 0.2s, color 0.2s;
  }
  .modern-sidebar.dark .sidebar-link-icon {
    background: #232946 !important;
    color: #fff !important;
  }
  .sidebar-link.active .sidebar-link-icon,
  .sidebar-link:hover .sidebar-link-icon {
    background: #fff;
    box-shadow: 0 2px 8px #b3e0ff44;
  }
  .modern-sidebar.dark .sidebar-link.active .sidebar-link-icon,
  .modern-sidebar.dark .sidebar-link:hover .sidebar-link-icon {
    background: #16161a !important;
    color: #fff !important;
  }
  .sidebar-divider {
    margin: 10px 10px 0 10px;
    border-bottom: 1px solid #e0e0e0;
  }
  .sidebar-logout {
    padding: 12px 12px;
  }
  .sidebar-help {
    margin-top: 24px;
  }
  /* Scrollbar styling for sidebar */
  .sidebar-menu::-webkit-scrollbar {
    width: 7px;
    background: #e0f7fa; /* Track color */
  }
  .sidebar-menu::-webkit-scrollbar-thumb {
    background:rgb(193, 199, 198); /* Thumb color changed for better visibility */
    border-radius: 7px;
  }
  .sidebar-menu::-webkit-scrollbar-thumb:hover {
    background: #2196f3; /* Thumb color on hover */
  }
`}</style>
		</aside>
	);
}

export default Sidebar;
