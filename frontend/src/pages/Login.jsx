import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

import ssecLogo from "../assets/rename.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "Faculty") {
        navigate("/faculty/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    const facultyEmail = "faculty@gmail.com";
    const facultyAltEmail = "rahul@singaji.edu.in";
    const facultyPassword = "faculty123";

    if (email === adminEmail && password === adminPassword) {
      setError("");

      login({
        email: adminEmail,
        role: "Admin",
        name: "Admin",
      });

      navigate("/admin/dashboard");
    } else if (
      (email === facultyEmail || email === facultyAltEmail) &&
      password === facultyPassword
    ) {
      setError("");

      login({
        email: facultyAltEmail,
        role: "Faculty",
        name: "Dr. Rahul Sharma",
        department: "ITEG",
      });

      navigate("/faculty/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@gmail.com");
    setPassword("admin123");
    setError("");
  };

  const handleFillDemoFaculty = () => {
    setEmail("faculty@gmail.com");
    setPassword("faculty123");
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo-wrapper">
          <img
            src={ssecLogo}
            alt="SSISM Logo"
            className="login-logo"
          />
        </div>

        <h1 className="login-title">Welcome</h1>

        <p className="login-subtitle">
          Sign in to your account to continue
        </p>

        <div className="demo-credentials-hints">
          <button
            type="button"
            className="demo-chip"
            onClick={handleFillDemoAdmin}
          >
            Demo Admin
          </button>

          <button
            type="button"
            className="demo-chip faculty-chip"
            onClick={handleFillDemoFaculty}
          >
            Demo Faculty
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="login-form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" className="login-button">
            Sign In
          </button>

        </form>

        {/* <div className="register-link">
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div> */}

      </div>
    </div>
  );
}

export default Login;