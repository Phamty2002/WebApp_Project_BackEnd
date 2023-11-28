const express = require('express');
const swaggerUi = require('swagger-ui-express');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const productsRoutes = require('./routes/products');
const orderRoutes = require('./routes/order'); // Add this line
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payment');
const saveprofileRoutes = require('./routes/saveprofile');
const changepasswordRoutes = require('./routes/changepassword');
const updateUserInfoRoutes = require('./routes/updateUserInfo');
const invoiceRoutes = require('./routes/invoice');
const invoice_empRoutes = require('./routes/invoice-emp');





const cors = require('cors');
const app = express();
const path = require('path');
const { verifyToken } = require('./middleware/authMiddleware');
require('dotenv').config();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger')));

app.use(express.json());

// Serve static files from the invoices directory
app.use('/invoices', express.static('src/invoices'));

// CORS configuration
const corsOptions = {
  origin: ['https://web-app-project-front-end.vercel.app', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Configure routes
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/products', verifyToken, productsRoutes); // Protect all product routes
app.use('/api/profile', verifyToken, profileRoutes); // Protect profile routes
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/saveprofile', saveprofileRoutes);
app.use('/api/changepassword', changepasswordRoutes);
app.use('/api/update', updateUserInfoRoutes );
app.use('/api/invoice', invoiceRoutes);
app.use('/api/invoice-emp', invoice_empRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
