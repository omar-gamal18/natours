class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // passes message to the built-in Error class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // marks this as a known, intentional error

    Error.captureStackTrace(this, this.constructor); // cleaner stack trace
  }
}

module.exports = AppError;
