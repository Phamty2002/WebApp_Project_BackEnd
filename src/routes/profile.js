// routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');


/**
 * @openapi
 * tags:
 *   name: User Management
 *   description: Operations about user profiles.
 *
 * /profile/{username}:
 *   get:
 *     summary: Retrieve a single user profile by username.
 *     description: Retrieve a user profile by their unique username.
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Unique username of the user.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A single user profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 *   put:
 *     summary: Update a user's profile by username.
 *     description: Update the email or other details of a user profile by their unique username.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Unique username of the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's new email.
 *     responses:
 *       '200':
 *         description: Profile updated successfully.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 *
 * /profile/:
 *   get:
 *     summary: List all user profiles.
 *     description: Retrieve a list of all user profiles in the system.
 *     tags: [Profile]
 *     responses:
 *       '200':
 *         description: A list of user profiles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       '404':
 *         description: No users found.
 *       '500':
 *         description: Internal server error.
 *
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         username:
 *           type: string
 *           description: The user's unique username.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         role:
 *           type: string
 *           description: The user's role within the system.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


// Get profile by username (you can add verifyToken if needed)
router.get('/:username', profileController.getProfileByUsername);

// Update profile by username (this route should be protected)
router.put('/:username', verifyToken, profileController.updateProfileByUsername);

// List all users
router.get('/', profileController.listAllUsers);

module.exports = router;
