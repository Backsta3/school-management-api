const express = require('express');
const pool = require('../db');
const checkJwt = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Approve Students (Teachers Only)
router.put('/approve-student/:userId', checkJwt, roleCheck('teacher'), async (req, res) => {
    const { userId } = req.params;

    try {
        await pool.query('UPDATE users SET role = $1, status = $2 WHERE id = $3', ['student', 'approved', userId]);
        res.json({ message: 'Student approved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Student's Class & Section
router.put('/assign-class/:userId', checkJwt, roleCheck('teacher'), async (req, res) => {
    const { userId } = req.params;
    const { class_name, section } = req.body;

    try {
        await pool.query('UPDATE students SET class = $1, section = $2 WHERE id = $3', [class_name, section, userId]);
        res.json({ message: 'Class assigned successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
