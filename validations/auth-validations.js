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

module.exports = { signUpValidation };