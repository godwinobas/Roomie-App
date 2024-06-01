import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// checking if a user is logged in
export const requireAuth = (req, res, next) => {
  const token = req.cookies.myCookie;

  // check if json web token exists & can be verified
  if (token) {
    jwt.verify(token, process.env.COOKIE_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ error: 'Failed to verify access Token' });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.status(401).json({ error: `You're not authorized to use this route` });
  }
};

//  check current user
export const checkUser = async (req, res, next) => {
  const token = req.cookies.myCookie;

  if (token) {
    jwt.verify(
      token,
      process.env.COOKIE_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          console.log(
            'failed to verify cookie in check user function ' + err.message
          );
          next();
        } else {
          console.log(decodedToken);
          let user;

          try {
            const userFromUserModel = await User.findById(decodedToken.id);
            const userFromNuserModel = await User.findById(
              decodedToken.cookieId
            );

            if (userFromUserModel === null) {
              user = userFromNuserModel;
            } else {
              user = userFromUserModel;
            }

            if (!user) {
              console.log('User not found');
            } else {
              console.log('User fetched from the database:', user);
              req.user = user;
            }
          } catch (err) {
            console.error('Error fetching user:', err.message);
          }

          next();
        }
      }
    );
  } else {
    console.log('no cookie to verify in check user func');
  }
};
