const pool = require("../config/db");

// Get student performance report
exports.getStudentPerformance = async (req, res) => {
    const { student_id } = req.params;
    try {
        const [studentGrades] = await pool.query(
            "SELECT c.course_name, g.assignment_name, g.score, g.letter_grade " +
            "FROM grades g " +
            "JOIN enrollments e ON g.enrollment_id = e.enrollment_id " +
            "JOIN courses c ON e.course_id = c.course_id " +
            "WHERE e.student_id = ?",
            [student_id]
        );
        res.json(studentGrades);
    } catch (error) {
        console.error("Error fetching student performance:", error);
        res.status(500).send("Server error.");
    }
};

// Get course analytics
exports.getCourseAnalytics = async (req, res) => {
    const { course_id } = req.params;
    try {
        const [courseGrades] = await pool.query(
            "SELECT AVG(g.score) as average_score, MIN(g.score) as min_score, MAX(g.score) as max_score, COUNT(DISTINCT e.student_id) as total_students " +
            "FROM grades g " +
            "JOIN enrollments e ON g.enrollment_id = e.enrollment_id " +
            "WHERE e.course_id = ?",
            [course_id]
        );
        res.json(courseGrades[0]);
    } catch (error) {
        console.error("Error fetching course analytics:", error);
        res.status(500).send("Server error.");
    }
};

// Get attendance report for a student in a course
exports.getStudentCourseAttendance = async (req, res) => {
    const { student_id, course_id } = req.params;
    try {
        const [attendanceRecords] = await pool.query(
            "SELECT a.session_date, a.status " +
            "FROM attendance a " +
            "JOIN enrollments e ON a.enrollment_id = e.enrollment_id " +
            "WHERE e.student_id = ? AND e.course_id = ?",
            [student_id, course_id]
        );
        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching student course attendance:", error);
        res.status(500).send("Server error.");
    }
};


