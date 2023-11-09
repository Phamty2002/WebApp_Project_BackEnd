const express = require('express');
const swaggerUi = require('swagger-ui-express');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const productsRoutes = require('./routes/products');
const profileRoutes = require('./routes/profile');
const cors = require('cors');
const app = express();
const { verifyToken } = require('./middleware/authMiddleware'); // Import the verifyToken middleware
require('dotenv').config();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger')));

// Use built-in middleware for json
app.use(express.json());

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
