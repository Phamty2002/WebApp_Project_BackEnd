const bcrypt = require('bcrypt');
const db = require('../db');

// Other existing code...

exports.changePassword = (req, res) => {
    const { id, oldPassword, newPassword } = req.body; // Get user ID, old password, and new password from request body

    // Retrieve hashed password from the database for the given user ID
    db.query('SELECT password FROM users WHERE id = ?', [id], async (err, result) => {
        if (err) {
            console.error('Error retrieving password:', err);
            return res.status(500).json({ message: 'Error retrieving password.' });
        }

        if (result.length > 0) {
            const hashedPassword = result[0].password;

            try {
                // Check if the entered old password matches the stored hashed password
                const isPasswordMatch = await bcrypt.compare(oldPassword, hashedPassword);

                if (isPasswordMatch) {
                    // Hash the new password before updating in the database
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Change 10 to your desired salt rounds

                    // Update the password in the database
                    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, id], (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating password:', updateErr);
                            return res.status(500).json({ message: 'Error updating password.' });
                        }

                        return res.status(200).json({ message: 'Password updated successfully.' });
                    });
                } else {
                    return res.status(401).json({ message: 'Old password is incorrect.' });
                }
            } catch (error) {
                console.error('Error comparing passwords:', error);
                return res.status(500).json({ message: 'Internal server error.' });
            }
        } else {
            return res.status(404).json({ message: 'User not found.' });
        }
    });
};