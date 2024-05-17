const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// checking if a user is logged in
const authCheck = (req, res, next) => {
  if (!req.session.myappUserId) {
    res.send('auth check failed');
  } else {
    next();
  }
};

// cookie setter
function setUserIDResponseSession(req, res, next) {
  try {
    if (req.user) {
      // Set user ID in the session
      req.session.myappUserId = req.user.id;
    } else {
      // Clear user ID from the session
      delete req.session.myappUserId;
    }
    next();
  } catch (e) {
    console.log('setUserIDResponseSession not working', e);
    // Handle any errors (optional)
    next(e);
  }
}

// homepage
router.get('/', (req, res) => {
  res.json({ data: 'uh, welcome i guess...' });
});

router.get('/healtz', (req, res) => {
  res.statusCode = 201;
  res.json({ data: '201' });
});

router.get('/documentation', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/28928988/2sA3JDhkaK');
});

router.get('/mockfrontend', (req, res) => {
  res.send('this is our front for the main time');
});

// consent page
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

// router.get('/auth/user', (req, res) => {
//   if (req.user) {
//     res.redirect('auth/user/success');
//   } else {
//     res.redirect('auth/failure');
//   }
// });

router.get('/auth/user', authCheck, (req, res) => {
  let user = {
    username: req.user.username,
    avatar: req.user.avatar,
    email: req.user.email,
  };
  // console.log(req.user);
  res.json({ data: user });
});

router.get('/auth/failure', (req, res) => {
  res.send('Google Oauth failed');
});

router.get('/auth/protected', setUserIDResponseSession, (req, res) => {
  try {
    const userId = req.user._id.toString();
    const secretKey = 'very secret key';
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    console.log('this is the token ' + token);
    console.log(req.session.myappUserId);

    // Set the JWT as an HTTP-only cookie
    res
      .cookie('myCookie', token, {
        maxAge: 3600000, // 1 hour (adjust as needed)
        httpOnly: false,
        secure: false, // Set to true in production
      })
      .redirect('https://roomie-app-1.onrender.com/mockfrontend');
  } catch (err) {
    console.log(err);
  }
});

// auth logout
// router.get('/google', (req, res) => {
//   // handle with passport
//   res.send('logging out');
// });

module.exports = router;
