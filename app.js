// app.js
const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
const studentsRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const eventsRoutes = require('./routes/events');
const financeRoutes = require('./routes/finance');
const profileRoutes = require('./routes/profile');
const checkJwt = require('./middleware/auth');

// dotenv.config();  // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // To parse incoming JSON data

// Public Routes
app.use('/login', (req, res) => {
    res.send('Login endpoint - Use Auth0 to log in');
});

// Protected Routes
// Apply Auth0 JWT authentication middleware to protected routes
app.use('/students', checkJwt, studentsRoutes);
app.use('/attendance', checkJwt, attendanceRoutes);
app.use('/events', checkJwt, eventsRoutes);
app.use('/finance', checkJwt, financeRoutes);
app.use('/profile', checkJwt, profileRoutes);  // Profile route protected by JWT

// Default Route (404 Not Found)
app.use('*', (req, res) => {
    res.status(404).send('Endpoint not found');
});

// Server Port
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
