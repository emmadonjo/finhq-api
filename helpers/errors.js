const { StatusCodes } = require('http-status-codes');

class BaseError extends Error {
    message;
    httpCode;
    errors;

    constructor(message, httpCode, errors = {}) {
        super(message);

        this.message = message;
        this.httpCode = httpCode;
        this.errors = errors;        
    }
}

class ServerError extends BaseError {
    constructor(message) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

class ValidationError extends BaseError {
    constructor(errors, message = '') {
        message = message ? message : 'Validation failed.';

        super(message, StatusCodes.UNPROCESSABLE_ENTITY, errors);
    }
}


class NotFoundError extends BaseError {
    constructor(message = '') {
        message = message ? message : 'Not Found';

        super(message, StatusCodes.NOT_FOUND, errors);
    }
}

module.exports = {
    ServerError,
    ValidationError,
    NotFoundError
};
