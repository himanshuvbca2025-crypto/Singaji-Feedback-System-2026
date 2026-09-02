import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>
          Overview of today's academic and feedback activity
        </p>
      </div>


      {/* Main Statistics */}
      <div className="dashboard-stats">

        {/* Today's Lectures */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">
              Today's Lectures Held
            </span>
            <span className="stat-icon">
              🎓
            </span>
          </div>

          <div className="stat-value">
            12
          </div>

          <div className="stat-description">
            Lectures conducted today
          </div>
        </div>


        {/* Low Score Alerts */}
        <div className="stat-card alert-card">
          <div className="stat-card-top">
            <span className="stat-title">
              Low Score Alerts
            </span>
            <span className="stat-icon">
              ⚠️
            </span>
          </div>

          <div className="stat-value">
            3
          </div>

          <div className="stat-description">
            Classes require administrative review
          </div>
        </div>


        {/* Campus Average */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">
              Today's Campus Avg
            </span>
            <span className="stat-icon">
              ⭐
            </span>
          </div>

          <div className="stat-value">
            4.2
            <span className="stat-max">
              / 5
            </span>
          </div>

          <div className="stat-description">
            Overall feedback rating
          </div>
        </div>


        {/* Feedback Completion */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">
              Feedback Completion
            </span>
            <span className="stat-icon">
              ✓
            </span>
          </div>

          <div className="stat-value">
            86%
          </div>

          <div className="stat-description">
            Students completed feedback
          </div>
        </div>

      </div>


      {/* Feedback Overview */}
      <div className="feedback-overview">

        <div className="overview-header">
          <div>
            <h2>Today's Feedback Summary</h2>
            <p>
              Real-time response breakdown across departments
            </p>
          </div>
        </div>


        <div className="overview-stats">

          <div className="overview-item">
            <span className="overview-label">
              Total Eligible Students
            </span>
            <strong>
              350
            </strong>
          </div>


          <div className="overview-item">
            <span className="overview-label">
              Feedbacks Submitted
            </span>
            <strong>
              301
            </strong>
          </div>


          <div className="overview-item">
            <span className="overview-label">
              Pending Submissions
            </span>
            <strong>
              49
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;