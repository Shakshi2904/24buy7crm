const express = require("express");
const pool = require("../db");
const router = express.Router();

// ✅ Get Technician-Related Issues for Refiller
router.get("/refiller_complaint_issues", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, issue_description FROM issues WHERE role_id = 2 ORDER BY issue_description ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching technician issues:", err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Refiller Submits a Complaint Against Technician
router.post("/refiller_submit_complaint", async (req, res) => {
    const { refiller_id, machine_id, issue_id } = req.body;

    if (!refiller_id || !machine_id || !issue_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // 🔹 Fetch the assigned technician from the machine
        const machineResult = await pool.query(
            "SELECT technician_id FROM machines WHERE id = $1",
            [machine_id]
        );

        if (machineResult.rows.length === 0 || !machineResult.rows[0].technician_id) {
            return res.status(404).json({ error: "No technician assigned to this machine" });
        }

        const assigned_to = machineResult.rows[0].technician_id;
        const assigned_date = new Date();
        const due_date = new Date(assigned_date);
        due_date.setHours(due_date.getHours() + 48); // 48-hour deadline

        // 🔹 Insert Complaint
        const result = await pool.query(
            `INSERT INTO complaints (reported_by, machine_id, issue_id, assigned_to, assigned_date, due_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id`,
            [refiller_id, machine_id, issue_id, assigned_to, assigned_date, due_date]
        );

        res.json({ message: "Complaint submitted successfully!", complaintId: result.rows[0].id });
    } catch (err) {
        console.error("Error submitting complaint:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
