const bcrypt = require("bcryptjs");
const pool = require("./db");

const migratePasswords = async () => {
    try {
        const users = await pool.query("SELECT id, password FROM users");

        for (let user of users.rows) {
            const { id, password } = user;

            // Check if the password is already hashed
            if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {
                console.log(`User ${id} already has a hashed password.`);
                continue;
            }

            // Hash the plain text password
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, id]);

            console.log(`Updated password for user ${id}`);
        }

        console.log("Password migration completed successfully.");
        process.exit();
    } catch (err) {
        console.error("Error migrating passwords:", err);
        process.exit(1);
    }
};

// Run the migration
migratePasswords();
