const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      index: {
    expires: "24h",
  },
},
    department: {
      type: String,
      required: true,
      trim: true,
    },

    groups: {
      type: [String],
      required: true,
    },

    class: {
      type: String,
      required: true,
      trim: true,
    },

    strength: {
      type: Number,
      required: true,
      min: 0,
    },

    slot1: {
      subject: {
        type: String,
        trim: true,
      },
      facultyName: {
        type: String,
        trim: true,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },

    lunchBreak: {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },

    slot2: {
      subject: {
        type: String,
        trim: true,
      },
      facultyName: {
        type: String,
        trim: true,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },

    teaBreak: {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },

    slot3: {
      subject: {
        type: String,
        trim: true,
      },
      facultyName: {
        type: String,
        trim: true,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    collection: "Schedules",
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);