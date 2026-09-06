const express = require("express");

const {
  createSchedule,
  getTodaySchedules,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

const router = express.Router();

router.post("/create", createSchedule);
router.get("/today", getTodaySchedules);

router.put("/:id", updateSchedule);

router.delete("/:id", deleteSchedule);

module.exports = router;