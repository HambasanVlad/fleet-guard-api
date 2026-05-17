// server.js
const express = require('express');
const cors = require('cors');
const truckRoutes = require('./routes/truckRoutes'); // <-- 1. IMPORTING THE ROUTES
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows the server to read JSON data from requests
app.use('/api/auth', authRoutes);
// Basic health-check endpoint
app.get('/', (req, res) => {
  res.send('FleetGuard Pro API is running perfectly in RAM!');
});

// 2. TELLING THE SERVER TO USE OUR ROUTES
// All requests starting with '/api/trucks' will be handled by truckRoutes
app.use('/api/trucks', truckRoutes); 

// Start the server (Only if this file is run directly, useful for testing later)
if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
}

module.exports = app; // Exporting the app for testing purposes