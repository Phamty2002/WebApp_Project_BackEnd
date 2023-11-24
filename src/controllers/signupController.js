const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.registerNewUser = (req, res) => {
  const { username, password, email, phone_number } = req.body;

  // Validate input parameters here if needed
  if (!username || !password || !email || !phone_number) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if username, email, or phone_number already exists
  db.query(
    'SELECT * FROM users WHERE username = ? OR email = ? OR phone_number = ?',
    [username, email, phone_number],
    (err, rows) => {
      if (err) {
        console.error('Error checking availability:', err);
        return res.status(500).json({ message: 'Error registering the user.' });
      }

      // Check if username, email, or phone_number is already taken
      if (rows.length > 0) {
        const userExists = rows.some(u => u.username === username);
        const emailExists = rows.some(u => u.email === email);
        const phoneExists = rows.some(u => u.phone_number === phone_number);

        if (userExists) {
          return res.status(409).json({ message: 'Username already in use.' });
        }
        if (emailExists) {
          return res.status(409).json({ message: 'Email already in use.' });
        }
        if (phoneExists) {
          return res.status(409).json({ message: 'Phone number already in use.' });
        }
      }

      // Hash the password before saving it to the database
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error('Error hashing the password:', err);
          return res.status(500).json({ message: 'Error registering the user.' });
        }

        // Save the new user with the hashed password
        db.query(
          'INSERT INTO users (username, password, email, phone_number) VALUES (?, ?, ?, ?)',
          [username, hash, email, phone_number],
          (err, result) => {
            if (err) {
              console.error('Error registering the user:', err);
              return res.status(500).json({ message: 'Error registering the user.' });
            }
            res.status(201).json({ message: 'User successfully registered.', userId: result.insertId });
          }
        );
      });
    }
  );
};
