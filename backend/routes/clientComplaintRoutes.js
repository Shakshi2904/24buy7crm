const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get unique complaint issues (Dropdown options)
router.get("/client_complaint_issues", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, issue_description, role_id FROM issues");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching issues:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get("/client_addresses/:location_id", async (req, res) => {
    const { location_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT id, address FROM locations WHERE id = $1",
            [location_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching addresses:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});

// Get all locations
router.get("/client_locations", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, location_name FROM locations");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching locations:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});
router.get("/client_machines/:address_id", async (req, res) => {
    const { address_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT id FROM machines WHERE location_id = $1",
            [address_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching machines:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});


// Submit a new complaint
router.post("/client_submit_complaint", async (req, res) => {
    const { client_id, machine_id, issue_id } = req.body;

    if (!client_id || !machine_id || !issue_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const assigned_date = new Date();
    const due_date = new Date(assigned_date);
    due_date.setHours(due_date.getHours() + 48); // Due date set 48 hours later

    try {
        // Validate client role
        const clientCheck = await pool.query("SELECT id FROM users WHERE id = $1 AND role_id = 4", [client_id]);
        if (clientCheck.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized client ID" });
        }

        // Get role_id responsible for the issue
        const issueResult = await pool.query("SELECT role_id FROM issues WHERE id = $1", [issue_id]);
        if (issueResult.rows.length === 0) {
            return res.status(404).json({ error: "Issue not found" });
        }
        const { role_id } = issueResult.rows[0];

        // Get assigned user (Technician or Refiller) from the `machines` table
        let assignedColumn = role_id === 2 ? "technician_id" : "refiller_id";
        const machineResult = await pool.query(
            `SELECT ${assignedColumn} as assigned_to FROM machines WHERE id = $1`, 
            [machine_id]
        );

        if (machineResult.rows.length === 0 || !machineResult.rows[0].assigned_to) {
            return res.status(404).json({ error: "No assigned person for this machine" });
        }

        const assigned_to = machineResult.rows[0].assigned_to;

        // Insert complaint into the database
        const result = await pool.query(
            `INSERT INTO complaints (reported_by, machine_id, issue_id, assigned_to, assigned_date, due_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id`,
            [client_id, machine_id, issue_id, assigned_to, assigned_date, due_date]
        );

        res.json({ message: "Complaint submitted successfully!", complaintId: result.rows[0].id });
    } catch (err) {
        console.error("Error submitting complaint:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;
