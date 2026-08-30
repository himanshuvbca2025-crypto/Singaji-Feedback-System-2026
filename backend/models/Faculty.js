const mongoose = require('mongoose');

/**
 * Faculty Model
 * Extends user information specific to faculty members.
 * TODO: Implement full schema when business logic is defined.
 */
const facultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
