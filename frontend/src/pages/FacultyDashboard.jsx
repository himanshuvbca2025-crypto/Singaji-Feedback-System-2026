import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import ssecLogo from "../assets/rename.png";
import "./FacultyDashboard.css";
import Modal from "../components/Modal.jsx";
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

function LectureCell({ data }) {
  if (!data || !data.subject) return <td className="lecture-cell empty-cell">-</td>;

  return (
    <td className="lecture-cell">
      <div className="lecture-content">
        <span className="lecture-subject">{data.subject}</span>
        {data.faculty && <span className="lecture-faculty">{data.faculty}</span>}
      </div>
    </td>
  );
}

function FacultyDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");
  const [schedules, setSchedules] = useState(timetableData);

  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    room: "",
    group: "",
    strength: "40",
    slot1Subject: "",
    slot1Faculty: "",
    slot2Subject: "",
    slot2Faculty: "",
    slot3Subject: "",
    slot3Faculty: "",
  });

  const facultyName = user?.name || "Dr. Rahul Sharma";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleAddScheduleSubmit = (e) => {
    e.preventDefault();
    if (!newSchedule.room || !newSchedule.group) {
      alert("Classroom and Group Name are required!");
      return;
    }

    const createdRow = {
      id: schedules.length + 1,
      room: newSchedule.room,
      group: newSchedule.group,
      strength: Number(newSchedule.strength) || 40,
      slot1: { subject: newSchedule.slot1Subject, faculty: newSchedule.slot1Faculty || facultyName },
      slot2: { subject: newSchedule.slot2Subject, faculty: newSchedule.slot2Faculty || facultyName },
      slot3: { subject: newSchedule.slot3Subject, faculty: newSchedule.slot3Faculty || facultyName },
    };

    setSchedules([...schedules, createdRow]);
    setIsAddScheduleOpen(false);
    setNewSchedule({
      room: "",
      group: "",
      strength: "40",
      slot1Subject: "",
      slot1Faculty: "",
      slot2Subject: "",
      slot2Faculty: "",
      slot3Subject: "",
      slot3Faculty: "",
    });
    showToast("New lecture schedule added successfully!");
  };

  // Date formatting for header
  const today = new Date();
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="faculty-layout">
      {toastMessage && <div className="faculty-toast">{toastMessage}</div>}

      <div className="faculty-body">
        <main className="faculty-main-content">
          <div className="faculty-page-header">
            <div>
              <h1>Faculty Dashboard</h1>
              <p>View & manage your academic schedule and lecture details</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                className="btn-add-schedule"
                onClick={() => setIsAddScheduleOpen(true)}
                style={{
                  background: "#166534",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                ➕ Add Schedule Row
              </button>

              <button
                className="btn-share-schedule"
                onClick={async () => {
                  let text = `SANT SINGAJI INSTITUTE OF SCIENCE AND MANAGEMENT, SANDALPUR\n`;
                  text += `Date: ${formattedDate} | Day: ${dayName}\n`;
                  text += `====================================\n\n`;
                  schedules.forEach((row) => {
                    text += `Class: ${row.room} | Group: ${row.group} | Strength: ${row.strength}\n`;
                    text += `[10:00 AM - 11:30 AM]: ${row.slot1?.subject || "Empty"} (${row.slot1?.faculty || "None"})\n`;
                    text += `[11:30 AM - 12:10 PM]: LUNCH BREAK\n`;
                    text += `[12:10 PM - 01:40 PM]: ${row.slot2?.subject || "Empty"} (${row.slot2?.faculty || "None"})\n`;
                    text += `[01:40 PM - 02:00 PM]: TEA BREAK\n`;
                    text += `[02:00 PM - 03:30 PM]: ${row.slot3?.subject || "Empty"} (${row.slot3?.faculty || "None"})\n`;
                    text += `------------------------------------\n`;
                  });
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: "Today Schedule", text });
                    } catch (e) { }
                  } else {
                    await navigator.clipboard.writeText(text);
                    showToast("Complete schedule copied to clipboard for Teams/Group share!");
                  }
                }}
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                📢 Share Schedule on Teams
              </button>

              <div className="faculty-date-display">
                <strong>{formattedDate}</strong>
                <span>{dayName} · Day 23</span>
              </div>
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
                    {schedules.map((row, index) => (
                      <tr key={row.id}>
                        <td className="td-sno">{row.id}</td>
                        <td className="td-class">{row.room}</td>
                        <td className="td-group">{row.group}</td>
                        <td className="td-strength">{row.strength}</td>

                        <LectureCell data={row.slot1} />

                        {index === 0 && (
                          <td rowSpan={schedules.length} className="break-cell lunch-break">
                            <div className="break-text">LUNCH BREAK</div>
                          </td>
                        )}

                        <LectureCell data={row.slot2} />

                        {index === 0 && (
                          <td rowSpan={schedules.length} className="break-cell tea-break">
                            <div className="break-text">TEA BREAK</div>
                          </td>
                        )}

                        <LectureCell data={row.slot3} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD SCHEDULE MODAL */}
          <Modal
            isOpen={isAddScheduleOpen}
            onClose={() => setIsAddScheduleOpen(false)}
            title="Create New Timetable Schedule"
          >
            <form onSubmit={handleAddScheduleSubmit} className="modal-form">
              <div className="modal-form-group">
                <label>Classroom / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. ITEG Lab 2 / F01"
                  value={newSchedule.room}
                  onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. ITEG 1C (1st-Year)"
                  value={newSchedule.group}
                  onChange={(e) => setNewSchedule({ ...newSchedule, group: e.target.value })}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Student Strength</label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={newSchedule.strength}
                  onChange={(e) => setNewSchedule({ ...newSchedule, strength: e.target.value })}
                />
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "12px" }}>
                <strong>Slot 1 (10:00 AM - 11:30 AM)</strong>
                <div className="modal-form-group" style={{ marginTop: "6px" }}>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={newSchedule.slot1Subject}
                    onChange={(e) => setNewSchedule({ ...newSchedule, slot1Subject: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "12px" }}>
                <strong>Slot 2 (12:10 PM - 01:40 PM)</strong>
                <div className="modal-form-group" style={{ marginTop: "6px" }}>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={newSchedule.slot2Subject}
                    onChange={(e) => setNewSchedule({ ...newSchedule, slot2Subject: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "12px" }}>
                <strong>Slot 3 (02:00 PM - 03:30 PM)</strong>
                <div className="modal-form-group" style={{ marginTop: "6px" }}>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={newSchedule.slot3Subject}
                    onChange={(e) => setNewSchedule({ ...newSchedule, slot3Subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddScheduleOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Schedule
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}

export default FacultyDashboard;
