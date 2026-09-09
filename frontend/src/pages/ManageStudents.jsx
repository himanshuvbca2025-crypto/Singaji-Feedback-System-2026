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

  const [showSelectedStudents, setShowSelectedStudents] = useState(false);
  const [savedStudents, setSavedStudents] = useState([]);
  const [loadingSelectedStudents, setLoadingSelectedStudents] = useState(false);

  const [studentData, setStudentData] = useState({
    ITEG: {},
    MEG: {},
    BEG: {},
    "B.Tech": {},
  });


  const departments = [
    {
      name: "ITEG",
      image: itegImage,
    },
    {
      name: "MEG",
      image: megImage,
    },
    {
      name: "BEG",
      image: begImage,
    },
    {
      name: "B.Tech",
      image: ssecImage,
    },
  ];

  const levels = ["1A", "1B", "1C", "2A", "2B", "2C"];
    const authUser = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
       

         const response = await fetch(
         "http://localhost:5000/api/students",
        {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
       }
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
          name: student.name,
          email: student.gmail,
          section: student.section,
          level: student.level,
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
    setShowSelectedStudents(false);
    setSavedStudents([]);
  };

  const handleLevelClick = (levelName) => {
    setSelectedLevel(levelName);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
    setShowSelectedStudents(false);
    setSavedStudents([]);
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

  const handleSave = async () => {
    if (selectedStudents.length !== 10) {
      alert("Please select exactly 10 students before saving.");
      return;
    }

    try {
      const selectedStudentData = currentStudentsList
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => ({
          name: student.name,
          gmail: student.email,
        }));

      console.log("Selected students:", selectedStudentData);

      const response = await fetch(
        "http://localhost:5000/api/selected-students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${authUser?.token}`,
          },
          body: JSON.stringify({
            department: selectedDepartment,
            level: selectedLevel,
            students: selectedStudentData,
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        alert(data.message || "Failed to save students.");
        return;
      }

      if (data.success) {
        setSaveSuccessMessage(
          `Selection saved successfully! 10 students have been assigned for ${selectedDepartment} — Level ${selectedLevel}.`
        );

        setSelectedStudents([]);

        setTimeout(() => {
          setSaveSuccessMessage("");
        }, 3000);

      }
    } catch (error) {
      console.error("Error saving selected students:", error);
      alert("Something went wrong while saving students.");
    }
  };


  const handleViewSelectedStudents = async () => {
    if (!selectedDepartment || !selectedLevel) {
      return;
    }

    setLoadingSelectedStudents(true);

    try {
      const response = await fetch(
       `http://localhost:5000/api/selected-students?department=${encodeURIComponent(
        selectedDepartment
      )}&level=${encodeURIComponent(selectedLevel)}`,
        {
        headers: {
        Authorization: `Bearer ${authUser?.token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch selected students.");
        return;
      }

      if (data.success) {
        setSavedStudents(data.data);
        setShowSelectedStudents(true);
      }
    } catch (error) {
      console.error("Error fetching selected students:", error);
      alert("Something went wrong while fetching selected students.");
    } finally {
      setLoadingSelectedStudents(false);
    }
  };


  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedLevel(null);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
    setShowSelectedStudents(false);
    setSavedStudents([]);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedStudents([]);
    setSearchTerm("");
    setSaveSuccessMessage("");
    setShowSelectedStudents(false);
    setSavedStudents([]);
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
            <div className="save-success-toast">
              <span className="toast-icon">✓</span>
              <span>{saveSuccessMessage}</span>
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

          {/* VIEW SELECTED STUDENTS */}
          <div className="view-selected-section">
            <button
              className="view-selected-button"
              onClick={handleViewSelectedStudents}
              disabled={loadingSelectedStudents}
            >
              {loadingSelectedStudents
                ? "Loading..."
                : "View Selected Students"}
            </button>
          </div>

          {showSelectedStudents && (
            <div className="selected-students-container">
              <div className="selected-students-header">
                <div>
                  <h2>Selected Students</h2>
                  <p>
                    {selectedDepartment} — Level {selectedLevel}
                  </p>
                </div>

                <span className="selected-total">
                  {savedStudents.length} / 10
                </span>
              </div>

              {savedStudents.length > 0 ? (
                <div className="selected-students-list">
                  {savedStudents.map((student, index) => (
                    <div
                      key={student._id}
                      className="selected-student-row"
                    >
                      <span className="student-number">
                        {index + 1}
                      </span>

                      <div className="student-info">
                        <h3>{student.name}</h3>
                        <p>{student.gmail}</p>
                      </div>

                      <span className="status-pill pill-active">
                        Selected
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-selected-students">
                  No students have been selected for this department and level.
                </div>
              )}
            </div>
          )}

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