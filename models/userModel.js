const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  username: String,
  email: String,
  avatar: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
