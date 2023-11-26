const PDFDocument = require('pdfkit');
const fs = require('fs');

function createInvoicePdf(invoiceData, path) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);

    // Set page size and margins (adjust as needed)
    doc.page.width = 612; // 8.5 inches at 72 dpi
    doc.page.height = 792; // 11 inches at 72 dpi
    doc.page.margins = { top: 50, bottom: 50, left: 50, right: 50 };

    // Add content to the PDF here using the invoiceData
    doc.font('Helvetica-Bold').fontSize(25).text('Invoice', { align: 'center' });

    // Company name in the upper-right corner
    doc.font('Helvetica-Bold').fontSize(14).text('Rose Petal Bistro LLC', doc.page.width - doc.page.margins.right - 200, doc.page.margins.top, { align: 'right' });

    // Order ID
    doc.font('Helvetica').fontSize(14).text(`Order ID: ${invoiceData.orderDetails.id}`, doc.page.margins.left, 80);

    // User information
    doc.font('Helvetica').fontSize(14).text(`User: ${invoiceData.userDetails.username}`, doc.page.margins.left, 100);
    doc.fontSize(14).text(`Email: ${invoiceData.userDetails.email}`, doc.page.margins.left, 120);
    doc.fontSize(14).text(`Phone: ${invoiceData.userDetails.phone_number}`, doc.page.margins.left, 140);

    // Order information
    doc.fontSize(14).text(`Order Date: ${invoiceData.orderDetails.order_date}`, doc.page.margins.left, 180);
    doc.fontSize(14).text(`Shipping Address: ${invoiceData.orderDetails.addressShipping}`, doc.page.margins.left, 220);
    doc.fontSize(14).text(`Payment Status: ${invoiceData.orderDetails.payment_status}`, doc.page.margins.left, 240);
    doc.fontSize(14).text(`Payment Method: ${invoiceData.orderDetails.payment_method}`, doc.page.margins.left, 260);

    // Table header
    doc.moveTo(100, 300).lineTo(500, 300).stroke();
    doc.fontSize(12);
    doc.text('Item', 100, 305);
    doc.text('Quantity', 250, 305);
    doc.text('Price', 350, 305);
    doc.text('Total', 450, 305);

    // Table content
    let y = 320;
    invoiceData.itemsDetails.forEach(item => {
      doc.text(item.name, 100, y);
      doc.text(item.quantity.toString(), 250, y);
      doc.text(`$${item.price.toFixed(2)}`, 350, y);
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 450, y);
      y += 20;
    });

    // Invoice total
    doc.fontSize(14).text(`Subtotal: $${invoiceData.invoiceSubtotal.toFixed(2)}`, 350, y + 20);
    doc.text(`Tax: $${invoiceData.tax.toFixed(2)}`, 350, y + 40);
    doc.text(`Total: $${invoiceData.invoiceTotal.toFixed(2)}`, 350, y + 60);

    // Finalize PDF file
    doc.end();

    writeStream.on('finish', () => {
      resolve(path);
    });

    writeStream.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = {
  createPdf: createInvoicePdf
};
