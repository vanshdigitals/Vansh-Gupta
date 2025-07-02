/**
 * Task Management Controller
 * TaskFlow Backend API
 * 
 * @author Vansh Gupta (vanshdigitals)
 * @email vanshdigitalsiscreative@gmail.com
 */

const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query("SELECT t.*, p.project_name, u_assignee.username as assignee_username, u_creator.username as creator_username FROM tasks t JOIN projects p ON t.project_id = p.project_id LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.user_id JOIN users u_creator ON t.creator_id = u_creator.user_id");
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Server error.");
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const [task] = await pool.query("SELECT t.*, p.project_name, u_assignee.username as assignee_username, u_creator.username as creator_username FROM tasks t JOIN projects p ON t.project_id = p.project_id LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.user_id JOIN users u_creator ON t.creator_id = u_creator.user_id WHERE t.task_id = ?", [id]);
        if (task.length === 0) {
            return res.status(404).send("Task not found.");
        }
        res.json(task[0]);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).send("Server error.");
    }
};

// Create new task
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { project_id, assignee_id, title, description, due_date, status, priority } = req.body;
    const creator_id = req.user.user_id; // Assuming user ID is available from authentication middleware

    try {
        await pool.query(
            "INSERT INTO tasks (project_id, assignee_id, creator_id, title, description, due_date, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [project_id, assignee_id, creator_id, title, description, due_date, status, priority]
        );
        res.status(201).send("Task created successfully.");
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).send("Server error.");
    }
};

// Update task
exports.updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { project_id, assignee_id, title, description, due_date, status, priority } = req.body;

    try {
        const [task] = await pool.query("SELECT * FROM tasks WHERE task_id = ?", [id]);
        if (task.length === 0) {
            return res.status(404).send("Task not found.");
        }

        await pool.query(
            "UPDATE tasks SET project_id = ?, assignee_id = ?, title = ?, description = ?, due_date = ?, status = ?, priority = ? WHERE task_id = ?",
            [project_id || task[0].project_id, assignee_id || task[0].assignee_id, title || task[0].title, description || task[0].description, due_date || task[0].due_date, status || task[0].status, priority || task[0].priority, id]
        );
        res.send("Task updated successfully.");
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Server error.");
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM tasks WHERE task_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Task not found.");
        }
        res.send("Task deleted successfully.");
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Server error.");
    }
};


