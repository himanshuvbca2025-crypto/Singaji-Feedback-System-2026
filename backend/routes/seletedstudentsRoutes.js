
const express = require("express");

const {
  saveSelectedStudents,
getSelectedStudents,
} = require("../controllers/seletedstudentsController");

const router = express.Router();

router.post("/", saveSelectedStudents);
router.get("/", getSelectedStudents);

router.post("/", saveSelectedStudents);

module.exports = router;
