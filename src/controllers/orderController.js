// src/controllers/orderController.js

const db = require('../db.js'); // Make sure this path is correct

exports.placeOrder = (req, res) => {
    const { userId, items, addressShipping } = req.body; // Now expecting addressShipping too

    if (!items || items.length === 0) {
        return res.status(400).send('No items specified for the order');
    }

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).send('Error starting transaction');
        }

        // Include addressShipping in the INSERT query
        db.query('INSERT INTO orders (users_id, addressShipping) VALUES (?, ?)', [userId, addressShipping], (error, results) => {
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

exports.updateOrder = (req, res) => {
    const orderId = req.params.id;
    const { status, addressShipping } = req.body; // Add other fields as needed

    let updateQuery = 'UPDATE orders SET ';
    let updateValues = [];

    if (status) {
        updateQuery += 'status = ?, ';
        updateValues.push(status);
    }

    if (addressShipping) {
        updateQuery += 'addressShipping = ?, ';
        updateValues.push(addressShipping);
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    // Only proceed if there are values to update
    if (updateValues.length > 0) {
        updateQuery += ' WHERE id = ?';
        updateValues.push(orderId);

        db.query(updateQuery, updateValues, (error, results) => {
            if (error) {
                return res.status(500).send('Error updating order');
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('Order not found');
            }

            res.send('Order updated successfully');
        });
    } else {
        res.status(400).send('No valid fields provided for update');
    }
};

exports.deleteOrder = (req, res) => {
    const orderId = req.params.id;

    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).send('Error starting transaction');
        }

        // First, delete related order_items
        db.query('DELETE FROM order_items WHERE order_id = ?', [orderId], (error, results) => {
            if (error) {
                return db.rollback(() => {
                    res.status(500).send('Error deleting order items');
                });
            }

            // Next, delete the order
            db.query('DELETE FROM orders WHERE id = ?', [orderId], (error, results) => {
                if (error) {
                    return db.rollback(() => {
                        res.status(500).send('Error deleting order');
                    });
                }

                // Commit the transaction
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Error committing transaction');
                        });
                    }
                    res.send('Order deleted successfully');
                });
            });
        });
    });
};

