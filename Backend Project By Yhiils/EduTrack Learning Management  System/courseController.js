const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const [courses] = await pool.query("SELECT c.*, u.first_name as faculty_first_name, u.last_name as faculty_last_name FROM courses c LEFT JOIN users u ON c.faculty_id = u.user_id");
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send("Server error.");
    }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const [course] = await pool.query("SELECT c.*, u.first_name as faculty_first_name, u.last_name as faculty_last_name FROM courses c LEFT JOIN users u ON c.faculty_id = u.user_id WHERE c.course_id = ?", [id]);
        if (course.length === 0) {
            return res.status(404).send("Course not found.");
        }
        res.json(course[0]);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).send("Server error.");
    }
};

// Create new course
exports.createCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { course_code, course_name, description, credits, faculty_id } = req.body;

    try {
        const [existingCourse] = await pool.query("SELECT * FROM courses WHERE course_code = ?", [course_code]);
        if (existingCourse.length > 0) {
            return res.status(409).send("Course with this code already exists.");
        }

        await pool.query(
            "INSERT INTO courses (course_code, course_name, description, credits, faculty_id) VALUES (?, ?, ?, ?, ?)",
            [course_code, course_name, description, credits, faculty_id]
        );
        res.status(201).send("Course created successfully.");
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).send("Server error.");
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { course_code, course_name, description, credits, faculty_id } = req.body;

    try {
        const [course] = await pool.query("SELECT * FROM courses WHERE course_id = ?", [id]);
        if (course.length === 0) {
            return res.status(404).send("Course not found.");
        }

        await pool.query(
            "UPDATE courses SET course_code = ?, course_name = ?, description = ?, credits = ?, faculty_id = ? WHERE course_id = ?",
            [course_code || course[0].course_code, course_name || course[0].course_name, description || course[0].description, credits || course[0].credits, faculty_id || course[0].faculty_id, id]
        );
        res.send("Course updated successfully.");
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).send("Server error.");
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM courses WHERE course_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Course not found.");
        }
        res.send("Course deleted successfully.");
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).send("Server error.");
    }
};


