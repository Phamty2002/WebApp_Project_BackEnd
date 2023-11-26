const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/create', invoiceController.createInvoice);
router.get('/download/:orderId', invoiceController.getInvoice);

module.exports = router;