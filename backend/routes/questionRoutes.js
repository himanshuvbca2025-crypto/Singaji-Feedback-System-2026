const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

// GET    /api/questions
router.get('/', getAllQuestions);

// POST   /api/questions
router.post('/', createQuestion);

// PUT    /api/questions/:id
router.put('/:id', updateQuestion);

// DELETE /api/questions/:id
router.delete('/:id', deleteQuestion);

module.exports = router;
