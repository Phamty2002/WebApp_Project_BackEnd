// src/controllers/paymentController.js

const db = require('../db.js'); // Adjust path as needed

exports.processPayment = (req, res) => {
    const { orderId, amount, paymentMethod } = req.body;

    // Validate the paymentMethod
    const validPaymentMethods = ['Credit Card', 'Cash', 'Internet Banking'];
    if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method' });
    }

    // First, verify that the amount matches the total_amount for the order
    db.query('SELECT total_amount FROM orders WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error fetching order details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderTotal = parseFloat(results[0].total_amount);
        if (parseFloat(amount) !== orderTotal) {
            return res.status(400).json({ error: 'The amount does not match the order total' });
        }

        // Payment processing logic goes here
        // Assuming the payment is successful

        // Update the payment status and payment method in the orders table
        const updatePaymentAndStatusQuery = `
         UPDATE orders 
         SET payment_status = ?, payment_method = ?, status = 'Delivering' 
          WHERE id = ?`;

           db.query(updatePaymentAndStatusQuery, ['Paid', paymentMethod, orderId], (updateError) => {
            if (updateError) {
              return res.status(500).json({ error: 'Error updating order after payment' });
             }

              res.json({ message: 'Payment processed and order status updated to Delivering' });
           });
    });
};



exports.processRefund = (req, res) => {
    const { orderId } = req.body;

    // Process the refund logic here, possibly interacting with a payment gateway

    // Update the order to reflect the refund
    db.query('UPDATE orders SET payment_status = ? WHERE id = ?', ['Refunded', orderId], (error, results) => {
        if (error) {
            return res.status(500).send('Error processing refund');
        }

        res.status(200).send('Refund processed successfully');
    });
};
