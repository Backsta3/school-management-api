// routes/attendance.js
const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// ✅ Teacher - Mark Attendance
router.post('/mark', checkJwt, roleCheck('teacher'), async (req, res) => {
    const { student_id, date, status } = req.body;

    try {
        await pool.query(
            'INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, $3)',
            [student_id, date, status]
        );
        res.status(201).json({ message: 'Attendance marked successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Student - View Attendance
router.get('/view/:studentId', checkJwt, roleCheck('student'), async (req, res) => {
    const { studentId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM attendance WHERE student_id = $1', [studentId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
