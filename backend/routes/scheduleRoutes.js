const express = require("express");

const {
  createSchedule,
  getTodaySchedules,
} = require("../controllers/scheduleController");

const router = express.Router();

router.post("/create", createSchedule);
router.get("/today", getTodaySchedules);

module.exports = router;