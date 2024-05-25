const User = require('../../models/user');
const Token = require('../../models/token');
const {
    ValidationError,
    ServerError
} = require('../../helpers/errors');

const Mail = require('../../helpers/mail');
const { signUpValidation } = require('../../validations/auth-validations');
const { DateTime } = require('luxon');

const signUp = async (req, res, next) => {
    const { error, value } = signUpValidation.validate(req.body);

    try {

        if (error) {
            throw new ValidationError(error.details)
        }

        const { name, email, password } = req.body;
        // check if user already exist
        if ((await User.exists(email))) {
    
            throw new ValidationError([
                {
                    message: 'A user with this email already exists.',
                    context: { key: 'email' }
                }
            ]);
        }

        // create account
        let model = new User({
            name,
            email,
            password
        });

        let user = await model.save();

        if (!user) {
            throw new ServerError()
        }

        let d = DateTime.local()
        // send verification code
        let tokenModel = new Token({
            tokenType: 'email',
            identifier: user.email,
            token: parseInt(Math.random() * (999999 - 100000) + 100000),
            expiresAt: d.plus({ minute: 30})
        });

        let token = await tokenModel.save();

        let msg = `
            <h2>Hi ${user.name},</h2>

            <p>
                Thanks for creating an account with us. To continue, kindly verify your email with the token below:
            </p>
            <p>
                <strong>${token.token}</strong>
            </p>

            <p>
                Regards,
            </p>
        `;
        await (new Mail).addTo(user.email, user.name)
            .addSubject('OTP - Account Verification')
            .send(msg);
        
        return res.status(201).json({
            status: true,
            message: 'User sign up successful.'
        });
    }
    catch (error) {
        next(error);
    }
}


module.exports = { signUp }