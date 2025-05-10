const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Fetch new tasks assigned to a technician
router.get("/technician_new_tasks/:id", async (req, res) => {
    try {
        const technicianId = parseInt(req.params.id);
        console.log("Fetching tasks for technician:", technicianId);

        const result = await pool.query(
            `SELECT c.id AS complaint_id, 
                    i.issue_description,  -- Fetch issue from issues table
                    c.machine_id,
                    c.status,
                    c.assigned_date,
                    c.due_date,
                    u.name AS technician_name, 
                    u.email
             FROM complaints c
             JOIN users u ON c.assigned_to = u.id
             JOIN issues i ON c.issue_id = i.id  -- Fetch issue description
             WHERE c.assigned_to = $1 
               AND c.status = 'pending' 
               AND c.due_date IS NULL`,
            [technicianId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching technician complaints:", err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Assign due date to a technician's complaint
router.put("/technician_new_tasks/:id/duedateassign", async (req, res) => {
    try {
        const complaintId = parseInt(req.params.id);
        const { due_date } = req.body;

        if (!due_date) {
            return res.status(400).json({ error: "Due date is required" });
        }

        const result = await pool.query(
            `UPDATE complaints 
             SET due_date = $1 
             WHERE id = $2 
             RETURNING due_date`,
            [due_date, complaintId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        res.json({ message: "Due date assigned successfully", due_date: result.rows[0].due_date });
    } catch (err) {
        console.error("Error updating due date:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
