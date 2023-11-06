// controllers/productsController.js

const db = require('../db');

// Get all products
exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

// Get one product by name
exports.getProductByName = (req, res) => {
  const { name } = req.params; // Get the name from the request parameters
  db.query('SELECT * FROM products WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Error fetching product', error: err });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });
};

// Create a new product
exports.createProduct = (req, res) => {
  const { name, price, description, image_path } = req.body;
  db.query(
    'INSERT INTO products (name, price, description, image_path) VALUES (?, ?, ?, ?)',
    [name, price, description, image_path], // Pass image_path as a parameter to the query
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json({ id: results.insertId, ...req.body });
  });
};

// Update a product
exports.updateProductByName = (req, res) => {
  const { name } = req.params; // assuming you pass the product name as a URL parameter
  const { price, description, image_path } = req.body; // assuming these are the only fields you want to update

  if (!price && !description && !image_path) {
    return res.status(400).send("No update information provided.");
  }

  let updateQuery = 'UPDATE products SET ';
  let queryParams = [];
  let updateParts = [];

  // Add price to the update query if it is provided
  if (price !== undefined) {
    updateParts.push('price = ?');
    queryParams.push(price);
  }

  // Add description to the update query if it is provided
  if (description !== undefined) {
    updateParts.push('description = ?');
    queryParams.push(description);
  }

  // Add image_path to the update query if it is provided
  if (image_path !== undefined) {
    updateParts.push('image_path = ?');
    queryParams.push(image_path);
  }

  // Finish the update query
  updateQuery += updateParts.join(', ');
  updateQuery += ' WHERE name = ?';
  queryParams.push(name);

  db.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
};

// Delete a product by name
exports.deleteProductByName = (req, res) => {
  const { name } = req.params; // assuming you pass the product name as a URL parameter

  db.query('DELETE FROM products WHERE name = ?', [name], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product Successfully Deleted' });
  });
};
