const express = require('express');
const router = express.Router();
const ChangePasswordController = require('../controllers/ChangePasswordController');
const swaggerSpec = require('../swagger');


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication and password management.
 */

/**
 * @swagger
 * /api/changepassword/password:
 *   post:
 *     summary: Change user password.
 *     tags: [Authentication]
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
 *               oldPassword:
 *                 type: string
 *                 description: The old password of the user.
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Password updated successfully.
 *       401:
 *         description: Unauthorized - Old password is incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Old password is incorrect.
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
 *         description: Internal server error - Error updating password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Error updating password.
 */

router.post('/password', ChangePasswordController.changePassword);
module.exports = router;