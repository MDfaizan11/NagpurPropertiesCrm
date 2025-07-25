import { useState, useEffect } from "react";
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
  ChevronRight,
  Filter,
  Download,
  Zap,
} from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import SectionCard from "../SectionCard/SectionCard";
import StatisticCard from "../StatisticCard/StatisticCard";
import { Outlet } from "react-router-dom";
import "../Dashboard/dashboard.css";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      clearTimeout(timer);
    };
  }, []);

  const sections = [
    {
      name: "Land Management",
      icon: <Map size={24} />,
      color: "blue",
      count: 24,
      path: "/land",
    },
    {
      name: "Lead Management",
      icon: <Phone size={24} />,
      color: "purple",
      count: 18,
      path: "/lead",
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
    {
      name: "Stock Management",
      icon: <Package size={24} />,
      color: "brown",
      count: 21,
    },
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
    {
      name: "Project Management",
      icon: <Calendar size={24} />,
      color: "cyan",
      count: 27,
    },
    {
      name: "Quotation",
      icon: <FileText size={24} />,
      color: "amber",
      count: 14,
    },
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



  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar
        sections={sections}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      {isMobile && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="dashboard-content">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={isMobile}
        />

        <main className="main-content">
          {/* {showWelcome && (
            <div className="welcome-banner">
              <div className="welcome-content">
                <div className="welcome-icon">
                  <Zap size={24} />
                </div>
                <div className="welcome-text">
                  <h3>Welcome back, John!</h3>
                  <p>
                    You have 12 pending tasks and 3 new notifications today.
                  </p>
                </div>
              </div>
              <button
                className="welcome-close"
                onClick={() => setShowWelcome(false)}
              >
                ×
              </button>
            </div>
          )} */}

          {/* <div className="dashboard-header">
            <div className="dashboard-title">
              <h1>Management Dashboard</h1>
              <p>Welcome back! Here's an overview of your management modules</p>
            </div>
            <div className="dashboard-actions">
              <button className="action-button primary">
                <Plus size={16} />
                <span>New Project</span>
              </button>
              <button className="action-button secondary">
                <FileText size={16} />
                <span>Generate Report</span>
              </button>
            </div>
          </div> */}

          {/* <div className="statistics-row">
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
          </div> */}

          {/* <div className="section-header">
            <h2>Management Modules</h2>
            <div className="section-controls">
              <div className="filter-dropdown">
                <button className="filter-button">
                  <Filter size={16} />
                  <span>Filter</span>
                  <ChevronRight size={16} className="dropdown-arrow" />
                </button>
              </div>
              <button className="export-button">
                <Download size={16} />
                <span>Export</span>
              </button>
              <div className="view-options">
                <button
                  className={`view-option ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </button>
                <button
                  className={`view-option ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
              </div>
            </div>
          </div> */}

          {/* <div className={`sections-container ${viewMode}`}>
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
          </div> */}
          <Outlet context={{ filteredSections }} />
        </main>
      </div>
    </div>
  );
}
