const express = require('express');
const { protect,authorize } = require("../middleware/authMiddleware");


const {
  submitFeedback,
  getFeedbackHistory,
  getAllFeedback,
  getFeedbackByFaculty,
  sendFeedbackInvite,
  getFacultyFeedbackView,
  getFacultyHistory,
  verifyFeedbackToken,
} = require('../controllers/feedbackController');

const router = express.Router();

router.get(
  "/verify-token",
  verifyFeedbackToken
);

router.post('/submit', submitFeedback);

router.get('/all',getAllFeedback);

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