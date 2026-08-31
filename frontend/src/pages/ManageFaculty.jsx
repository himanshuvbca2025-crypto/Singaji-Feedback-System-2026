import { useState } from "react";

import itegImage from "../assets/iteg.png";
import megImage from "../assets/meg.png";
import begImage from "../assets/beg.png";
import ssecImage from "../assets/ssec.png";

import "./ManageFaculty.css";

function ManageFaculty() {

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Departments
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


  // Faculty according to department
  const facultyData = {

    ITEG: [
      {
        id: 1,
        name: "Dr. Rahul Sharma",
        email: "rahul@example.com",
        subject: "Programming",
      },
      {
        id: 2,
        name: "Prof. Neha Jain",
        email: "neha@example.com",
        subject: "Database Management",
      },
      {
        id: 3,
        name: "Dr. Amit Singh",
        email: "amit@example.com",
        subject: "Java Programming",
      },
    ],

    MEG: [
      {
        id: 4,
        name: "Dr. Priya Verma",
        email: "priya@example.com",
        subject: "Mathematics",
      },
      {
        id: 5,
        name: "Prof. Raj Kumar",
        email: "raj@example.com",
        subject: "Physics",
      },
      {
        id: 6,
        name: "Dr. Anjali Patel",
        email: "anjali@example.com",
        subject: "Engineering Mathematics",
      },
    ],

    BEG: [
      {
        id: 7,
        name: "Dr. Vikash Meena",
        email: "vikash@example.com",
        subject: "Engineering",
      },
      {
        id: 8,
        name: "Prof. Pooja Sharma",
        email: "pooja@example.com",
        subject: "Technical Communication",
      },
      {
        id: 9,
        name: "Dr. Mohit Jain",
        email: "mohit@example.com",
        subject: "Engineering Science",
      },
    ],

    "B.Tech": [
      {
        id: 10,
        name: "Dr. S.K Mehta",
        email: "skmehta@example.com",
        subject: "Computer Science",
      },
      {
        id: 11,
        name: "Prof. Rohan Verma",
        email: "rohan@example.com",
        subject: "Data Structures",
      },
      {
        id: 12,
        name: "Dr. Sneha Gupta",
        email: "sneha@example.com",
        subject: "Web Development",
      },
    ],
  };


  // Department select
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };


  // Back to departments
  const handleBack = () => {
    setSelectedDepartment(null);
  };


  // Selected department ki faculty
  const selectedFaculty =
    selectedDepartment
      ? facultyData[selectedDepartment] || []
      : [];


  return (
    <div className="manage-faculty">

      {/* =====================================
          STEP 1 — DEPARTMENT SELECTION
      ====================================== */}

      {!selectedDepartment && (

        <section>

          <h1>Select Department</h1>

          <p>
            Choose a department to manage faculty.
          </p>


          <div className="faculty-department-grid">

            {departments.map((department) => (

              <button
                key={department.name}
                className="faculty-department-card"
                onClick={() =>
                  handleDepartmentClick(department.name)
                }
              >

                <img
                  src={department.image}
                  alt={department.name}
                  className="faculty-department-image"
                />

                <h2>
                  {department.name}
                </h2>

              </button>

            ))}

          </div>

        </section>
      )}


      {/* =====================================
          STEP 2 — FACULTY LIST
      ====================================== */}

      {selectedDepartment && (

        <section>

          {/* Back */}

          <button
            className="faculty-back-button"
            onClick={handleBack}
          >
            ← Back
          </button>


          {/* Header */}

          <div className="faculty-header">

            <div>

              <h1>
                {selectedDepartment} Faculty
              </h1>

              <p>
                Faculty members of {selectedDepartment}.
              </p>

            </div>


            <button className="add-faculty-button">
              + Add Faculty
            </button>

          </div>


          {/* Faculty List */}

          <div className="faculty-list">

            {selectedFaculty.map((member) => (

              <div
                key={member.id}
                className="faculty-row"
              >

                {/* Avatar */}

                <div className="faculty-avatar">

                  {member.name
                    .replace("Dr. ", "")
                    .replace("Prof. ", "")
                    .charAt(0)}

                </div>


                {/* Faculty Information */}

                <div className="faculty-info">

                  <h3>
                    {member.name}
                  </h3>

                  <p>
                    {member.email}
                  </p>

                  <span>
                    {member.subject}
                  </span>

                </div>


                {/* Actions */}

                <div className="faculty-actions">

                  <button>
                    Edit
                  </button>

                  <button>
                    View
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* Faculty Count */}

          <div className="faculty-count">

            Total Faculty:

            <strong>
              {" "}
              {selectedFaculty.length}
            </strong>

          </div>

        </section>
      )}

    </div>
  );
}

export default ManageFaculty;