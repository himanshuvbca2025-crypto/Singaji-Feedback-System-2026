import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FacultyHistory.css";

function FacultyHistory() {
  const { facultyId } = useParams();
  const navigate = useNavigate();

  const [facultyData, setFacultyData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock faculty database matching ID or fallback
  const mockFacultyDetails = {
    "1": {
      name: "Dr. Rahul Sharma",
      department: "ITEG",
      subject: "Programming in C++ & Java",
      email: "rahul.sharma@singaji.edu.in",
      totalLectures: 48,
      feedbackCount: 380,
      avgRating: 4.6,
    },
    "2": {
      name: "Prof. Neha Jain",
      department: "ITEG",
      subject: "Database Management Systems",
      email: "neha.jain@singaji.edu.in",
      totalLectures: 42,
      feedbackCount: 310,
      avgRating: 4.4,
    },
    "3": {
      name: "Dr. Amit Singh",
      department: "ITEG",
      subject: "Web Development & Frameworks",
      email: "amit.singh@singaji.edu.in",
      totalLectures: 36,
      feedbackCount: 290,
      avgRating: 4.7,
    },
  };

  const defaultFaculty = mockFacultyDetails[facultyId] || {
    name: "Faculty Member",
    department: "Engineering",
    subject: "Core Specialization",
    email: "faculty@singaji.edu.in",
    totalLectures: 40,
    feedbackCount: 320,
    avgRating: 4.5,
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const nameToQuery = defaultFaculty.name;
        const res = await fetch(`http://localhost:5000/api/feedback/faculty/${encodeURIComponent(nameToQuery)}`);
        const data = await res.json();
        if (res.ok && data.success && data.feedbacks) {
          setFeedbacks(data.feedbacks);
          setFacultyData({
            ...defaultFaculty,
            feedbackCount: data.count || defaultFaculty.feedbackCount,
            avgRating: data.avgRating || defaultFaculty.avgRating,
          });
        } else {
          setFacultyData(defaultFaculty);
        }
      } catch (err) {
        setFacultyData(defaultFaculty);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [facultyId]);

  const faculty = facultyData || defaultFaculty;

  const questionScores = [
    { question: "Punctuality & Class Readiness", score: 4.8, category: "Classroom Management" },
    { question: "Clarity of Explanation & Concepts", score: 4.6, category: "Teaching" },
    { question: "Communication & Interaction", score: 4.5, category: "Communication" },
    { question: "Subject Knowledge & Depth", score: 4.7, category: "Subject Knowledge" },
    { question: "Availability for Doubts & Guidance", score: 4.4, category: "Overall Experience" },
  ];

  const displayFeedbacks = feedbacks.length > 0
    ? feedbacks.map(item => ({
        date: new Date(item.timestamp || Date.now()).toLocaleDateString("en-GB"),
        student: `Student (${item.level || "Level 1A"})`,
        rating: item.metrics?.Overall || 5,
        comment: item.remarks || "Great explanation and interactive session.",
      }))
    : [
        {
          date: "01 Sep 2026",
          student: "Student (Level 1A)",
          rating: 5,
          comment: "Excellent lecture on Object Oriented Concepts with clear real-world examples.",
        },
        {
          date: "28 Aug 2026",
          student: "Student (Level 1B)",
          rating: 4,
          comment: "Very detailed explanation. Pace was smooth and well-managed.",
        },
        {
          date: "25 Aug 2026",
          student: "Student (Level 2A)",
          rating: 5,
          comment: "Great practical session and doubt clearing.",
        },
      ];

  return (
    <div className="faculty-history-page">
      <button className="history-back-btn" onClick={() => navigate("/admin/faculty")}>
        ← Back to Faculty List
      </button>

      {/* Header Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {faculty.name.replace("Dr. ", "").replace("Prof. ", "").charAt(0)}
        </div>
        <div className="profile-details">
          <h1>{faculty.name}</h1>
          <p className="profile-sub">
            {faculty.department} Department • {faculty.subject}
          </p>
          <p className="profile-email">✉ {faculty.email}</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="history-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Lectures Held</span>
          <span className="kpi-value">{faculty.totalLectures}</span>
          <span className="kpi-desc">Sessions completed</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Total Feedbacks Received</span>
          <span className="kpi-value">{faculty.feedbackCount}</span>
          <span className="kpi-desc">Student evaluations</span>
        </div>

        <div className="kpi-card highlight-kpi">
          <span className="kpi-label">Average Score</span>
          <span className="kpi-value">
            ⭐ {faculty.avgRating} <small>/ 5</small>
          </span>
          <span className="kpi-desc">Overall satisfaction score</span>
        </div>
      </div>

      {/* Question-wise Scores */}
      <div className="history-section-card">
        <h2>Question-Wise Rating Analysis</h2>
        <div className="question-scores-list">
          {questionScores.map((qs, index) => (
            <div key={index} className="qs-row">
              <div className="qs-info">
                <span className="qs-category">{qs.category}</span>
                <span className="qs-text">{qs.question}</span>
              </div>
              <div className="qs-score-bar">
                <div
                  className="qs-bar-fill"
                  style={{ width: `${(qs.score / 5) * 100}%` }}
                ></div>
              </div>
              <span className="qs-score-number">{qs.score} / 5</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Student Feedback Comments */}
      <div className="history-section-card">
        <h2>Recent Student Comments</h2>
        <div className="comments-list">
          {displayFeedbacks.map((fb, idx) => (
            <div key={idx} className="comment-card">
              <div className="comment-top">
                <span className="comment-date">{fb.date}</span>
                <span className="comment-rating">{"★".repeat(fb.rating)} ({fb.rating}/5)</span>
              </div>
              <p className="comment-text">"{fb.comment}"</p>
              <span className="comment-student">{fb.student}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacultyHistory;
