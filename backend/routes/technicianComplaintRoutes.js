const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get Cities
router.get("/cities", async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT city FROM locations ORDER BY city ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching cities:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Get Addresses by City
router.get("/addresses/:city", async (req, res) => {
    const { city } = req.params;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const result = await pool.query(
            "SELECT DISTINCT address FROM locations WHERE city = $1 ORDER BY address ASC",
            [city]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching addresses:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Get Machines by Address
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
// Get only Refiller-related issues
router.get("/technician_complaint_issues", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, issue_description FROM issues WHERE role_id = 3"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching technician complaint issues:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});


// Technician submits a complaint
router.post("/technician_submit_complaint", async (req, res) => {
    const { technician_id, machine_id, issue_id } = req.body;

    if (!technician_id || !machine_id || !issue_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const assigned_date = new Date();
    const due_date = new Date(assigned_date);
    due_date.setHours(due_date.getHours() + 48); // Due date set 48 hours later

    try {
        // Validate technician role
        const technicianCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND role_id = 2",
            [technician_id]
        );
        if (technicianCheck.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized technician ID" });
        }

        // Get assigned Refiller from the machines table
        const machineResult = await pool.query(
            "SELECT refiller_id FROM machines WHERE id = $1",
            [machine_id]
        );

        if (machineResult.rows.length === 0 || !machineResult.rows[0].refiller_id) {
            return res.status(404).json({ error: "No assigned Refiller for this machine" });
        }

        const assigned_to = machineResult.rows[0].refiller_id;

        // Insert complaint into the database
        const result = await pool.query(
            `INSERT INTO complaints (reported_by, machine_id, issue_id, assigned_to, assigned_date, due_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id`,
            [technician_id, machine_id, issue_id, assigned_to, assigned_date, due_date]
        );

        res.json({ message: "Complaint submitted successfully!", complaintId: result.rows[0].id });
    } catch (err) {
        console.error("Error submitting complaint:", err.stack);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;
