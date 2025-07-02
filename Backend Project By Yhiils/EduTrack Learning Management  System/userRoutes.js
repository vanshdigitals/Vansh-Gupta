const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorizeRole(["Administrator"]), userController.getAllUsers);
router.get("/:id", authenticateToken, authorizeRole(["Administrator", "Faculty", "Student"]), userController.getUserById);
router.put(
    "/:id",
    authenticateToken,
    authorizeRole(["Administrator"]),
    [
        check("first_name", "First name is required").optional().not().isEmpty(),
        check("last_name", "Last name is required").optional().not().isEmpty(),
        check("email", "Please include a valid email").optional().isEmail(),
        check("role_name", "Role name is required").optional().not().isEmpty(),
    ],
    userController.updateUser
);
router.delete("/:id", authenticateToken, authorizeRole(["Administrator"]), userController.deleteUser);

module.exports = router;


