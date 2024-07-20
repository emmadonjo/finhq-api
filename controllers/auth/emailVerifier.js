const { success, failure } = require('../../helpers/response');
const { ValidationError } = require('../../helpers/errors');
const Validator = require('validatorjs');
const { DateTime } = require('luxon');
const User = require('../../models/user');
const Token = require('../../models/token');
const Mail = require('../../helpers/mail');
const { StatusCodes } = require('http-status-codes');

const verifyEmail = async (req, res, next) => {

    try {

        let validation = new Validator(req.body, {
             otp:'required|string|size:6'
        });
        
        if (validation.fails()) {
            throw new ValidationError(validation.errors);
        }

        // find otp and owner
        let token = await Token.findOneByType('email')
            .where('token', req.body.otp);

        if (!token) {
            throw new ValidationError({
                otp: ['Invalid OTP.']
            });
        }
        let d = DateTime.local()

        if (token.expiresAt < d) {
            throw new ValidationError({
                otp: ['OTP has expired']
            });
        }

        let user = await User.findOne({ email: token.identifier });

        if (!user) {
            throw new ValidationError({
                otp: ['No account found for this otp']
            });
        }

        user.emailVerified = true;
        await user.save();

        await token.deleteOne(); 

        return success(res, {}, 'Email verified successfully',StatusCodes.OK);
    }
    catch (error) {
        next(error);
    }
}

const resendOtp = async (req, res, next) => {

    try {
        console.log(req)

        // get otp or create
        // send otp

        return success(res, {}, 'OTP successfully resent',StatusCodes.OK);
    }
    catch (error) {
        next(error);
    }
}

module.exports = { verifyEmail, resendOtp };