import { useEffect, useState } from "react";
import "./AdminFeedback.css";

function StarDisplay({ value }) {
  return (
    <div className="star-display">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            i <= Math.round(value) ? "star-on" : "star-off"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);


  useEffect(() => {
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/feedback/all"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchFeedbacks();
}, []);

 const filtered = feedbacks.filter((fb) => {
  const matchDept =
    deptFilter === "All" ||
    fb.department === deptFilter;

  const rating = Number(fb.overallRating || 0);

  const status =
    rating < 3.5 ? "Needs Review" : "Pending";

  const matchStatus =
    statusFilter === "All" ||
    status === statusFilter;

  const search = searchTerm.toLowerCase().trim();

  const matchSearch =
    fb.facultyName
      ?.toLowerCase()
      .includes(search) ||
    fb.subjects?.some((subject) =>
      subject.toLowerCase().includes(search)
    );

  return matchDept && matchStatus && matchSearch;
});

  const lowScoreCount = feedbacks.filter(
    (fb) => Number(fb.overallRating) < 3.5
  ).length;

  const totalSubmissions = feedbacks.reduce(
    (total, fb) =>
      total + Number(fb.totalFeedbacks || 0),
    0
  );

  const totalRatingPoints = feedbacks.reduce(
    (total, fb) =>
      total +
      Number(fb.overallRating || 0) *
        Number(fb.totalFeedbacks || 0),
    0
  );

  const campusAverage =
    totalSubmissions > 0
      ? (totalRatingPoints / totalSubmissions).toFixed(1)
      : "0.0";


  return (
    <div className="admin-feedback-page">

      {/* Header */}
      <div className="af-header">
        <div>
          <h1>Feedback Management</h1>
          <p>
            View and manage all student feedback submissions
            across departments.
          </p>
        </div>

        {lowScoreCount > 0 && (
          <div className="af-alert-pill">
            ⚠️ {lowScoreCount} low score alert
            {lowScoreCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="af-summary-grid">

        <div className="af-summary-card">
          <span className="af-summary-label">
            Total Submissions
          </span>
         <strong className="af-summary-value"> 
           {totalSubmissions} 
        </strong>

        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">
            Campus Average
          </span>

          
          <strong className="af-summary-value">
            ⭐ {campusAverage}
         </strong>
        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">
            Needs Review
          </span>

          <strong className="af-summary-value af-value-alert">
            {lowScoreCount}
          </strong>
        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">
            Reviewed
          </span>

        <strong className="af-summary-value">
         0
        </strong>
        </div>

      </div>

      {/* Filters */}
      <div className="af-filters">

        <input
          type="text"
          className="af-search"
          placeholder="Search by faculty or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="af-select"
          value={deptFilter}
          onChange={(e) =>
            setDeptFilter(e.target.value)
          }
        >
          <option value="All">All Departments</option>
          <option value="ITEG">ITEG</option>
          <option value="MEG">MEG</option>
          <option value="BEG">BEG</option>
          <option value="B.Tech">B.Tech</option>
        </select>



        <select
          className="af-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Pending">Pending</option>
          <option value="Needs Review">
            Needs Review
          </option>
        </select>

      </div>

      {/* Table */}
      <div className="af-table-wrap">
        <table className="af-table">

          <thead>
            <tr>
              <th>Faculty</th>
              <th>Dept</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((fb) => {
                const status =
                  Number(fb.overallRating) < 3.5
                    ? "Needs Review"
                    : "Pending";

                return (
                  <tr
                    key={`${fb.facultyName}-${fb.department}`}
                    className={
                      Number(fb.overallRating) < 3.5
                        ? "af-row-alert"
                        : ""
                    }
                  >
                    <td>
                      <div className="af-faculty-name">
                        {fb.facultyName}
                      </div>

                      <div className="af-course-name">
                        {fb.subjects?.join(", ")}
                      </div>
                    </td>

                    <td>
                      <span className="af-dept-tag">
                        {fb.department}
                      </span>
                    </td>

                    <td>
                      <div className="af-rating-value">
                        {fb.overallRating}
                      </div>

                      <StarDisplay value={fb.overallRating} />
                    </td>

                    <td>
                      <span className="af-date">
                        {fb.date ? new Date(fb.date).toLocaleDateString() : "N/A"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`af-status-badge af-status-${status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="af-view-btn"
                        onClick={() => alert(`Viewing feedback of ${fb.facultyName}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="af-empty">
                  {loading
                    ? "Loading feedbacks..."
                    : "No feedback entries match your filters."}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

     <div className="af-table-footer">
      Showing {filtered.length} of {feedbacks.length} entries
    </div>

    </div>
  );
}

export default AdminFeedback;