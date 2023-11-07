const express = require('express');
const swaggerSpec = require('./swagger'); // Import your Swagger specification
const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express
const loginRoutes = require('./routes/login'); // Import your auth routes
const signupRoutes = require('./routes/signup');
const productsRoutes = require('./routes/products');
const cors = require('cors');
const app = express();
const path = require('path');


// Serve images as static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use built-in middleware for json
app.use(express.json());

// CORS configuration
// Replace 'https://your-frontend.vercel.app' with your actual frontend application URL
const corsOptions = {
  origin: 'https://web-app-project-front-end.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Enable CORS with the above options
app.use(cors(corsOptions));

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
const port = process.env.PORT || 3001; // Specify the port you want to listen on
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
