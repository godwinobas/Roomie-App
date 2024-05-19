const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  username: String,
  email: String,
  avatar: String,
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: [6, 'Minimum password length is 6 characters'],
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
