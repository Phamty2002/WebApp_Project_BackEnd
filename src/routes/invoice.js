const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: API endpoints for managing customer invoices
 */

/**
 * @swagger
 * /api/invoices/create:
 *   post:
 *     summary: Create a new invoice for an order
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId: 
 *                 type: integer
 *                 description: The ID of the order to generate an invoice for
 *                 example: 123
 *     responses:
 *       200:
 *         description: Invoice generated successfully
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the invoice was generated successfully
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Invoice generated  
 *                 invoicePath:
 *                   type: string
 *                   description: The URL to download the generated PDF invoice  
 *                   example: https://example.com/invoices/invoice-123.pdf
 *       400:
 *         description: Bad request. The 'orderId' field is required.  
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 error:  
 *                   type: string
 *                   description: The error message
 *                   example: Order ID is required
 *       500:
 *         description: Internal server error
 */

/** 
 * @swagger
 * /api/invoices/download/{orderId}:
 *   get:
 *     summary: Download invoice PDF by order ID
 *     tags: [Invoices]   
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to download invoice for
 *         schema:
 *           type: integer
 *         example: 123
 *     responses:
 *       200:
 *         description: Invoice PDF downloaded successfully
 *       404:
 *         description: Invoice not found for the order ID  
 *       500:
 *         description: Internal server error
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the invoice.
 *         order_id:
 *           type: integer
 *           description: The reference to the corresponding order's ID.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the invoice was created.
 *         file_path:
 *           type: string
 *           description: The file path to the invoice PDF.
 */



router.post('/create', invoiceController.createInvoice);
router.get('/download/:orderId', invoiceController.getInvoice);

module.exports = router;