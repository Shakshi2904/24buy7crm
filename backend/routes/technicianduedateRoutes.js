const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Get technician complaints where status is 'pending'
router.get("/technician_tasks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id AS complaint_id,
                u.name AS technician_name,
                u.email AS technician_email,
                c.machine_id,
                i.issue_description,
                TO_CHAR(c.assigned_date, 'YYYY-MM-DD') AS assigned_date,
                TO_CHAR(c.due_date, 'YYYY-MM-DD') AS due_date  
            FROM complaints c
            JOIN users u ON c.assigned_to = u.id
            JOIN issues i ON c.issue_id = i.id
            WHERE c.status = 'pending'
              AND u.role_id = 2
            ORDER BY c.assigned_date DESC;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching technician complaints:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
