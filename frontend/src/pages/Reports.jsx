import { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");

  const [overallReport, setOverallReport] = useState({
  overallRating: 0,
  totalSubmissions: 0,
  lowScoreAlerts: 0,
});

const [departmentReports, setDepartmentReports] = useState([]);
const [topFaculty, setTopFaculty] = useState([]);
const [lowScoreAlerts, setLowScoreAlerts] = useState([]);

useEffect(() => {
  const fetchReport = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/reports"
      );

      const data = await response.json();

      if (data.success) {
        setOverallReport(data.overall);
        setDepartmentReports(data.departments);
        setTopFaculty(data.topRatedFaculty);
        setLowScoreAlerts(data.lowScoreDetails);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  fetchReport();
}, []);


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

            <div className="kpi-main-val">
            ⭐ {overallReport.overallRating} <small>/ 5.0</small>
           </div>

              <p>
                 Based on {overallReport.totalSubmissions} response submissions
              </p>
        </div>

        <div className="kpi-report-card">
          <span className="kpi-title">Campus Feedback Completion</span>
          <div className="kpi-main-val">86%</div>
          <p>301 / 350 designated students submitted</p>
        </div>

        <div className="kpi-report-card">
          <span className="kpi-title">Active Low Score Alerts</span>
         <div className="kpi-main-val alert-text">
          {overallReport.lowScoreAlerts} Alerts
         </div>
          <p>Ratings under 3.5 needing review</p>
        </div>
      </div>

      {/* Department Performance */}
      <div className="reports-section-card">
        <h2>Department Ratings & Completion</h2>
        <div className="dept-perf-grid">
         {departmentReports.filter((dept) =>
           selectedDeptFilter === "All" ||
         dept.department === selectedDeptFilter
     )
      .map((dept) => (
              <div key={dept.department} className="dept-perf-card">
                        <h3>{dept.department}</h3>

                         <div className="perf-score">
                       ⭐ {dept.overallRating} / 5
                       </div>

                <div className="perf-bar-bg">
                   <div
                     className="perf-bar-fill"
                      style={{
                        width: `${(dept.overallRating / 5) * 100}%`,}}>

                        </div>
                  </div>

                      <div className="perf-footer">
                        <span>Submissions: {dept.totalSubmissions}</span>
                   <span>
                   Low Score Alerts: {dept.lowScoreAlerts}</span>
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

          <span className="rank-num">
            #{i + 1}
          </span>

         <div className="leader-info">
          <strong>{f.facultyName}</strong>
          <p>{f.department} • {f.subject}</p>
         </div>

         <span className="leader-score">
          ⭐ {f.rating}
         </span>

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
              <strong>⚠️ {a.facultyName}</strong>

              <span className="alert-score-badge">
                 {a.rating} / 5
              </span>

            </div>

               <p className="alert-dept">
                 {a.department} • {a.subject}
                </p>

               <div className="alert-note">
                 Reason: {a.reason}
              </div>

          </div>
          ))}
      </div>
    </div>

      </div>
    </div>
  );
}

export default Reports;
