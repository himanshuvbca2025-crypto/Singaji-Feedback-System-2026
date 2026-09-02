import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import "./Navbar.css";
import ssecLogo from "../assets/rename.png";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">

      {/* Left Side */}
      <div
        className="navbar-brand"
        onClick={() => navigate("/admin/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img
          src={ssecLogo}
          alt="Singaji Educational Society"
          className="navbar-logo"
        />

        <div className="navbar-brand-text">
          <h1>Singaji Educational Society</h1>
          <p>Feedback Management System</p>
        </div>
      </div>


      {/* Right Side */}
      <div className="navbar-right">

        <div className="navbar-user">
          <span className="navbar-user-name">
            {user?.name || "Admin"}
          </span>

          <span className="navbar-user-role">
            {user?.role || "Administrator"}
          </span>
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;