const Jwt = require('../helpers/jwt');
const { failure } = require('../helpers/response');
const { StatusCodes } = require('http-status-codes');

const auth = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];

    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token == null){
        return failure(res, {}, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const user = Jwt.verify(token);

    if (user == null){
        return failure(res, {}, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    req.user = user;

    next();
}

module.exports = auth;