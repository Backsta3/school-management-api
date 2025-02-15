// routes/finance.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Fetch all finance records
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM finance');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add new finance record (income/expense)
router.post('/', async (req, res) => {
    const { income, expense, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO finance (income, expense, date) VALUES ($1, $2, $3) RETURNING *',
            [income, expense, date]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update finance record
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { income, expense, date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE finance SET income = $1, expense = $2, date = $3 WHERE id = $4 RETURNING *',
            [income, expense, date, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete finance record
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM finance WHERE id = $1 RETURNING *', [id]);
        res.json({ message: 'Finance record deleted', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
