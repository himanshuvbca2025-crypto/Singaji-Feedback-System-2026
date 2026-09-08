const express = require('express');

const {
  submitFeedback,
  getFeedbackHistory,
  getAllFeedback,
  getFeedbackByFaculty,
  sendFeedbackInvite,
  getFacultyFeedbackView,
  getFacultyHistory
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/submit', submitFeedback);

router.get('/all', getAllFeedback);

router.get('/faculty/:facultyId', getFeedbackByFaculty);

router.post('/send-invite', sendFeedbackInvite);

router.get(
  "/faculty-view",
  getFacultyFeedbackView
);

router.get(
  "/faculty-history/:facultyId",
  getFacultyHistory
);


module.exports = router;