const db = require('../db');

const orderController = {
    // Create a new order
    createOrder: async (req, res) => {
        try {
            const { users_id, status } = req.body;
            const [result] = await db.execute('INSERT INTO orders (users_id, status) VALUES (?, ?)', [users_id, status]);
            res.status(201).json({ message: 'Order created', orderId: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating order', error });
        }
    },

    // Get all orders
    getAllOrders: async (req, res) => {
        try {
            const [orders] = await db.query('SELECT * FROM orders');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    },

    // Get a single order by ID
    getOrderById: async (req, res) => {
        try {
            const orderId = req.params.id;
            const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);

            if (orders.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json(orders[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching order', error });
        }
    },

    // Update an order
    updateOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { users_id, status } = req.body;
            const [result] = await db.execute('UPDATE orders SET users_id = ?, status = ? WHERE id = ?', [users_id, status, orderId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({ message: 'Order updated' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating order', error });
        }
    },

    // Delete an order
    deleteOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [orderId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({ message: 'Order deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting order', error });
        }
    }
};

module.exports = orderController;
