import { useState } from "react";
import "./Reports.css";

function Reports() {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");

  const deptPerformance = [
    { name: "ITEG", avgScore: 4.6, totalResponses: 140, completion: "92%" },
    { name: "MEG", avgScore: 4.2, totalResponses: 95, completion: "84%" },
    { name: "BEG", avgScore: 4.1, totalResponses: 80, completion: "80%" },
    { name: "B.Tech", avgScore: 4.5, totalResponses: 110, completion: "89%" },
  ];

  const topFaculty = [
    { name: "Dr. Rahul Sharma", dept: "ITEG", subject: "Programming", score: 4.8 },
    { name: "Dr. Amit Singh", dept: "ITEG", subject: "Web Development", score: 4.7 },
    { name: "Dr. S.K. Mehta", dept: "B.Tech", subject: "Networks", score: 4.6 },
    { name: "Prof. Neha Jain", dept: "ITEG", subject: "DBMS", score: 4.4 },
  ];

  const lowScoreAlerts = [
    { faculty: "Prof. Raj Kumar", dept: "MEG", subject: "Thermodynamics", score: 3.2, issue: "Speed of coverage & practical availability" },
    { faculty: "Prof. Vikash Meena", dept: "BEG", subject: "Maths", score: 3.4, issue: "Need more numerical practice in class" },
  ];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Comprehensive overview of campus feedback metrics, department ratings, and faculty trends.</p>
        </div>

        <div className="filter-group">
          <label>Department:</label>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="ITEG">ITEG</option>
            <option value="MEG">MEG</option>
            <option value="BEG">BEG</option>
            <option value="B.Tech">B.Tech</option>
          </select>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="reports-kpi-grid">
        <div className="kpi-report-card">
          <span className="kpi-title">Overall Feedback Score</span>
          <div className="kpi-main-val">⭐ 4.4 <small>/ 5.0</small></div>
          <p>Based on 425 response submissions</p>
        </div>

        <div className="kpi-report-card">
          <span className="kpi-title">Campus Feedback Completion</span>
          <div className="kpi-main-val">86%</div>
          <p>301 / 350 designated students submitted</p>
        </div>

        <div className="kpi-report-card">
          <span className="kpi-title">Active Low Score Alerts</span>
          <div className="kpi-main-val alert-text">2 Alerts</div>
          <p>Ratings under 3.5 needing review</p>
        </div>
      </div>

      {/* Department Performance */}
      <div className="reports-section-card">
        <h2>Department Ratings & Completion</h2>
        <div className="dept-perf-grid">
          {deptPerformance
            .filter((d) => selectedDeptFilter === "All" || d.name === selectedDeptFilter)
            .map((dept) => (
              <div key={dept.name} className="dept-perf-card">
                <h3>{dept.name}</h3>
                <div className="perf-score">⭐ {dept.avgScore} / 5</div>
                <div className="perf-bar-bg">
                  <div
                    className="perf-bar-fill"
                    style={{ width: `${(dept.avgScore / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="perf-footer">
                  <span>Submissions: {dept.totalResponses}</span>
                  <span>Completion: {dept.completion}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Faculty Leaderboard & Low Score Alerts */}
      <div className="reports-two-col">
        <div className="reports-section-card">
          <h2>Top Rated Faculty</h2>
          <div className="leaderboard-list">
            {topFaculty.map((f, i) => (
              <div key={i} className="leaderboard-item">
                <span className="rank-num">#{i + 1}</span>
                <div className="leader-info">
                  <strong>{f.name}</strong>
                  <p>{f.dept} • {f.subject}</p>
                </div>
                <span className="leader-score">⭐ {f.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reports-section-card">
          <h2>Low Score Alerts & Reviews</h2>
          <div className="alerts-list">
            {lowScoreAlerts.map((a, idx) => (
              <div key={idx} className="alert-item">
                <div className="alert-item-header">
                  <strong>⚠️ {a.faculty}</strong>
                  <span className="alert-score-badge">{a.score} / 5</span>
                </div>
                <p className="alert-dept">{a.dept} • {a.subject}</p>
                <div className="alert-note">Reason: {a.issue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
