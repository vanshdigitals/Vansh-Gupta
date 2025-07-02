/**
 * Project Management Controller
 * TaskFlow Backend API
 * 
 * @author Vansh Gupta (vanshdigitals)
 * @email vanshdigitalsiscreative@gmail.com
 */

const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await pool.query("SELECT p.*, u.username as creator_username FROM projects p JOIN users u ON p.creator_id = u.user_id");
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Server error.");
    }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const [project] = await pool.query("SELECT p.*, u.username as creator_username FROM projects p JOIN users u ON p.creator_id = u.user_id WHERE p.project_id = ?", [id]);
        if (project.length === 0) {
            return res.status(404).send("Project not found.");
        }
        res.json(project[0]);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).send("Server error.");
    }
};

// Create new project
exports.createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { project_name, description, start_date, end_date, status } = req.body;
    const creator_id = req.user.user_id; // Assuming user ID is available from authentication middleware

    try {
        await pool.query(
            "INSERT INTO projects (project_name, description, start_date, end_date, status, creator_id) VALUES (?, ?, ?, ?, ?, ?)",
            [project_name, description, start_date, end_date, status, creator_id]
        );
        res.status(201).send("Project created successfully.");
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).send("Server error.");
    }
};

// Update project
exports.updateProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { project_name, description, start_date, end_date, status } = req.body;

    try {
        const [project] = await pool.query("SELECT * FROM projects WHERE project_id = ?", [id]);
        if (project.length === 0) {
            return res.status(404).send("Project not found.");
        }

        await pool.query(
            "UPDATE projects SET project_name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE project_id = ?",
            [project_name || project[0].project_name, description || project[0].description, start_date || project[0].start_date, end_date || project[0].end_date, status || project[0].status, id]
        );
        res.send("Project updated successfully.");
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Server error.");
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM projects WHERE project_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Project not found.");
        }
        res.send("Project deleted successfully.");
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).send("Server error.");
    }
};


