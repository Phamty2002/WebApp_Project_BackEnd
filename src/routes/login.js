const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const swaggerSpec = require('../swagger');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user authentication, including login and other auth-related operations.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the User.
 *           example: 1
 *         name:
 *           type: string
 *           description: Full name of the User.
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the User, needs to be unique.
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: Password for the User account, which is encrypted in the database.
 *           example: Password@123
 *         role:
 *           type: string
 *           description: Role of the User in the system, which determines their level of access.
 *           enum: [admin, customer]
 *           example: admin
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user credentials and return a token upon success.
 *     tags: [Authentication]
 *     description: Validates user login credentials and provides a JWT token for successful authentication.
 *     requestBody:
 *       required: true
 *       description: User login credentials.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Registered username of the user.
 *                 example: example_user
 *               password:
 *                 type: string
 *                 description: Password associated with the username.
 *                 example: password123
 *     responses:
 *       '200':
 *         description: A JSON object containing the JWT token for authorization and a message indicating a successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token to be used for authorization in subsequent requests.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Login successful.
 *       '401':
 *         description: Authentication error due to invalid credentials provided by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the reason for authentication failure.
 *                   example: Invalid username or password.
 *       '500':
 *         description: Server error occurred while attempting to verify the credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining that an error occurred during the login process.
 *                   example: Error occurred while checking credentials.
 */

router.post('/login', loginController.loginUser);

module.exports = router;
