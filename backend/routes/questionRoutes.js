const express = require('express');

const {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

const router = express.Router();

router.get('/', getAllQuestions);

router.post('/create', createQuestion);

router.put('/:id', updateQuestion);

router.delete('/:id', deleteQuestion);

module.exports = router;