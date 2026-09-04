import { useState } from "react";
import "./AdminFeedback.css";
/* ============================================================
   MOCK FEEDBACK DATA
   Replace with real API calls when backend is available
============================================================ */

const allFeedback = [
  {
    id: 1,
    faculty: "Dr. Rahul Sharma",
    department: "ITEG",
    rating: 4.8,
    date: "2026-09-02",
    status: "view",
  },
  {
    id: 2,

    faculty: "Prof. Neha Jain",
    department: "ITEG",
    rating: 4.4,
    date: "2026-09-02",
    status: "view",
  },
  {
    id: 3,

    faculty: "Prof. Raj Kumar",
    department: "MEG",
    rating: 3.2,
    date: "2026-09-02",
    status: "view",
  },
  {
    id: 4,

    faculty: "Dr. S.K. Mehta",
    department: "B.Tech",
    rating: 4.6,
    date: "2026-09-01",
    status: "view",
  },
  {
    id: 5,
    faculty: "Prof. Vikash Meena",
    department: "BEG",
    rating: 3.4,
    date: "2026-09-01",
    status: "view",
  },
  {
    id: 6,
    faculty: "Dr. Amit Singh",
    department: "ITEG",
    rating: 4.7,
    date: "2026-09-01",
    status: "view",
  },
  {
    id: 7,
    faculty: "Dr. Priya Verma",
    department: "MEG",
    rating: 4.2,
    date: "2026-08-31",
    status: "view",
  },
  {
    id: 8,
    faculty: "Dr. Mohit Jain",
    department: "BEG",
    rating: 3.1,
    date: "2026-08-31",
    status: "view",
  },
];

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
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = allFeedback.filter((fb) => {
    const matchDept =
      deptFilter === "All" || fb.department === deptFilter;

    const matchStatus =
      statusFilter === "All" || fb.status === statusFilter;

    const matchSearch =
      fb.faculty
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      fb.course
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchDept && matchStatus && matchSearch;
  });

  const lowScoreCount = allFeedback.filter(
    (fb) => fb.rating < 3.5
  ).length;

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
            {allFeedback.length}
          </strong>
        </div>

        <div className="af-summary-card">
          <span className="af-summary-label">
            Campus Average
          </span>

          <strong className="af-summary-value">
            ⭐{" "}
            {(
              allFeedback.reduce(
                (s, f) => s + f.rating,
                0
              ) / allFeedback.length
            ).toFixed(1)}
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
            {
              allFeedback.filter(
                (f) => f.status === "Reviewed"
              ).length
            }
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
              filtered.map((fb) => (
                <tr
                  key={fb.id}
                  className={
                    fb.rating < 3.5
                      ? "af-row-alert"
                      : ""
                  }
                >

                  <td>
                    <div className="af-course-name">
                      {fb.course}
                    </div>

                    <div className="af-faculty-name">
                      {fb.faculty}
                    </div>
                  </td>

                  <td>
                    <span className="af-dept-tag">
                      {fb.department}
                    </span>
                  </td>

                  <td>
                    <div className="af-rating-value">
                      {fb.rating}
                    </div>

                    <StarDisplay
                      value={fb.rating}
                    />
                  </td>



                  <td>
                    <span className="af-date">
                      {fb.date}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`af-status-badge af-status-${fb.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {fb.status}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="af-empty"
                >
                  No feedback entries match your
                  filters.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <div className="af-table-footer">
        Showing {filtered.length} of {allFeedback.length} entries
      </div>

    </div>
  );
}

export default AdminFeedback;