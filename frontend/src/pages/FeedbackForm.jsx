import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ssecLogo from "../assets/rename.png";
import "./FeedbackForm.css";

const defaultQuestions = [
  "1. Clarity of Explanation",
  "2. Subject Knowledge & Depth",
  "3. Communication Skills",
  "4. Punctuality & Time Management",
  "5. Teaching Methodology",
  "6. Student Engagement",
  "7. Practical Examples",
  "8. Doubt Resolution",
  "9. Course Coverage",
  "10. Overall Teaching Effectiveness"
];

function FeedbackForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const facultyName = searchParams.get("faculty") || "Dr. Rahul Sharma";
  const subjectName = searchParams.get("subject") || "Web Development";
  const classNameParam = searchParams.get("class") || "BCA ITEG (Group A)";
  const timeParam = searchParams.get("time") || "10:00 AM - 11:30 AM";
  const dateParam = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [step, setStep] = useState("form"); // "form", "success"
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleRatingChange = (qIndex, value) => {
    setRatings((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all 10 questions are answered
    const unanswered = [];
    defaultQuestions.forEach((_, idx) => {
      if (!ratings[idx]) {
        unanswered.push(idx + 1);
      }
    });

    if (unanswered.length > 0) {
      setValidationError(
        `Please provide ratings for all 10 questions before submitting. Unanswered: ${unanswered.join(
          ", "
        )}`
      );
      return;
    }

    try {
      const avgOverall = Math.round(
        Object.values(ratings).reduce((a, b) => a + b, 0) / 10
      );

      await fetch("http://localhost:5000/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentGmail: `student_${Date.now()}@singaji.edu.in`,
          level: classNameParam,
          section: "ITEG",
          facultyName,
          subject: subjectName,
          metrics: { Overall: avgOverall, ...ratings },
          remarks: comment || "Great lecture session.",
        }),
      });
    } catch (err) {
      console.log("Submitting feedback in local offline mode");
    }

    setStep("success");
  };

  return (
    <div className="feedback-form-container">
      <header className="student-header">
        <div className="header-brand">
          <img src={ssecLogo} alt="SSISM Logo" className="student-logo" />
          <div>
            <h1>Singaji Educational Society</h1>
            <p>Student Lecture Feedback Portal</p>
          </div>
        </div>
      </header>

      <main className="feedback-form-main">
        {/* STEP 1: EMAIL-LIKE INVITATION VIEW */}
        {step === "invite" && (
          <div className="feedback-card-wrapper invite-card">
            <div className="email-invitation-banner">
              <span className="email-badge">📩 Lecture Completed Notification</span>
              <h2>Your Feedback Matters!</h2>
              <p>
                You recently attended the lecture session. Please share your honest feedback to help us continuously improve teaching quality.
              </p>
            </div>

            <div className="lecture-meta-card">
              <div className="meta-row">
                <span className="meta-label">Faculty Name:</span>
                <strong className="meta-val">{facultyName}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">Subject:</span>
                <strong className="meta-val">{subjectName}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">Class & Group:</span>
                <strong className="meta-val">{classNameParam}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">Lecture Time:</span>
                <strong className="meta-val">⏰ {timeParam} ({dateParam})</strong>
              </div>
            </div>

            <div className="invite-footer">
              <p className="anon-note">🔒 Your feedback is 100% anonymous. Student identity is never shared.</p>
              <button
                className="student-card-btn give-feedback-btn"
                onClick={() => setStep("form")}
              >
                Give Feedback →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 10-QUESTION RATING FORM */}
        {step === "form" && (
          <div className="feedback-card-wrapper">
            <div className="lecture-info-header">
              <h2>Student Feedback Questionnaire</h2>
              <p>
                Faculty: <strong>{facultyName}</strong> | Subject: <strong>{subjectName}</strong>
              </p>
            </div>

            {validationError && (
              <div className="feedback-error-banner">
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="questions-form">
              {defaultQuestions.map((qText, index) => (
                <div key={index} className="form-q-block">
                  <p className="q-text">
                    <strong>{qText}</strong>
                  </p>

                  <div className="star-rating-row">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`star-option-btn ${ratings[index] >= val ? "active-star" : ""
                          }`}
                        onClick={() => handleRatingChange(index, val)}
                        title={`${val} - ${val === 1 ? "Poor" : val === 2 ? "Fair" : val === 3 ? "Average" : val === 4 ? "Good" : "Excellent"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="star-rating-label">
                      {ratings[index]
                        ? `${ratings[index]} / 5 (${ratings[index] === 1
                          ? "Poor"
                          : ratings[index] === 2
                            ? "Fair"
                            : ratings[index] === 3
                              ? "Average"
                              : ratings[index] === 4
                                ? "Good"
                                : "Excellent"
                        })`
                        : "Select Rating"}
                    </span>
                  </div>
                </div>
              ))}

              <div className="form-q-block">
                <label className="q-text">
                  <strong>Additional Comments / Suggestions (Optional)</strong>
                </label>
                <textarea
                  rows="3"
                  className="remarks-textarea"
                  placeholder="Share any suggestions or comments about today's lecture..."
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

        {/* STEP 3: SUCCESS SCREEN */}
        {step === "success" && (
          <div className="submission-success-card">
            <div className="success-icon">✓</div>
            <h2>Feedback Submitted Successfully!</h2>
            <p>Thank you for helping us improve teaching quality at SSISM.</p>
            <p className="anon-sub">Your response has been recorded anonymously.</p>
            <button
              className="student-card-btn"
              onClick={() => navigate("/login")}
            >
              Back to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FeedbackForm;
