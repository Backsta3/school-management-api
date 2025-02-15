// routes/finance.js
const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// ✅ Admin - Add Finance Transaction
router.post('/add', checkJwt, roleCheck('admin'), async (req, res) => {
    const { type, amount, description } = req.body;

    try {
        await pool.query(
            'INSERT INTO finance (type, amount, description) VALUES ($1, $2, $3)',
            [type, amount, description]
        );
        res.status(201).json({ message: 'Transaction added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Admin - View All Transactions
router.get('/transactions', checkJwt, roleCheck('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM finance');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
