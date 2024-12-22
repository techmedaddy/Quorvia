class ErrorHandler {
  static handleError(err, req, res, next) {
    // Default to 500 if no status code is set
    const statusCode = err.statusCode || 500;

    // Log the error for debugging
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
    });

    // Respond with a meaningful error message
    res.status(statusCode).json({
      success: false,
      message: err.message || 'An unexpected error occurred.',
    });
  }

  static notFound(req, res, next) {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found.`,
    });
  }
}

module.exports = ErrorHandler;