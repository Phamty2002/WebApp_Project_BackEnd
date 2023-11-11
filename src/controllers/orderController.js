// src/controllers/orderController.js

const db = require('../db.js'); // Make sure this path is correct

exports.placeOrder = (req, res) => {
    const { userId, items } = req.body; // Expecting items to be an array of { productId, quantity }

    if (!items || items.length === 0) {
        return res.status(400).send('No items specified for the order');
    }

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).send('Error starting transaction');
        }

        db.query('INSERT INTO orders (users_id) VALUES (?)', [userId], (error, results) => {
            if (error) {
                return db.rollback(() => {
                    res.status(500).send('Error inserting order');
                });
            }

            const orderId = results.insertId;
            const orderItems = items.map(item => [orderId, item.productId, item.quantity]);

            db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ?', [orderItems], (error) => {
                if (error) {
                    return db.rollback(() => {
                        res.status(500).send('Error inserting order items');
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Error committing transaction');
                        });
                    }
                    res.status(201).send(`Order placed successfully with ID: ${orderId}`);
                });
            });
        });
    });
};

exports.getOrder = (req, res) => {
    const orderId = req.params.id;

    db.query('SELECT * FROM orders WHERE id = ?', [orderId], (error, orders) => {
        if (error) {
            return res.status(500).send('Error retrieving order');
        }

        if (orders.length === 0) {
            return res.status(404).send('Order not found');
        }

        db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId], (error, items) => {
            if (error) {
                return res.status(500).send('Error retrieving order items');
            }

            res.json({
                order: orders[0],
                items: items
            });
        });
    });
};
