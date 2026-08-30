/**
 * Faculty Controller
 * Handles faculty profile and course management.
 * TODO: Implement when business logic is ready.
 */

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private/Admin
const getAllFaculty = async (req, res) => {
  try {
    res.status(501).json({ message: 'getAllFaculty – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get faculty by ID
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res) => {
  try {
    res.status(501).json({ message: 'getFacultyById – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create faculty profile
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
  try {
    res.status(501).json({ message: 'createFaculty – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res) => {
  try {
    res.status(501).json({ message: 'updateFaculty – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res) => {
  try {
    res.status(501).json({ message: 'deleteFaculty – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
