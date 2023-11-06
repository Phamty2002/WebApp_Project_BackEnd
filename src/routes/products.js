// routes/products.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products management API endpoints.
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
 *           description: Unique identifier for the product.
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: "Sample Product"
 *         price:
 *           type: number
 *           format: double
 *           description: The price of the product.
 *           example: 29.99
 *         description:
 *           type: string
 *           description: A brief description of the product.
 *           example: "This is a sample product description."
 *         image_path:
 *           type: string
 *           description: The relative URL path to the product's image.
 *           example: "/images/sample-product.jpg"
 *     
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieves a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: An array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieves a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detailed product information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Creates a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       description: Product data for the new product.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{name}:
 *   put:
 *     summary: Updates an existing product by name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Name of the product to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Product data to update the product with.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{name}:
 *   delete:
 *     summary: Deletes an existing product by name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Name of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation of the deletion.
 *                   example: "Product deleted successfully."
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */



router.get('/', productsController.getAllProducts);
router.get('/:name', productsController.getProductByName);
router.post('/', productsController.createProduct);
router.put('/update/:name', productsController.updateProductByName);
router.delete('/delete/:name', productsController.deleteProductByName);

module.exports = router;
