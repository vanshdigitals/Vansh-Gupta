const pool = require("../config/db");
const { validationResult } = require("express-validator");

// Get all notifications for a user
exports.getNotificationsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        // Ensure user can only access their own notifications
        if (req.user.user_id !== parseInt(userId)) {
            return res.status(403).send("Access Denied: You can only view your own notifications.");
        }
        const [notifications] = await pool.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", [userId]);
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send("Server error.");
    }
};

// Create new notification (typically called internally by other services)
exports.createNotification = async (user_id, message, type) => {
    try {
        await pool.query(
            "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)",
            [user_id, message, type]
        );
        console.log(`Notification created for user ${user_id}: ${message}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const [notification] = await pool.query("SELECT * FROM notifications WHERE notification_id = ?", [id]);
        if (notification.length === 0) {
            return res.status(404).send("Notification not found.");
        }

        // Ensure user can only mark their own notifications as read
        if (notification[0].user_id !== req.user.user_id) {
            return res.status(403).send("Access Denied: You can only mark your own notifications as read.");
        }

        await pool.query("UPDATE notifications SET is_read = TRUE WHERE notification_id = ?", [id]);
        res.send("Notification marked as read.");
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).send("Server error.");
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const [notification] = await pool.query("SELECT * FROM notifications WHERE notification_id = ?", [id]);
        if (notification.length === 0) {
            return res.status(404).send("Notification not found.");
        }

        // Ensure user can only delete their own notifications
        if (notification[0].user_id !== req.user.user_id) {
            return res.status(403).send("Access Denied: You can only delete your own notifications.");
        }

        const [result] = await pool.query("DELETE FROM notifications WHERE notification_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Notification not found.");
        }
        res.send("Notification deleted successfully.");
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).send("Server error.");
    }
};


