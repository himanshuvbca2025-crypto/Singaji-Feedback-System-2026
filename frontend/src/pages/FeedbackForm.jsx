import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ssecLogo from "../assets/rename.png";
import "./FeedbackForm.css";

function FeedbackForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ==========================================
  // DATA FROM FEEDBACK LINK
  // ==========================================
  const facultyName = searchParams.get("faculty") || "Dr. Rahul Sharma";

  const subjectName = searchParams.get("subject") || "Web Development";

  const facultyIdParam = searchParams.get("facultyId") || "";

  const classNameParam =
    searchParams.get("class") || "BCA ITEG (Group A)";

  const timeParam =
    searchParams.get("time") || "10:00 AM - 11:30 AM";

    const lectureEndTimeParam =
       searchParams.get("endTime") || "";

  const dateParam = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ==========================================
  // FORM STATES
  // ==========================================
  const [step, setStep] = useState("form");

  // Questions from database
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Student Gmail
  const [studentGmail, setStudentGmail] = useState("");
  const [gmailError, setGmailError] = useState("");

  // Ratings
  const [ratings, setRatings] = useState({});

  // Comment
  const [comment, setComment] = useState("");

  // General validation
  const [validationError, setValidationError] = useState("");

  // Submit loading
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // FETCH QUESTIONS
  // ==========================================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/questions"
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setQuestions(data.questions || []);
        } else {
          console.error(
            "Failed to fetch questions:",
            data.message
          );

          setValidationError(
            data.message || "Failed to load questions."
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);

        setValidationError(
          "Unable to load feedback questions."
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  // ==========================================
  // RATING CHANGE
  // ==========================================
  const handleRatingChange = (qIndex, value) => {
    setRatings((prev) => ({
      ...prev,
      [qIndex]: value,
    }));

    setValidationError("");
  };

  // ==========================================
  // SUBMIT FEEDBACK
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear old errors
    setValidationError("");
    setGmailError("");

    // ==========================================
    // 1. VALIDATE GMAIL
    // ==========================================
    const email = studentGmail.trim().toLowerCase();

    if (!email) {
      setGmailError(
        "Please enter your registered college Gmail."
      );
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setGmailError("Please enter a valid Gmail address.");
      return;
    }

    // ==========================================
    // 2. QUESTIONS CHECK
    // ==========================================
    if (questions.length === 0) {
      setValidationError("No questions are available.");
      return;
    }

    // ==========================================
    // 3. CHECK ALL QUESTIONS ANSWERED
    // ==========================================
    const unanswered = [];

    questions.forEach((_, idx) => {
      if (!ratings[idx]) {
        unanswered.push(idx + 1);
      }
    });

    if (unanswered.length > 0) {
      setValidationError(
        `Please provide ratings for all questions. Unanswered: ${unanswered.join(
          ", "
        )}`
      );
      return;
    }

    // ==========================================
    // 4. CHECK EXPECTED 5 QUESTIONS
    // ==========================================
    if (questions.length < 5) {
      setValidationError(
        "Feedback questions are not configured correctly. Please contact administrator."
      );
      return;
    }

    // ==========================================
    // 5. PREPARE METRICS
    // ==========================================
    const metrics = {
      Explanation: Number(ratings[0]),
      Punctuality: Number(ratings[1]),
      Engagement: Number(ratings[2]),
      Resolution: Number(ratings[3]),
      Overall: Number(ratings[4]),
    };

    // ==========================================
    // 6. EXTRA VALIDATION
    // ==========================================
    const invalidMetric = Object.entries(metrics).some(
      ([, value]) => value < 1 || value > 5 || Number.isNaN(value)
    );

    if (invalidMetric) {
      setValidationError(
        "Please select a valid rating for every question."
      );
      return;
    }

    try {
      setSubmitting(true);

      console.log("=================================");
      console.log("SUBMITTING FEEDBACK");
      console.log("Student Gmail:", email);
      console.log("Faculty:", facultyName);
      console.log("Subject:", subjectName);
      console.log("Class:", classNameParam);
      console.log("Metrics:", metrics);
      console.log("Comment:", comment);
      console.log("=================================");

      // ==========================================
      // 7. SEND TO BACKEND
      // ==========================================
      const response = await fetch(
        "http://localhost:5000/api/feedback/submit",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            studentGmail: email,

            // Backend will get actual level/section
            // from Students collection.
            // These are only fallback values.
            level: classNameParam,
            section: "ITEG",
            facultyId: facultyIdParam,
            facultyName,
            subject: subjectName,
            lectureTime: timeParam,
            lectureEndTime: lectureEndTimeParam,

            metrics,

            remarks: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      // ==========================================
      // 8. HANDLE BACKEND ERROR
      // ==========================================
      if (!response.ok || !data.success) {
        const message =
          data.message ||
          "Feedback submission failed.";

        console.error(
          "Feedback submission failed:",
          message
        );

        // Gmail related error
        if (
          message.toLowerCase().includes("college gmail") ||
          message.toLowerCase().includes("registered gmail") ||
          message.toLowerCase().includes("registered")
        ) {
          setGmailError(message);
        } else {
          setValidationError(message);
        }

        // IMPORTANT:
        // Do not show success screen
        return;
      }

      // ==========================================
      // 9. SUCCESS
      // ==========================================
      console.log(
        "Feedback successfully saved in database."
      );

      setStep("success");
    } catch (error) {
      console.error(
        "Feedback submission error:",
        error
      );

      setValidationError(
        "Unable to submit feedback. Please check your internet connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="feedback-form-container">
      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="student-header">
        <div className="header-brand">
          <img
            src={ssecLogo}
            alt="SSISM Logo"
            className="student-logo"
          />

          <div>
            <h1>Singaji Educational Society</h1>
            <p>Student Lecture Feedback Portal</p>
          </div>
        </div>
      </header>

      <main className="feedback-form-main">
        {/* ==========================================
            STEP 1: INVITATION
        ========================================== */}

        {step === "invite" && (
          <div className="feedback-card-wrapper invite-card">
            <div className="email-invitation-banner">
              <span className="email-badge">
                📩 Lecture Completed Notification
              </span>

              <h2>Your Feedback Matters!</h2>

              <p>
                You recently attended the lecture session.
                Please share your honest feedback to help us
                continuously improve teaching quality.
              </p>
            </div>

            <div className="lecture-meta-card">
              <div className="meta-row">
                <span className="meta-label">
                  Faculty Name:
                </span>

                <strong className="meta-val">
                  {facultyName}
                </strong>
              </div>

              <div className="meta-row">
                <span className="meta-label">
                  Subject:
                </span>

                <strong className="meta-val">
                  {subjectName}
                </strong>
              </div>

              <div className="meta-row">
                <span className="meta-label">
                  Class & Group:
                </span>

                <strong className="meta-val">
                  {classNameParam}
                </strong>
              </div>

              <div className="meta-row">
                <span className="meta-label">
                  Lecture Time:
                </span>

                <strong className="meta-val">
                  ⏰ {timeParam} ({dateParam})
                </strong>
              </div>
            </div>

            <div className="invite-footer">
              <p className="anon-note">
                🔒 Your feedback is 100% anonymous. Student
                identity is never shared.
              </p>

              <button
                className="student-card-btn give-feedback-btn"
                onClick={() => setStep("form")}
              >
                Give Feedback →
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            STEP 2: FEEDBACK FORM
        ========================================== */}

        {step === "form" && (
          <div className="feedback-card-wrapper">
            <div className="lecture-info-header">
              <h2>Student Feedback Questionnaire</h2>

              <p>
                Faculty: <strong>{facultyName}</strong> |
                Subject: <strong>{subjectName}</strong>
              </p>
            </div>

            {/* GENERAL ERROR */}
            {validationError && (
              <div className="feedback-error-banner">
                ⚠️ {validationError}
              </div>
            )}

            {loadingQuestions ? (
              <div className="loading-questions">
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <div className="feedback-error-banner">
                No questions available.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="questions-form"
              >
                {/* ==========================================
                    COLLEGE GMAIL
                ========================================== */}

                <div className="form-q-block">
                  <label className="q-text">
                    <strong>
                      College Gmail
                    </strong>
                  </label>

                  <input
                    type="email"
                    value={studentGmail}
                    onChange={(e) => {
                      setStudentGmail(e.target.value);
                      setGmailError("");
                    }}
                    placeholder="Enter your registered college Gmail"
                    className={`remarks-textarea ${
                      gmailError
                        ? "gmail-error-input"
                        : ""
                    }`}
                    autoComplete="email"
                    disabled={submitting}
                  />

                  {!gmailError && (
                    <p className="gmail-help-text">
                      Please enter the Gmail registered
                      with the college.
                    </p>
                  )}

                  {gmailError && (
                    <p className="gmail-error-message">
                      ❌ {gmailError}
                    </p>
                  )}
                </div>

                {/* ==========================================
                    DB QUESTIONS
                ========================================== */}

                {questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="form-q-block"
                  >
                    <p className="q-text">
                      <strong>
                        {index + 1}. {question.text}
                      </strong>
                    </p>

                    <div className="star-rating-row">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          disabled={submitting}
                          className={`star-option-btn ${
                            ratings[index] >= val
                              ? "active-star"
                              : ""
                          }`}
                          onClick={() =>
                            handleRatingChange(
                              index,
                              val
                            )
                          }
                          title={`${val} - ${
                            val === 1
                              ? "Poor"
                              : val === 2
                              ? "Fair"
                              : val === 3
                              ? "Average"
                              : val === 4
                              ? "Good"
                              : "Excellent"
                          }`}
                        >
                          ★
                        </button>
                      ))}

                      <span className="star-rating-label">
                        {ratings[index]
                          ? `${ratings[index]} / 5 (${
                              ratings[index] === 1
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

                {/* ==========================================
                    COMMENTS
                ========================================== */}

                <div className="form-q-block">
                  <label className="q-text">
                    <strong>
                      Additional Comments / Suggestions
                      (Optional)
                    </strong>
                  </label>

                  <textarea
                    rows="3"
                    className="remarks-textarea"
                    placeholder="Share any suggestions or comments about today's lecture..."
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    disabled={submitting}
                  />
                </div>

                {/* ==========================================
                    SUBMIT BUTTON
                ========================================== */}

                <button
                  type="submit"
                  className="student-card-btn submit-feedback-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting Feedback..."
                    : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==========================================
            STEP 3: SUCCESS
        ========================================== */}

        {step === "success" && (
          <div className="submission-success-card">
            <div className="success-icon">✓</div>

            <h2>
              Feedback Submitted Successfully!
            </h2>

            <p>
              Thank you for helping us improve teaching
              quality at SSISM.
            </p>

            <p className="anon-sub">
              Your response has been recorded anonymously.
            </p>

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