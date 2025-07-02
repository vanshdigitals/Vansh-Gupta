const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
    try {
        const [enrollments] = await pool.query("SELECT e.*, u.first_name as student_first_name, u.last_name as student_last_name, c.course_name FROM enrollments e JOIN users u ON e.student_id = u.user_id JOIN courses c ON e.course_id = c.course_id");
        res.json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).send("Server error.");
    }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const [enrollment] = await pool.query("SELECT e.*, u.first_name as student_first_name, u.last_name as student_last_name, c.course_name FROM enrollments e JOIN users u ON e.student_id = u.user_id JOIN courses c ON e.course_id = c.course_id WHERE e.enrollment_id = ?", [id]);
        if (enrollment.length === 0) {
            return res.status(404).send("Enrollment not found.");
        }
        res.json(enrollment[0]);
    } catch (error) {
        console.error("Error fetching enrollment:", error);
        res.status(500).send("Server error.");
    }
};

// Create new enrollment
exports.createEnrollment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { student_id, course_id, enrollment_date, status } = req.body;

    try {
        const [existingEnrollment] = await pool.query("SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?", [student_id, course_id]);
        if (existingEnrollment.length > 0) {
            return res.status(409).send("Student is already enrolled in this course.");
        }

        await pool.query(
            "INSERT INTO enrollments (student_id, course_id, enrollment_date, status) VALUES (?, ?, ?, ?)",
            [student_id, course_id, enrollment_date, status]
        );
        res.status(201).send("Enrollment created successfully.");
    } catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).send("Server error.");
    }
};

// Update enrollment
exports.updateEnrollment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { enrollment_date, status } = req.body;

    try {
        const [enrollment] = await pool.query("SELECT * FROM enrollments WHERE enrollment_id = ?", [id]);
        if (enrollment.length === 0) {
            return res.status(404).send("Enrollment not found.");
        }

        await pool.query(
            "UPDATE enrollments SET enrollment_date = ?, status = ? WHERE enrollment_id = ?",
            [enrollment_date || enrollment[0].enrollment_date, status || enrollment[0].status, id]
        );
        res.send("Enrollment updated successfully.");
    } catch (error) {
        console.error("Error updating enrollment:", error);
        res.status(500).send("Server error.");
    }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM enrollments WHERE enrollment_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Enrollment not found.");
        }
        res.send("Enrollment deleted successfully.");
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).send("Server error.");
    }
};


