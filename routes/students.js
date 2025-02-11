// routes/students.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Fetch all students
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add a new student
router.post('/', async (req, res) => {
    const { first_name, last_name, gender, grade, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO students (first_name, last_name, gender, grade, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, gender, grade, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update student record
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE students SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
        res.json({ message: 'Student deleted', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
