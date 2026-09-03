const express = require('express');
const router = express.Router();

const {
  getOverallReport,
  getFacultyReport,
  getCourseReport,
} = require('../controllers/reportController');

// GET /api/reports
router.get('/', getOverallReport);

// GET /api/reports/faculty/:facultyId
// router.get('/faculty/:facultyId', getFacultyReport);

// GET /api/reports/course/:courseId
// router.get('/course/:courseId', getCourseReport);

module.exports = router;
