import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext.jsx";
import useAuth from "../hooks/useAuth.js";
import "./Sidebar.css";

function Sidebar() {
  const { sidebarOpen } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/admin/dashboard", icon: "▦", label: "Dashboard" },
    { to: "/admin/students", icon: "👨‍🎓", label: "Students" },
    { to: "/admin/faculty", icon: "👨‍🏫", label: "Faculty" },
    // { to: "/admin/courses", icon: "📚", label: "Courses" },
    // { to: "/admin/lectures", icon: "🗓️", label: "Lectures" },
    { to: "/admin/questions", icon: "❓", label: "Questions" },
    { to: "/admin/feedback", icon: "💬", label: "Feedback" },
    { to: "/admin/reports", icon: "📊", label: "Reports" },
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

export default Sidebar;