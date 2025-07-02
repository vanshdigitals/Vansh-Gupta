
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, taskController.getAllTasks);
router.get("/:id", authenticateToken, taskController.getTaskById);
router.post(
    "/",
    authenticateToken,
    [
        check("project_id", "Project ID is required and must be an integer").isInt(),
        check("assignee_id", "Assignee ID must be an integer").optional().isInt(),
        check("title", "Title is required").not().isEmpty(),
        check("due_date", "Due date must be a valid date").optional().isDate(),
        check("status", "Status cannot be empty").optional().not().isEmpty(),
        check("priority", "Priority cannot be empty").optional().not().isEmpty(),
    ],
    taskController.createTask
);
router.put(
    "/:id",
    authenticateToken,
    [
        check("project_id", "Project ID must be an integer").optional().isInt(),
        check("assignee_id", "Assignee ID must be an integer").optional().isInt(),
        check("title", "Title cannot be empty").optional().not().isEmpty(),
        check("due_date", "Due date must be a valid date").optional().isDate(),
        check("status", "Status cannot be empty").optional().not().isEmpty(),
        check("priority", "Priority cannot be empty").optional().not().isEmpty(),
    ],
    taskController.updateTask
);
router.delete("/:id", authenticateToken, taskController.deleteTask);

module.exports = router;


