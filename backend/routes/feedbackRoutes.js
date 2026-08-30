const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedbackHistory,
  getAllFeedback,
  getFeedbackByFaculty,
} = require('../controllers/feedbackController');

// POST   /api/feedback
router.post('/', submitFeedback);

// GET    /api/feedback
router.get('/', getAllFeedback);

// GET    /api/feedback/history
router.get('/history', getFeedbackHistory);

// GET    /api/feedback/faculty/:facultyId
router.get('/faculty/:facultyId', getFeedbackByFaculty);

module.exports = router;
