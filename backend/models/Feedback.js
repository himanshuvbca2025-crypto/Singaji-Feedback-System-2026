const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentGmail: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    facultyName: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    metrics: {
      Explanation: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      Punctuality: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      Engagement: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      Resolution: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      Overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },

    remarks: {
      type: String,
      default: '',
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'Feedbacks',
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);