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


 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setError("");

    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid email or password");
      return;
    }

    // Login successful
    login({
      email: data.admin.gmail,
      role: "Admin",
      name: data.admin.username || "Admin",
    });

    navigate("/admin/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    setError("Unable to connect to server. Please try again.");
  }
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