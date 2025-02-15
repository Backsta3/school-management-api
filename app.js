// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const checkJwt = require('./middleware/auth'); // Auth0 authentication middleware

// Import Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/auth', authRoutes); // Authentication & Authorization
app.use('/admin', checkJwt, adminRoutes); // Admin Routes (Protected)
app.use('/teacher', checkJwt, teacherRoutes); // Teacher Routes (Protected)
app.use('/student', checkJwt, studentRoutes); // Student Routes (Protected)

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the School Management System API 🚀');
});

// 404 Error Handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
