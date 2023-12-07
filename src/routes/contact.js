const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route for creating a new contact submission
router.post('/contact', contactController.createContactSubmission);

module.exports = router;