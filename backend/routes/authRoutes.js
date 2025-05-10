const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser, updateUserPassword } = require("../models/userModel");
require("dotenv").config();

const router = express.Router();

// Signup Route - Now Always Stores Hashed Passwords
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        // Check if the email is already registered
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: "Email already registered!" });

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(name, email, hashedPassword, role_id);

        res.json({ message: "Signup successful! Please sign in." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error during signup" });
    }
});

// Signin Route - Handles Both Plain Text and Hashed Passwords
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) return res.status(400).json({ error: "User not found" });

        // Check if the stored password is hashed (bcrypt hashes always start with "$2a$" or similar)
        const isHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$");

        let validPassword;
        if (isHashed) {
            validPassword = await bcrypt.compare(password, user.password); // Compare hashed passwords
        } else {
            validPassword = password === user.password; // Directly compare if stored password is plain text

            if (validPassword) {
                // If the user logged in successfully with a plain text password, hash it and update the database
                const newHashedPassword = await bcrypt.hash(password, 10);
                await updateUserPassword(user.id, newHashedPassword);
                console.log(`Updated password for user ${user.id} to hashed format.`);
            }
        }

        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id, role: user.role_id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.json({ token, userId: user.id, role: user.role_id, message: "Signin successful!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error during signin" });
    }
});

module.exports = router;
