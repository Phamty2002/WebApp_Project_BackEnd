const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API FOR WEBAPP PROJECT',
      version: '1.0.0',
      description: "Website APIs are essential for extending a website's functionality and accessibility. These APIs, including Authentication, Content, Search, Data, Social Media, Payment, Maps, Analytics, Notification, Chat, and IoT, empower developers to enhance user experiences, facilitate secure transactions, and expand a website's reach. Understanding and utilizing these APIs are pivotal for maximizing a website's potential in the digital landscape.",
    },
  },
  // Define the API endpoints in the 'apis' array below.
  apis: ['./src/routes/login.js', './src/routes/signup.js', './src/routes/products.js', './src/routes/profile.js' ]
};// Path to your route files.


const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
