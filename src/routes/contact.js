const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route for creating a new contact submission
router.post('/contact', contactController.createContactSubmission);
router.get('/contactlist', contactController.getAllContacts);
router.get('/contactbyId/:id', contactController.getContactById);

module.exports = router;