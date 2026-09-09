const express = require('express');
const { protect,authorize } = require("../middleware/authMiddleware");


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

router.post('/submit', protect, submitFeedback);

router.get('/all', protect, authorize("Admin"), getAllFeedback);

router.get('/faculty/:facultyId', protect, authorize("Admin"), getFeedbackByFaculty);

router.post('/send-invite', protect, authorize("Admin"), sendFeedbackInvite);

router.get(
  "/faculty-view",
  protect,
  authorize("Admin"),
  getFacultyFeedbackView
);

router.get(
  "/faculty-history/:facultyId",
  protect,
  authorize("Admin"),
  getFacultyHistory
);


module.exports = router;