const db = require('../db'); // Assuming you have a database connection module

exports.updateUserInfo = (req, res) => {
    const { id, phone_number, email } = req.body; // Extracting the data from the request body

    // Validate the input
    if (!id || !phone_number || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update the user information in the database
    const query = 'UPDATE users SET phone_number = ?, email = ? WHERE id = ?';
    const values = [phone_number, email, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating user information:', err);
            return res.status(500).json({ message: 'Error updating user information' });
        }

        // Check if any rows were affected
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User information updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
};
