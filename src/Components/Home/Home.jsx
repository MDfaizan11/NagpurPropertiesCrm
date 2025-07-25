import { useState, useMemo } from "react";
import SectionCard from "../SectionCard/SectionCard";
import "../Home/home.css";
import StatisticCard from "../StatisticCard/StatisticCard";
import {
  MapPin,
  Phone,
  HardHat,
  Map,
  CheckSquare,
  PenToolIcon as Tool,
  Users,
  Handshake,
  Package,
  DollarSign,
  Settings,
  Calendar,
  FileText,
  Mail,
  Building,
  Pen,
  BarChart3,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";

function Home() {
  const [viewMode, setViewMode] = useState("grid");
  const userRole = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("NagpurProperties"));
      return user?.role?.[0]?.roleName || "Partner";
    } catch {
      return "Partner";
    }
  }, []);

  const sections = [
    {
      name: "Land Management",
      icon: <Map size={24} />,
      color: "blue",
      count: 24,
      path: "/dashboard/land",
    },
    {
      name: "Lead Management",
      icon: <Phone size={24} />,
      color: "purple",
      count: 18,
      path: "/dashboard/lead",
    },
    {
      name: "Labour Management",
      icon: <HardHat size={24} />,
      color: "orange",
      count: 32,
    },
    {
      name: "Plot Management",
      icon: <MapPin size={24} />,
      color: "red",
      count: 15,
    },
    {
      name: "Task Management",
      icon: <CheckSquare size={24} />,
      color: "green",
      count: 47,
    },
    {
      name: "Material Management",
      icon: <Tool size={24} />,
      color: "teal",
      count: 29,
    },
    {
      name: "Employee Management",
      icon: <Users size={24} />,
      color: "indigo",
      count: 36,
    },
    {
      name: "Contractor Management",
      icon: <Handshake size={24} />,
      color: "yellow",
      count: 12,
    },
    // {
    //   name: "Stock Management",
    //   icon: <Package size={24} />,
    //   color: "brown",
    //   count: 21,
    // },
    {
      name: "Finance Management",
      icon: <DollarSign size={24} />,
      color: "emerald",
      count: 19,
    },
    {
      name: "Machine Management",
      icon: <Settings size={24} />,
      color: "gray",
      count: 8,
    },
    // {
    //   name: "Project Management",
    //   icon: <Calendar size={24} />,
    //   color: "cyan",
    //   count: 27,
    // },
    // {
    //   name: "Quotation",
    //   icon: <FileText size={24} />,
    //   color: "amber",
    //   count: 14,
    // },
    { name: "Letter Head", icon: <Mail size={24} />, color: "lime", count: 6 },
    {
      name: "Office Expense",
      icon: <Building size={24} />,
      color: "pink",
      count: 11,
    },
    {
      name: "Stationary Management",
      icon: <Pen size={24} />,
      color: "violet",
      count: 9,
    },
  ];

  // 🔍 Role-based filtering
  const filteredSections = useMemo(() => {
    if (userRole === "Admin" || userRole === "Head") return sections;
    if (userRole === "Partner")
      return sections.filter((sec) => sec.name === "Land Management");
    if (userRole === "Employee")
      return sections.filter((sec) => sec.name === "Task Management");
    if (userRole === "Engineer")
      return sections.filter((sec) => sec.name === "Material Management");
    return [];
  }, [userRole]);

  const statistics = [
    {
      title: "Total Projects",
      value: "128",
      icon: <BarChart3 size={24} />,
      change: "+12%",
      color: "blue",
      path: "/dashboard/land",
    },
    {
      title: "Total Lead",
      value: "64",
      icon: <CheckSquare size={24} />,
      change: "+8%",
      color: "green",
    },
    {
      title: "Plot",
      value: "$48.5k",
      icon: <TrendingUp size={24} />,
      change: "+24%",
      color: "emerald",
    },
    {
      title: "Letter",
      value: "23",
      icon: <Clock size={24} />,
      change: "-5%",
      color: "amber",
      isNegative: true,
    },
  ];

  return (
    <>
      <div className="dashboard-header2">
        <div className="dashboard-title">
          <h1>Management Dashboard</h1>
          <p>Welcome back! Here's an overview of your management modules</p>
        </div>
        {(userRole === "Admin" || userRole === "Head") && (
          <div className="dashboard-actions">
            <button className="action-button primary">
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
        )}
      </div>
      {(userRole === "Admin" || userRole === "Head") && (
        <div className="statistics-row">
          {statistics.map((stat, index) => (
            <StatisticCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              color={stat.color}
              isNegative={stat.isNegative}
            />
          ))}
        </div>
      )}
      {userRole === "Partner" && (
        <hr style={{ backgroundColor: "lightgrey" }} />
      )}
      {userRole === "Employee" && (
        <hr style={{ backgroundColor: "lightgrey" }} />
      )}
      <div className="section-header">
        <h2>Management Modules</h2>
        <div className="section-controls">
          <div className="view-options">
            <button
              className={`view-option ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`view-option ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>
      </div>
      <div className={`sections-container ${viewMode}`}>
        {filteredSections.map((section, index) => (
          <SectionCard
            key={index}
            name={section.name}
            icon={section.icon}
            color={section.color}
            count={section.count}
            viewMode={viewMode}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
