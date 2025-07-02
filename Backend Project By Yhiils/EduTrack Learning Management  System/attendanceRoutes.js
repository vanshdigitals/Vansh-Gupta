const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const attendanceController = require("../controllers/attendanceController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorizeRole(["Administrator", "Faculty"]), attendanceController.getAllAttendance);
router.get("/:id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), attendanceController.getAttendanceById);
router.post(
    "/",
    authenticateToken,
    authorizeRole(["Administrator", "Faculty"]),
    [
        check("enrollment_id", "Enrollment ID is required and must be an integer").isInt(),
        check("session_date", "Session date is required and must be a valid date").isDate(),
        check("status", "Status is required").not().isEmpty(),
        check("recorded_by", "Recorded by ID must be an integer").optional().isInt(),
    ],
    attendanceController.createAttendance
);
router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["Administrator", "Faculty"]),
    [
        check("session_date", "Session date must be a valid date").optional().isDate(),
        check("status", "Status cannot be empty").optional().not().isEmpty(),
        check("recorded_by", "Recorded by ID must be an integer").optional().isInt(),
    ],
    attendanceController.updateAttendance
);
router.delete("/:id", authenticateToken, authorizeRole(["Administrator"]), attendanceController.deleteAttendance);

module.exports = router;


