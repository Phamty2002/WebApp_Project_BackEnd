// routes/signup.js
const express = require('express');
const { registerNewUser } = require('../controllers/signupController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations for user authentication, including sign up, log in, and password management.
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
 *         - password
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: The auto-generated unique identifier of the user.
 *           example: 1
 *         name:
 *           type: string
 *           description: The full name of the user.
 *           example: John Doe
 *         password:
 *           type: string
 *           description: The password for the user's account. It is encrypted before storage and not returned in API responses.
 *           example: Password123!
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user, which is used for login and communication purposes.
 *           example: john.doe@example.com
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user account.
 *     tags: [Authentication]
 *     description: This endpoint is responsible for creating a new user account in the system. It accepts a username, password, and email, and if the username and email are not already taken, it creates a new user record.
 *     requestBody:
 *       required: true
 *       description: Payload containing the new user's credentials.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: Desired username for the new user. Must be unique across the system.
 *                 example: new_user
 *               password:
 *                 type: string
 *                 description: Password for the new user's account. Must meet the system's complexity requirements.
 *                 example: password123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for the new user. Must be unique and will be used for account verification.
 *                 example: user@example.com
 *     responses:
 *       '201':
 *         description: The user has been successfully registered and their user ID is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming successful registration.
 *                   example: User successfully registered.
 *                 userId:
 *                   type: integer
 *                   description: The unique identifier assigned to the newly created user.
 *                   example: 123
 *       '409':
 *         description: The attempt to create a new user has resulted in a conflict, typically due to an existing user with the same username or email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message explaining the nature of the conflict.
 *                   example: Username or email already in use.
 *       '500':
 *         description: An error has occurred on the server side, preventing the completion of the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message detailing the internal error encountered by the server.
 *                   example: Error registering the user.
 */



router.post('/signup', registerNewUser);

module.exports = router;
