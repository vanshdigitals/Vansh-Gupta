
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const projectController = require("../controllers/projectController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, projectController.getAllProjects);
router.get("/:id", authenticateToken, projectController.getProjectById);
router.post(
    "/",
    authenticateToken,
    [
        check("project_name", "Project name is required").not().isEmpty(),
        check("start_date", "Start date must be a valid date").optional().isDate(),
        check("end_date", "End date must be a valid date").optional().isDate(),
        check("status", "Status cannot be empty").optional().not().isEmpty(),
    ],
    projectController.createProject
);
router.put(
    "/:id",
    authenticateToken,
    [
        check("project_name", "Project name cannot be empty").optional().not().isEmpty(),
        check("start_date", "Start date must be a valid date").optional().isDate(),
        check("end_date", "End date must be a valid date").optional().isDate(),
        check("status", "Status cannot be empty").optional().not().isEmpty(),
    ],
    projectController.updateProject
);
router.delete("/:id", authenticateToken, projectController.deleteProject);

module.exports = router;


