// routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');


/**
* @openapi
* tags:
*   - name: User Management
*     description: Operations about user profiles.
*
* /profile/{username}:
*   get:
*     summary: Retrieve a single user profile by username.
*     description: Retrieve a user profile by their unique username.
*     tags: [User Management]
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
*     tags: [User Management]
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
*   delete:
*     summary: Delete a user's profile by username.
*     description: Delete a user's profile based on their unique username. This operation cannot be undone.
*     tags: [User Management]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: username
*         required: true
*         description: Unique username of the user to be deleted.
*         schema:
*           type: string
*     responses:
*       '200':
*         description: User deleted successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "User 'username' deleted successfully."
*       '404':
*         description: User not found.
*       '500':
*         description: Error deleting user.
*
* /profile/:
*   get:
*     summary: List all user profiles.
*     description: Retrieve a list of all user profiles in the system.
*     tags: [User Management]
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
*   post:
*     summary: Add a new user to the system.
*     description: Creates a new user with the provided username, email, and password. The password is hashed before being stored.
*     tags: [User Management]
*     requestBody:
*       required: true
*       description: JSON object containing the new user's details.
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - username
*               - email
*               - password
*             properties:
*               username:
*                 type: string
*                 description: The user's desired unique username.
*                 example: newusername
*               email:
*                 type: string
*                 format: email
*                 description: The user's email address for contact and login purposes.
*                 example: user@example.com
*               password:
*                 type: string
*                 description: The user's password, which will be hashed for security.
*                 example: securePassword123
*               role:
*                 type: string
*                 description: The user's role within the application (e.g., user, admin).
*                 example: user
*     responses:
*       '201':
*         description: New user created successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Success message confirming user creation.
*                   example: User created successfully.
*                 userId:
*                   type: integer
*                   description: The ID of the newly created user.
*                   example: 100
*       '400':
*         description: Bad request when input validation fails or user data is incomplete.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Error message explaining the reason for the failure.
*                   example: "Username is required."
*       '409':
*         description: Conflict occurs when username or email is already taken.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Error message explaining the reason for the conflict.
*                   example: "Username already exists."
*       '500':
*         description: Internal server error when the server fails to create the user due to a server-side issue.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Error message indicating an internal server error.
*                   example: "Could not create the user due to an internal server error."
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

//Create a new users
router.post('/', verifyToken, profileController.addNewUser);

//Delete a user by username
router.delete('/:username', profileController.deleteUserByUsername);

module.exports = router;
