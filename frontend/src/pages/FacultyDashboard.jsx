import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Modal from "../components/Modal.jsx";
import ssecLogo from "../assets/rename.png";
import "./FacultyDashboard.css";

function FacultyDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Active Tab state: 'dashboard' | 'schedule' | 'feedback' | 'history'
  const [activeTab, setActiveTab] = useState("dashboard");

  // Logged-in Faculty details fallback
  const facultyName = user?.name || "Dr. Rahul Sharma";
  const facultyDept = user?.department || "ITEG";

  // Date selection for timetable view (default today: 2026-09-02)
  const [selectedDate, setSelectedDate] = useState("2026-09-02");

  // Initial mock schedule data
  const defaultSchedules = [
    {
      id: "lec-101",
      date: "2026-09-02",
      class: "ITEG",
      group: "ITEG 1A",
      subject: "Presentation",
      startTime: "10:00",
      endTime: "11:30",
      faculty: "Dr. Rahul Sharma",
      status: "Upcoming",
    },
    {
      id: "lec-102",
      date: "2026-09-02",
      class: "ITEG",
      group: "ITEG 1A",
      subject: "Presentation",
      startTime: "12:10",
      endTime: "13:40",
      faculty: "Dr. Rahul Sharma",
      status: "Upcoming",
    },
    {
      id: "lec-103",
      date: "2026-09-02",
      class: "ITEG",
      group: "ITEG 1A",
      subject: "Soft Skills",
      startTime: "14:00",
      endTime: "15:30",
      faculty: "Dr. Rahul Sharma",
      status: "Upcoming",
    },
  ];

  // LocalStorage state management
  const [schedules, setSchedules] = useState(() => {
    try {
      const stored = localStorage.getItem("facultySchedules");
      return stored ? JSON.parse(stored) : defaultSchedules;
    } catch {
      return defaultSchedules;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("facultySchedules", JSON.stringify(schedules));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [schedules]);

  // Auth Protection Check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    date: "2026-09-02",
    class: "ITEG",
    group: "ITEG 1A",
    subject: "Presentation",
    startTime: "10:00",
    endTime: "11:30",
  });

  const [editingLectureId, setEditingLectureId] = useState(null);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Format 24h to 12h AM/PM
  const formatTime12h = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  // Format date display (e.g. 02 September 2026 — Wednesday)
  const formatDateHeader = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options = { day: "2-digit", month: "long", year: "numeric", weekday: "long" };
    const formatted = d.toLocaleDateString("en-GB", options);
    // Split weekday and date
    const parts = formatted.split(", ");
    return parts.length === 2 ? `${parts[1]} — ${parts[0]}` : formatted;
  };

  // Filter lectures for selected date
  const selectedDateLectures = schedules
    .filter((s) => s.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Dashboard Stats calculation for Today's Date
  const todayDateStr = "2026-09-02";
  const todayLectures = schedules.filter((s) => s.date === todayDateStr);
  const todayUpcoming = todayLectures.filter((s) => s.status === "Upcoming").length;
  const todayLive = todayLectures.filter((s) => s.status === "Live").length;
  const todayCompleted = todayLectures.filter((s) => s.status === "Completed").length;

  // Validation logic
  const validateForm = (data, currentId = null) => {
    if (!data.date || !data.class || !data.group || !data.subject || !data.startTime || !data.endTime) {
      return "All fields are required.";
    }

    if (data.endTime <= data.startTime) {
      return "End time must be after Start time.";
    }

    // Overlap conflict check for same date
    const sameDateLectures = schedules.filter(
      (s) => s.date === data.date && s.id !== currentId
    );

    for (let lec of sameDateLectures) {
      if (data.startTime < lec.endTime && data.endTime > lec.startTime) {
        return `Time slot overlaps with existing lecture: ${lec.subject} (${formatTime12h(lec.startTime)} - ${formatTime12h(lec.endTime)})`;
      }
    }

    return null;
  };

  // Handle Add Lecture Submit
  const handleCreateLecture = (e) => {
    e.preventDefault();
    const errorMsg = validateForm(formData);
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }

    const newLec = {
      id: `lec-${Date.now()}`,
      ...formData,
      faculty: facultyName,
      status: "Upcoming",
    };

    setSchedules([...schedules, newLec]);
    setSelectedDate(formData.date);
    setIsAddModalOpen(false);
    setFormError("");
    showToast("Lecture added to schedule successfully!");
  };

  // Open Edit Modal
  const handleOpenEdit = (lec) => {
    setEditingLectureId(lec.id);
    setFormData({
      date: lec.date,
      class: lec.class,
      group: lec.group,
      subject: lec.subject,
      startTime: lec.startTime,
      endTime: lec.endTime,
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  // Handle Edit Save
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm(formData, editingLectureId);
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }

    setSchedules(
      schedules.map((s) =>
        s.id === editingLectureId ? { ...s, ...formData } : s
      )
    );

    setIsEditModalOpen(false);
    setEditingLectureId(null);
    setFormError("");
    showToast("Lecture schedule updated!");
  };

  // Handle Delete
  const handleDeleteLecture = (id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
      showToast("Lecture removed from schedule.");
    }
  };

  // Handle Status Transitions (Start -> Live, End -> Completed)
  const handleStartLecture = (id) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, status: "Live" } : s))
    );
    showToast("Lecture is now LIVE! 🔴");
  };

  const handleEndLecture = (id) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, status: "Completed" } : s))
    );
    showToast("Lecture marked as Completed! ✓");
  };

  // Share Schedule Copy to Clipboard
  const handleCopySchedule = () => {
    if (selectedDateLectures.length === 0) {
      alert("No lectures to share for this date.");
      return;
    }

    let text = `📅 Timetable for ${formatDateHeader(selectedDate)}\nFaculty: ${facultyName}\nDepartment: ${facultyDept}\n-----------------------------------\n`;

    selectedDateLectures.forEach((lec, i) => {
      text += `${i + 1}. ${formatTime12h(lec.startTime)} - ${formatTime12h(lec.endTime)}\n   Class: ${lec.class} (${lec.group})\n   Subject: ${lec.subject}\n   Status: ${lec.status}\n\n`;
    });

    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Schedule copied to clipboard!");
        setIsShareModalOpen(false);
      })
      .catch(() => alert("Failed to copy text."));
  };

  // Logout Action
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="faculty-layout">
      {/* Toast Banner */}
      {toastMessage && <div className="faculty-toast">{toastMessage}</div>}

      {/* NAVBAR */}
      <header className="faculty-navbar">
        <div className="navbar-brand">
          <img src={ssecLogo} alt="SSEC Logo" className="navbar-logo" />
          <div className="navbar-brand-text">
            <h1>Singaji Educational Society</h1>
            <p>Faculty Dashboard & Timetable Portal</p>
          </div>
        </div>

        <div className="navbar-right">
          <div className="faculty-user-badge">
            <span className="user-avatar">{facultyName.charAt(0)}</span>
            <div className="user-info">
              <strong className="user-name">{facultyName}</strong>
              <span className="user-dept">{facultyDept} Department</span>
            </div>
          </div>

          <button className="faculty-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="faculty-body">
        {/* FACULTY SIDEBAR */}
        <aside className="faculty-sidebar">
          <div className="sidebar-menu">
            <button
              className={`sidebar-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <span>🏠</span> Dashboard
            </button>

            <button
              className={`sidebar-link ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              <span>📅</span> My Schedule
            </button>

            <button
              className="sidebar-link highlight-action-btn"
              onClick={() => {
                setFormError("");
                setIsAddModalOpen(true);
              }}
            >
              <span>➕</span> Create Schedule
            </button>

            <button
              className="sidebar-link"
              onClick={() => setIsShareModalOpen(true)}
            >
              <span>📤</span> Share Schedule
            </button>

            <button
              className={`sidebar-link ${activeTab === "feedback" ? "active" : ""}`}
              onClick={() => setActiveTab("feedback")}
            >
              <span>📝</span> Feedback
            </button>

            <button
              className={`sidebar-link ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <span>📊</span> Feedback History
            </button>

            <button className="sidebar-link logout-link" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="faculty-main-content">

          {/* ========================================================
              TAB 1: DASHBOARD HOME
          ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="tab-container">
              <div className="dashboard-banner">
                <div>
                  <h2>Welcome, {facultyName}!</h2>
                  <p>Here is your daily lecture overview for {formatDateHeader(todayDateStr)}.</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => setActiveTab("schedule")}
                >
                  View Full Timetable →
                </button>
              </div>

              {/* SUMMARY STAT CARDS */}
              <div className="summary-cards-grid">
                <div className="summary-card">
                  <div className="card-icon">📚</div>
                  <div className="card-val">{todayLectures.length}</div>
                  <div className="card-label">Today's Lectures</div>
                  <span className="card-subtext">Total scheduled for today</span>
                </div>

                <div className="summary-card">
                  <div className="card-icon">⏳</div>
                  <div className="card-val">{todayUpcoming}</div>
                  <div className="card-label">Upcoming Lectures</div>
                  <span className="card-subtext">Remaining to take</span>
                </div>

                <div className="summary-card">
                  <div className="card-icon">✓</div>
                  <div className="card-val">{todayCompleted}</div>
                  <div className="card-label">Completed Lectures</div>
                  <span className="card-subtext">Successfully conducted</span>
                </div>

                <div className="summary-card highlight-rating-card">
                  <div className="card-icon">⭐</div>
                  <div className="card-val">4.6 <small>/ 5.0</small></div>
                  <div className="card-label">Feedback Received</div>
                  <span className="card-subtext">380 student evaluations</span>
                </div>
              </div>

              {/* TODAY'S SCHEDULE HIGHLIGHT */}
              <div className="section-panel">
                <div className="panel-header">
                  <h3>Today's Schedule Highlights ({todayDateStr})</h3>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setFormError("");
                      setIsAddModalOpen(true);
                    }}
                  >
                    + Add New Lecture
                  </button>
                </div>

                <div className="timetable-wrapper">
                  {todayLectures.length > 0 ? (
                    <table className="college-timetable">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Class</th>
                          <th>Group</th>
                          <th>Subject</th>
                          <th>Faculty</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayLectures.map((lec, idx) => (
                          <tr key={lec.id} className={lec.status === "Live" ? "live-row" : ""}>
                            <td className="time-col">
                              {formatTime12h(lec.startTime)} – {formatTime12h(lec.endTime)}
                            </td>
                            <td><strong>{lec.class}</strong></td>
                            <td><span className="group-badge">{lec.group}</span></td>
                            <td>{lec.subject}</td>
                            <td>{lec.faculty}</td>
                            <td>
                              <span className={`status-pill ${lec.status.toLowerCase()}`}>
                                {lec.status === "Live" ? "🔴 LIVE" : lec.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-group">
                                {lec.status === "Upcoming" && (
                                  <button
                                    className="btn-start"
                                    onClick={() => handleStartLecture(lec.id)}
                                  >
                                    Start Lecture
                                  </button>
                                )}
                                {lec.status === "Live" && (
                                  <button
                                    className="btn-end"
                                    onClick={() => handleEndLecture(lec.id)}
                                  >
                                    End Lecture
                                  </button>
                                )}
                                <button
                                  className="btn-action-sm"
                                  onClick={() => handleOpenEdit(lec)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn-action-sm btn-delete-sm"
                                  onClick={() => handleDeleteLecture(lec.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-data-box">No lectures scheduled for today. Click "+ Add New Lecture" to create one.</div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* ========================================================
              TAB 2 & 3: MY SCHEDULE (TIMETABLE VIEW)
          ======================================================== */}
          {activeTab === "schedule" && (
            <div className="tab-container">
              <div className="schedule-page-header">
                <div>
                  <h2>My Class Schedule & Timetable</h2>
                  <p>View, manage and launch interactive college lectures.</p>
                </div>

                <div className="schedule-header-actions">
                  <div className="date-picker-box">
                    <label>Select Date:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <button
                    className="primary-btn"
                    onClick={() => {
                      setFormError("");
                      setFormData({ ...formData, date: selectedDate });
                      setIsAddModalOpen(true);
                    }}
                  >
                    + Create Schedule
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => setIsShareModalOpen(true)}
                  >
                    📤 Share Schedule
                  </button>
                </div>
              </div>

              <div className="section-panel">
                <div className="timetable-heading-bar">
                  <h3>🗓 {formatDateHeader(selectedDate)}</h3>
                  <span className="total-lectures-badge">
                    {selectedDateLectures.length} Lectures Scheduled
                  </span>
                </div>

                <div className="timetable-wrapper">
                  <table className="college-timetable">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Class</th>
                        <th>Group</th>
                        <th>Subject</th>
                        <th>Faculty</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Slot 1: 10:00 - 11:30 */}
                      {selectedDateLectures.map((lec) => (
                        <tr key={lec.id} className={lec.status === "Live" ? "live-row" : ""}>
                          <td className="time-col">
                            {formatTime12h(lec.startTime)} – {formatTime12h(lec.endTime)}
                          </td>
                          <td><strong>{lec.class}</strong></td>
                          <td><span className="group-badge">{lec.group}</span></td>
                          <td>{lec.subject}</td>
                          <td>{lec.faculty}</td>
                          <td>
                            <span className={`status-pill ${lec.status.toLowerCase()}`}>
                              {lec.status === "Live" ? "🔴 LIVE" : lec.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons-group">
                              {lec.status === "Upcoming" && (
                                <button
                                  className="btn-start"
                                  onClick={() => handleStartLecture(lec.id)}
                                >
                                  Start Lecture
                                </button>
                              )}
                              {lec.status === "Live" && (
                                <button
                                  className="btn-end"
                                  onClick={() => handleEndLecture(lec.id)}
                                >
                                  End Lecture
                                </button>
                              )}
                              <button
                                className="btn-action-sm"
                                onClick={() => handleOpenEdit(lec)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-action-sm btn-delete-sm"
                                onClick={() => handleDeleteLecture(lec.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Visual Breaks for realistic college schedule */}
                      <tr className="break-row">
                        <td className="time-col">11:30 – 12:10</td>
                        <td colSpan="6" className="break-label">
                          🍱 Lunch Break
                        </td>
                      </tr>

                      <tr className="break-row">
                        <td className="time-col">01:40 – 02:00</td>
                        <td colSpan="6" className="break-label">
                          ☕ Tea Break
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {selectedDateLectures.length === 0 && (
                    <div className="no-data-box">
                      No custom lectures scheduled for {selectedDate}. Click <strong>+ Create Schedule</strong> above to add one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* ========================================================
              TAB 5: FEEDBACK OVERVIEW
          ======================================================== */}
          {activeTab === "feedback" && (
            <div className="tab-container">
              <div className="dashboard-banner">
                <div>
                  <h2>Student Feedback Overview</h2>
                  <p>Ratings and evaluations submitted for {facultyName}.</p>
                </div>
              </div>

              <div className="summary-cards-grid">
                <div className="summary-card highlight-rating-card">
                  <div className="card-icon">⭐</div>
                  <div className="card-val">4.6 <small>/ 5.0</small></div>
                  <div className="card-label">Overall Rating</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon">📋</div>
                  <div className="card-val">380</div>
                  <div className="card-label">Total Student Responses</div>
                </div>

                <div className="summary-card">
                  <div className="card-icon">📈</div>
                  <div className="card-val">94%</div>
                  <div className="card-label">Positive Feedback Ratio</div>
                </div>
              </div>

              <div className="section-panel">
                <h3>Question-wise Rating Breakdown</h3>
                <div className="feedback-breakdown-list">
                  <div className="feedback-item">
                    <span>1. Syllabus Coverage & Punctuality</span>
                    <strong>4.8 / 5.0</strong>
                  </div>
                  <div className="feedback-item">
                    <span>2. Clarity of Explanation & Teaching</span>
                    <strong>4.6 / 5.0</strong>
                  </div>
                  <div className="feedback-item">
                    <span>3. Interaction & Doubt Clearing</span>
                    <strong>4.5 / 5.0</strong>
                  </div>
                  <div className="feedback-item">
                    <span>4. Classroom Discipline & Engagement</span>
                    <strong>4.7 / 5.0</strong>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================
              TAB 6: FEEDBACK HISTORY
          ======================================================== */}
          {activeTab === "history" && (
            <div className="tab-container">
              <div className="dashboard-banner">
                <div>
                  <h2>Feedback History & Student Comments</h2>
                  <p>Recent evaluation feedback history for {facultyName}.</p>
                </div>
              </div>

              <div className="section-panel">
                <h3>Recent Student Feedback Log</h3>
                <div className="history-comments-list">
                  <div className="comment-box">
                    <div className="comment-head">
                      <span>Student (Level 1A) • ITEG</span>
                      <span className="rating-stars">★★★★★ (5/5)</span>
                    </div>
                    <p>"Excellent presentation and clear explanation of concepts during the session!"</p>
                    <small>01 September 2026</small>
                  </div>

                  <div className="comment-box">
                    <div className="comment-head">
                      <span>Student (Level 1B) • ITEG</span>
                      <span className="rating-stars">★★★★☆ (4/5)</span>
                    </div>
                    <p>"Very informative session. Smooth pace and good practical examples."</p>
                    <small>28 August 2026</small>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>


      {/* ========================================================
          MODAL 1: CREATE SCHEDULE FORM
      ======================================================== */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormError("");
        }}
        title="➕ Create Schedule (Add Lecture)"
      >
        <form onSubmit={handleCreateLecture} className="faculty-form">
          {formError && <div className="form-error-banner">⚠️ {formError}</div>}

          <div className="form-grid-2">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Class / Department</label>
              <select
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
              >
                <option value="ITEG">ITEG</option>
                <option value="MEG">MEG</option>
                <option value="BEG">BEG</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Group / Section</label>
              <select
                value={formData.group}
                onChange={(e) =>
                  setFormData({ ...formData, group: e.target.value })
                }
              >
                <option value="ITEG 1A">ITEG 1A</option>
                <option value="ITEG 1B">ITEG 1B</option>
                <option value="ITEG 1C">ITEG 1C</option>
                <option value="MEG 2A">MEG 2A</option>
                <option value="BEG 1A">BEG 1A</option>
                <option value="B.Tech 3A">B.Tech 3A</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                placeholder="e.g. Presentation / Soft Skills"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Assigned Faculty</label>
            <input
              type="text"
              value={facultyName}
              readOnly
              className="readonly-input"
            />
            <small className="field-hint">Auto-filled with your faculty account</small>
          </div>

          <div className="modal-actions-bar">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setIsAddModalOpen(false);
                setFormError("");
              }}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Add Lecture
            </button>
          </div>
        </form>
      </Modal>


      {/* ========================================================
          MODAL 2: EDIT SCHEDULE FORM
      ======================================================== */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormError("");
        }}
        title="✏️ Edit Scheduled Lecture"
      >
        <form onSubmit={handleSaveEdit} className="faculty-form">
          {formError && <div className="form-error-banner">⚠️ {formError}</div>}

          <div className="form-grid-2">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Class / Department</label>
              <select
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
              >
                <option value="ITEG">ITEG</option>
                <option value="MEG">MEG</option>
                <option value="BEG">BEG</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Group / Section</label>
              <select
                value={formData.group}
                onChange={(e) =>
                  setFormData({ ...formData, group: e.target.value })
                }
              >
                <option value="ITEG 1A">ITEG 1A</option>
                <option value="ITEG 1B">ITEG 1B</option>
                <option value="ITEG 1C">ITEG 1C</option>
                <option value="MEG 2A">MEG 2A</option>
                <option value="BEG 1A">BEG 1A</option>
                <option value="B.Tech 3A">B.Tech 3A</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="modal-actions-bar">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setIsEditModalOpen(false);
                setFormError("");
              }}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>


      {/* ========================================================
          MODAL 3: SHARE SCHEDULE MODAL
      ======================================================== */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="📤 Share Timetable Schedule"
      >
        <div className="share-modal-body">
          <div className="share-preview-box">
            <h4>📅 {formatDateHeader(selectedDate)}</h4>
            <p><strong>Faculty:</strong> {facultyName} ({facultyDept})</p>
            <hr />
            {selectedDateLectures.length > 0 ? (
              <ul className="share-lecture-list">
                {selectedDateLectures.map((lec) => (
                  <li key={lec.id}>
                    🕒 <strong>{formatTime12h(lec.startTime)} - {formatTime12h(lec.endTime)}</strong>: {lec.subject} ({lec.class} - {lec.group})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-text">No lectures scheduled for {selectedDate}.</p>
            )}
          </div>

          <div className="modal-actions-bar">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setIsShareModalOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={handleCopySchedule}
            >
              📋 Copy Schedule
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default FacultyDashboard;
