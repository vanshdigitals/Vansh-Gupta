const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const [attendance] = await pool.query("SELECT a.*, e.student_id, e.course_id, u.first_name as student_first_name, u.last_name as student_last_name, c.course_name FROM attendance a JOIN enrollments e ON a.enrollment_id = e.enrollment_id JOIN users u ON e.student_id = u.user_id JOIN courses c ON e.course_id = c.course_id");
        res.json(attendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).send("Server error.");
    }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
    const { id } = req.params;
    try {
        const [attendance] = await pool.query("SELECT a.*, e.student_id, e.course_id, u.first_name as student_first_name, u.last_name as student_last_name, c.course_name FROM attendance a JOIN enrollments e ON a.enrollment_id = e.enrollment_id JOIN users u ON e.student_id = u.user_id JOIN courses c ON e.course_id = c.course_id WHERE a.attendance_id = ?", [id]);
        if (attendance.length === 0) {
            return res.status(404).send("Attendance record not found.");
        }
        res.json(attendance[0]);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).send("Server error.");
    }
};

// Create new attendance record
exports.createAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { enrollment_id, session_date, status, recorded_by } = req.body;

    try {
        await pool.query(
            "INSERT INTO attendance (enrollment_id, session_date, status, recorded_by) VALUES (?, ?, ?, ?)",
            [enrollment_id, session_date, status, recorded_by]
        );
        res.status(201).send("Attendance record created successfully.");
    } catch (error) {
        console.error("Error creating attendance:", error);
        res.status(500).send("Server error.");
    }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { session_date, status, recorded_by } = req.body;

    try {
        const [attendance] = await pool.query("SELECT * FROM attendance WHERE attendance_id = ?", [id]);
        if (attendance.length === 0) {
            return res.status(404).send("Attendance record not found.");
        }

        await pool.query(
            "UPDATE attendance SET session_date = ?, status = ?, recorded_by = ? WHERE attendance_id = ?",
            [session_date || attendance[0].session_date, status || attendance[0].status, recorded_by || attendance[0].recorded_by, id]
        );
        res.send("Attendance record updated successfully.");
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).send("Server error.");
    }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM attendance WHERE attendance_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Attendance record not found.");
        }
        res.send("Attendance record deleted successfully.");
    } catch (error) {
        console.error("Error deleting attendance:", error);
        res.status(500).send("Server error.");
    }
};


