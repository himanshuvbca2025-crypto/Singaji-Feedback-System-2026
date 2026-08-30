import "./Navbar.css";
import ssecLogo from "../assets/rename.png";

function Navbar() {
  return (
    <header className="navbar">

      {/* Left Side */}
      <div className="navbar-brand">

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
            Admin
          </span>

          <span className="navbar-user-role">
            Administrator
          </span>
        </div>

        <button className="navbar-logout">
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;