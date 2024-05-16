const { StatusCodes } = require("http-status-codes");

const success = (
    res,
    data = null,
    message = '',
    code  = StatusCodes.OK,
) => {
    return res.status(code).json({
        status: true,
        message,
        data
    });
}

const failure = (
    res,
    data = null,
    message = '',
    code  = StatusCodes.BAD_REQUEST,
) => {
    return res.status(code).json({
        status: false,
        message,
        data
    });
}


module.exports = {
    success, failure
}