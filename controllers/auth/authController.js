const User = require('../../models/user');
const Token = require('../../models/token');
const {
    ValidationError,
    ServerError
} = require('../../helpers/errors');

const Mail = require('../../helpers/mail');
const { DateTime } = require('luxon');
const { success } = require('../../helpers/response');
const Validator = require('validatorjs');
const Jwt = require('../../helpers/jwt');
const { StatusCodes } = require('http-status-codes');


const signUp = async (req, res, next) => {

    try {

        let validation = new Validator(req.body, {
             name:'required|string|min:3|max:255',
            email:'required|email|max:255',
            password:'required|string|min:5|max:32|confirmed'
        });
        
        if (validation.fails()) {
            throw new ValidationError(validation.errors.errors);
        }

        const { name, email, password } = req.body;

        // check if user already exist
        let userExist = await User.exists(email.toLowerCase());

        if (userExist) {    
            throw new ValidationError({
                email: ['A user with this email already exists.']
            });
        }

        // create account
        let model = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        let user = await model.save();

        if (!user) {
            throw new ServerError('User account could not be created');
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
        
        // generate jwt token
        return success(res, {
            token: Jwt.sign({ id: user._id, email: user.email})
        }, 'User account created successfully',StatusCodes.CREATED);
    }
    catch (error) {
        next(error);
    }
}

const signIn = async (req, res, next) => {

    try {

        let validation = new Validator(req.body, {
            email:'required|email',
            password:'required|string'
        });
        
        if (validation.fails()) {
            
            throw new ValidationError(validation.errors.errors);
        }

        const { email, password } = req.body;

        // check if user already exist
        let user = await User.findOne({ email: email });

        if (!user) {    
            throw new ValidationError({
                email: ['Email/password combination is incorrect.']
            });
        }

        // verify password
        let isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) {    
            throw new ValidationError({
                password: ['Email/password combination is incorrect.']
            });
        }

        // generate jwt token
        return success(res, {
            token: Jwt.sign({ id: user._id, email: user.email})
        }, 'User signed in successfully',StatusCodes.OK);
    }
    catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {

    try {
        req.user = null;

        // destroy session cookie
        res.clearCookie('connect.sid');

        // destroy session data from client
        res.setHeader('Set-Cookie', 'connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0');

        // invalidate session
        req.session = null;

        return success(res, {}, 'Logout successful',StatusCodes.OK);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}



module.exports = { signUp, signIn, logout };