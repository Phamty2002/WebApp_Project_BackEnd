const db = require('../db'); // Your database connection file
const pdfGenerator = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');

exports.createInvoice = async (req, res) => {
    const orderId = req.body.orderId;
    if (!orderId) {
        return res.status(400).send('Order ID is required');
    }

    try {
        // Fetch order, user, and item details
        const orderDetails = await getOrderDetails(orderId);
        const userDetails = await getUserDetails(orderDetails.users_id);
        const itemsDetails = await getOrderItems(orderId);

        // Calculate invoice details
        const tax = calculateTax(orderDetails.total_amount);
        const invoiceSubtotal = orderDetails.total_amount;
        const invoiceTotal = invoiceSubtotal + tax;

        // Prepare the invoice data
        const invoiceData = {
            orderDetails,
            userDetails,
            itemsDetails,
            invoiceSubtotal,
            tax,
            invoiceTotal,
            generatedDate: new Date()
        };

        // Define a unique path for the invoice PDF
        const invoiceFilename = `invoice-${orderDetails.id}.pdf`;
        const invoicePath = path.join(__dirname, '..', 'invoices', invoiceFilename);

        // Generate PDF
        await pdfGenerator.createPdf(invoiceData, invoicePath);

        // Insert invoice record into the database
        const insertInvoiceQuery = 'INSERT INTO invoices (order_id, file_path) VALUES (?, ?)';
        await db.query(insertInvoiceQuery, [orderDetails.id, invoicePath]);

        // Return the URL to access the PDF
        res.json({ success: true, message: 'Invoice generated', invoicePath: `/invoices/${invoiceFilename}` });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createOrder = async (req, res) => {
    // Extract order details from the request body
    const { order_date, status, addShipping, payment_status, payment_method, users_id } = req.body;

    try {
        // Insert the order details into the database
        const result = await insertOrder(order_date, status, addShipping, payment_status, payment_method, users_id);

        // Fetch the generated order details from the database
        const orderDetails = await getOrderDetails(result.insertId);

        // Generate an invoice for the created order
        const invoicePath = await generateInvoice(orderDetails);

        res.json({ success: true, message: 'Order created', invoicePath });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Insert order details into the database
async function insertOrder(order_date, status, addShipping, payment_status, payment_method, users_id) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO orders (order_date, status, addShipping, payment_status, payment_method, users_id)
            VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [order_date, status, addShipping, payment_status, payment_method, users_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// Fetch the order details along with user information
async function getOrderDetails(orderId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT o.*, u.username, u.email, u.phone_number
            FROM orders o
            JOIN users u ON o.users_id = u.id
            WHERE o.id = ?`;
        db.query(query, [orderId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Order not found'));
            resolve(results[0]);
        });
    });
}

// Fetch the user details
async function getUserDetails(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('User not found'));
            resolve(results[0]);
        });
    });
}

// Fetch the items for a given order
async function getOrderItems(orderId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT oi.*, p.name, p.price
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`;
        db.query(query, [orderId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}


// A simple tax calculation function
function calculateTax(amount) {
    const TAX_RATE = 0.08; 
    return parseFloat((amount * TAX_RATE).toFixed(2));
}

exports.getInvoice = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        // Build the expected file name based on the order ID
        const invoiceFilename = `invoice-${orderId}.pdf`;
        const invoicePath = path.join(__dirname, '..', 'invoices', invoiceFilename);

        // Check if the file exists
        if (fs.existsSync(invoicePath)) {
            // If the file exists, send it to the client
            res.download(invoicePath); 
        } else {
            // If the file does not exist, return a 404 error
            res.status(404).send('Invoice not found');
        }
    } catch (error) {
        console.error('Error retrieving invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};