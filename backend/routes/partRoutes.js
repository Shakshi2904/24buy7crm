const express = require("express");
const pool = require("../db");
const router = express.Router();

// Fetch all cities (distinct locations)
router.get("/cities", async (req, res) => {
    try {
        const citiesQuery = "SELECT DISTINCT location_name FROM locations ORDER BY location_name ASC";
        const citiesResult = await pool.query(citiesQuery);
        res.json(citiesResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Fetch addresses based on selected city
router.get("/addresses/:city", async (req, res) => {
    const { city } = req.params;
    try {
        const addressesQuery = "SELECT id, address FROM locations WHERE location_name = $1 ORDER BY address ASC";
        const addressesResult = await pool.query(addressesQuery, [city]);
        res.json(addressesResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Fetch machines for a selected address
router.get("/machines/:addressId", async (req, res) => {
    const { addressId } = req.params;

    try {
        const machinesQuery = `
            SELECT m.id AS machine_id, m.status, m.last_service_date, m.next_service_due, 
                   m.refiller_id, refiller.name AS refiller_name, refiller.email AS refiller_email, refiller.phone_number AS refiller_phn,
                   m.buyer_id, buyer.name AS buyer_name, buyer.email AS buyer_email, buyer.phone_number AS buyer_phn
            FROM machines m
            LEFT JOIN users refiller ON m.refiller_id = refiller.id
            LEFT JOIN users buyer ON m.buyer_id = buyer.id
            WHERE m.location_id = $1;
        `;
        const machinesResult = await pool.query(machinesQuery, [addressId]);

        // Fetch parts purchased for each machine
        const machines = await Promise.all(machinesResult.rows.map(async (machine) => {
            const partsQuery = `
                SELECT mp.part_name, mp.price, up.quantity
                FROM machine_parts mp
                JOIN user_purchases up ON up.machine_part_id = mp.id
                WHERE up.machine_id = $1 AND up.user_id = $2
            `;
            const partsResult = await pool.query(partsQuery, [machine.machine_id, machine.refiller_id]);
            machine.parts = partsResult.rows;
            return machine;
        }));

        res.json(machines);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
