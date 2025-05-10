const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Get refiller complaints where status is 'pending'
router.get("/refiller_tasks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id AS complaint_id,
                u.name AS refiller_name,
                u.email AS refiller_email,
                c.machine_id,
                i.issue_description,
                TO_CHAR(c.assigned_date, 'YYYY-MM-DD') AS assigned_date,
                TO_CHAR(c.due_date, 'YYYY-MM-DD') AS due_date  
            FROM complaints c
            JOIN users u ON c.assigned_to = u.id
            JOIN issues i ON c.issue_id = i.id
            WHERE c.status = 'pending'
              AND u.role_id = 3
            ORDER BY c.assigned_date DESC;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching refiller complaints:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
