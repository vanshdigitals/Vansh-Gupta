const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// User Registration
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password, role_name } = req.body;

    try {
        const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(409).send("User with this email already exists.");
        }

        const [role] = await pool.query("SELECT role_id FROM roles WHERE role_name = ?", [role_name]);
        if (role.length === 0) {
            return res.status(400).send("Invalid role specified.");
        }
        const role_id = role[0].role_id;

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (first_name, last_name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword, role_id]
        );

        res.status(201).send("User registered successfully.");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error during registration.");
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const [users] = await pool.query("SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.email = ?", [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials.");
        }

        const accessToken = jwt.sign(
            { user_id: user.user_id, role_name: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server error during login.");
    }
};


