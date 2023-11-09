const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    // Verify the token using the JWT secret from your .env file
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Error during token verification:', err);
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        } else {
          return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
      }
      req.user = user;
      next();
    });
  } else {
    // If no token is provided, send a forbidden status
    res.sendStatus(401);
  }
};

module.exports = { verifyToken };
