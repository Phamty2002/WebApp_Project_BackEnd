// routes/saveprofile.js
const express = require('express');
const router = express.Router();
const saveprofileController = require('../controllers/saveprofileController');



// Get profile by username (you can add verifyToken if needed)
router.get('/:id', saveprofileController.getProfileByID);

module.exports = router;