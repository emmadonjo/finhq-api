const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashing } = require('../configs/configs');

const Schema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true, index: true},
  password: { type: String, required: true},
  bio : String,
  avatar: String,
}, { versionKey: false, timestamps: true});


Schema.methods.isValidPassword = async function (password) {
  return await this.password && bcrypt.compare(password, this.password);
}

Schema.statics.exists = async function (email) {
  let u = await this.findOne({ email });

  return !!u;
}

Schema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();

  try {
    let salt = await bcrypt.genSalt(Number(hashing.saltRounds));
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    return next(error);
  }
  
  return next();
});

Schema.pre('save', function (next) {
  this.email = this.email.toLowerCase();
  
  next();
});


const User = mongoose.model('users', Schema);

module.exports = User;