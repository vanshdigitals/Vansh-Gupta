
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const notificationController = require("../controllers/notificationController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/user/:userId", authenticateToken, notificationController.getNotificationsByUserId);
router.put("/mark-read/:id", authenticateToken, notificationController.markNotificationAsRead);
router.delete("/:id", authenticateToken, notificationController.deleteNotification);

module.exports = router;


