const Schedule = require("../models/Schedule");
const Students = require("../models/Students");


// =====================================================
// Get today's start and end according to Indian time
// =====================================================
const getTodayRange = () => {
  const now = new Date();

  // Current UTC time
  const utcTime = now.getTime();

  // IST = UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istNow = new Date(utcTime + istOffset);

  const year = istNow.getUTCFullYear();
  const month = istNow.getUTCMonth();
  const day = istNow.getUTCDate();

  // Start of today in IST
  const startIST = new Date(
    Date.UTC(year, month, day, 0, 0, 0, 0) - istOffset
  );

  // Start of tomorrow in IST
  const endIST = new Date(
    Date.UTC(year, month, day + 1, 0, 0, 0, 0) - istOffset
  );

  return {
    start: startIST,
    end: endIST,
  };
};


// =====================================================
// Create Schedule
// =====================================================
const createSchedule = async (req, res) => {
  try {
    const {
      department,
      groups,
      class: className,
      slot1,
      lunchBreak,
      slot2,
      teaBreak,
      slot3,
    } = req.body;


    // =================================================
    // Basic validation
    // =================================================
    if (!department || !groups || !className) {
      return res.status(400).json({
        success: false,
        message: "Department, groups and class are required",
      });
    }


    if (!Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one group is required",
      });
    }


    // =================================================
    // Calculate total strength
    // =================================================
    const students = await Students.find({
      section: department,
      level: { $in: groups },
    });

    const strength = students.length;


    // =================================================
    // Find today's existing schedule
    // =================================================
    const { start, end } = getTodayRange();

    const existingSchedule = await Schedule.findOne({
      department,
      date: {
        $gte: start,
        $lt: end,
      },
    }).sort({ date: 1 });


    // =================================================
    // If today's schedule already exists
    // then reuse its timing
    // =================================================
    let finalSlot1;
    let finalLunchBreak;
    let finalSlot2;
    let finalTeaBreak;
    let finalSlot3;


    if (existingSchedule) {

      // -----------------------------------------------
      // Timing already exists for today
      // -----------------------------------------------

      finalSlot1 = {
        subject: slot1?.subject || "",
        facultyName: slot1?.facultyName || "",
        startTime: existingSchedule.slot1?.startTime,
        endTime: existingSchedule.slot1?.endTime,
      };


      finalLunchBreak = {
        startTime: existingSchedule.lunchBreak?.startTime,
        endTime: existingSchedule.lunchBreak?.endTime,
      };


      finalSlot2 = {
        subject: slot2?.subject || "",
        facultyName: slot2?.facultyName || "",
        startTime: existingSchedule.slot2?.startTime,
        endTime: existingSchedule.slot2?.endTime,
      };


      finalTeaBreak = {
        startTime: existingSchedule.teaBreak?.startTime,
        endTime: existingSchedule.teaBreak?.endTime,
      };


      finalSlot3 = {
        subject: slot3?.subject || "",
        facultyName: slot3?.facultyName || "",
        startTime: existingSchedule.slot3?.startTime,
        endTime: existingSchedule.slot3?.endTime,
      };

    } else {

      // -----------------------------------------------
      // First schedule of the day
      // Timing is required
      // -----------------------------------------------

      if (
        !slot1?.startTime ||
        !slot1?.endTime ||
        !lunchBreak?.startTime ||
        !lunchBreak?.endTime ||
        !slot2?.startTime ||
        !slot2?.endTime ||
        !teaBreak?.startTime ||
        !teaBreak?.endTime ||
        !slot3?.startTime ||
        !slot3?.endTime
      ) {
        return res.status(400).json({
          success: false,
          message:
            "For the first schedule of the day, all timings are required",
        });
      }


      finalSlot1 = slot1;

      finalLunchBreak = lunchBreak;

      finalSlot2 = slot2;

      finalTeaBreak = teaBreak;

      finalSlot3 = slot3;
    }


    // =================================================
    // Create schedule
    // =================================================
    const schedule = await Schedule.create({
      department,
      groups,
      class: className,
      strength,

      slot1: finalSlot1,

      lunchBreak: finalLunchBreak,

      slot2: finalSlot2,

      teaBreak: finalTeaBreak,

      slot3: finalSlot3,
    });


    // =================================================
    // Response
    // =================================================
    return res.status(201).json({
      success: true,
      message: existingSchedule
        ? "Schedule created using today's existing timing"
        : "First schedule of the day created successfully",

      schedule,
    });

  } catch (error) {

    console.error("Create schedule error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Get Today's Schedules
// =====================================================
const getTodaySchedules = async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    const filter = {
      date: { $gte: start, $lt: end },
    };

    // Department diya hai to us department ka data
    // nahi diya hai to sabhi departments ka data
    if (req.query.department) {
      filter.department = req.query.department;
    }

    const schedules = await Schedule.find(filter).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.error("Get today's schedules error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's schedules",
    });
  }
};

module.exports = {
  createSchedule,
  getTodaySchedules,
};