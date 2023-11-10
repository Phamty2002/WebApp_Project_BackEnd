const db = require('../db'); // Update this with your actual database connection module

exports.createOrder = async (req, res) => {
    try {
      const { userId, products, shippingAddress } = req.body;

      // Input validation
      if (!userId || !products || !shippingAddress) {
        return res.status(400).json({ message: 'Invalid input data' });
      }

      // Transaction for data consistency
      await db.beginTransaction();

      // Insert into Orders table
      const orderResult = await db.query('INSERT INTO Orders (UserID, ShippingAddress) VALUES (?, ?)', [userId, shippingAddress]);
      const orderId = orderResult.insertId;

      // Insert each product into OrderDetails table
      for (const product of products) {
        await db.query('INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES (?, ?, ?)', [orderId, product.id, product.quantity]);
      }

      // Commit the transaction
      await db.commit();

      res.status(201).json({ message: 'Order created successfully', orderId: orderId });
    } catch (error) {
      // Rollback the transaction in case of an error
      await db.rollback();

      // Log the error for debugging
      console.error("Error in createOrder:", error);

      // Error handling
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Query to join Orders, OrderDetails, and products tables
        const query = `
            SELECT 
                O.OrderID, O.UserID, O.OrderStatus, O.OrderDate, O.ShippingAddress,
                OD.ProductID, P.name, P.description, P.price, P.image_path, OD.Quantity
            FROM Orders O
            JOIN OrderDetails OD ON O.OrderID = OD.OrderID
            JOIN products P ON OD.ProductID = P.id
            WHERE O.OrderID = ?
        `;

        const orderDetails = await db.query(query, [orderId]);

        // Check if order exists
        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Formatting the response
        const formattedResponse = {
            orderId: orderId,
            userId: orderDetails[0].UserID,
            orderStatus: orderDetails[0].OrderStatus,
            orderDate: orderDetails[0].OrderDate,
            shippingAddress: orderDetails[0].ShippingAddress,
            products: orderDetails.map(item => ({
                productId: item.ProductID,
                name: item.name,
                description: item.description,
                price: item.price,
                imagePath: item.image_path,
                quantity: item.Quantity
            }))
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error("Error in getOrder:", error);
        res.status(500).json({ message: 'Error retrieving order details', error: error.message });
    }
};


  exports.updateOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const { newStatus, newShippingAddress } = req.body;
  
      // Update order in Orders table
      await db.query('UPDATE Orders SET OrderStatus = ?, ShippingAddress = ? WHERE OrderID = ?', [newStatus, newShippingAddress, orderId]);
  
      res.json({ message: 'Order updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error: error.message });
    }
  };

  exports.deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      // Delete associated products from OrderDetails table
      await db.query('DELETE FROM OrderDetails WHERE OrderID = ?', [orderId]);
  
      // Delete order from Orders table
      await db.query('DELETE FROM Orders WHERE OrderID = ?', [orderId]);
  
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
  };