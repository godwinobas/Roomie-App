import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  googleId: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: false,
    minLength: 6,
    default: process.env.DEFAULT_PASSWORD,
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

const User = mongoose.model('user', userSchema);

export default User;
