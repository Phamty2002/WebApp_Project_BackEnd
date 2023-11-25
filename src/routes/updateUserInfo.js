const express = require('express');
const router = express.Router();
const UpdateUserInfo = require('../controllers/updateUserInfoController');
const swaggerSpec = require('../swagger');


/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing user information.
 */

/**
 * @swagger
 * /api/update/updateUserInfo:
 *   post:
 *     summary: Update user information.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 1
 *               phone_number:
 *                 type: string
 *                 description: The new phone number of the user.
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The new email address of the user.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: User information updated successfully.
 *       400:
 *         description: Bad request - Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Missing required fields.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: User not found.
 *       500:
 *         description: Internal server error - Error updating user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Error updating user information.
 */

router.post('/updateUserInfo', UpdateUserInfo.updateUserInfo);
module.exports = router;