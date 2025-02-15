// routes/attendance.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection

// Fetch all attendance records
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM attendance');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Fetch attendance by student ID
router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM attendance WHERE student_id = $1', [studentId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a new attendance record
router.post('/', async (req, res) => {
    const { student_id, date, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, $3) RETURNING *',
            [student_id, date, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update an attendance record
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE attendance SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete an attendance record
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM attendance WHERE id = $1 RETURNING *', [id]);
        res.json({ message: 'Attendance record deleted', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
