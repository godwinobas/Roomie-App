import { setCookie } from '../middlewares/middleware.js';
import User from '../models/userModel.js';
import passport from '../auth.js';
import jwt from 'jsonwebtoken';

// auth routes (for now)
export const signupPost = async (req, res, next) => {
  const { username, email, avatar, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      avatar,
      password,
    });

    const token = setCookie(user._id);
    res.cookie('myCookie', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: 'User created successfully',
      user: user,
      cookie: token,
    });
  } catch (err) {
    console.error(err);
    next(err);
    // res.status(400).json({ error: 'Error creating user' });
  }
};

// Login route
export const loginPost = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = setCookie(user._id);
    res.cookie('myCookie', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: 'user logged in successfully',
      user: user,
      cookie: token,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//google Oauth consent page
export const gAuth = (req, res) => {
  res.redirect('/auth/google');
};

export const pAuth = passport.authenticate('google', {
  scope: ['email', 'profile'],
});

export const gCallb = passport.authenticate('google', {
  keepSessionInfo: true,
  successRedirect: '/auth/protected',
  failureRedirect: '/auth/failure',
});

export const aFailure = (req, res) => {
  res.send('Google Oauth failed');
};

export const aSuccess = (req, res, next) => {
  try {
    const cookieId = req.user._id.toString();
    const secretKey = process.env.COOKIE_SECRET_KEY;
    const token = jwt.sign({ cookieId }, secretKey, { expiresIn: '1h' });
    console.log('this is the token ' + token);
    console.log('this is the session cookie ' + req.session.myappUserId);

    // Set the JWT as an HTTP-only cookie
    res
      .cookie('myCookie', token, {
        maxAge: 3600000, // 1 hour (adjust as needed)
        httpOnly: false,
        secure: true, // Set to true in production
      })
      .redirect(process.env.FRONTENDAPP_URL + '?auth=' + token);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
