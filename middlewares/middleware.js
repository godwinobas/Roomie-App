import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middlewares

// // cookie setter
export const setCookie = (cookieSettingData) => {
  try {
    const cookieId = cookieSettingData.toString();
    const secretKey = process.env.COOKIE_SECRET_KEY;
    const token = jwt.sign({ cookieId }, secretKey, { expiresIn: '1d' });

    // Set the JWT as an HTTP-only cookie
    return token;
  } catch (err) {
    console.error(err);
    // Handle any errors (optional)
    return null;
  }
};

// checking if a user is logged in
export const requireAuth = (req, res, next) => {
  const token =
    req.cookies.myCookie || req.headers.authorization?.split(' ')[1];

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
  const token =
    req.cookies.myCookie || req.headers.authorization?.split(' ')[1];

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
            const userFromUserModel = await User.findById(
              decodedToken.cookieId
            );
            user = userFromUserModel;
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

export const handleErr = async (err, req, res, next) => {
  var status = 500;
  var message = 'internal server error';

  // if(err.Code === '34567'){
  //   status = 400
  //   m
  // }

  res.status(status).json({ message, success: false, err });
};
