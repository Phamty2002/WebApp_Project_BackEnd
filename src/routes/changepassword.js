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

/**
 * @swagger
 * /api/changepassword/getPasswordToken:
 *   post:
 *     summary: Request password reset token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Password reset email sent successfully.
 *       400:
 *         description: Bad Request - Email is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Email is required.
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
 *         description: Internal server error - Error updating user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Error updating user data.
 */
router.post('/getPasswordToken', ChangePasswordController.requestPasswordReset);

/**
 * @swagger
 * /api/changepassword/reset-password:
 *   post:
 *     summary: Reset user password using a reset token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: The reset token received by the user via email.
 *                 example: "1234567890abcdef"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newpassword456"
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the new password.
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Password reset successful.
 *       400:
 *         description: Bad Request - resetToken, newPassword, and confirmPassword are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: resetToken, newPassword, and confirmPassword are required.
 *       404:
 *         description: User not found or Invalid reset token or expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: User not found or Invalid reset token or expired.
 *       500:
 *         description: Internal server error - Error resetting password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Error resetting password.
 */
router.post('/reset-password', ChangePasswordController.resetPassword);

module.exports = router;
