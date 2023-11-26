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