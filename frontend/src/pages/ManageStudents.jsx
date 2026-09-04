import { useEffect, useState } from "react";

import itegImage from "../assets/iteg.png";
import megImage from "../assets/meg.png";
import begImage from "../assets/beg.png";
import ssecImage from "../assets/ssec.png";

import "./ManageStudents.css";

function ManageStudents() {

  /* ========================================
     STATES
  ======================================== */

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  const [studentData, setStudentData] = useState({
  ITEG: {},
  MEG: {},
  BEG: {},
  "B.Tech": {},
});


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

  const levels = ["1A", "1B", "1C", "2A", "2B", "2C"];

useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      if (data.success) {
        setStudentData(data.sections);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, []);

  /* ========================================
     DEPARTMENTS
  ======================================== */

const currentStudentsList =
  selectedDepartment && selectedLevel
    ? (studentData[selectedDepartment]?.[selectedLevel] || []).map(
        (student) => ({
          id: student.studentId,
          name: `${student.name} (${student.section}-${student.level})`,
          email: student.gmail,
        })
      )
    : [];
  /* ========================================
     FILTER STUDENTS
  ======================================== */

  const filteredStudents = currentStudentsList.filter((student) => {
    const search = searchTerm.toLowerCase().trim();
    return (
      student.name.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search)
    );
  });


  /* ========================================
     HANDLERS
  ======================================== */

  const handleDepartmentClick = (deptName) => {
    setSelectedDepartment(deptName);
    setSelectedLevel(null);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
  };

  const handleLevelClick = (levelName) => {
    setSelectedLevel(levelName);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
  };

  const handleStudentSelect = (studentId) => {
    setSaveSuccessMessage("");
    setSelectedStudents((currentSelected) => {
      if (currentSelected.includes(studentId)) {
        return currentSelected.filter((id) => id !== studentId);
      }
      if (currentSelected.length >= 10) {
        alert("Maximum 10 students can be selected for feedback quota.");
        return currentSelected;
      }
      return [...currentSelected, studentId];
    });
  };

  const handleSave = () => {
    if (selectedStudents.length !== 10) {
      alert("Please select exactly 10 students before saving.");
      return;
    }

    setSaveSuccessMessage(
      `Successfully assigned 10 feedback students for ${selectedDepartment} - Level ${selectedLevel}.`
    );
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedLevel(null);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
  };


  /* ========================================
     UI
  ======================================== */

  return (
    <div className="manage-students">

      {/* STEP 1: DEPARTMENT SELECTION */}
      {!selectedDepartment && (
        <section>
          <div className="students-header">
            <h1>Students Management</h1>
            <p>Select a department to view and manage student evaluation groups.</p>
          </div>

          <div className="department-grid">
            {departments.map((department) => (
              <div
                key={department.name}
                className="department-card"
                onClick={() => handleDepartmentClick(department.name)}
              >
                <img
                  src={department.image}
                  alt={department.name}
                  className="department-image"
                />
                <h2>{department.name}</h2>
                <p className="department-title">{department.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* STEP 2: LEVEL SELECTION */}
      {selectedDepartment && !selectedLevel && (
        <section>
          <button className="back-button" onClick={handleBackToDepartments}>
            ← Back to Departments
          </button>

          <div className="students-header">
            <h1>{selectedDepartment} Department</h1>
            <p>Select a section level for {selectedDepartment}.</p>
          </div>

          <div className="level-grid">
            {levels.map((level) => (
              <div
                key={level}
                className="level-card"
                onClick={() => handleLevelClick(level)}
              >
                <span className="level-badge">Level</span>
                <h2>{level}</h2>
                <p>Click to view students</p>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* STEP 3: STUDENT SELECTION */}
      {selectedDepartment && selectedLevel && (
        <section>
          <button className="back-button" onClick={handleBackToLevels}>
            ← Back to Levels
          </button>

          <div className="student-page-header">
            <div>
              <h1>
                {selectedDepartment} — Level {selectedLevel}
              </h1>
              <p>Select exactly 10 students for feedback sampling.</p>
            </div>

            <div className={`selection-count ${selectedStudents.length === 10 ? 'count-complete' : ''}`}>
              <span>Selected:</span>
              <strong>{selectedStudents.length} / 10</strong>
            </div>
          </div>

          {saveSuccessMessage && (
            <div className="save-success-banner">
              ✓ {saveSuccessMessage}
            </div>
          )}

          {/* SEARCH */}
          <div className="student-search">
            <input
              type="text"
              placeholder="Search student by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* STUDENT LIST */}
          <div className="students-list">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isSelected = selectedStudents.includes(student.id);

                return (
                  <div
                    key={student.id}
                    className={`student-row ${isSelected ? "selected" : ""}`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleStudentSelect(student.id)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <p>{student.email}</p>
                    </div>

                    <span className={`status-pill ${isSelected ? "pill-active" : ""}`}>
                      {isSelected ? "Selected" : "Unselected"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="no-students">No students found matching search.</div>
            )}
          </div>

          {/* SAVE BAR */}
          <div className="save-section">
            <p>
              Requirements: Exactly 10 students required. Currently selected:{" "}
              <strong>{selectedStudents.length} / 10</strong>
            </p>

            <button
              className="save-button"
              onClick={handleSave}
              disabled={selectedStudents.length !== 10}
            >
              Save Selection
            </button>
          </div>
        </section>
      )}

    </div>
  );
}

export default ManageStudents;