const { failure } = require('../helpers/response');

const guest = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token) {
        return failure(res, {}, 'Only guests can access this resource.');
    }

    next();
}

module.exports = guest;