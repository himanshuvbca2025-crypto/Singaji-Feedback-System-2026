import React, { useState } from "react";
import "./FacultyFeedbackModal.css";

function StarDisplay({ value }) {
  return (
    <div className="star-display">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(value) ? "star-on" : "star-off"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function FacultyFeedbackModal({ isOpen, onClose, faculty }) {
  const [expandedMetrics, setExpandedMetrics] = useState({});

  if (!isOpen || !faculty) return null;

  const toggleMetrics = (lectureId) => {
    setExpandedMetrics((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const getStatusBadge = (rating) => {
    const num = Number(rating);
    if (num >= 4.5) return { label: "Excellent", className: "badge-excellent" };
    if (num >= 3.5) return { label: "Good", className: "badge-good" };
    if (num >= 2.5) return { label: "Needs Improvement", className: "badge-warning" };
    return { label: "Critical", className: "badge-critical" };
  };

  return (
    <div className="ffm-overlay" onClick={onClose}>
      <div className="ffm-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ffm-header">
          <div className="ffm-header-info">
            <h2>{faculty.name}</h2>
            <div className="ffm-sub-bar">
              <span className="ffm-badge">{faculty.department}</span>
              <span className="ffm-date">📅 Today's Feedback ({todayStr})</span>
            </div>
          </div>
          <button className="ffm-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="ffm-body">
          <div className="ffm-overview-strip">
            <div className="ffm-overview-card">
              <span className="ffm-ov-label">Overall Rating</span>
              <div className="ffm-ov-rating">
                <strong>⭐ {faculty.overallRating}</strong> / 5.0
              </div>
            </div>
            <div className="ffm-overview-card">
              <span className="ffm-ov-label">Today's Lectures</span>
              <strong className="ffm-ov-num">{faculty.lecturesToday?.length || 0} Lectures</strong>
            </div>
            <div className="ffm-overview-card">
              <span className="ffm-ov-label">Department</span>
              <strong className="ffm-ov-num">{faculty.department}</strong>
            </div>
          </div>

          <h3 className="ffm-section-title">Today's Conducted Lectures</h3>

          {faculty.lecturesToday && faculty.lecturesToday.length > 0 ? (
            faculty.lecturesToday.map((lecture, index) => {
              const statusInfo = getStatusBadge(lecture.overallRating);
              const isLowScore = Number(lecture.overallRating) < 3.5;
              const isExpanded = expandedMetrics[lecture.lectureId] ?? false;

              return (
                <div
                  key={lecture.lectureId || index}
                  className={`ffm-lecture-card ${isLowScore ? "ffm-low-score" : ""}`}
                >
                  {/* Lecture Header */}
                  <div className="ffm-lecture-header">
                    <div>
                      <span className="ffm-lec-number">{lecture.number || `Lecture ${index + 1}`}</span>
                      <h4 className="ffm-lec-subject">{lecture.subject}</h4>
                      <div className="ffm-lec-meta">
                        <span>⏰ {lecture.time}</span>
                        <span>🏫 Class: {lecture.className} (Group {lecture.group})</span>
                        <span>👥 Strength: {lecture.strength}</span>
                      </div>
                    </div>

                    <div className="ffm-lec-rating-box">
                      <div className="ffm-rating-number">{lecture.overallRating}</div>
                      <StarDisplay value={lecture.overallRating} />
                      <span className={`ffm-status-badge ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                      {isLowScore && (
                        <div className="ffm-needs-review-pill">⚠️ Needs Review</div>
                      )}
                    </div>
                  </div>

                  {/* Submission Rate Bar */}
                  <div className="ffm-submission-banner">
                    <span>
                      Submission Rate: <strong>{lecture.responses} / {lecture.strength}</strong> (
                      {Math.round((lecture.responses / lecture.strength) * 100)}%)
                    </span>
                  </div>

                  {/* Feedback Matrix */}
                  <div className="ffm-matrix-wrapper">
                    <h5 className="ffm-matrix-title">Feedback Rating Matrix</h5>
                    <div className="ffm-table-scroll">
                      <table className="ffm-matrix-table">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th className="tc">1 (Poor)</th>
                            <th className="tc">2 (Fair)</th>
                            <th className="tc">3 (Avg)</th>
                            <th className="tc">4 (Good)</th>
                            <th className="tc">5 (Exc)</th>
                            <th className="tc">Average</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(isExpanded
                            ? lecture.parameters
                            : lecture.parameters?.slice(0, 5)
                          )?.map((param, idx) => (
                            <tr key={idx}>
                              <td className="param-name">{param.name}</td>
                              {param.ratings.map((cnt, rIdx) => (
                                <td key={rIdx} className="tc rating-cnt">
                                  {cnt}
                                </td>
                              ))}
                              <td className="tc param-avg">
                                <strong>{param.avg}</strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {lecture.parameters?.length > 5 && (
                      <button
                        className="ffm-toggle-metrics-btn"
                        onClick={() => toggleMetrics(lecture.lectureId)}
                      >
                        {isExpanded ? "Show Top 5 Metrics ▲" : "View 10 Metrics ▼"}
                      </button>
                    )}
                  </div>

                  {/* Anonymous Student Remarks */}
                  {lecture.remarks && lecture.remarks.length > 0 && (
                    <div className="ffm-remarks-section">
                      <h5 className="ffm-remarks-title">Written Student Remarks (Anonymous)</h5>
                      <div className="ffm-remarks-list">
                        {lecture.remarks.map((remark, rIdx) => (
                          <div key={rIdx} className="ffm-remark-bubble">
                            "{remark}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="ffm-empty-lectures">
              No lectures recorded for today for this faculty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyFeedbackModal;
