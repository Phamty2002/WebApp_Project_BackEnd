// controllers/signupController.js

const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the number of salt rounds as needed

exports.registerNewUser = (req, res) => {
    const { username, password, email } = req.body;

    // Validate input parameters here if needed

    // Check if username or email already exists
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, rows) => {
      if (err) {
        // More detailed error handling could be implemented here
        console.error('Error checking username and email availability:', err);
        res.status(500).json({ message: 'Error registering the user.' });
        return;
      }

      // Check if username or email is already taken
      if (rows.length > 0) {
        const userExists = rows.some(u => u.username === username);
        const emailExists = rows.some(u => u.email === email);
        if (userExists) {
          res.status(409).json({ message: 'Username already in use.' });
          return;
        }
        if (emailExists) {
          res.status(409).json({ message: 'Email already in use.' });
          return;
        }
      }

      // Hash the password before saving it to the database
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error('Error hashing the password:', err);
          res.status(500).json({ message: 'Error registering the user.' });
          return;
        }

        // Save the new user with the hashed password
        db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hash, email], (err, result) => {
          if (err) {
            // Handle specific errors like duplicate entry here
            console.error('Error registering the user:', err);
            res.status(500).json({ message: 'Error registering the user.' });
            return;
          }
          res.status(201).json({ message: 'User successfully registered.', userId: result.insertId });
        });
      });
    });
};
