const express = require('express');

const {
  submitFeedback,
  getFeedbackHistory,
  getAllFeedback,
  getFeedbackByFaculty,
  sendFeedbackInvite,
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/submit', submitFeedback);

router.get('/all', getAllFeedback);

router.get('/faculty/:facultyName', getFeedbackByFaculty);

router.post('/send-invite', sendFeedbackInvite);

module.exports = router;