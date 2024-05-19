const User = require('../models/userModel.js');
const Nuser = require('../models/Nuser.js');
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// Middlewares

// checking if a user is logged in
const requireAuth = (req, res, next) => {
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
const checkUser = async (req, res, next) => {
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
            const userFromNuserModel = await Nuser.findById(
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

// // cookie setter
function setCookie(cookieSettingData) {
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
}

// homepage
router.get('/', (req, res) => {
  res.json({ data: '*******OFF-K*******' });
});

router.get('/healtz', (req, res) => {
  res.statusCode = 201;
  res.json({ data: '201' });
});

router.get('/documentation', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/28928988/2sA3JDhkaK');
});

// auth routes (for now)
router.post('/signup', async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  try {
    const user = await Nuser.create({
      fullName,
      phoneNumber,
      email,
      password,
    });

    const token = setCookie(user._id);
    res.cookie('myCookie', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ message: 'User created successfully', user: user._id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Nuser.login(email, password);
    const token = setCookie(user._id);
    res.cookie('myCookie', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: user._id + 'logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'error loggin-in' });
  }
});

//google Oauth consent page
router.get('/goauth', (req, res) => {
  res.redirect('/auth/google');
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    keepSessionInfo: true,
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/failure',
  })
);

router.get('/auth/user', requireAuth, checkUser, (req, res) => {
  let user;
  user = {
    username: req.user.username,
    avatar: req.user.avatar,
    email: req.user.email,
    username: req.user.fullName,
    phone: req.user.phoneNumber,
  };
  res.json({ data: user });
});

router.get('/auth/failure', (req, res) => {
  res.send('Google Oauth failed');
});

router.get('/auth/protected', (req, res) => {
  try {
    const userId = req.user._id.toString();
    const secretKey = process.env.COOKIE_SECRET_KEY;
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    console.log('this is the token ' + token);
    console.log('this is the session cookie ' + req.session.myappUserId);

    // Set the JWT as an HTTP-only cookie
    res
      .cookie('myCookie', token, {
        maxAge: 3600000, // 1 hour (adjust as needed)
        httpOnly: false,
        secure: false, // Set to true in production
      })
      .redirect(process.env.FRONTENDAPP_URL + '?auth=' + token);
  } catch (err) {
    console.log(err);
  }
});

router.get('/mockfrontend', (req, res) => {
  res.send('this is our front for the main time');
});

// auth logout
// router.get('/google', (req, res) => {
//   // handle with passport
//   res.send('logging out');
// });

module.exports = router;
