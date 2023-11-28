const db = require('../db'); // Your database connection file
const pdfGenerator = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');

exports.getInvoiceRecord = async (req, res) => {
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


exports.deleteInvoice = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        // Attempt to delete the invoice PDF file based on the orderId
        const invoiceFilename = `invoice-${orderId}.pdf`;
        const invoicePath = path.join(__dirname, '..', 'invoices', invoiceFilename);

        if (fs.existsSync(invoicePath)) {
            fs.unlinkSync(invoicePath); // Delete the file
            // Proceed to delete the invoice record from the database
            const deleteQuery = 'DELETE FROM invoices WHERE order_id = ?';
            await db.query(deleteQuery, [orderId]);
            res.send('Invoice deleted successfully');
        } else {
            res.status(404).send('Invoice file not found');
        }
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};
