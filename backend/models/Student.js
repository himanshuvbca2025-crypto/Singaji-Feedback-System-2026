const mongoose = require('mongoose');

/**
 * Student Model
 * Extends user information specific to students.
 * TODO: Implement full schema when business logic is defined.
 */
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrollmentNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    semester: {
      type: Number,
    },
    branch: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
