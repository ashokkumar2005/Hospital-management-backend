const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${message}`);

  // Handle common Mongoose/SSL errors with better labels
  if (message.includes('SSL routines') || message.includes('alert 80')) {
    message = 'Database Connection Error: Your IP may not be whitelisted on MongoDB Atlas. Please check your Atlas Network Access settings.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
