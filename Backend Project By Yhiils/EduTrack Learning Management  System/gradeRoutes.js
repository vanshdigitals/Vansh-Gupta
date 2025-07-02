const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const gradeController = require("../controllers/gradeController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorizeRole(["Administrator", "Faculty"]), gradeController.getAllGrades);
router.get("/:id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), gradeController.getGradeById);
router.post(
    "/",
    authenticateToken,
    authorizeRole(["Administrator", "Faculty"]),
    [
        check("enrollment_id", "Enrollment ID is required and must be an integer").isInt(),
        check("assignment_name", "Assignment name is required").not().isEmpty(),
        check("score", "Score must be a number").optional().isFloat(),
        check("letter_grade", "Letter grade cannot be empty").optional().not().isEmpty(),
        check("graded_by", "Grader ID must be an integer").optional().isInt(),
    ],
    gradeController.createGrade
);
router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["Administrator", "Faculty"]),
    [
        check("assignment_name", "Assignment name cannot be empty").optional().not().isEmpty(),
        check("score", "Score must be a number").optional().isFloat(),
        check("letter_grade", "Letter grade cannot be empty").optional().not().isEmpty(),
        check("graded_by", "Grader ID must be an integer").optional().isInt(),
    ],
    gradeController.updateGrade
);
router.delete("/:id", authenticateToken, authorizeRole(["Administrator"]), gradeController.deleteGrade);

module.exports = router;


