const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const swaggerSpec = require('../swagger');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Endpoints for managing orders, including creating, retrieving, updating, and deleting orders.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - orderDate
 *         - status
 *         - addressShipping
 *         - totalAmount
 *         - paymentStatus
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the Order.
 *           example: 1
 *         userId:
 *           type: integer
 *           description: Identifier for the User who placed the order.
 *           example: 123
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was placed.
 *           example: "2021-07-21T17:32:28Z"
 *         status:
 *           type: string
 *           description: Current status of the order (e.g., pending, shipped, delivered).
 *           example: pending
 *         addressShipping:
 *           type: string
 *           description: Shipping address for the order.
 *           example: "123 Main St, Anytown, USA"
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Total amount of the order.
 *           example: 150.50
 *         paymentStatus:
 *           type: string
 *           description: Current payment status of the order (e.g., paid, pending, failed).
 *           example: paid
 *         paymentMethod:
 *           type: string
 *           description: Payment method used for the order.
 *           example: "Credit Card"
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Place a new order.
 *     tags: [Orders]
 *     description: Create a new order with specified items, total amount, and shipping address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '201':
 *         description: Order placed successfully.
 *       '400':
 *         description: Bad request due to missing or invalid input.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Retrieve an order by ID.
 *     tags: [Orders]
 *     description: Get details of a specific order.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the order.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Order details retrieved successfully.
 *       '404':
 *         description: Order not found.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Update an existing order.
 *     tags: [Orders]
 *     description: Modify details of an existing order, such as its status, shipping address, and payment status.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the order to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the order (e.g., pending, shipped, delivered).
 *                 example: shipped
 *               addressShipping:
 *                 type: string
 *                 description: New shipping address for the order.
 *                 example: "456 Elm St, OtherTown, USA"
 *               paymentStatus:
 *                 type: string
 *                 description: Current payment status of the order (e.g., paid, pending, failed).
 *                 example: paid
 *     responses:
 *       '200':
 *         description: Order updated successfully.
 *       '400':
 *         description: Bad request due to missing or invalid input.
 *       '404':
 *         description: Order not found.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Delete an order.
 *     tags: [Orders]
 *     description: Permanently remove an order from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the order to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Order deleted successfully.
 *       '404':
 *         description: Order not found.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /order/user/{userId}:
 *   get:
 *     summary: Retrieve orders by user ID.
 *     tags: [Orders]
 *     description: Get a list of orders placed by a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Unique ID of the user.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of orders retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '404':
 *         description: No orders found for this user.
 *       '500':
 *         description: Internal server error.
 */


router.post('/', orderController.placeOrder);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/user/:userId', orderController.getOrdersByUserId);


module.exports = router;
