const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');

// POST request to create a new order
router.post('/', ordersController.createOrder);

// GET request to retrieve a specific order
router.get('/:orderId', ordersController.getOrder);

// PUT request to update a specific order
router.put('/:orderId', ordersController.updateOrder);

// DELETE request to delete a specific order
router.delete('/:orderId', ordersController.deleteOrder);

module.exports = router;