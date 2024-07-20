const { StatusCodes } = require("http-status-codes");
const { ValidationError } = require("../helpers/errors");
const { failure } = require("../helpers/response");

const handler = async (error, req, res, next) => {   
    if (error instanceof ValidationError) {

        return failure(
            res,
            error.errors,
            error.message,
            StatusCodes.UNPROCESSABLE_ENTITY
        );
    }

    else if (error instanceof Error) {
        return failure(
            res,
            {},
            error.message,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
    else {
        return failure(
            res,
            {},
            error.message,
            StatusCodes.httpCode
        );
    }
}

module.exports = {handler};