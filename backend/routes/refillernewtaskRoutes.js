const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Fetch pending complaints assigned to a refiller (role_id = 3)
router.get("/refiller_new_tasks/:id", async (req, res) => {
    try {
        const refillerId = parseInt(req.params.id);

        const result = await pool.query(
            `SELECT c.id AS complaint_id, 
                    c.machine_id,
                    i.issue_description,  -- Fetching issue description from issues table
                    c.status,
                    c.assigned_date,
                    c.due_date,
                    u.name AS refiller_name, 
                    u.email
             FROM complaints c
             JOIN users u ON c.assigned_to = u.id
             JOIN issues i ON c.issue_id = i.id  -- Join to get issue details
             WHERE c.assigned_to = $1 
               AND c.status = 'pending' 
               AND c.due_date IS NULL
               AND i.role_id = 3`,  
            [refillerId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching refiller complaints:", err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Assign due date to a complaint assigned to a refiller
router.put("/refiller_new_tasks/:id/duedateassign", async (req, res) => {
    try {
        const complaintId = parseInt(req.params.id);
        const { due_date } = req.body;

        if (!due_date) {
            return res.status(400).json({ error: "Due date is required" });
        }

        // ✅ Ensure the complaint exists before updating
        const checkComplaint = await pool.query(`SELECT * FROM complaints WHERE id = $1`, [complaintId]);
        if (checkComplaint.rowCount === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        // ✅ Update the due date
        const result = await pool.query(
            `UPDATE complaints 
             SET due_date = $1 
             WHERE id = $2 
             RETURNING due_date`,
            [due_date, complaintId]
        );

        res.json({ message: "Due date assigned successfully", due_date: result.rows[0].due_date });
    } catch (err) {
        console.error("Error updating due date:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
