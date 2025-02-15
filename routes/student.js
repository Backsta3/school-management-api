const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// View Attendance (Students Only)
router.get('/attendance', checkJwt, roleCheck('student'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM attendance WHERE student_id = $1', [req.user.sub]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// View Results (Students Only)
router.get('/results', checkJwt, roleCheck('student'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM results WHERE student_id = $1', [req.user.sub]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
