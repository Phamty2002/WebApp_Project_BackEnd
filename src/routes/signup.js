// routes/signup.js
const express = require('express');
const { registerNewUser } = require('../controllers/signupController');
const router = express.Router();

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
 * /signup:
 *   post:
 *     summary: Register a new user
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
 *                 description: The username for the new user.
 *                 example: new_user
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: password123
 *               email:
 *                 type: string
 *                 description: The email address for the new user.
 *                 example: user@example.com
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: User successfully registered.
 *                 userId:
 *                   type: integer
 *                   description: The ID of the newly registered user.
 *                   example: 123
 *       '409':
 *         description: Conflict - Username or Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Username already in use.
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Error registering the user.
 */


router.post('/signup', registerNewUser);

module.exports = router;
