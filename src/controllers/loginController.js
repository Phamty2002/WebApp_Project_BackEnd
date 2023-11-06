// controllers/loginController.js
const bcrypt = require('bcrypt');
const db = require('../db');

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

    // Authentication successful, proceed with token creation or session management
    return res.status(200).json({ message: 'Login successful' });
  });
};
