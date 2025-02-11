// routes/profile.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const checkJwt = require('../middleware/auth'); // Auth0 JWT validation

// Fetch user profile
router.get('/:userId', checkJwt, async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update user profile
router.put('/:userId', checkJwt, async (req, res) => {
    const { userId } = req.params;
    const { name, email, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
            [name, email, role, userId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
