/**
 * Question Controller
 * Handles feedback question CRUD for admin.
 * TODO: Implement when business logic is ready.
 */

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
const getAllQuestions = async (req, res) => {
  try {
    res.status(501).json({ message: 'getAllQuestions – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    res.status(501).json({ message: 'createQuestion – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    res.status(501).json({ message: 'updateQuestion – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    res.status(501).json({ message: 'deleteQuestion – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
