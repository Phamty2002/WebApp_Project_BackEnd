// controllers/emailController.js

const nodemailer = require('nodemailer');
const db = require('../db')
require('dotenv').config();

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email service
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Function to handle saving contact submissions and sending an email
  exports.createContactSubmission = (req, res) => {
    const { name, email, phone_number, message } = req.body;
  
    const query = `
      INSERT INTO contact_submissions (name, email, phone_number, message)
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(query, [name, email, phone_number, message], (error, results) => {
      if (error) {
        console.error('Error occurred while inserting contact submission:', error);
        return res.status(500).send('An error occurred while submitting your contact form.');
      }
  
      // After inserting the data into the database, send an email notification
      const mailOptions = {
        from: process.env.EMAIL_USERNAME, // Sender address
        to: process.env.RECEIVER_EMAIL, // List of receivers, can be comma separated
        subject: `New Contact Form Submission from ${name}`, // Subject line
        text: `You have received a new contact form submission. Here are the details:
               Name: ${name}
               Email: ${email}
               Phone Number: ${phone_number}
               Message: ${message}`, 
        
      };
  
      transporter.sendMail(mailOptions, (sendError, info) => {
        if (sendError) {
          console.error('Error sending email:', sendError);
          return res.status(500).send('Contact form submitted, but an error occurred while sending the email.');
        }
        console.log('Email sent: ' + info.response);
        // Respond to the client after email is sent
        res.status(201).send({ message: 'Contact form submitted successfully, email sent.', id: results.insertId });
      });
    });
  };

  exports.getAllContacts = (req, res) => {
    const query = 'SELECT * FROM contact_submissions ORDER BY submitted_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching contacts' });
        }
        res.json({ contacts: results });
    });
};

exports.getContactById = (req, res) => {
    const query = 'SELECT * FROM contact_submissions WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching contact' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json({ contact: results[0] });
    });
};