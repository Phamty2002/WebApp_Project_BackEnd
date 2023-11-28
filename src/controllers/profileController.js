// controllers/profileController.js

const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; 


exports.addNewUser = (req, res) => {
  // Extract the user details from the request body
  const { username, email, password, role, phone_number } = req.body;

  // Hash the password before saving it to the database
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing the password:', err);
      return res.status(500).json({ message: 'Error registering the user.' });
    } 

    // Construct the SQL query to insert a new user
    const query = 'INSERT INTO users (username, email, password, role, phone_number) VALUES (?, ?, ?, ?, ?)';
    const values = [username, email, hashedPassword, role, phone_number];

    // Execute the query
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error adding new user:', err);
        return res.status(500).json({ message: 'Error adding new user.' });
      }

      // If the user was successfully added, send back a success message
      // You might also want to send back the ID of the new user, but be careful not to expose sensitive information
      return res.status(201).json({ message: 'New user added successfully.' });
    });
  });
};

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
  const { email, phone_number } = req.body; // Include the phone number along with other fields

  // Assume validation and sanitization have been done for both email and phone_number
  const query = 'UPDATE users SET email = ?, phone_number = ? WHERE username = ?';
  const values = [email, phone_number, username];

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

//Delete a user by username
exports.deleteUserByUsername = (req, res) => {
  const { username } = req.params; // assuming you pass the product name as a URL parameter

  db.query('DELETE FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user.' });
    }
    if (result.affectedRows === 0) {
      // If no rows are affected, it means the user was not found
      return res.status(404).json({ message: 'User not found.' });
    }

    // If the user was successfully deleted, send back a success message
    return res.status(200).json({ message: 'User deleted successfully.' });
  });
};
