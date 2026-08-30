/**
 * Auth Controller
 * Handles user registration and login.
 * TODO: Implement when backend authentication is ready.
 */

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    res.status(501).json({ message: 'registerUser – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user and return JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    res.status(501).json({ message: 'loginUser – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(501).json({ message: 'getMe – not yet implemented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
