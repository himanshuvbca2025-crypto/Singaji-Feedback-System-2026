const mongoose = require('mongoose');

/**
 * Course Model
 * Represents a subject/course taught by a faculty member.
 * TODO: Implement full schema when business logic is defined.
 */
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
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
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
