const express = require("express");

const {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  facultyLogin,
} = require("../controllers/facultyController");

const router = express.Router();

router.get("/", getAllFaculty);
router.post("/create", createFaculty);
router.put("/:facultyId", updateFaculty);
router.delete("/:facultyId", deleteFaculty);
router.post("/login", facultyLogin);



module.exports = router;