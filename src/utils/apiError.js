class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Invalid Request') {
    return new ApiError(message, 400);
  }

  static notAuthenticated(message = 'Not Authenticated') {
    return new ApiError(message, 401);
  }

  static notAuthorized(message = 'Not Authorized') {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Invalid Endpoint') {
    return new ApiError(message, 404);
  }
}

module.exports = ApiError;
