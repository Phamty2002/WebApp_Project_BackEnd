const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

/**
 * @swagger
 * tags:
 *   - name: Contacts
 *     description: Endpoints for managing contact form submissions and retrieving contact information.
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Create a new contact form submission.
 *     tags: [Contacts]
 *     description: Saves a new contact form submission to the database and sends a notification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_number
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person submitting the contact form.
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the person submitting the contact form.
 *                 example: jane.doe@example.com
 *               phone_number:
 *                 type: string
 *                 description: Phone number of the person submitting the contact form.
 *                 example: 123-456-7890
 *               message:
 *                 type: string
 *                 description: The message content from the contact form.
 *                 example: I would like more information about your services.
 *     responses:
 *       '201':
 *         description: Contact form submission was successful.
 *       '500':
 *         description: Server error occurred while processing the contact form.
 */

/**
 * @swagger
 * /contactlist:
 *   get:
 *     summary: Retrieve a list of all contact submissions.
 *     tags: [Contacts]
 *     description: Fetches all contact form submissions from the database.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all contacts.
 *       '500':
 *         description: Server error occurred while fetching contacts.
 */

/**
 * @swagger
 * /contactbyId/{id}:
 *   get:
 *     summary: Retrieve a specific contact submission by ID.
 *     tags: [Contacts]
 *     description: Fetches a specific contact form submission based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the contact to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved the contact.
 *       '404':
 *         description: Contact not found.
 *       '500':
 *         description: Server error occurred while fetching the contact.
 */

router.post('/contact', contactController.createContactSubmission);
router.get('/contactlist', contactController.getAllContacts);
router.get('/contactbyId/:id', contactController.getContactById);

module.exports = router;
