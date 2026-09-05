import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function StarRating({ value }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`star ${i <= Math.round(value) ? "star-filled" : "star-empty"}`}>
        ★
      </span>
    );
  }
  return <div className="star-row">{stars}</div>;
}

function AdminDashboard() {
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [lowScoreFeedback, setLowScoreFeedback] = useState([]);
  const [campusCompletion, setCampusCompletion] = useState({
  percentage: 0,
  submitted: 0,
  designated: 0,
});
const [overallReport, setOverallReport] = useState({
  overallRating: 0,
  totalSubmissions: 0,
  lowScoreAlerts: 0,
});

    useEffect(() => {
    const fetchFeedbackReport = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reports"
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        if (data.success) {
           setCampusCompletion(
           data.campusFeedbackCompletion || {
           percentage: 0,
           submitted: 0,
           designated: 0,
  }
);

setOverallReport(
  data.overall || {
    overallRating: 0,
    totalSubmissions: 0,
    lowScoreAlerts: 0,
  }
);
        const topRated = data.topRatedFaculty.map(
         (faculty, index) => ({
          id: index + 1,
          student: faculty.department,
          faculty: faculty.facultyName,
          rating: faculty.rating,
          date: "",
          subject: faculty.subject || "Subject not available",
     })
   );

          const lowRated = data.lowScoreDetails.map(
           (faculty, index) => ({
           id: index + 1,
           faculty: faculty.facultyName,
           department: faculty.department,
            rating: faculty.rating,
           date: faculty.date
          ? new Date(faculty.date).toLocaleDateString()
           : "",
           course: faculty.subject || "Subject not available",
       })
    );

          setRecentFeedback(topRated);
          setLowScoreFeedback(lowRated);
        }
      } catch (error) {
        console.error(
          "Error fetching feedback report:",
          error
        );
      }
    };

    fetchFeedbackReport();
  }, []);

  return (
    <div className="admin-dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of today's academic and feedback activity</p>
      </div>


      {/* ========================
          STAT CARDS (4)
      ======================== */}
      <div className="dashboard-stats">

        {/* Today's Lectures */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Today's Lectures Held</span>
            <span className="stat-icon">🎓</span>
          </div>
          <div className="stat-value">12</div>
          <div className="stat-description">Lectures conducted today</div>
        </div>


        {/* Low Score Alerts */}
        <div className="stat-card stat-card-alert">
          <div className="stat-card-top">
            <span className="stat-title">Low Score Alerts</span>
            <span className="stat-icon">⚠️</span>
          </div>
              <div className="stat-value stat-value-alert">
               {overallReport.lowScoreAlerts}
             </div>
          <div className="stat-description">Classes require administrative review</div>
        </div>


        {/* Campus Average */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Today's Campus Avg</span>
            <span className="stat-icon">⭐</span>
          </div>
               <div className="stat-value">
               {overallReport.overallRating}
             <span className="stat-max"> / 5</span>
           </div>
          <div className="stat-description">Overall feedback rating</div>
        </div>


        {/* Feedback Completion */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Feedback Completion</span>
            <span className="stat-icon">✅</span>
          </div>
         <div className="stat-value">
         {campusCompletion.percentage}%
     </div>

        <div className="stat-description">
         {campusCompletion.submitted} / {campusCompletion.designated} students completed feedback
      </div>

       <div className="completion-bar-bg">
      <div
        className="completion-bar-fill"
        style={{
         width: `${campusCompletion.percentage}%`,
        }}
      />
        </div>
     </div>

   </div>


      {/* ========================
          LOWER SECTIONS (2-col)
      ======================== */}
      <div className="dashboard-lower">

        {/* ---- TOP RECENT FEEDBACK ---- */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent High-Quality Feedback</h2>
            <span className="section-badge section-badge-green">Top Rated</span>
          </div>

          <div className="feedback-cards">
            {recentFeedback.map((fb) => (
              <div key={fb.id} className="feedback-item">
                <div className="feedback-item-top">
                  <div className="feedback-item-info">
                    <span className="feedback-class-tag">{fb.student}</span>
                    <span className="feedback-faculty">{fb.faculty}</span>
                  </div>
                  <div className="feedback-rating-badge">
                    ⭐ {fb.rating}
                  </div>
                </div>
                <p className="feedback-subject">{fb.subject}</p>

                <StarRating value={fb.rating} />
                <p className="feedback-date">{fb.date}</p>
              </div>
            ))}
          </div>
        </div>


        {/* ---- NEEDS ATTENTION ---- */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Needs Attention</h2>
            <span className="section-badge section-badge-red">Low Score</span>
          </div>

          <div className="feedback-cards">
            {lowScoreFeedback.map((fb) => (
              <div key={fb.id} className="feedback-item feedback-item-alert">
                <div className="feedback-item-top">
                  <div className="feedback-item-info">
                    <span className="feedback-class-tag alert-tag">{fb.department}</span>
                    <span className="feedback-faculty">{fb.faculty}</span>
                  </div>
                  <div className="feedback-rating-badge rating-badge-alert">
                    ⚠️ {fb.rating}
                  </div>
                </div>
                <p className="feedback-subject">{fb.course}</p>

                <div className="alert-footer">
                  <span className="feedback-date">{fb.date}</span>
                  <button className="review-btn">view</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;