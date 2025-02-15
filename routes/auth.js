const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');

const router = express.Router();

// User Signup - Adds user to waiting list
router.post('/signup', checkJwt, async (req, res) => {
    const { name, email, profile_picture } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, role, status, profile_picture) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, 'pending', 'waiting', profile_picture]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// View Waiting Users (Teachers & Admins Only)
router.get('/waiting-list', checkJwt, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE status = $1', ['waiting']);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Approve User (Admin or Teacher)
router.put('/approve/:userId', checkJwt, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;  // Role must be 'student' or 'teacher'

    try {
        await pool.query('UPDATE users SET role = $1, status = $2 WHERE id = $3', [role, 'approved', userId]);
        res.json({ message: 'User approved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
