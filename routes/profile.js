// routes/profile.js
const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');

const router = express.Router();

// ✅ Get User Profile
router.get('/:userId', checkJwt, async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Update User Profile
router.put('/:userId', checkJwt, async (req, res) => {
    const { userId } = req.params;
    const { name, profile_picture } = req.body;

    try {
        await pool.query(
            'UPDATE users SET name = $1, profile_picture = $2 WHERE id = $3',
            [name, profile_picture, userId]
        );
        res.json({ message: 'Profile updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
