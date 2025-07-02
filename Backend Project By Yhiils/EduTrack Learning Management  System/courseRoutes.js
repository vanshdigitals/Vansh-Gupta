const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const courseController = require("../controllers/courseController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), courseController.getAllCourses);
router.get("/:id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), courseController.getCourseById);
router.post(
    "/",
    authenticateToken,
    authorizeRole(["Administrator", "Faculty"]),
    [
        check("course_code", "Course code is required").not().isEmpty(),
        check("course_name", "Course name is required").not().isEmpty(),
        check("credits", "Credits must be a number").isFloat({ min: 0.1 }),
        check("faculty_id", "Faculty ID must be an integer").optional().isInt(),
    ],
    courseController.createCourse
);
router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["Administrator", "Faculty"]),
    [
        check("course_code", "Course code cannot be empty").optional().not().isEmpty(),
        check("course_name", "Course name cannot be empty").optional().not().isEmpty(),
        check("credits", "Credits must be a number").optional().isFloat({ min: 0.1 }),
        check("faculty_id", "Faculty ID must be an integer").optional().isInt(),
    ],
    courseController.updateCourse
);
router.delete("/:id", authenticateToken, authorizeRole(["Administrator"]), courseController.deleteCourse);

module.exports = router;


