import { Link } from "react-router-dom";
import ssecLogo from "../assets/rename.png";
import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="student-container">
      <header className="student-header">
        <div className="header-brand">
          <img src={ssecLogo} alt="Singaji Logo" className="student-logo" />
          <div>
            <h1>Singaji Educational Society</h1>
            <p>Student Feedback Portal</p>
          </div>
        </div>

        <Link to="/login" className="student-logout-btn">
          Logout
        </Link>
      </header>

      <main className="student-main">
        <div className="welcome-banner">
          <h2>Welcome, Student!</h2>
          <p>
            Department: <strong>ITEG</strong> • Level: <strong>1A</strong> • Batch 2026
          </p>
        </div>

        <div className="student-card-grid">
          <div className="student-card">
            <h3>📝 Give Feedback</h3>
            <p>Complete your evaluation for today's active lectures.</p>
            <Link to="/student/feedback" className="student-card-btn">
              Start Feedback
            </Link>
          </div>

          <div className="student-card">
            <h3>📜 Feedback History</h3>
            <p>View your past submitted feedback responses.</p>
            <Link to="/student/history" className="student-card-btn secondary">
              View History
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
