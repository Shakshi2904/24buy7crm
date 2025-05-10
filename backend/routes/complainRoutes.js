const express = require("express");
const pool = require("../db");  
const router = express.Router();

router.get("/complaints", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM complaints");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;