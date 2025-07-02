
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/task/:taskId", authenticateToken, commentController.getCommentsByTaskId);
router.post(
    "/",
    authenticateToken,
    [
        check("task_id", "Task ID is required and must be an integer").isInt(),
        check("comment_text", "Comment text is required").not().isEmpty(),
    ],
    commentController.createComment
);
router.put(
    "/:id",
    authenticateToken,
    [
        check("comment_text", "Comment text cannot be empty").not().isEmpty(),
    ],
    commentController.updateComment
);
router.delete("/:id", authenticateToken, commentController.deleteComment);

module.exports = router;


