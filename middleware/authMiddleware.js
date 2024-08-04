const Jwt = require('../helpers/jwt');
const { failure } = require('../helpers/response');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');

const auth = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];

    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token == null){
        return failure(res, {}, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const verify = Jwt.verify(token);

    if (verify == null){
        return failure(res, {}, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    try {
        let user = await User.findOne({ email: verify.email });
        
        if (!user) {
            return failure(res, {}, 'Unauthorized', StatusCodes.UNAUTHORIZED);
        }

         req.user = user;
    } catch (error) {
        next(error);
    }

    next();
}

module.exports = auth;