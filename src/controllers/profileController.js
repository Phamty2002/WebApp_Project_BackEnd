// controllers/profileController.js

const db = require('../db');

exports.getProfileByUsername = (req, res) => {
  const username = req.params.username; // Get the username from request parameters

  db.query('SELECT username, email, role FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Error retrieving profile information:', err);
      return res.status(500).json({ message: 'Error retrieving profile information.' });
    }
    if (result.length > 0) {
      const profile = result[0];
      return res.status(200).json(profile);
    } else {
      return res.status(404).json({ message: 'User not found.' });
    }
  });
};

exports.updateProfileByUsername = (req, res) => {
  const username = req.params.username; // Get the username from request parameters
  const { email } = req.body; // Include any other fields you allow to update, except the username

  // Assume validation and sanitization have been done
  const query = 'UPDATE users SET email = ? WHERE username = ?';
  const values = [email, username];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating profile information:', err);
      return res.status(500).json({ message: 'Error updating profile information.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return a message that the profile was updated successfully
    return res.status(200).json({ message: 'Profile updated successfully.' });
  });
};

// New function to list all users
exports.listAllUsers = (req, res) => {
  db.query('SELECT username, email, role FROM users', (err, results) => {
    if (err) {
      console.error('Error retrieving user list:', err);
      return res.status(500).json({ message: 'Error retrieving user list.' });
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: 'No users found.' });
    }
  });
};
