const express = require('express');
const router = express.Router();
const UpdateUserInfo = require('../controllers/updateUserInfoController');

router.post('/updateUserInfo', UpdateUserInfo.updateUserInfo);
module.exports = router;