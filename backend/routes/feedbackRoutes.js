const express = require('express');

const {
  submitFeedback,
  getFeedbackHistory,
  getAllFeedback,
  getFeedbackByFaculty,
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/submit', submitFeedback);

router.get('/all', getAllFeedback);

module.exports = router;