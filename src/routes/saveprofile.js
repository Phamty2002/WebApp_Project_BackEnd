// routes/saveprofile.js
const express = require('express');
const router = express.Router();
const saveprofileController = require('../controllers/saveprofileController');

/**
 * @swagger
 * /profile/{id}:
 *   get:
 *     summary: Retrieve a user profile by ID.
 *     tags: [Profile]
 *     description: Fetches a user's profile information based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve the profile.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved the user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the user.
 *                 username:
 *                   type: string
 *                   description: Username of the user.
 *                 phone_number:
 *                   type: string
 *                   description: Phone number of the user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email address of the user.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Server error occurred while retrieving the user profile.
 */

// Get profile by ID
router.get('/:id', saveprofileController.getProfileByID);

module.exports = router;
