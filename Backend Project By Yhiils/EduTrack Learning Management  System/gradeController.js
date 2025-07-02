const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all grades
exports.getAllGrades = async (req, res) => {
    try {
        const [grades] = await pool.query("SELECT g.*, e.student_id, e.course_id, u.first_name as student_first_name, u.last_name as student_last_name, c.course_name FROM grades g JOIN enrollments e ON g.enrollment_id = e.enrollment_id JOIN users u ON e.student_id = u.user_id JOIN courses c ON e.course_id = c.course_id");
        res.json(grades);
    } catch (error) {
        console.error("Error fetching grades:", error);
        res.status(500).send("Server error.");
    }
};

// Get grade by ID
exports.getGradeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [grade] = await pool.query("SELECT g.*, e.student_id, e.course_id, u.first_name as student_first_name, u.last_name as student_last_name, c.course_name FROM grades g JOIN enrollments e ON g.enrollment_id = e.enrollment_id JOIN users u ON e.student_id = u.user_id JOIN courses c ON e.course_id = c.course_id WHERE g.grade_id = ?", [id]);
        if (grade.length === 0) {
            return res.status(404).send("Grade not found.");
        }
        res.json(grade[0]);
    } catch (error) {
        console.error("Error fetching grade:", error);
        res.status(500).send("Server error.");
    }
};

// Create new grade
exports.createGrade = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { enrollment_id, assignment_name, score, letter_grade, graded_by } = req.body;

    try {
        await pool.query(
            "INSERT INTO grades (enrollment_id, assignment_name, score, letter_grade, graded_by) VALUES (?, ?, ?, ?, ?)",
            [enrollment_id, assignment_name, score, letter_grade, graded_by]
        );
        res.status(201).send("Grade created successfully.");
    } catch (error) {
        console.error("Error creating grade:", error);
        res.status(500).send("Server error.");
    }
};

// Update grade
exports.updateGrade = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { assignment_name, score, letter_grade, graded_by } = req.body;

    try {
        const [grade] = await pool.query("SELECT * FROM grades WHERE grade_id = ?", [id]);
        if (grade.length === 0) {
            return res.status(404).send("Grade not found.");
        }

        await pool.query(
            "UPDATE grades SET assignment_name = ?, score = ?, letter_grade = ?, graded_by = ? WHERE grade_id = ?",
            [assignment_name || grade[0].assignment_name, score || grade[0].score, letter_grade || grade[0].letter_grade, graded_by || grade[0].graded_by, id]
        );
        res.send("Grade updated successfully.");
    } catch (error) {
        console.error("Error updating grade:", error);
        res.status(500).send("Server error.");
    }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM grades WHERE grade_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Grade not found.");
        }
        res.send("Grade deleted successfully.");
    } catch (error) {
        console.error("Error deleting grade:", error);
        res.status(500).send("Server error.");
    }
};


