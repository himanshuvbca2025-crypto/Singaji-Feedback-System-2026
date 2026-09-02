import { useState } from "react";
import { useNavigate } from "react-router-dom";

import itegImage from "../assets/iteg.png";
import megImage from "../assets/meg.png";
import begImage from "../assets/beg.png";
import ssecImage from "../assets/ssec.png";
import Modal from "../components/Modal.jsx";

import "./ManageFaculty.css";

function ManageFaculty() {
  const navigate = useNavigate();

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Departments
  const departments = [
    {
      name: "ITEG",
      title: "Information Technology & Engg.",
      image: itegImage,
    },
    {
      name: "MEG",
      title: "Mechanical Engg. Group",
      image: megImage,
    },
    {
      name: "BEG",
      title: "Basic Engineering Group",
      image: begImage,
    },
    {
      name: "B.Tech",
      title: "Bachelor of Technology",
      image: ssecImage,
    },
  ];

  // Faculty according to department state
  const [facultyData, setFacultyData] = useState({
    ITEG: [
      {
        id: "1",
        name: "Dr. Rahul Sharma",
        email: "rahul.sharma@singaji.edu.in",
        subject: "Programming in C++ & Java",
      },
      {
        id: "2",
        name: "Prof. Neha Jain",
        email: "neha.jain@singaji.edu.in",
        subject: "Database Management Systems",
      },
      {
        id: "3",
        name: "Dr. Amit Singh",
        email: "amit.singh@singaji.edu.in",
        subject: "Web Development & Frameworks",
      },
    ],

    MEG: [
      {
        id: "4",
        name: "Dr. Priya Verma",
        email: "priya.verma@singaji.edu.in",
        subject: "Fluid Mechanics",
      },
      {
        id: "5",
        name: "Prof. Raj Kumar",
        email: "raj.kumar@singaji.edu.in",
        subject: "Thermodynamics",
      },
      {
        id: "6",
        name: "Dr. Anjali Patel",
        email: "anjali.patel@singaji.edu.in",
        subject: "Engineering Graphics",
      },
    ],

    BEG: [
      {
        id: "7",
        name: "Dr. Vikash Meena",
        email: "vikash.meena@singaji.edu.in",
        subject: "Applied Mathematics",
      },
      {
        id: "8",
        name: "Prof. Pooja Sharma",
        email: "pooja.sharma@singaji.edu.in",
        subject: "Technical Communication",
      },
      {
        id: "9",
        name: "Dr. Mohit Jain",
        email: "mohit.jain@singaji.edu.in",
        subject: "Engineering Physics",
      },
    ],

    "B.Tech": [
      {
        id: "10",
        name: "Dr. S.K. Mehta",
        email: "sk.mehta@singaji.edu.in",
        subject: "Computer Networks & Security",
      },
      {
        id: "11",
        name: "Prof. Rohan Verma",
        email: "rohan.verma@singaji.edu.in",
        subject: "Data Structures & Algorithms",
      },
      {
        id: "12",
        name: "Dr. Sneha Gupta",
        email: "sneha.gupta@singaji.edu.in",
        subject: "Artificial Intelligence & ML",
      },
    ],
  });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    subject: "",
  });

  // Department select
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

  // Back to departments
  const handleBack = () => {
    setSelectedDepartment(null);
  };

  // View faculty history page
  const handleViewHistory = (facultyId) => {
    navigate(`/admin/faculty/history/${facultyId}`);
  };

  // Open Edit Modal
  const handleOpenEdit = (faculty) => {
    setEditingFaculty({ ...faculty });
    setIsEditModalOpen(true);
  };

  // Save Edit Faculty
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFaculty) return;

    setFacultyData((prevData) => ({
      ...prevData,
      [selectedDepartment]: prevData[selectedDepartment].map((item) =>
        item.id === editingFaculty.id ? editingFaculty : item
      ),
    }));

    setIsEditModalOpen(false);
    setEditingFaculty(null);
  };

  // Save New Faculty
  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.email || !newFaculty.subject) {
      alert("Please fill out all fields.");
      return;
    }

    const created = {
      id: Date.now().toString(),
      ...newFaculty,
    };

    setFacultyData((prevData) => ({
      ...prevData,
      [selectedDepartment]: [...(prevData[selectedDepartment] || []), created],
    }));

    setNewFaculty({ name: "", email: "", subject: "" });
    setIsAddModalOpen(false);
  };

  // Selected department faculty list
  const selectedFaculty = selectedDepartment
    ? facultyData[selectedDepartment] || []
    : [];

  return (
    <div className="manage-faculty">

      {/* STEP 1 — DEPARTMENT SELECTION */}
      {!selectedDepartment && (
        <section>
          <div className="faculty-page-title">
            <h1>Select Department</h1>
            <p>Choose a department to manage faculty members.</p>
          </div>

          <div className="faculty-department-grid">
            {departments.map((department) => (
              <div
                key={department.name}
                className="faculty-department-card"
                onClick={() => handleDepartmentClick(department.name)}
              >
                <img
                  src={department.image}
                  alt={department.name}
                  className="faculty-department-image"
                />
                <h2>{department.name}</h2>
                <p className="faculty-dept-sub">{department.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* STEP 2 — FACULTY LIST */}
      {selectedDepartment && (
        <section>
          <button className="faculty-back-button" onClick={handleBack}>
            ← Back to Departments
          </button>

          <div className="faculty-header">
            <div>
              <h1>{selectedDepartment} Faculty</h1>
              <p>Faculty members registered under {selectedDepartment}.</p>
            </div>

            <button
              className="add-faculty-button"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add Faculty
            </button>
          </div>

          <div className="faculty-list">
            {selectedFaculty.map((member) => (
              <div key={member.id} className="faculty-row">
                {/* Avatar */}
                <div className="faculty-avatar">
                  {member.name
                    .replace("Dr. ", "")
                    .replace("Prof. ", "")
                    .charAt(0)}
                </div>

                {/* Faculty Info */}
                <div className="faculty-info">
                  <h3>{member.name}</h3>
                  <p>{member.email}</p>
                  <span className="faculty-subject-tag">{member.subject}</span>
                </div>

                {/* Actions */}
                <div className="faculty-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenEdit(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-view"
                    onClick={() => handleViewHistory(member.id)}
                  >
                    View History
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="faculty-count">
            Total Faculty: <strong>{selectedFaculty.length}</strong>
          </div>
        </section>
      )}


      {/* EDIT FACULTY MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Faculty Member"
      >
        {editingFaculty && (
          <form onSubmit={handleSaveEdit} className="faculty-modal-form">
            <div className="modal-form-group">
              <label>Faculty Name</label>
              <input
                type="text"
                value={editingFaculty.name}
                onChange={(e) =>
                  setEditingFaculty({ ...editingFaculty, name: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={editingFaculty.email}
                onChange={(e) =>
                  setEditingFaculty({ ...editingFaculty, email: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Subject</label>
              <input
                type="text"
                value={editingFaculty.subject}
                onChange={(e) =>
                  setEditingFaculty({ ...editingFaculty, subject: e.target.value })
                }
                required
              />
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


      {/* ADD FACULTY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Faculty to ${selectedDepartment}`}
      >
        <form onSubmit={handleSaveNew} className="faculty-modal-form">
          <div className="modal-form-group">
            <label>Faculty Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Ramesh Kumar"
              value={newFaculty.name}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, name: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. ramesh@singaji.edu.in"
              value={newFaculty.email}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, email: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="e.g. Cloud Computing"
              value={newFaculty.subject}
              onChange={(e) =>
                setNewFaculty({ ...newFaculty, subject: e.target.value })
              }
              required
            />
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
              Add Faculty
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default ManageFaculty;