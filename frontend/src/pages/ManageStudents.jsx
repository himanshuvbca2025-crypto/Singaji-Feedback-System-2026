import { useState } from "react";

import itegImage from "../assets/iteg.png";
import megImage from "../assets/meg.png";
import begImage from "../assets/beg.png";
import ssecImage from "../assets/ssec.png";

function ManageStudents() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

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

  /*
    Temporary frontend student data.

    Later this data will come from backend API
    according to selected department and level.
  */

  const students = [
    {
      id: 1,
      name: "Student 1",
      email: "student1@example.com",
    },
    {
      id: 2,
      name: "Student 2",
      email: "student2@example.com",
    },
    {
      id: 3,
      name: "Student 3",
      email: "student3@example.com",
    },
    {
      id: 4,
      name: "Student 4",
      email: "student4@example.com",
    },
    {
      id: 5,
      name: "Student 5",
      email: "student5@example.com",
    },
    {
      id: 6,
      name: "Student 6",
      email: "student6@example.com",
    },
    {
      id: 7,
      name: "Student 7",
      email: "student7@example.com",
    },
    {
      id: 8,
      name: "Student 8",
      email: "student8@example.com",
    },
    {
      id: 9,
      name: "Student 9",
      email: "student9@example.com",
    },
    {
      id: 10,
      name: "Student 10",
      email: "student10@example.com",
    },
    {
      id: 11,
      name: "Student 11",
      email: "student11@example.com",
    },
    {
      id: 12,
      name: "Student 12",
      email: "student12@example.com",
    },
  ];

  // Department select
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setSelectedLevel(null);
    setSelectedStudents([]);
  };

  // Level select
  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setSelectedStudents([]);
  };

  // Student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudents((currentSelected) => {

      // If already selected → remove
      if (currentSelected.includes(studentId)) {
        return currentSelected.filter(
          (id) => id !== studentId
        );
      }

      // Maximum 10 students
      if (currentSelected.length >= 10) {
        alert("You can select maximum 10 students.");
        return currentSelected;
      }

      // Add student
      return [...currentSelected, studentId];
    });
  };

  // Save selected students
  const handleSave = () => {
    if (selectedStudents.length !== 10) {
      alert("Please select exactly 10 students.");
      return;
    }

    console.log("Department:", selectedDepartment);
    console.log("Level:", selectedLevel);
    console.log("Selected Students:", selectedStudents);

    alert("10 students selected successfully.");
  };

  // Back to department
  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedLevel(null);
    setSelectedStudents([]);
  };

  // Back to levels
  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedStudents([]);
  };

  return (
    <div className="manage-students">

      {/* =========================================
          STEP 1 — DEPARTMENT SELECTION
      ========================================== */}

      {!selectedDepartment && (
        <section>

          <h1>Select Department</h1>

          <p>
            Choose a department to continue.
          </p>

          <div className="department-grid">

            {departments.map((department) => (
              <button
                key={department.name}
                className="department-card"
                onClick={() =>
                  handleDepartmentClick(department.name)
                }
              >

                <img
                  src={department.image}
                  alt={department.name}
                  className="department-image"
                />

                <h2>{department.name}</h2>

              </button>
            ))}

          </div>

        </section>
      )}

      {/* =========================================
          STEP 2 — LEVEL SELECTION
      ========================================== */}

      {selectedDepartment && !selectedLevel && (
        <section>

          <button
            className="back-button"
            onClick={handleBackToDepartments}
          >
            ← Back
          </button>

          <h1>{selectedDepartment}</h1>

          <p>
            Select the level for this department.
          </p>

          <div className="level-grid">

            {levels.map((level) => (
              <button
                key={level}
                className="level-card"
                onClick={() =>
                  handleLevelClick(level)
                }
              >
                {level}
              </button>
            ))}

          </div>

        </section>
      )}

      {/* =========================================
          STEP 3 — STUDENT SELECTION
      ========================================== */}

      {selectedDepartment && selectedLevel && (
        <section>

          <button
            className="back-button"
            onClick={handleBackToLevels}
          >
            ← Back
          </button>

          <div className="student-page-header">

            <div>
              <h1>
                {selectedDepartment} - {selectedLevel}
              </h1>

              <p>
                Select exactly 10 permanent students.
              </p>
            </div>

            <div className="selection-count">
              {selectedStudents.length} / 10
            </div>

          </div>

          {/* Student List */}

          <div className="students-list">

            {students.map((student) => {

              const isSelected =
                selectedStudents.includes(student.id);

              return (
                <div
                  key={student.id}
                  className={`student-row ${isSelected ? "selected" : ""
                    }`}
                  onClick={() =>
                    handleStudentSelect(student.id)
                  }
                >

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      handleStudentSelect(student.id)
                    }
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  />

                  <div className="student-info">

                    <h3>
                      {student.name}
                    </h3>

                    <p>
                      {student.email}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

          {/* Save */}

          <div className="save-section">

            <p>
              Selected students:
              <strong>
                {" "}
                {selectedStudents.length} / 10
              </strong>
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


