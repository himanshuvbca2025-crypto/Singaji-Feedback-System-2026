const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');

// GET    /api/faculty
router.get('/', getAllFaculty);

// POST   /api/faculty
router.post('/', createFaculty);

// GET    /api/faculty/:id
router.get('/:id', getFacultyById);

// PUT    /api/faculty/:id
router.put('/:id', updateFaculty);

// DELETE /api/faculty/:id
router.delete('/:id', deleteFaculty);

module.exports = router;
