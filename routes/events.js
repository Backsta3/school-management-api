// routes/events.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Fetch all events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add new event
router.post('/', async (req, res) => {
    const { name, date, time } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (name, date, time) VALUES ($1, $2, $3) RETURNING *',
            [name, date, time]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update event
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, time } = req.body;
    try {
        const result = await pool.query(
            'UPDATE events SET name = $1, date = $2, time = $3 WHERE id = $4 RETURNING *',
            [name, date, time, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        res.json({ message: 'Event deleted', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
