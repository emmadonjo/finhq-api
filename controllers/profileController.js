const { success } = require('../helpers/response');
const { StatusCodes } = require('http-status-codes');

const getProfile = async (req, res, next) => {
    return success(res, req.user, StatusCodes.OK);
}

module.exports = { getProfile };