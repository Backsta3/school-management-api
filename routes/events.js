// routes/events.js
const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// ✅ Admin & Teacher - Create Event
router.post('/add', checkJwt, roleCheck('admin'), async (req, res) => {
    const { title, description, date } = req.body;

    try {
        await pool.query(
            'INSERT INTO events (title, description, date) VALUES ($1, $2, $3)',
            [title, description, date]
        );
        res.status(201).json({ message: 'Event created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Everyone - View Events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events WHERE date >= NOW()');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
