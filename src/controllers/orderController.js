// src/controllers/orderController.js

const db = require('../db.js'); // Make sure this path is correct

// Function to get product price by ID
function getProductPrice(productId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT price FROM products WHERE id = ?', [productId], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length === 0) {
                return reject(new Error('Product not found'));
            }
            resolve(results[0].price);
        });
    });
}

exports.placeOrder = (req, res) => {
    const { userId, items, addressShipping } = req.body;
    db.beginTransaction(async (err) => {
        if (err) {
            return res.status(500).send('Error starting transaction');
        }

        try {
            let totalAmount = 0;

            // Calculate total price
            for (const item of items) {
                const price = await getProductPrice(item.productId);
                totalAmount += price * item.quantity;
            }

            // Create order with total amount and addressShipping
            db.query('INSERT INTO orders (users_id, total_amount, addressShipping) VALUES (?, ?, ?)', 
                     [userId, totalAmount, addressShipping], (error, orderResult) => {
                if (error) {
                    return db.rollback(() => {
                        res.status(500).send('Error inserting order');
                    });
                }

                const orderId = orderResult.insertId;

                // Add items to order_items
                items.forEach(item => {
                    db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', 
                             [orderId, item.productId, item.quantity], (error) => {
                        if (error) {
                            return db.rollback(() => {
                                res.status(500).send('Error inserting order items');
                            });
                        }
                    });
                });

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Error committing transaction');
                        });
                    }
                    res.status(201).json({ orderId: orderId, totalAmount: totalAmount });
                });
            });
        } catch (error) {
            db.rollback(() => {
                res.status(500).send('Error processing order');
            });
        }
    });
};

exports.getOrder = (req, res) => {
    const orderId = req.params.id;

    // Query to retrieve order details including user information
    const orderQuery = `
        SELECT o.*, u.username, u.email
        FROM orders o
        JOIN users u ON o.users_id = u.id
        WHERE o.id = ?`;

    db.query(orderQuery, [orderId], (error, orders) => {
        if (error) {
            return res.status(500).send('Error retrieving order with user info');
        }

        if (orders.length === 0) {
            return res.status(404).send('Order not found');
        }

        // Updated query to include product name along with other item details
        const itemsQuery = `
            SELECT oi.order_id, oi.product_id, oi.quantity, p.image_path, p.name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`;

        db.query(itemsQuery, [orderId], (error, items) => {
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
    const { status, addressShipping, paymentStatus } = req.body; 

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

    if (paymentStatus) {
        updateQuery += 'payment_status = ?, '; 
        updateValues.push(paymentStatus);
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

exports.getOrdersByUserId = (req, res) => {
    const userId = req.params.userId;

    // Query to retrieve all orders for a specific user
    const ordersQuery = `
        SELECT o.*, u.username, u.email
        FROM orders o
        JOIN users u ON o.users_id = u.id
        WHERE o.users_id = ?`;

    db.query(ordersQuery, [userId], (error, orders) => {
        if (error) {
            return res.status(500).send('Error retrieving orders');
        }

        if (orders.length === 0) {
            return res.status(404).send('No orders found for this user');
        }

        // Enhanced response to include details of each order's items
        const fullOrderDetails = orders.map((order) => {
            const itemsQuery = `
                SELECT oi.order_id, oi.product_id, oi.quantity, p.image_path, p.name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?`;

            return new Promise((resolve, reject) => {
                db.query(itemsQuery, [order.id], (error, items) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ ...order, items: items });
                    }
                });
            });
        });

        Promise.all(fullOrderDetails)
            .then(results => res.json(results))
            .catch(error => res.status(500).send('Error retrieving order items'));
    });
};