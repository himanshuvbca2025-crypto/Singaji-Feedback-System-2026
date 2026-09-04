const express = require("express");

const {
  saveSelectedStudents,
} = require("../controllers/seletedstudentsController");

const router = express.Router();

router.post("/", saveSelectedStudents);

module.exports = router;