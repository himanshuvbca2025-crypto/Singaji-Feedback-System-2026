import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-menu">

        <NavLink
          to="/admin/dashboard"
          className="sidebar-link"
        >
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/students"
          className="sidebar-link"
        >
          <span>👨‍🎓</span>
          Students
        </NavLink>

        <NavLink
          to="/admin/faculty"
          className="sidebar-link"
        >
          <span>👨‍🏫</span>
          Faculty
        </NavLink>

        <NavLink
          to="/admin/questions"
          className="sidebar-link"
        >
          <span>?</span>
          Questions
        </NavLink>

        <NavLink
          to="/admin/courses"
          className="sidebar-link"
        >
          <span>▤</span>
          Courses
        </NavLink>

        <NavLink
          to="/admin/lectures"
          className="sidebar-link"
        >
          <span>▣</span>
          Lectures
        </NavLink>

        <NavLink
          to="/admin/reports"
          className="sidebar-link"
        >
          <span>▥</span>
          Reports
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;