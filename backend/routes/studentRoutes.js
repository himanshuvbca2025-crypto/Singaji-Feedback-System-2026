const express = require("express");
const { getStudents } = require("../controllers/StudentsController");

const router = express.Router();

router.get("/", getStudents);

module.exports = router;