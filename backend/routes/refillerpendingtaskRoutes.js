const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Fetch pending complaints assigned to a refiller
router.get("/refiller_pending_tasks/:refiller_id", async (req, res) => {
    const { refiller_id } = req.params;

    if (!refiller_id) {
        return res.status(400).json({ error: "Refiller ID is required" });
    }

    try {
        const result = await pool.query(
            `SELECT 
                c.id AS complaint_id, 
                c.machine_id, 
                i.issue_description, 
                c.assigned_date, 
                c.due_date 
            FROM complaints c
            JOIN issues i ON c.issue_id = i.id
            WHERE c.assigned_to = $1 
              AND c.status = 'pending'
              AND i.role_id = 3`,  
            [refiller_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching tasks:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// ✅ Update task status for a refiller
router.patch("/refiller_update_task_status/:complaintId", async (req, res) => {
    try {
        const { complaintId } = req.params;
        console.log(`Updating status for complaint ID: ${complaintId}`);

        const checkComplaint = await pool.query(`SELECT * FROM complaints WHERE id = $1`, [complaintId]);
        if (checkComplaint.rowCount === 0) {
            console.log("Complaint not found");
            return res.status(404).json({ message: "Complaint not found" });
        }

        const result = await pool.query(
            `UPDATE complaints 
             SET status = 'completed', actual_completion_date = NOW() 
             WHERE id = $1 RETURNING *`,
            [complaintId]
        );
        res.json({ message: "Task marked as completed", updatedComplaint: result.rows[0] });
    } catch (err) {
        console.error("Error updating task status:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

module.exports = router;
