const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query("SELECT user_id, first_name, last_name, email, role_name FROM users JOIN roles ON users.role_id = roles.role_id");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Server error.");
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await pool.query("SELECT user_id, first_name, last_name, email, role_name FROM users JOIN roles ON users.role_id = roles.role_id WHERE user_id = ?", [id]);
        if (user.length === 0) {
            return res.status(404).send("User not found.");
        }
        res.json(user[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Server error.");
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { first_name, last_name, email, role_name } = req.body;

    try {
        const [user] = await pool.query("SELECT * FROM users WHERE user_id = ?", [id]);
        if (user.length === 0) {
            return res.status(404).send("User not found.");
        }

        let role_id = user[0].role_id;
        if (role_name) {
            const [role] = await pool.query("SELECT role_id FROM roles WHERE role_name = ?", [role_name]);
            if (role.length === 0) {
                return res.status(400).send("Invalid role specified.");
            }
            role_id = role[0].role_id;
        }

        await pool.query(
            "UPDATE users SET first_name = ?, last_name = ?, email = ?, role_id = ? WHERE user_id = ?",
            [first_name || user[0].first_name, last_name || user[0].last_name, email || user[0].email, role_id, id]
        );
        res.send("User updated successfully.");
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Server error.");
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("User not found.");
        }
        res.send("User deleted successfully.");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Server error.");
    }
};


