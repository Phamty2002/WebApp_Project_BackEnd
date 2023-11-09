//loginController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check the user's username in the database
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
    if (err) {
      console.error('Error checking user credentials:', err);
      return res.status(500).json({ message: 'Error checking credentials.' });
    }
    
    // Check if any user was returned
    if (rows.length === 0) {
      // Avoid revealing that the username does not exist
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    // Compare provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Avoid revealing that the password was incorrect
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    // Create a token with the user role
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      jwtSecret, // Use an environment variable for the secret key
      { expiresIn: '24h' }
    );

    // Authentication successful, return the token and user data
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
};
