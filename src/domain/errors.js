class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
}