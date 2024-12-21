const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token. Please login again.' });
      }

      req.user = decoded; // Attach user information to the request
      next();
    });
  } catch (error) {
    console.error('Error in auth middleware:', error.message);
    return res.status(500).json({ message: 'Authentication failed. Please try again later.' });
  }
};

module.exports = authMiddleware;