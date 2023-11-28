const express = require('express');
const router = express.Router();
const invoice_empController = require('../controllers/invoice-empController');

/**
 * @swagger
 * tags:
 *   name: Invoices For Employee
 *   description: API endpoints for managing customer invoices for employees
 */

/**
 * @swagger
 * /invoices-employee/{orderId}:
 *   get:
 *     summary: Retrieve an invoice record for an employee
 *     tags: [Invoices For Employee]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the invoice to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved the invoice record
 *       '404':
 *         description: Invoice not found
 */

router.get('/:orderId', invoice_empController.getInvoiceRecord);

/**
 * @swagger
 * /invoices-employee/{orderId}:
 *   delete:
 *     summary: Delete an invoice record for an employee
 *     tags: [Invoices For Employee]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the invoice to delete
 *     responses:
 *       '204':
 *         description: Successfully deleted the invoice record
 *       '404':
 *         description: Invoice not found
 */

router.delete('/:orderId', invoice_empController.deleteInvoice);

module.exports = router;
