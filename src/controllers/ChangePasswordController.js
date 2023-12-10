const bcrypt = require('bcrypt');
const db = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

const sendResetEmail = async (email, resetToken) => {
    try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Here is your reset token:</p>
                   <p><b>${resetToken}</b></p>
                   <p>If you did not request this, please ignore this email.</p>`
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

exports.requestPasswordReset = async (req, res) => { 
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: 'Email is required' });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set the expiration time (e.g., 30 minutes)
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 30);

    // Update the user's record with the reset token and expiration time
    const sql = 'UPDATE users SET password_reset_code = ?, password_reset_expires = ? WHERE email = ?';
    
    try {
        const result = await db.query(sql, [resetToken, expireTime, email]); // Use "await" here

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Email not found' });
        }

        // Send the reset email
        await sendResetEmail(email, resetToken); // Use "await" here

        res.send({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating user data' });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;
    if (!resetToken || !newPassword || !confirmPassword) {
        return res.status(400).send({ message: 'resetToken, newPassword, and confirmPassword are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }

    try {
        // Check if the reset token and expiration time are valid
        const sql = 'SELECT * FROM users WHERE password_reset_code = ? AND password_reset_expires > NOW()';
        const user = await db.query(sql, [resetToken]);

        if (user.length === 0) {
            return res.status(404).send({ message: 'Invalid reset token or expired' });
        }

        // Update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // You may need to use a password hashing library
        const updateSql = 'UPDATE users SET password = ?, password_reset_code = NULL, password_reset_expires = NULL WHERE password_reset_code = ?';
        await db.query(updateSql, [hashedPassword, resetToken]);

        res.send({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error resetting password' });
    }
};
