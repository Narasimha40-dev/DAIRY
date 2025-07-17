import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { FaHome } from "react-icons/fa";
import { GiCow, GiMilkCarton } from "react-icons/gi";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// --- Milk States Data for Graph ---
const initialMilkStates = [
  { state: "Uttar Pradesh", value: 14902 },
  { state: "Punjab", value: 9028 },
  { state: "Rajasthan", value: 7770 },
  { state: "Maharashtra", value: 6511 },
  { state: "Andhra Pradesh", value: 5922 },
  { state: "Gujarat", value: 5387 },
  { state: "Madhya Pradesh", value: 5306 },
  { state: "Haryana", value: 4983 },
  { state: "Tamil Nadu", value: 4695 },
  { state: "Karnataka", value: 4656 },
];

const milkStatesColors = [
  "#38b6ff", "#ffc107", "#17a2b8", "#e53935", "#b2fefa",
  "#4f8cff", "#43c6ac", "#fbbf24", "#7c3aed", "#ef476f"
];

const getMilkStatesChartData = (milkStates) => ({
  labels: milkStates.map(s => s.state),
  datasets: [
    {
      label: "Production (tonnes)",
      data: milkStates.map(s => s.value),
      backgroundColor: milkStatesColors,
      borderRadius: 8,
      barThickness: 32,
    }
  ]
});

const milkStatesChartOptions = {
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

const milkDataByYear = {
  "2024": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Morning Shift",
        data: [1200, 1350, 1400, 1300, 1450, 1380, 1420, 1390],
        backgroundColor: "rgba(63,175,250,0.55)",
        borderRadius: 8,
        barThickness: 28,
      },
      {
        label: "Evening Shift",
        data: [1100, 1250, 1300, 1200, 1350, 1280, 1320, 1290],
        backgroundColor: "rgba(99,102,241,0.55)",
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  },
  "2023": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Morning Shift",
        data: [1150, 1200, 1250, 1230, 1300, 1280, 1310, 1270],
        backgroundColor: "rgba(63,175,250,0.55)",
        borderRadius: 8,
        barThickness: 28,
      },
      {
        label: "Evening Shift",
        data: [1050, 1100, 1150, 1130, 1200, 1180, 1210, 1170],
        backgroundColor: "rgba(99,102,241,0.55)",
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: "bottom" },
    tooltip: { enabled: true },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#232946", font: { size: 13 } } },
    y: { grid: { color: "#e0e7ef" }, ticks: { color: "#232946", font: { size: 13 } } },
  },
};

export default function Dashboard({ darkMode }) {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [progress] = useState(86.5);

  // Milk states graph state
  const [milkStates, setMilkStates] = useState(initialMilkStates);
  const [newState, setNewState] = useState({ state: "", value: "" });
  const [showMilkStatesGraph, setShowMilkStatesGraph] = useState(false);

  // Add milk entry state
  const [recentMilkEntries, setRecentMilkEntries] = useState([
    {
      name: "Ravi Kumar",
      village: "Village A",
      shift: "Morning",
      quantity: 250,
      time: "06:30 AM",
    },
    {
      name: "Sita Reddy",
      village: "Village C",
      shift: "Evening",
      quantity: 210,
      time: "06:45 PM",
    },
    {
      name: "Prasad Naidu",
      village: "Village B",
      shift: "Morning",
      quantity: 180,
      time: "07:00 AM",
    },
    {
      name: "Meena Patel",
      village: "Village D",
      shift: "Evening",
      quantity: 195,
      time: "07:10 PM",
    },
  ]);
  const [newEntry, setNewEntry] = useState({
    name: "",
    village: "",
    shift: "Morning",
    quantity: "",
    time: "",
  });

  // Realistic summary data
  const totalMilk = selectedYear === "2024" ? "21,500" : "19,800";
  const totalFarmers = "325";
  const avgFat = "4.1%";
  const totalRevenue = selectedYear === "2024" ? "₹15,800" : "₹14,200";

  // Add new state to graph
  const handleAddMilkState = () => {
    if (!newState.state || !newState.value || isNaN(newState.value)) {
      alert("Please enter a valid state name and numeric value.");
      return;
    }
    setMilkStates([
      ...milkStates,
      { state: newState.state, value: Number(newState.value) }
    ]);
    setNewState({ state: "", value: "" });
  };

  return (
    <div
      style={{
        background: darkMode
          ? "linear-gradient(120deg, #232946 0%, #16161a 100%)"
          : "linear-gradient(120deg, #e0eafc 0%, #f8f9fa 100%)",
        minHeight: "100vh",
        padding: "32px 0",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* Increase maxWidth and add padding for better alignment */}
      <div style={{
        maxWidth: 1600,
        margin: "0 auto",
        padding: "0 36px",
        transition: "max-width 0.2s",
      }}>
        {/* Welcome Message */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 26,
            color: "#232946",
            marginBottom: 28,
            textAlign: "center",
            letterSpacing: 0.5,
            background: "none", // Remove box background
            borderRadius: 0,
            padding: 0,
            boxShadow: "none",
            textShadow: "none",
            marginTop: 0,
          }}
        >
          Welcome back <span style={{
            color: "#6366f1",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 1,
            textTransform: "capitalize"
          }}>Narasimha</span>
        </div>
        {/* Top Cards - With headers as requested */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "#ef476f",
            borderRadius: 12,
            boxShadow: "0 2px 8px #ef476f33",
            padding: 22,
            textAlign: "left",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 28,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Total Cows</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span>7591</span>
              <GiCow size={38} style={{ marginLeft: "auto" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", opacity: 0.85, marginTop: 8 }}>
              Breeds: Sahiwal, Gir, Jersey
            </div>
          </div>
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "#fbbf24",
            borderRadius: 12,
            boxShadow: "0 2px 8px #fbbf2433",
            padding: 22,
            textAlign: "left",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 28,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Total Farms</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span>4875</span>
              <FaHome size={38} style={{ marginLeft: "auto" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", opacity: 0.85, marginTop: 8 }}>
              Main: Green Valley, Sunrise, Happy Dairy
            </div>
          </div>
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "#2196f3",
            borderRadius: 12,
            boxShadow: "0 2px 8px #2196f333",
            padding: 22,
            textAlign: "left",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 28,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Total Gallons</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span>9954</span>
              <GiMilkCarton size={38} style={{ marginLeft: "auto" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", opacity: 0.85, marginTop: 8 }}>
              Types: Buffalo, Cow, Mixed
            </div>
          </div>
          <div style={{
            flex: 1,
            minWidth: 180,
            background: "#7c3aed",
            borderRadius: 12,
            boxShadow: "0 2px 8px #7c3aed33",
            padding: 22,
            textAlign: "left",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 700,
            fontSize: 28,
            position: "relative"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Deliveries</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span>4584</span>
              <GiMilkCarton size={38} style={{ marginLeft: "auto" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", opacity: 0.85, marginTop: 8 }}>
              This Month: 1,200 Gallons
            </div>
          </div>
        </div>

        {/* Main Row */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {/* Left: Milk Collection Bar Chart */}
          <div style={{
            flex: 2,
            minWidth: 340,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 8px #e0e7ef",
            padding: 24
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#232946" }}>Milk Collection (Monthly)</div>
              <select
                style={{
                  borderRadius: 8,
                  padding: "4px 12px",
                  border: "1px solid #e0e7ef",
                  fontSize: 14,
                  background: "#f8fafc",
                  color: "#232946"
                }}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 32, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, color: "#555" }}>Morning Shift</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#232946" }}>
                  {selectedYear === "2024" ? "12,201 L" : "11,200 L"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 15, color: "#555" }}>Evening Shift</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#232946" }}>
                  {selectedYear === "2024" ? "100,799 L" : "98,600 L"}
                  <span style={{ color: "#38d9a9", fontSize: 14, fontWeight: 600, marginLeft: 8 }}>
                    {selectedYear === "2024" ? "+4%" : "+2%"}
                  </span>
                </div>
              </div>
            </div>
            <Bar data={milkDataByYear[selectedYear]} options={barOptions} height={120} />
          </div>

          {/* Right: Status & Success Rate */}
          <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 8px #e0e7ef",
              padding: 24,
              marginBottom: 0
            }}>
              <div style={{ fontWeight: 600, color: "#232946", marginBottom: 8 }}>Milk Testing Status</div>
              <div style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>In progress</div>
              <div style={{ width: "100%", background: "#e0e7ef", borderRadius: 8, height: 10, marginBottom: 8 }}>
                <div style={{
                  width: "70%",
                  background: "linear-gradient(90deg,#6366f1 60%,#38d9a9 100%)",
                  height: "100%",
                  borderRadius: 8,
                  transition: "width 0.3s"
                }}></div>
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>Estimated Processing</div>
              <button style={{
                marginTop: 8,
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 18px",
                fontWeight: 600,
                cursor: "pointer"
              }}>View status</button>
            </div>
            <div style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 8px #e0e7ef",
              padding: 24,
              position: "relative"
            }}>
              <div style={{ fontWeight: 600, color: "#232946", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Quality Success Rate</span>
              </div>
              {/* Remove Add Entry Form here */}
              {/* You can also remove any <div> or <button> related to Add Entry in this section */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `conic-gradient(#6366f1 0% ${progress}%, #e0e7ef ${progress}% 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#232946",
                  marginRight: 8,
                }}>
                  <span>{progress}%</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#555" }}>Milk passed quality test</div>
                  <div style={{ fontSize: 15, color: "#232946", fontWeight: 600 }}>15,110 <span style={{ color: "#555", fontWeight: 400, marginLeft: 8 }}>Samples</span></div>
                  <div style={{ fontSize: 15, color: "#232946", fontWeight: 600 }}>91,130 <span style={{ color: "#555", fontWeight: 400, marginLeft: 8 }}>Processed</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add gap above Recent Milk Entries */}
        <div style={{ height: 32 }}></div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {/* Recent Milk Entries Box */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div style={{
              flex: 1,
              minWidth: 480,
              background: "linear-gradient(120deg,#e0eafc 60%,#f8f9fa 100%)",
              borderRadius: 18,
              boxShadow: "0 2px 8px #e0e7ef",
              padding: 32,
              marginBottom: 0,
              alignSelf: "flex-start",
              maxHeight: 540,
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, color: "#232946" }}>Recent Milk Entries</div>
                {/* Remove this Add Entry Button */}
              </div>
              {/* Add Entry Form */}
              <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Farmer Name"
                  value={newEntry.name}
                  onChange={e => setNewEntry({ ...newEntry, name: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #e0e7ef",
                    fontSize: 14,
                    width: "28%",
                  }}
                />
                <input
                  type="text"
                  placeholder="Village"
                  value={newEntry.village}
                  onChange={e => setNewEntry({ ...newEntry, village: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #e0e7ef",
                    fontSize: 14,
                    width: "18%",
                  }}
                />
                <select
                  value={newEntry.shift}
                  onChange={e => setNewEntry({ ...newEntry, shift: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #e0e7ef",
                    fontSize: 14,
                    width: "18%",
                  }}
                >
                  <option>Morning</option>
                  <option>Evening</option>
                </select>
                <input
                  type="number"
                  placeholder="Quantity (L)"
                  value={newEntry.quantity}
                  onChange={e => setNewEntry({ ...newEntry, quantity: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #e0e7ef",
                    fontSize: 14,
                    width: "18%",
                  }}
                />
                <input
                  type="text"
                  placeholder="Time (e.g. 06:30 AM)"
                  value={newEntry.time}
                  onChange={e => setNewEntry({ ...newEntry, time: e.target.value })}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #e0e7ef",
                    fontSize: 14,
                    width: "18%",
                  }}
                />
                {/* Add Entry Button after Time field */}
                <button
                  style={{
                    background: "#38d9a9",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14
                  }}
                  onClick={() => {
                    if (
                      !newEntry.name ||
                      !newEntry.village ||
                      !newEntry.quantity ||
                      !newEntry.time
                    ) {
                      alert("Please fill all fields.");
                      return;
                    }
                    setRecentMilkEntries([
                      { ...newEntry },
                      ...recentMilkEntries,
                    ]);
                    setNewEntry({
                      name: "",
                      village: "",
                      shift: "Morning",
                      quantity: "",
                      time: "",
                    });
                  }}
                >
                  Add Entry
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: "#232946" }}>
                    <th style={{ padding: "8px 12px", fontWeight: 600 }}>Farmer Name</th>
                    <th style={{ padding: "8px 12px", fontWeight: 600 }}>Village</th>
                    <th style={{ padding: "8px 12px", fontWeight: 600 }}>Shift</th>
                    <th style={{ padding: "8px 12px", fontWeight: 600 }}>Quantity (L)</th>
                    <th style={{ padding: "8px 12px", fontWeight: 600 }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMilkEntries.map((entry, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "8px 12px" }}>{entry.name}</td>
                      <td style={{ padding: "8px 12px" }}>{entry.village}</td>
                      <td style={{ padding: "8px 12px" }}>{entry.shift}</td>
                      <td style={{ padding: "8px 12px" }}>{entry.quantity}</td>
                      <td style={{ padding: "8px 12px" }}>{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Milk Production States Chart Section */}
        <div style={{
          margin: "38px auto 0 auto",
          maxWidth: 900,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 12px #e0e7ef",
          padding: "32px 32px",
          textAlign: "center"
        }}>
          <h3 style={{
            fontWeight: 700,
            fontSize: 22,
            color: "#232946",
            marginBottom: 18,
            letterSpacing: 1
          }}>
            Top 10 Milk Producing States in India (2025)
          </h3>
          {/* Toggle Graph Button */}
          <button
            style={{
              background: showMilkStatesGraph ? "#38b6ff" : "#e0e7ef",
              color: showMilkStatesGraph ? "#fff" : "#232946",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              marginBottom: 18
            }}
            onClick={() => setShowMilkStatesGraph(!showMilkStatesGraph)}
          >
            {showMilkStatesGraph ? "Hide Graph" : "Show Graph"}
          </button>
          {/* Graph Display */}
          {showMilkStatesGraph ? (
            <>
              <Bar
                data={getMilkStatesChartData(milkStates)}
                options={milkStatesChartOptions}
                height={220}
              />
              {/* Add Data Form */}
              <div style={{
                marginTop: 22,
                display: "flex",
                gap: 12,
                justifyContent: "center",
                alignItems: "center"
              }}>
                <input
                  type="text"
                  placeholder="State Name"
                  value={newState.state}
                  onChange={e => setNewState({ ...newState, state: e.target.value })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #e0e7ef",
                    fontSize: 15,
                    width: 140
                  }}
                />
                <input
                  type="number"
                  placeholder="Production (tonnes)"
                  value={newState.value}
                  onChange={e => setNewState({ ...newState, value: e.target.value })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #e0e7ef",
                    fontSize: 15,
                    width: 140
                  }}
                />
                <button
                  style={{
                    background: "#38d9a9",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer"
                  }}
                  onClick={handleAddMilkState}
                >
                  Add Data
                </button>
              </div>
            </>
          ) : (
            <>
              <img
                src="https://cdn.jsdelivr.net/gh/yourusername/assets/top10milkstates2025.jpg"
                alt="Top 10 milk producing states in India 2025"
                style={{
                  width: "100%",
                  maxWidth: 520,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #e0e7ef",
                  marginBottom: 8
                }}
              />
              <div style={{
                fontSize: 15,
                color: "#555",
                marginTop: 8,
                marginBottom: 0
              }}>
                Uttar Pradesh leads with 14,902 tonnes, followed by Punjab and Rajasthan. Total production: 86,582 tonnes.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}