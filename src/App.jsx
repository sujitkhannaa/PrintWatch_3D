import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleGauge,
  Cpu,
  Gauge,
  Home,
  Layers3,
  Menu,
  Pause,
  Play,
  Printer,
  Settings,
  ShieldCheck,
  Thermometer,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const initialPrinters = [
  {
    id: 1,
    name: "PrintWatch Alpha",
    model: "Ender-3 V3",
    status: "Printing",
    nozzle: 211,
    bed: 63,
    progress: 67,
    layer: 128,
    totalLayers: 190,
    speed: 72,
    eta: 42,
    job: "Cyberpunk_Gear.stl",
    uptime: "18h 42m",
    ip: "192.168.1.108",
    camera: "CAM-01",
  },
  {
    id: 2,
    name: "PrintWatch Beta",
    model: "Bambu Lab A1",
    status: "Idle",
    nozzle: 28,
    bed: 29,
    progress: 0,
    layer: 0,
    totalLayers: 0,
    speed: 0,
    eta: 0,
    job: "No active job",
    uptime: "11h 18m",
    ip: "192.168.1.109",
    camera: "CAM-02",
  },
  {
    id: 3,
    name: "PrintWatch Gamma",
    model: "K1 Max",
    status: "Warning",
    nozzle: 235,
    bed: 72,
    progress: 41,
    layer: 82,
    totalLayers: 200,
    speed: 61,
    eta: 76,
    job: "Industrial_Case.stl",
    uptime: "26h 04m",
    ip: "192.168.1.110",
    camera: "CAM-03",
  },
];

const temperatureData = [
  { time: "10:00", nozzle: 204, bed: 58 },
  { time: "10:05", nozzle: 208, bed: 60 },
  { time: "10:10", nozzle: 212, bed: 62 },
  { time: "10:15", nozzle: 210, bed: 63 },
  { time: "10:20", nozzle: 215, bed: 64 },
  { time: "10:25", nozzle: 211, bed: 63 },
  { time: "10:30", nozzle: 213, bed: 64 },
  { time: "10:35", nozzle: 211, bed: 63 },
];

const weeklyData = [
  { day: "Mon", prints: 7 },
  { day: "Tue", prints: 11 },
  { day: "Wed", prints: 8 },
  { day: "Thu", prints: 14 },
  { day: "Fri", prints: 12 },
  { day: "Sat", prints: 9 },
  { day: "Sun", prints: 6 },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [printers, setPrinters] = useState(initialPrinters);
  const [selectedId, setSelectedId] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const selectedPrinter = useMemo(
    () => printers.find((printer) => printer.id === selectedId) || printers[0],
    [printers, selectedId]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPrinters((current) =>
        current.map((printer) => {
          if (printer.status !== "Printing") return printer;

          const progressIncrease = Math.random() * 0.7;

          return {
            ...printer,
            progress: Math.min(100, printer.progress + progressIncrease),
            nozzle: Math.round(
              Math.max(205, Math.min(220, printer.nozzle + (Math.random() * 4 - 2)))
            ),
            bed: Math.round(
              Math.max(58, Math.min(68, printer.bed + (Math.random() * 2 - 1)))
            ),
            speed: Math.round(
              Math.max(60, Math.min(80, printer.speed + (Math.random() * 4 - 2)))
            ),
          };
        })
      );

      setLastUpdated(new Date());
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const togglePrinter = () => {
    setPrinters((current) =>
      current.map((printer) => {
        if (printer.id !== selectedId) return printer;

        if (printer.status === "Printing") {
          return { ...printer, status: "Paused" };
        }

        if (printer.status === "Paused") {
          return { ...printer, status: "Printing" };
        }

        return printer;
      })
    );
  };

  const pages = [
    { name: "Dashboard", icon: Home },
    { name: "Printers", icon: Printer },
    { name: "Camera", icon: Camera },
    { name: "Analytics", icon: BarChart3 },
    { name: "Alerts", icon: AlertTriangle },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">
            <Printer size={23} strokeWidth={2.2} />
          </div>

          <div>
            <div className="brand-name">PrintWatch</div>
            <div className="brand-subtitle">3D MONITORING</div>
          </div>
        </div>

        <div className="network-status">
          <span className="online-dot" />
          <span>NETWORK ONLINE</span>
        </div>

        <nav className="navigation">
          {pages.map((page) => {
            const Icon = page.icon;

            return (
              <button
                key={page.name}
                className={`nav-button ${
                  activePage === page.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(page.name);
                  setMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{page.name}</span>

                {page.name === "Alerts" && (
                  <span className="alert-count">2</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="health-card">
            <div className="health-header">
              <ShieldCheck size={16} />
              <span>System Health</span>
              <strong>96%</strong>
            </div>

            <div className="health-bar">
              <div style={{ width: "96%" }} />
            </div>

            <div className="health-text">All systems operational</div>
          </div>

          <div className="version">PrintWatch 3D · v1.0.0</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="breadcrumb">Monitoring / Dashboard</div>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-right">
            <div className="live-status">
              <span />
              LIVE
            </div>

            <button
              className="notification-button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>

            <div className="profile">
              <div className="profile-avatar">PW</div>

              <div className="profile-info">
                <span>Operator</span>
                <strong>Administrator</strong>
              </div>

              <ChevronDown size={16} />
            </div>

            {notificationsOpen && (
              <div className="notification-panel">
                <div className="notification-title">Notifications</div>

                <div className="notification-item">
                  <AlertTriangle size={16} />
                  <div>
                    <strong>Printer Gamma</strong>
                    <span>High nozzle temperature</span>
                  </div>
                </div>

                <div className="notification-item">
                  <CheckCircle2 size={16} />
                  <div>
                    <strong>PrintWatch Alpha</strong>
                    <span>Print running normally</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {activePage === "Dashboard" && (
          <Dashboard
            printer={selectedPrinter}
            printers={printers}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            togglePrinter={togglePrinter}
            lastUpdated={lastUpdated}
          />
        )}

        {activePage === "Printers" && <PrintersPage printers={printers} />}

        {activePage === "Camera" && <CameraPage printer={selectedPrinter} />}

        {activePage === "Analytics" && <AnalyticsPage />}

        {activePage === "Alerts" && <AlertsPage />}

        {activePage === "Settings" && <SettingsPage />}
      </main>
    </div>
  );
}

function Dashboard({
  printer,
  printers,
  selectedId,
  setSelectedId,
  togglePrinter,
  lastUpdated,
}) {
  const activePrinters = printers.filter(
    (item) => item.status === "Printing"
  ).length;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">REAL-TIME TELEMETRY</div>
          <h2>Printer Command Center</h2>
          <p>Monitor your 3D printing infrastructure in real time.</p>
        </div>

        <div className="printer-selector">
          <label>ACTIVE PRINTER</label>

          <select
            value={selectedId}
            onChange={(event) => setSelectedId(Number(event.target.value))}
          >
            {printers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Thermometer />}
          label="NOZZLE TEMP"
          value={`${printer.nozzle}°C`}
          subtitle="Normal operating range"
          color="blue"
        />

        <StatCard
          icon={<Zap />}
          label="BED TEMP"
          value={`${printer.bed}°C`}
          subtitle="Stable"
          color="green"
        />

        <StatCard
          icon={<CircleGauge />}
          label="PRINT PROGRESS"
          value={`${Math.round(printer.progress)}%`}
          subtitle={
            printer.totalLayers
              ? `Layer ${printer.layer} / ${printer.totalLayers}`
              : "No active layers"
          }
          color="purple"
        />

        <StatCard
          icon={<Gauge />}
          label="PRINT SPEED"
          value={`${printer.speed} mm/s`}
          subtitle="Target 70–80 mm/s"
          color="orange"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel printer-panel">
          <PanelHeader
            title="Printer Status"
            subtitle={printer.name}
            right={<StatusBadge status={printer.status} />}
          />

          <div className="printer-visual">
            <div className="grid-floor" />

            <div className="printer-frame">
              <div className="frame-top" />
              <div className="frame-left" />
              <div className="frame-right" />

              <div className="printer-rail" />

              <div className="printer-head">
                <div className="nozzle-tip" />
              </div>

              <div className="print-bed" />

              {printer.status !== "Idle" && <div className="print-model" />}
            </div>

            <div className="printer-live-tag">
              <span />
              PRINTWATCH LIVE
            </div>

            <div className="visual-job">
              <span>ACTIVE JOB</span>
              <strong>{printer.job}</strong>
            </div>
          </div>

          <div className="printer-controls">
            <div>
              <span className="control-label">PRINTER</span>
              <strong>{printer.model}</strong>
            </div>

            <button
              className={`control-button ${
                printer.status === "Printing" ? "pause" : "play"
              }`}
              onClick={togglePrinter}
              disabled={printer.status === "Idle"}
            >
              {printer.status === "Printing" ? (
                <>
                  <Pause size={16} />
                  Pause Print
                </>
              ) : (
                <>
                  <Play size={16} />
                  Resume Print
                </>
              )}
            </button>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Current Job"
            subtitle="Print Progress"
            right={
              printer.eta ? (
                <div className="eta">
                  <span>ETA</span>
                  <strong>{printer.eta}m</strong>
                </div>
              ) : null
            }
          />

          <div className="job-content">
            <div className="job-title-row">
              <div>
                <span className="job-label">CURRENT FILE</span>
                <strong>{printer.job}</strong>
              </div>

              <div className="job-percent">
                {Math.round(printer.progress)}%
              </div>
            </div>

            <div className="progress-track large">
              <div
                className="progress-fill"
                style={{ width: `${printer.progress}%` }}
              />
            </div>

            <div className="job-details">
              <div>
                <span>Layer</span>
                <strong>
                  {printer.layer} / {printer.totalLayers || "--"}
                </strong>
              </div>

              <div>
                <span>Remaining</span>
                <strong>{printer.eta ? `${printer.eta} min` : "--"}</strong>
              </div>

              <div>
                <span>Uptime</span>
                <strong>{printer.uptime}</strong>
              </div>
            </div>

            <div className="job-divider" />

            <div className="job-health">
              <div className="health-icon">
                <Activity size={18} />
              </div>

              <div>
                <strong>Print Health</strong>
                <span>All monitored parameters are within limits.</span>
              </div>

              <CheckCircle2 size={19} className="success-icon" />
            </div>
          </div>
        </section>
      </div>

      <div className="content-grid">
        <section className="panel">
          <PanelHeader
            title="Temperature Monitoring"
            subtitle={`Last update ${lastUpdated.toLocaleTimeString()}`}
          />

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="nozzleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="bedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#e8edf3" strokeDasharray="3 3" />

                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#7b8798" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[40, 240]}
                  tick={{ fontSize: 10, fill: "#7b8798" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="nozzle"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#nozzleGradient)"
                  name="Nozzle"
                />

                <Area
                  type="monotone"
                  dataKey="bed"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="url(#bedGradient)"
                  name="Bed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-blue" />
              Nozzle Temperature
            </span>

            <span>
              <i className="legend-green" />
              Bed Temperature
            </span>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="AI Vision"
            subtitle="Camera-based print inspection"
          />

          <div className="vision-content">
            <div className="ai-status">
              <span className="pulse-dot" />
              AI VISION ENGINE ONLINE
            </div>

            <div className="vision-result">
              <div>
                <span className="result-label">LATEST ANALYSIS</span>
                <strong>Normal Print</strong>
                <p>No visible defects detected</p>
              </div>

              <div className="confidence">
                <div className="confidence-ring">
                  <span>94%</span>
                </div>

                <small>Confidence</small>
              </div>
            </div>

            <div className="vision-checks">
              <VisionCheck label="Layer consistency" value="Normal" />
              <VisionCheck label="Spaghetti detection" value="Clear" />
              <VisionCheck label="Object adhesion" value="Good" />
            </div>
          </div>
        </section>
      </div>

      <div className="content-grid">
        <section className="panel">
          <PanelHeader
            title="Camera Feed"
            subtitle={printer.camera}
            right={<StatusBadge status="Live" />}
          />

          <div className="camera-preview">
            <div className="camera-grid" />
            <div className="scan-line" />

            <div className="camera-printer">
              <div className="camera-top" />
              <div className="camera-head" />
              <div className="camera-bed" />
              <div className="camera-object" />
            </div>

            <div className="camera-tag">
              <Camera size={13} />
              LIVE CAMERA
            </div>

            <div className="camera-time">1080p · 24 FPS</div>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Live Telemetry"
            subtitle="Machine parameters"
          />

          <div className="telemetry-grid">
            <Telemetry icon={<Thermometer />} label="Nozzle" value={`${printer.nozzle} °C`} />
            <Telemetry icon={<Zap />} label="Bed" value={`${printer.bed} °C`} />
            <Telemetry icon={<Gauge />} label="Speed" value={`${printer.speed} mm/s`} />
            <Telemetry icon={<Layers3 />} label="Layer" value={`${printer.layer}`} />
            <Telemetry icon={<Wifi />} label="Network" value="Connected" />
            <Telemetry icon={<Cpu />} label="Controller" value="Online" />
          </div>

          <div className="connection-box">
            <div>
              <span>DEVICE IP</span>
              <strong>{printer.ip}</strong>
            </div>

            <div className="connected">
              <span />
              Connected
            </div>
          </div>
        </section>
      </div>

      <section className="panel alerts-panel">
        <PanelHeader
          title="Recent Alerts"
          subtitle="Latest system events"
          right={<span className="view-all">View all alerts</span>}
        />

        <div className="alert-list">
          <AlertRow
            type="warning"
            title="Printer Gamma nozzle temperature elevated"
            time="2 minutes ago"
            text="Temperature reached 235°C."
          />

          <AlertRow
            type="success"
            title="PrintWatch Alpha operating normally"
            time="8 minutes ago"
            text="All monitored parameters are within expected limits."
          />

          <AlertRow
            type="success"
            title="AI Vision inspection completed"
            time="12 minutes ago"
            text="No defects detected in latest frame."
          />
        </div>
      </section>

      <div className="footer-note">
        <span>
          <span className="online-dot small" />
          Sample data mode
        </span>

        <span>PrintWatch 3D · Frontend Preview</span>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, subtitle, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>

      <div className="stat-text">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle, right }) {
  return (
    <div className="panel-header">
      <div>
        <h3>{title}</h3>
        {subtitle && <span>{subtitle}</span>}
      </div>

      {right}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status.toLowerCase();

  let className = "neutral";

  if (normalized === "printing" || normalized === "live") {
    className = "success";
  } else if (normalized === "warning") {
    className = "warning";
  } else if (normalized === "paused") {
    className = "paused";
  } else if (normalized === "idle") {
    className = "neutral";
  }

  return (
    <span className={`status-badge ${className}`}>
      <span />
      {status}
    </span>
  );
}

function VisionCheck({ label, value }) {
  return (
    <div className="vision-check">
      <span>{label}</span>
      <strong>
        <CheckCircle2 size={14} />
        {value}
      </strong>
    </div>
  );
}

function Telemetry({ icon, label, value }) {
  return (
    <div className="telemetry-card">
      <div className="telemetry-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AlertRow({ type, title, time, text }) {
  const warning = type === "warning";

  return (
    <div className="alert-row">
      <div className={`alert-symbol ${warning ? "warning" : "success"}`}>
        {warning ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}
      </div>

      <div className="alert-main">
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <time>{time}</time>
    </div>
  );
}

function PrintersPage({ printers }) {
  return (
    <section className="page">
      <div className="page-heading simple">
        <div>
          <div className="eyebrow">DEVICE MANAGEMENT</div>
          <h2>Printers</h2>
          <p>Monitor all connected 3D printers.</p>
        </div>
      </div>

      <div className="printer-cards">
        {printers.map((printer) => (
          <div className="printer-card" key={printer.id}>
            <div className="printer-card-top">
              <div className="printer-card-icon">
                <Printer size={21} />
              </div>

              <StatusBadge status={printer.status} />
            </div>

            <h3>{printer.name}</h3>
            <p>{printer.model}</p>

            <div className="printer-card-grid">
              <div>
                <span>Nozzle</span>
                <strong>{printer.nozzle}°C</strong>
              </div>

              <div>
                <span>Bed</span>
                <strong>{printer.bed}°C</strong>
              </div>

              <div>
                <span>Speed</span>
                <strong>{printer.speed} mm/s</strong>
              </div>

              <div>
                <span>Progress</span>
                <strong>{Math.round(printer.progress)}%</strong>
              </div>
            </div>

            <div className="mini-progress">
              <div style={{ width: `${printer.progress}%` }} />
            </div>

            <div className="printer-card-footer">
              <span>{printer.ip}</span>
              <span>{printer.camera}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CameraPage({ printer }) {
  return (
    <section className="page">
      <div className="page-heading simple">
        <div>
          <div className="eyebrow">VISION MONITORING</div>
          <h2>Camera</h2>
          <p>Live camera monitoring for your printer.</p>
        </div>
      </div>

      <div className="camera-page-grid">
        <div className="panel large-camera">
          <PanelHeader
            title={printer.camera}
            subtitle={`${printer.name} · 1080p`}
            right={<StatusBadge status="Live" />}
          />

          <div className="camera-preview large">
            <div className="camera-grid" />
            <div className="scan-line" />

            <div className="camera-printer large-printer">
              <div className="camera-top" />
              <div className="camera-head" />
              <div className="camera-bed" />
              <div className="camera-object" />
            </div>

            <div className="camera-tag">
              <Camera size={13} />
              LIVE CAMERA
            </div>
          </div>
        </div>

        <div className="panel">
          <PanelHeader title="AI Vision" subtitle="Latest inspection" />

          <div className="camera-ai">
            <div className="ai-large-icon">
              <ShieldCheck size={28} />
            </div>

            <h3>Normal Print</h3>
            <p>No visible defects detected.</p>

            <div className="big-confidence">94%</div>
            <span>Detection confidence</span>

            <button className="primary-button">Run New Inspection</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsPage() {
  return (
    <section className="page">
      <div className="page-heading simple">
        <div>
          <div className="eyebrow">PERFORMANCE DATA</div>
          <h2>Analytics</h2>
          <p>Review printer performance and production activity.</p>
        </div>
      </div>

      <div className="analytics-stats">
        <StatCard
          icon={<Printer />}
          label="TOTAL PRINTS"
          value="67"
          subtitle="+12% this week"
          color="blue"
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="SUCCESS RATE"
          value="94.2%"
          subtitle="Last 30 days"
          color="green"
        />

        <StatCard
          icon={<Activity />}
          label="PRINT HOURS"
          value="186h"
          subtitle="Across all printers"
          color="purple"
        />

        <StatCard
          icon={<Gauge />}
          label="AVG SPEED"
          value="68 mm/s"
          subtitle="Current average"
          color="orange"
        />
      </div>

      <div className="analytics-grid">
        <div className="panel">
          <PanelHeader
            title="Weekly Print Activity"
            subtitle="Completed jobs"
          />

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={weeklyData}>
                <CartesianGrid stroke="#e8edf3" strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#7b8798" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 10, fill: "#7b8798" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="prints"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel analytics-summary">
          <PanelHeader title="Performance Summary" subtitle="Current period" />

          <div className="summary-list">
            <SummaryRow label="Printer utilization" value="82%" />
            <SummaryRow label="Successful prints" value="63 / 67" />
            <SummaryRow label="Average print time" value="2h 48m" />
            <SummaryRow label="Material consumed" value="4.8 kg" />
            <SummaryRow label="AI inspections" value="312" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AlertsPage() {
  return (
    <section className="page">
      <div className="page-heading simple">
        <div>
          <div className="eyebrow">SYSTEM EVENTS</div>
          <h2>Alerts</h2>
          <p>Review warnings and printer events.</p>
        </div>
      </div>

      <div className="panel">
        <div className="full-alert-list">
          <AlertRow
            type="warning"
            title="Printer Gamma nozzle temperature elevated"
            time="2 minutes ago"
            text="Temperature reached 235°C. Continue monitoring the print."
          />

          <AlertRow
            type="warning"
            title="Printer Gamma bed temperature above target"
            time="6 minutes ago"
            text="Current bed temperature is 72°C."
          />

          <AlertRow
            type="success"
            title="PrintWatch Alpha operating normally"
            time="8 minutes ago"
            text="All monitored parameters are within expected limits."
          />

          <AlertRow
            type="success"
            title="AI Vision inspection completed"
            time="12 minutes ago"
            text="No defects detected in the latest camera frame."
          />

          <AlertRow
            type="success"
            title="Printer Beta entered idle mode"
            time="21 minutes ago"
            text="Previous print completed successfully."
          />
        </div>
      </div>
    </section>
  );
}

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [aiVision, setAiVision] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <section className="page">
      <div className="page-heading simple">
        <div>
          <div className="eyebrow">SYSTEM CONFIGURATION</div>
          <h2>Settings</h2>
          <p>Configure your PrintWatch dashboard.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <PanelHeader title="Monitoring" subtitle="Dashboard preferences" />

          <Setting
            title="Auto refresh"
            description="Update telemetry automatically"
            active={autoRefresh}
            onClick={() => setAutoRefresh(!autoRefresh)}
          />

          <Setting
            title="AI Vision"
            description="Enable print inspection monitoring"
            active={aiVision}
            onClick={() => setAiVision(!aiVision)}
          />

          <Setting
            title="Notifications"
            description="Show printer alerts"
            active={notifications}
            onClick={() => setNotifications(!notifications)}
          />
        </div>

        <div className="panel">
          <PanelHeader title="System Information" subtitle="PrintWatch 3D" />

          <div className="info-list">
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Mode" value="Sample Data" />
            <InfoRow label="Connected printers" value="3" />
            <InfoRow label="AI engine" value="Online" />
            <InfoRow label="Network" value="Connected" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Setting({ title, description, active, onClick }) {
  return (
    <div className="setting">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        className={`toggle ${active ? "active" : ""}`}
        onClick={onClick}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;