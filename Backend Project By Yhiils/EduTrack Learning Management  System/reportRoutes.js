
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.get("/student-performance/:student_id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), reportController.getStudentPerformance);
router.get("/course-analytics/:course_id", authenticateToken, authorizeRole(["Administrator", "Faculty"]), reportController.getCourseAnalytics);
router.get("/student-attendance/:student_id/:course_id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), reportController.getStudentCourseAttendance);

module.exports = router;


