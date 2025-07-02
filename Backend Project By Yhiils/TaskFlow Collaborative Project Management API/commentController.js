const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all comments for a task
exports.getCommentsByTaskId = async (req, res) => {
    const { taskId } = req.params;
    try {
        const [comments] = await pool.query("SELECT c.*, u.username as user_username FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.task_id = ? ORDER BY c.created_at ASC", [taskId]);
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Server error.");
    }
};

// Create new comment
exports.createComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { task_id, comment_text } = req.body;
    const user_id = req.user.user_id; // Assuming user ID is available from authentication middleware

    try {
        await pool.query(
            "INSERT INTO comments (task_id, user_id, comment_text) VALUES (?, ?, ?)",
            [task_id, user_id, comment_text]
        );
        res.status(201).send("Comment created successfully.");
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).send("Server error.");
    }
};

// Update comment
exports.updateComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { comment_text } = req.body;

    try {
        const [comment] = await pool.query("SELECT * FROM comments WHERE comment_id = ?", [id]);
        if (comment.length === 0) {
            return res.status(404).send("Comment not found.");
        }

        // Ensure only the comment creator can update their comment
        if (comment[0].user_id !== req.user.user_id) {
            return res.status(403).send("You are not authorized to update this comment.");
        }

        await pool.query(
            "UPDATE comments SET comment_text = ? WHERE comment_id = ?",
            [comment_text || comment[0].comment_text, id]
        );
        res.send("Comment updated successfully.");
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).send("Server error.");
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const [comment] = await pool.query("SELECT * FROM comments WHERE comment_id = ?", [id]);
        if (comment.length === 0) {
            return res.status(404).send("Comment not found.");
        }

        // Ensure only the comment creator or an admin can delete the comment
        // Assuming admin role check would be handled by a separate middleware if needed
        if (comment[0].user_id !== req.user.user_id) {
            return res.status(403).send("You are not authorized to delete this comment.");
        }

        const [result] = await pool.query("DELETE FROM comments WHERE comment_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Comment not found.");
        }
        res.send("Comment deleted successfully.");
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).send("Server error.");
    }
};


