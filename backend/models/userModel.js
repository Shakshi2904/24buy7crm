const pool = require("../db");

// Find a user by email
const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

// Create a new user with hashed password
const createUser = async (name, email, password, role_id) => {
    await pool.query(
        "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)",
        [name, email, password, role_id]
    );
};

// Update a user's password (for migrating to hashed passwords)
const updateUserPassword = async (userId, newPassword) => {
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [newPassword, userId]);
};

module.exports = { findUserByEmail, createUser, updateUserPassword };
