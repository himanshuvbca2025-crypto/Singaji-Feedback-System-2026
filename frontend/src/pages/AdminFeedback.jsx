import { useState, useEffect } from "react";
import { mockFaculties } from "../data/mockData.js";
import FacultyFeedbackModal from "../components/FacultyFeedbackModal.jsx";
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
  const [feedbacks, setFeedbacks] = useState(mockFaculties);
  const [deptFilter, setDeptFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFacultyModal, setSelectedFacultyModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback/all");
        const data = await response.json();
        if (response.ok && data.success && data.feedbacks?.length > 0) {
          // Normalize backend data to include mock structure if necessary
          const mapped = data.feedbacks.map((item, idx) => ({
            id: item._id || item.id || `fb-api-${idx}`,
            name: item.facultyName || item.faculty || item.name || "Faculty Member",
            department: item.department || "ITEG",
            overallRating: item.overallRating || item.rating || 4.2,
            totalFeedbacks: item.totalFeedbacks || 40,
            lecturesToday: item.lecturesToday || mockFaculties[idx % mockFaculties.length].lecturesToday
          }));
          setFeedbacks(mapped);
        }
      } catch (err) {
        console.log("Backend offline, using default mock feedback data.");
      }
    };
    fetchFeedbacks();
  }, []);

  const filtered = feedbacks.filter((fb) => {
    const matchDept =
      deptFilter === "All" || fb.department === deptFilter;

    const search = searchTerm.toLowerCase().trim();

    const matchSearch =
      fb.name.toLowerCase().includes(search) ||
      fb.lecturesToday?.some((lec) =>
        lec.subject.toLowerCase().includes(search)
      );

    return matchDept && matchSearch;
  });

  const lowScoreCount = feedbacks.filter(
    (fb) => Number(fb.overallRating) < 3.5
  ).length;

  const totalSubmissions = feedbacks.reduce(
    (total, fb) => total + Number(fb.totalFeedbacks || 0),
    0
  );

  const totalRatingPoints = feedbacks.reduce(
    (total, fb) =>
      total + Number(fb.overallRating || 0) * Number(fb.totalFeedbacks || 0),
    0
  );

  const campusAverage =
    totalSubmissions > 0
      ? (totalRatingPoints / totalSubmissions).toFixed(1)
      : "0.0";

  const handleOpenModal = (faculty) => {
    setSelectedFacultyModal(faculty);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-feedback-page">
      {/* Header */}
      <div className="af-header">
        <div>
          <h1>Feedback Management</h1>
          <p>
            View and analyze student feedback submissions across departments.
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
          <span className="af-summary-label">Total Submissions</span>
          <strong className="af-summary-value">{totalSubmissions}</strong>
        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">Campus Average</span>
          <strong className="af-summary-value">⭐ {campusAverage}</strong>
        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">Needs Review</span>
          <strong className="af-summary-value af-value-alert">
            {lowScoreCount}
          </strong>
        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">Reviewed</span>
          <strong className="af-summary-value">
            {feedbacks.length - lowScoreCount}
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
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="ITEG">ITEG</option>
          <option value="MEG">MEG</option>
          <option value="BEG">BEG</option>
          <option value="B.Tech">B.Tech</option>
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((fb) => {
                const isAlert = Number(fb.overallRating) < 3.5;

                return (
                  <tr
                    key={fb.id}
                    className={isAlert ? "af-row-alert" : ""}
                  >
                    <td>
                      <div className="af-faculty-name">{fb.name}</div>
                      <div className="af-course-name">
                        {fb.lecturesToday?.map((l) => l.subject).join(", ")}
                      </div>
                    </td>

                    <td>
                      <span className="af-dept-tag">{fb.department}</span>
                    </td>

                    <td>
                      <div className="af-rating-value">{fb.overallRating}</div>
                      <StarDisplay value={fb.overallRating} />
                    </td>

                    <td>
                      <span className="af-date">
                        {new Date().toLocaleDateString("en-GB")}
                      </span>
                    </td>

                    <td>
                      <button
                        className="af-view-btn"
                        onClick={() => handleOpenModal(fb)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="af-empty">
                  No feedback entries match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="af-table-footer">
        Showing {filtered.length} of {feedbacks.length} entries
      </div>

      {/* Faculty Feedback Today Modal */}
      <FacultyFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faculty={selectedFacultyModal}
      />
    </div>
  );
}

export default AdminFeedback;