const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    tokenType: {
        type: String,
        required: true,
        index: true
    },
    identifier: {
        type: String,
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    expiresAt: { type: Date, required: true }
}, { versionKey: false, timestamps: true });

Schema.statics.findOneByType = async function (type) {
    return this.findOne({ tokenType: type });
}


const Token = mongoose.model('tokens', Schema);

module.exports = Token;

