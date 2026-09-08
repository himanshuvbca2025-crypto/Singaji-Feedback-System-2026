const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendFeedbackLinkEmail = async (
  studentEmail,
   facultyId,
  facultyName,
  subject,
  time,
  endTime
) => {
const feedbackUrl =
  `http://localhost:5173/student/feedback` +
  `?facultyId=${encodeURIComponent(facultyId)}` +
  `&faculty=${encodeURIComponent(facultyName)}` +
  `&subject=${encodeURIComponent(subject)}` +
  `&time=${encodeURIComponent(time)}` +
  `&endTime=${encodeURIComponent(endTime || "")}`;
  
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: studentEmail,
    subject: `Feedback Required - ${facultyName}`,
    html: `
      <h2>Student Feedback</h2>

      <p>Hello,</p>

      <p>Please submit your feedback for:</p>

      <p>
        <strong>Faculty:</strong> ${facultyName}<br>
        <strong>Subject:</strong> ${subject}<br>
        <strong>Time:</strong> ${time}<br>
        <strong>Lecture End Time:</strong> ${endTime || "Not available"}
      </p>

      <p>
        <a href="${feedbackUrl}">
          Click here to submit your feedback
        </a>
      </p>

      <p>Thank you.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log("==========================================");
    console.log(`[EMAIL SENT] To: ${studentEmail}`);
    console.log(`Faculty: ${facultyName}`);
    console.log(`Subject: ${subject}`);
    console.log(`Lecture Time: ${time}`);
    console.log(`Lecture End Time: ${endTime}`);
    console.log(`Message ID: ${info.messageId}`);
    console.log("==========================================");

    return {
      success: true,
      message: "Email sent successfully",
      studentEmail,
      feedbackUrl,
      lectureEndTime: endTime,
    };
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};

module.exports = {
  sendFeedbackLinkEmail,
};