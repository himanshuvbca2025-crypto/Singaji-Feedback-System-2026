import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext.jsx";
import useAuth from "../hooks/useAuth.js";
import "./FacultySidebar.css"; // We'll just reuse the same CSS rules but scoped or we can just import Sidebar.css if we don't need changes.

function FacultySidebar() {
  const { sidebarOpen } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/faculty/dashboard", icon: "▦", label: "Dashboard" },
    { to: "/faculty/schedule", icon: "🗓️", label: "My Schedule" },
    { to: "/faculty/feedback", icon: "💬", label: "Student Feedback" },
    { to: "/faculty/history", icon: "⏳", label: "Feedback History" },
    { to: "/faculty/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>

      <nav className="sidebar-menu">

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
            title={!sidebarOpen ? item.label : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}

        {/* Separator */}
        <div className="sidebar-separator" />

        {/* Logout */}
        <button
          className="sidebar-link sidebar-logout-btn"
          onClick={handleLogout}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>

      </nav>

    </aside>
  );
}

export default FacultySidebar;
