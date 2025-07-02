/**
 * EduTrack Learning Management System - Backend API
 * 
 * @author Vansh Gupta <vanshdigitalsiscreative@gmail.com>
 * @github https://github.com/vanshdigitals
 * @version 1.0.0
 * @description Complete LMS backend with authentication, course management, 
 *              enrollment, grading, attendance tracking and reporting system
 * @created July 2025
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const enrollmentRoutes = require("./enrollmentRoutes");
const gradeRoutes = require("./gradeRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const reportRoutes = require("./reportRoutes");
const errorHandler = require("./errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "EduTrack LMS Backend API is running!",
        version: "1.0.0",
        author: "Vansh Gupta (@vanshdigitals)",
        contact: "vanshdigitalsiscreative@gmail.com",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎓 EduTrack LMS Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
