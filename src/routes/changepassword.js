const express = require('express');
const router = express.Router();
const ChangePasswordController = require('../controllers/ChangePasswordController');

router.post('/password', ChangePasswordController.changePassword);
module.exports = router;