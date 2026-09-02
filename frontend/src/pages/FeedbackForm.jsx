import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ssecLogo from "../assets/rename.png";
import "./FeedbackForm.css";

function FeedbackForm() {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({
    q1: 5,
    q2: 4,
    q3: 5,
    q4: 4,
    q5: 5,
  });

  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { id: "q1", text: "How effectively does the faculty cover the course syllabus on schedule?" },
    { id: "q2", text: "Does the faculty communicate concepts clearly and encourage student queries?" },
    { id: "q3", text: "How well does the faculty demonstrate in-depth knowledge of the subject matter?" },
    { id: "q4", text: "Is classroom decorum and discipline maintained during lectures?" },
    { id: "q5", text: "Overall rating for the faculty member's teaching quality." },
  ];

  const handleRatingChange = (qId, val) => {
    setRatings({ ...ratings, [qId]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="feedback-form-container">
      <header className="student-header">
        <div className="header-brand">
          <img src={ssecLogo} alt="Singaji Logo" className="student-logo" />
          <div>
            <h1>Singaji Educational Society</h1>
            <p>Lecture Feedback Submission</p>
          </div>
        </div>

        <button className="student-logout-btn" onClick={() => navigate("/student/dashboard")}>
          Back to Dashboard
        </button>
      </header>

      <main className="feedback-form-main">
        {submitted ? (
          <div className="submission-success-card">
            <h2>🎉 Thank You!</h2>
            <p>Your feedback has been successfully recorded anonymously.</p>
            <button className="student-card-btn" onClick={() => navigate("/student/dashboard")}>
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="feedback-card-wrapper">
            <div className="lecture-info-header">
              <h2>Subject: Programming in C++</h2>
              <p>Faculty: <strong>Dr. Rahul Sharma</strong> • Date: <strong>Today</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="questions-form">
              {questions.map((q, index) => (
                <div key={q.id} className="form-q-block">
                  <p className="q-text">
                    <strong>Q{index + 1}.</strong> {q.text}
                  </p>

                  <div className="star-rating-options">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${ratings[q.id] >= star ? "active" : ""}`}
                        onClick={() => handleRatingChange(q.id, star)}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-num-label">{ratings[q.id]} / 5</span>
                  </div>
                </div>
              ))}

              <div className="form-q-block">
                <label className="q-text">Additional Comments / Suggestions (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Share feedback or recommendations for class improvement..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button type="submit" className="student-card-btn submit-feedback-btn">
                Submit Feedback
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default FeedbackForm;
