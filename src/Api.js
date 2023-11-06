const express = require('express');
const swaggerSpec = require('./swagger'); // Import your Swagger specification
const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express
const loginRoutes = require('./routes/login'); // Import your auth routes
const signupRoutes = require('./routes/signup');
const productsRoutes = require('./routes/products');
const cors = require('cors');
const app = express();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use built-in middleware for json
app.use(express.json());

// Enable CORS with default options
app.use(cors());

// Configure routes without passing the db object
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/products', productsRoutes);

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Add the app.listen method to start the server
const port = 3001; // Specify the port you want to listen on
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
