const mongoose = require('mongoose');
const { isEmail, isMobilePhone } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please enter full-name'],
    lowercase: true,
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Please enter a phone number'],
    minLength: [10, 'please enter a valid phone number'],
    // validate: [isMobilePhone, 'please enter a valid phone number'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: [6, 'Minimum password length is 6 characters'],
  },
});

// password hashing
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const Nuser = mongoose.model('nuser', userSchema);

module.exports = Nuser;
