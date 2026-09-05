import { useState } from "react";
import Modal from "../components/Modal.jsx";
import "./ManageLectures.css";

function ManageLectures() {
  const [lectures, setLectures] = useState([
    {
      id: "1",
      subject: "Programming in C++ & Java",
      faculty: "Dr. Rahul Sharma",
      department: "ITEG",
      date: "2026-09-02",
      time: "10:00 AM - 11:30 AM",
      room: "Lab-3",
      status: "Scheduled",
    },
    {
      id: "2",
      subject: "Database Management Systems",
      faculty: "Prof. Neha Jain",
      department: "ITEG",
      date: "2026-09-02",
      time: "11:45 AM - 01:15 PM",
      room: "Hall-102",
      status: "In Progress",
    },
    {
      id: "3",
      subject: "Fluid Mechanics",
      faculty: "Dr. Priya Verma",
      department: "MEG",
      date: "2026-09-02",
      time: "02:00 PM - 03:30 PM",
      room: "Workshop-B",
      status: "Scheduled",
    },
    {
      id: "4",
      subject: "Technical Communication",
      faculty: "Prof. Pooja Sharma",
      department: "BEG",
      date: "2026-09-02",
      time: "09:00 AM - 10:00 AM",
      room: "Room-204",
      status: "Completed",
    },
    {
      id: "5",
      subject: "Computer Networks & Security",
      faculty: "Dr. S.K. Mehta",
      department: "B.Tech",
      date: "2026-09-02",
      time: "03:30 PM - 05:00 PM",
      room: "Auditorium",
      status: "Scheduled",
    },
  ]);

  const departments = ["ITEG", "MEG", "BEG", "B.Tech"];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newLecture, setNewLecture] = useState({
    subject: "",
    faculty: "",
    department: "ITEG",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM - 11:00 AM",
    room: "Lab-1",
    status: "Scheduled",
  });

  const [activeLecture, setActiveLecture] = useState(null);

  // Add lecture
  const handleAddLecture = (e) => {
    e.preventDefault();
    if (!newLecture.subject || !newLecture.faculty || !newLecture.room) return;

    const created = {
      id: Date.now().toString(),
      ...newLecture,
    };
    setLectures([...lectures, created]);
    setNewLecture({
      subject: "",
      faculty: "",
      department: "ITEG",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM - 11:00 AM",
      room: "Lab-1",
      status: "Scheduled",
    });
    setIsAddModalOpen(false);
  };

  // Edit lecture
  const handleOpenEdit = (lec) => {
    setActiveLecture({ ...lec });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!activeLecture) return;

    setLectures(
      lectures.map((l) => (l.id === activeLecture.id ? activeLecture : l))
    );
    setIsEditModalOpen(false);
    setActiveLecture(null);
  };

  // Delete lecture
  const handleOpenDelete = (lec) => {
    setActiveLecture(lec);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!activeLecture) return;
    setLectures(lectures.filter((l) => l.id !== activeLecture.id));
    setIsDeleteModalOpen(false);
    setActiveLecture(null);
  };

  return (
    <div className="manage-lectures-page">
      <div className="lectures-header">
        <div>
          <h1>Manage Daily Lectures</h1>
          <p>Schedule, manage classrooms, and track active lecture status.</p>
        </div>

        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          + Add Lecture
        </button>
      </div>

      <div className="lectures-list">
        {lectures.length > 0 ? (
          lectures.map((lec) => (
            <div key={lec.id} className="lecture-row-card">
              <div className="lecture-main-info">
                <div className="lecture-time-badge">
                  <span>📅 {lec.date}</span>
                  <strong>⏰ {lec.time}</strong>
                </div>

                <div className="lecture-details">
                  <h3>{lec.subject}</h3>
                  <p>
                    👨‍🏫 <strong>{lec.faculty}</strong> • 🏛 {lec.department} Department
                  </p>
                  <span className="room-tag">📍 Room / Venue: {lec.room}</span>
                </div>
              </div>

              <div className="lecture-status-actions">
                <span
                  className={`status-badge ${lec.status.toLowerCase().replace(" ", "-")}`}
                >
                  {lec.status}
                </span>

                <div className="lecture-buttons">
                  <button
                    className="btn-edit"
                    style={{ background: "#ea580c", color: "#ffffff", borderColor: "#ea580c" }}
                    onClick={async () => {
                      const studentMail = prompt("Enter Student Email to send feedback link:", "student@singaji.edu.in");
                      if (studentMail) {
                        try {
                          const res = await fetch("http://localhost:5000/api/feedback/send-invite", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              studentEmail: studentMail,
                              facultyName: lec.faculty,
                              subject: lec.subject,
                              time: lec.time,
                            })
                          });
                          const d = await res.json();
                          alert(d.message || `Feedback link email dispatched to ${studentMail}!`);
                        } catch (err) {
                          alert(`Feedback invite link simulated for ${studentMail}`);
                        }
                      }
                    }}
                  >
                    ✉ Send Email
                  </button>
                  <button className="btn-edit" onClick={() => handleOpenEdit(lec)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleOpenDelete(lec)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-box">No lectures scheduled. Add one to get started.</div>
        )}
      </div>

      {/* ADD LECTURE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Lecture"
      >
        <form onSubmit={handleAddLecture} className="lecture-modal-form">
          <div className="modal-form-group">
            <label>Subject / Topic</label>
            <input
              type="text"
              placeholder="e.g. Java OOP Concepts"
              value={newLecture.subject}
              onChange={(e) =>
                setNewLecture({ ...newLecture, subject: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Faculty Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Rahul Sharma"
              value={newLecture.faculty}
              onChange={(e) =>
                setNewLecture({ ...newLecture, faculty: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Department</label>
            <select
              value={newLecture.department}
              onChange={(e) =>
                setNewLecture({ ...newLecture, department: e.target.value })
              }
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label>Date</label>
            <input
              type="date"
              value={newLecture.date}
              onChange={(e) =>
                setNewLecture({ ...newLecture, date: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Time Slot</label>
            <input
              type="text"
              placeholder="e.g. 10:00 AM - 11:30 AM"
              value={newLecture.time}
              onChange={(e) =>
                setNewLecture({ ...newLecture, time: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Room / Venue</label>
            <input
              type="text"
              placeholder="e.g. Lab-3"
              value={newLecture.room}
              onChange={(e) =>
                setNewLecture({ ...newLecture, room: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Status</label>
            <select
              value={newLecture.status}
              onChange={(e) =>
                setNewLecture({ ...newLecture, status: e.target.value })
              }
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Schedule Lecture
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT LECTURE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Scheduled Lecture"
      >
        {activeLecture && (
          <form onSubmit={handleSaveEdit} className="lecture-modal-form">
            <div className="modal-form-group">
              <label>Subject / Topic</label>
              <input
                type="text"
                value={activeLecture.subject}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, subject: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Faculty Name</label>
              <input
                type="text"
                value={activeLecture.faculty}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, faculty: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Department</label>
              <select
                value={activeLecture.department}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, department: e.target.value })
                }
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-form-group">
              <label>Date</label>
              <input
                type="date"
                value={activeLecture.date}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, date: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Time Slot</label>
              <input
                type="text"
                value={activeLecture.time}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, time: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Room / Venue</label>
              <input
                type="text"
                value={activeLecture.room}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, room: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Status</label>
              <select
                value={activeLecture.status}
                onChange={(e) =>
                  setActiveLecture({ ...activeLecture, status: e.target.value })
                }
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Lecture"
      >
        <div className="confirm-delete-body">
          <span className="confirm-icon">🗑️</span>
          <p>
            Are you sure you want to cancel and delete the lecture{" "}
            <strong>{activeLecture?.subject}</strong>?
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Keep Lecture
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleConfirmDelete}
          >
            Yes, Delete
          </button>
        </div>
      </Modal>

    </div>
  );
}

export default ManageLectures;