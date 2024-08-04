const Validator = require('validatorjs');
const {
    ValidationError
} = require('../../helpers/errors');
const Token = require('../../models/token');
const User = require('../../models/user');
const Mail = require('../../helpers/mail');
const { StatusCodes } = require('http-status-codes');
const { DateTime } = require('luxon');
const { success } = require('../../helpers/response');

const sendOtp = async (req, res, next) => {
    let validation = new Validator(req.body, {
        email: 'required|string|max:255'
    });

    
    try {
        if (validation.fails()) {
            throw new ValidationError(validation.errors.errors);
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            throw new ValidationError({
                email: ['No account was found for this email.']
            });
        }
        
        let model = new Token({
            tokenType: 'password',
            identifier: req.body.email,
            token: parseInt(Math.random() * (999999 - 100000) + 100000),
            expiresAt: DateTime.local().plus({ minute: 30 })
        });

        let token = await model.save();

        let msg = `
            <h2>Hi ${user.name},</h2>

            <p>
                Thanks for requesting a password reset. Kindly use the OTP below to reset your password.
            </p>
            <p>
                <strong>${token.token}</strong>
            </p>

            <p>
                If you did not make this request, no further action will be required from you or performed on your account.
            </p>
            
            <p>
                Regards,
            </p>
        `;

        await(new Mail).addTo(user.email, user.name)
            .addSubject('Password reset OTP')
            .send(msg);
        
        return success(res, {}, 'OTP sent successfully', StatusCodes.OK);

    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req, res, next) => {
    const validation = new Validator(req.body, {
        otp: 'required|string',
        password: 'required|string|min:5|max:32|confirmed'
    });

    try {
        if (validation.fails()) {
            throw new ValidationError(validation.errors.errors);
        }

        let token = await Token.findOneByType('password')
            .where('token', req.body.otp);
        
        if (!token) {
            throw new ValidationError({
                otp: ['Invalid OTP.']
            });
        }

        let d = DateTime.local();
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


        user.password= req.body.password;
        await user.save();

        await token.deleteOne(); 

        return success(res, {}, 'Password reset successful.',StatusCodes.OK);
    } catch (error) {
        next(error);
    }
}

module.exports = { sendOtp, resetPassword }