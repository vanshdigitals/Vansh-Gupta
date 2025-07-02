const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
    "/register",
    [
        check("first_name", "First name is required").not().isEmpty(),
        check("last_name", "Last name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
        check("role_name", "Role name is required").not().isEmpty(),
    ],
    authController.registerUser
);

router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    authController.loginUser
);

module.exports = router;


