const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Fetch pending complaints assigned to a technician
router.get("/technician_pending_tasks/:id", async (req, res) => {
    try {
        const technicianId = req.params.id;
        console.log("Fetching pending complaints for technician:", technicianId);

        const result = await pool.query(
            `SELECT c.id AS complaint_id, 
                    c.machine_id,
                    i.issue_description, 
                    c.status, 
                    TO_CHAR(c.assigned_date, 'YYYY-MM-DD') AS assigned_date, 
                    TO_CHAR(c.due_date, 'YYYY-MM-DD') AS due_date, 
                    u.name AS technician_name
             FROM complaints c
             JOIN users u ON c.assigned_to = u.id
             JOIN issues i ON c.issue_id = i.id  -- ✅ Join with issues table
             WHERE c.assigned_to = $1 
               AND c.status = 'pending'`,
            [technicianId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching technician complaints:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// ✅ Technician updates task status to "completed"
router.patch("/technician_update_task_status/:complaintId", async (req, res) => {
    try {
        const { complaintId } = req.params;
        console.log(`Updating status for complaint ID: ${complaintId}`);

        // ✅ Check if the complaint exists and is assigned to a technician
        const checkComplaint = await pool.query(
            `SELECT * FROM complaints WHERE id = $1 AND assigned_to IS NOT NULL`,
            [complaintId]
        );

        if (checkComplaint.rowCount === 0) {
            console.log("Complaint not found or not assigned");
            return res.status(404).json({ message: "Complaint not found or not assigned" });
        }

        // ✅ Update status to "completed"
        const result = await pool.query(
            `UPDATE complaints 
             SET status = 'completed', actual_completion_date = NOW() 
             WHERE id = $1 
             RETURNING *`,
            [complaintId]
        );

        res.json({ message: "Task marked as completed", updatedComplaint: result.rows[0] });
    } catch (err) {
        console.error("Error updating task status:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

module.exports = router;
