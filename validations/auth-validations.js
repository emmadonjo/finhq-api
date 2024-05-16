const { body } = require('express-validator');
const Joi = require('joi');

const signUpValidation = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(255),
    email: Joi.string().required()
        .email()
        .max(255),
    password: Joi.string().required()
        .min(8)
        .max(32)
});

const signup = [
    body('name')
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 2, max: 255 })
        .escape(),
    body('email').isEmail()
        .notEmpty()
        .normalizeEmail()
        .isLength({ max: 255 }),
    body('password').isString()
        .notEmpty()
        .isLength({ min: 8, max: 32})
];


module.exports = { signup, signUpValidation };