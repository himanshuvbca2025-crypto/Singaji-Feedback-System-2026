const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const questionRoutes = require("./routes/questionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const studentsRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const selectedStudentsRoutes = require("./routes/seletedstudentsRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

// Feedback Email Scheduler
const { startEmailScheduler } = require("./utils/emailScheduler");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/students", studentsRoutes);

app.use("/api/faculty", facultyRoutes);

app.use("/api/selected-students", selectedStudentsRoutes);

app.use("/api/schedules", scheduleRoutes);

// ==========================================
// START EMAIL SCHEDULER
// ==========================================

startEmailScheduler();

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});