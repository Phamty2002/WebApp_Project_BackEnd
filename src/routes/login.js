const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const swaggerSpec = require('../swagger');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the user.
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: John Doe
 *         password:
 *           type: string
 *           description: The user's password (should be stored securely, not exposed in responses).
 *           example: toitenty
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *           example: john.doe@example.com
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: example_user
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Login successful
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Invalid credentials.
 *       '500':
 *         description: Error checking credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Error checking credentials.
 */
router.post('/login', loginController.loginUser);

module.exports = router;
