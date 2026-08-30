const jwt = require('jsonwebtoken');

/**
 * protect
 * Middleware to verify JWT token on protected routes.
 * TODO: Implement full token verification when auth is ready.
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized – no token provided' });
    }

    // TODO: verify token and attach user to req
    // const token = authHeader.split(' ')[1];
    // req.user = jwt.verify(token, process.env.JWT_SECRET);

    res.status(501).json({ message: 'protect middleware – not yet implemented' });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized – invalid token' });
  }
};

module.exports = { protect };
