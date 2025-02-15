// routes/admin.js
const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// ✅ Admin - Get All Waiting Users
router.get('/waiting-users', checkJwt, roleCheck('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE status = $1', ['waiting']);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Admin - Approve Users (Assign Role)
router.put('/approve/:userId', checkJwt, roleCheck('admin'), async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body; // Role should be 'student' or 'teacher'

    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Use 'student' or 'teacher'." });
    }

    try {
        await pool.query('UPDATE users SET role = $1, status = $2 WHERE id = $3', [role, 'approved', userId]);
        res.json({ message: 'User approved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Admin - View All Users
router.get('/all-users', checkJwt, roleCheck('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ Admin - Remove User
router.delete('/remove/:userId', checkJwt, roleCheck('admin'), async (req, res) => {
    const { userId } = req.params;

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ message: 'User removed successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
