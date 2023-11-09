// routes/products.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Endpoints related to product management operations such as retrieving, creating, updating, and deleting products.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - price
 *         - image_path
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated unique identifier of the product.
 *           example: 1
 *         name:
 *           type: string
 *           description: The commercial name of the product as it will appear in listings and searches.
 *           example: "Ergonomic Chair"
 *         price:
 *           type: number
 *           format: double
 *           description: The retail price of the product. Must be a non-negative number.
 *           example: 299.99
 *         description:
 *           type: string
 *           description: An elaborate description of the product detailing its features, dimensions, warranty, etc.
 *           example: "A comfortable ergonomic chair with lumbar support and adjustable height."
 *         image_path:
 *           type: string
 *           description: The URL path leading to the image of the product for display on the website.
 *           example: "/images/ergonomic-chair.jpg"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieves a comprehensive list of products.
 *     tags: [Products]
 *     description: Fetches a list of all products including their details such as name, price, and image path. Can be used to display all products in a catalog.
 *     responses:
 *       200:
 *         description: An array of product objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error occurred while processing the request.
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieves detailed information about a product using its ID.
 *     tags: [Products]
 *     description: Provides the details of a product including name, price, and description, identified by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the product to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A detailed product object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product with the specified ID was not found in the database.
 *       500:
 *         description: An error occurred on the server while attempting to retrieve the product.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Creates a new product with the provided data.
 *     tags: [Products]
 *     description: Adds a new product to the database with the details specified in the request body. Requires an admin role.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: JSON object containing the product details necessary to create a new product record.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was created successfully and has been added to the database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: The server encountered an error while trying to create the product.
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Updates the details of an existing product identified by its ID.
 *     tags: [Products]
 *     description: Modifies the existing records of a product in the database with the new data provided in the request body. The product is identified using its unique ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: JSON object containing the new product details for update.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product details were updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: No product found corresponding to the ID provided.
 *       500:
 *         description: Server error occurred while attempting to update the product.
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Removes a product from the database by its ID.
 *     tags: [Products]
 *     description: Deletes the product record associated with the given ID. This operation is irreversible.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deletion was successful. Returns a message confirming the deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the successful deletion of the product.
 *                   example: "Product deleted successfully."
 *       404:
 *         description: The product could not be found or has already been deleted.
 *       500:
 *         description: An error occurred on the server while attempting to delete the product.
 */




router.get('/', productsController.getAllProducts);
router.get('/:name', productsController.getProductByName);
router.post('/', productsController.createProduct);
router.put('/update/:name', productsController.updateProductByName);
router.delete('/delete/:name', productsController.deleteProductByName);

module.exports = router;
