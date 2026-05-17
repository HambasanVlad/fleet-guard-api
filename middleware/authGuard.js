const jwt = require('jsonwebtoken');
const SECRET_KEY = 'fleet_guard_super_secret'; // Must match the secret in authRoutes.js

const verifyToken = (req, res, next) => {
  // Grab the token from the header (it looks like "Bearer eyJhbGciOi...")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token is real and hasn't expired
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Attach the user's role and ID to the request
    next(); // Let them pass to the actual route
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;