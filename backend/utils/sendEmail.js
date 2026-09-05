const sendFeedbackLinkEmail = async (studentEmail, facultyName, subject, time) => {
  const feedbackUrl = `http://localhost:5173/student/feedback?faculty=${encodeURIComponent(
    facultyName
  )}&subject=${encodeURIComponent(subject)}&time=${encodeURIComponent(time)}`;

  console.log("==========================================");
  console.log(`[EMAIL DISPATCHER] Sending Feedback Email to: ${studentEmail}`);
  console.log(`Faculty: ${facultyName} | Subject: ${subject} | Time: ${time}`);
  console.log(`Student Feedback Link: ${feedbackUrl}`);
  console.log("==========================================");

  return {
    success: true,
    message: `Email successfully dispatched to ${studentEmail}`,
    studentEmail,
    feedbackUrl,
  };
};

module.exports = {
  sendFeedbackLinkEmail,
};
