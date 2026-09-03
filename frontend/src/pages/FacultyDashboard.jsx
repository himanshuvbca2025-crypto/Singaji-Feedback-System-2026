import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import ssecLogo from "../assets/rename.png";
import "./FacultyDashboard.css";

// Mock Data for the Timetable
const timetableData = [
  {
    id: 1,
    room: "ITEG lab 1",
    group: "ITEG 1A (1st-Year)",
    strength: 74,
    slot1: { subject: "What is Programming", faculty: "Shivalika Ma'am", link: "https://meet.google.com/abc-defg-hij" },
    slot2: { subject: "What is Programming", faculty: "Shivalika Ma'am", link: "https://meet.google.com/abc-defg-hij" },
    slot3: { subject: "Soft Skills", faculty: "Shivalika Ma'am", link: "https://meet.google.com/abc-defg-hij" },
  },
  {
    id: 2,
    room: "F02",
    group: "ITEG 1B",
    strength: 40,
    slot1: { subject: "Apti. & Reasoning", faculty: "Himanshu Sir", link: "https://meet.google.com/abc-defg-hij" },
    slot2: { subject: "Interview", faculty: "Anees Sir", link: "https://meet.google.com/abc-defg-hij" },
    slot3: { subject: "Interview", faculty: "Himanshu Sir", link: "https://meet.google.com/abc-defg-hij" },
  },
  {
    id: 3,
    room: "F03",
    group: "ITEG 1A (1st-Year)",
    strength: 50,
    slot1: { subject: "What is Programming", faculty: "Saheer Sir", link: "https://meet.google.com/abc-defg-hij" },
    slot2: { subject: "What is Programming", faculty: "Shivalika Ma'am", link: "https://meet.google.com/abc-defg-hij" },
    slot3: { subject: "Soft Skills", faculty: "Saheer Sir", link: "https://meet.google.com/abc-defg-hij" },
  },
  {
    id: 4,
    room: "F04",
    group: "ITEG 1B",
    strength: 43,
    slot1: { subject: "Apti. & Reasoning", faculty: "Anees Sir", link: "https://meet.google.com/abc-defg-hij" },
    slot2: { subject: "Interview", faculty: "Himanshu Sir", link: "https://meet.google.com/abc-defg-hij" },
    slot3: { subject: "Practice", faculty: "Yogendra Sir", link: "https://meet.google.com/abc-defg-hij" },
  },
  {
    id: 5,
    room: "F05",
    group: "SAP ABAP + 1C",
    strength: 50,
    slot1: { subject: "Project", faculty: "Yogendra Sir", link: "https://teams.microsoft.com/l/meetup-join/..." },
    slot2: { subject: "Project", faculty: "Yogendra Sir", link: "https://teams.microsoft.com/l/meetup-join/..." },
    slot3: { subject: "Practice", faculty: "Sunita Ma'am", link: "https://teams.microsoft.com/l/meetup-join/..." },
  },
  {
    id: 6,
    room: "F01",
    group: "ITEG 2A",
    strength: 45,
    slot1: { subject: "Apti. & Reasoning", faculty: "Tanushree Ma'am", link: "https://meet.google.com/xyz" },
    slot2: { subject: "Task Checking", faculty: "Tanushree Ma'am", link: "https://meet.google.com/xyz" },
    slot3: { subject: "Interview", faculty: "Tanushree Ma'am", link: "https://meet.google.com/xyz" },
  },
  {
    id: 7,
    room: "English Lab",
    group: "UIUX",
    strength: 20,
    slot1: { subject: "Practice", faculty: "Sanjana Ma'am", link: "https://meet.google.com/xyz" },
    slot2: { subject: "Practice", faculty: null, link: null },
    slot3: { subject: "Practice", faculty: null, link: null },
  },
];

// Helper Component for a single Lecture Cell
function LectureCell({ data, onShare }) {
  if (!data || !data.subject) return <td className="lecture-cell empty-cell">-</td>;

  return (
    <td className="lecture-cell">
      <div className="lecture-content">
        <span className="lecture-subject">{data.subject}</span>
        {data.faculty && <span className="lecture-faculty">{data.faculty}</span>}
        {data.link && (
          <button 
            className="share-btn" 
            onClick={() => onShare(data.subject, data.faculty, data.link)}
            title="Share Meeting Link"
          >
            <span>🔗</span> Share
          </button>
        )}
      </div>
    </td>
  );
}

function FacultyDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");

  const facultyName = user?.name || "Dr. Rahul Sharma";
  const facultyDept = user?.department || "ITEG";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleShare = async (subject, faculty, link) => {
    const shareData = {
      title: `Meeting Link for ${subject}`,
      text: `Join the lecture for ${subject} by ${faculty}.`,
      url: link,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} Link: ${shareData.url}`);
        showToast("Meeting link copied to clipboard!");
      } catch (err) {
        alert("Failed to copy link.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Date formatting for header
  const today = new Date();
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="faculty-layout">
      {toastMessage && <div className="faculty-toast">{toastMessage}</div>}

      {/* NAVBAR */}
      <header className="faculty-navbar">
        <div className="navbar-brand">
          <img src={ssecLogo} alt="SSISM Logo" className="navbar-logo" />
          <div className="navbar-brand-text">
            <h1>Singaji Educational Society</h1>
            <p>Feedback Management System</p>
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
        </div>
      </header>

      {/* BODY */}
      <div className="faculty-body">
        
        {/* SIDEBAR */}
        <aside className="faculty-sidebar">
          <nav className="sidebar-menu">
            <button className={`sidebar-link ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              <span className="sidebar-icon">🏠</span> <span className="sidebar-label">Dashboard</span>
            </button>
            <button className={`sidebar-link ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>
              <span className="sidebar-icon">📅</span> <span className="sidebar-label">My Schedule</span>
            </button>
            <button className={`sidebar-link ${activeTab === "lectures" ? "active" : ""}`} onClick={() => setActiveTab("lectures")}>
              <span className="sidebar-icon">📚</span> <span className="sidebar-label">My Lectures</span>
            </button>
            <button className={`sidebar-link ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
              <span className="sidebar-icon">📝</span> <span className="sidebar-label">Student Feedback</span>
            </button>
            <button className={`sidebar-link ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
              <span className="sidebar-icon">📊</span> <span className="sidebar-label">Feedback History</span>
            </button>
            <button className={`sidebar-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
              <span className="sidebar-icon">👤</span> <span className="sidebar-label">Profile</span>
            </button>

            <div className="sidebar-separator" />

            <button className="sidebar-link logout-link" onClick={handleLogout}>
              <span className="sidebar-icon">🚪</span> <span className="sidebar-label">Logout</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="faculty-main-content">
          
          <div className="faculty-page-header">
            <div>
              <h1>Faculty Dashboard</h1>
              <p>View your academic schedule and lecture details</p>
            </div>
            <div className="faculty-date-display">
              <strong>{formattedDate}</strong>
              <span>{dayName} · Day 23</span>
            </div>
          </div>

          {activeTab === "schedule" && (
            <div className="schedule-section">
              
              <div className="schedule-table-wrapper">
                <table className="academic-timetable">
                  <thead>
                    <tr>
                      <th className="th-sno">S.No.</th>
                      <th className="th-class">Classes</th>
                      <th className="th-group">Groups Name</th>
                      <th className="th-strength">Strength</th>
                      <th className="th-slot">
                        <div className="slot-title">Slot 1</div>
                        <div className="slot-time">10:00 AM to 11:30 AM</div>
                      </th>
                      <th className="th-break">
                        <div className="slot-title">Lunch Break</div>
                        <div className="slot-time">11:30 AM to 12:10 PM</div>
                      </th>
                      <th className="th-slot">
                        <div className="slot-title">Slot 2</div>
                        <div className="slot-time">12:10 PM to 01:40 PM</div>
                      </th>
                      <th className="th-break">
                        <div className="slot-title">Tea Break</div>
                        <div className="slot-time">01:40 PM to 02:00 PM</div>
                      </th>
                      <th className="th-slot">
                        <div className="slot-title">Slot 3</div>
                        <div className="slot-time">02:00 PM to 03:30 PM</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetableData.map((row, index) => (
                      <tr key={row.id}>
                        <td className="td-sno">{row.id}</td>
                        <td className="td-class">{row.room}</td>
                        <td className="td-group">{row.group}</td>
                        <td className="td-strength">{row.strength}</td>
                        
                        <LectureCell data={row.slot1} onShare={handleShare} />

                        {/* Merged Lunch Break Cell (only rendered on the first row) */}
                        {index === 0 && (
                          <td rowSpan={timetableData.length} className="break-cell lunch-break">
                            <div className="break-text">LUNCH BREAK</div>
                          </td>
                        )}

                        <LectureCell data={row.slot2} onShare={handleShare} />

                        {/* Merged Tea Break Cell (only rendered on the first row) */}
                        {index === 0 && (
                          <td rowSpan={timetableData.length} className="break-cell tea-break">
                            <div className="break-text">TEA BREAK</div>
                          </td>
                        )}

                        <LectureCell data={row.slot3} onShare={handleShare} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== "schedule" && (
            <div className="placeholder-content">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <p>This section is under construction.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default FacultyDashboard;
