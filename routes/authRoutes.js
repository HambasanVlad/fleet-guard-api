const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');// Make sure this path points to your new User model

const router = express.Router();

// The "Secret Key" for generating tokens. 
// (In a real company, this is hidden in a .env file, but this is fine for your lab!)
const SECRET_KEY = 'fleet_guard_super_secret'; 

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Hash (scramble) the password before saving
    // The "10" is the "salt rounds" - how complex the scrambling is
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Save the new user to the database
    const newUser = await User.create({ 
      username: username, 
      password: hashedPassword 
    });
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed. Username might already exist." });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Check if the user exists in the database
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // 2. Compare the typed password with the scrambled password in the database
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Incorrect password!" });
    }

    // 3. Generate the JWT (Digital Session Token)
    // We include the user's ID and Role inside the token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' } // Automatically logs out the user after 1 hour of inactivity
    );

    res.json({ message: "Login successful!", token: token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
});

module.exports = router;