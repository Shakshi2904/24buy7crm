const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/machines", async (req, res) => {
    try {
        // Join the machines table with users (twice) for technician and refiller names, and locations for location details
        const result = await pool.query(`
            SELECT 
                m.id AS machine_id, 
                m.location_id, 
                m.status, 
                m.last_service_date, 
                m.next_service_due, 
                t.name AS technician_name, 
                r.name AS refiller_name,
                l.location_name
            FROM machines m
            LEFT JOIN users t ON m.technician_id = t.id  -- Join for technician
            LEFT JOIN users r ON m.refiller_id = r.id    -- Join for refiller
            LEFT JOIN locations l ON m.location_id = l.id -- Join for location name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching machines:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
