/**
 * errorMiddleware
 * Global error handler for Express.
 * Must be registered AFTER all routes in server.js.
 *
 * Usage in server.js:
 *   const { errorHandler, notFound } = require('./middleware/errorMiddleware');
 *   app.use(notFound);
 *   app.use(errorHandler);
 */

// 404 handler – for unmatched routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found – ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
