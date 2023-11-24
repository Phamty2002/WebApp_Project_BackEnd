const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Endpoints for processing payments and refunds.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - orderId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         orderId:
 *           type: integer
 *           description: Unique identifier for the order.
 *           example: 1
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount to be paid.
 *           example: 100.50
 *         paymentMethod:
 *           type: string
 *           description: Method of payment (e.g., Credit Card, Cash, Internet Banking).
 *           example: Credit Card
 */

/**
 * @swagger
 * /payment/process:
 *   post:
 *     summary: Process a payment for an order.
 *     tags: [Payments]
 *     description: Process a payment by matching the amount and updating the order status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '200':
 *         description: Payment processed successfully.
 *       '400':
 *         description: Invalid input or amount does not match order total.
 *       '404':
 *         description: Order not found.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Refund:
 *       type: object
 *       required:
 *         - orderId
 *       properties:
 *         orderId:
 *           type: integer
 *           description: Unique identifier for the order to be refunded.
 *           example: 2
 */

/**
 * @swagger
 * /payment/refund:
 *   post:
 *     summary: Process a refund for an order.
 *     tags: [Payments]
 *     description: Initiate a refund process for a specified order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Refund'
 *     responses:
 *       '200':
 *         description: Refund processed successfully.
 *       '400':
 *         description: Bad request due to missing or invalid input.
 *       '500':
 *         description: Internal server error.
 */

router.post('/process', paymentController.processPayment);
router.post('/refund', paymentController.processRefund);

module.exports = router;
