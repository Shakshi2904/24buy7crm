const express = require("express");
const { pool } = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const { role, userId } = req.user;
        let query, values = [];

        if (role === 1) {
            query = "SELECT id, name, email FROM users"; // Admin sees all users
        } else {
            query = "SELECT id, name, email FROM users WHERE id = $1";
            values = [userId]; // Regular users see only their own info
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;