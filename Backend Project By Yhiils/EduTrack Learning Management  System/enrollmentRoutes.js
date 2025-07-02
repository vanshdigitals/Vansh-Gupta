const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const enrollmentController = require("../controllers/enrollmentController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorizeRole(["Administrator", "Faculty"]), enrollmentController.getAllEnrollments);
router.get("/:id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), enrollmentController.getEnrollmentById);
router.post(
    "/",
    authenticateToken,
    authorizeRole(["Administrator"]),
    [
        check("student_id", "Student ID is required and must be an integer").isInt(),
        check("course_id", "Course ID is required and must be an integer").isInt(),
        check("enrollment_date", "Enrollment date is required and must be a valid date").isDate(),
        check("status", "Status is required").not().isEmpty(),
    ],
    enrollmentController.createEnrollment
);
router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["Administrator"]),
    [
        check("enrollment_date", "Enrollment date must be a valid date").optional().isDate(),
        check("status", "Status cannot be empty").optional().not().isEmpty(),
    ],
    enrollmentController.updateEnrollment
);
router.delete("/:id", authenticateToken, authorizeRole(["Administrator"]), enrollmentController.deleteEnrollment);

module.exports = router;


