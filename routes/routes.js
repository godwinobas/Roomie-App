const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// checking if a user is logged in
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('https://roomieapp.netlify.app');
  } else {
    next();
  }
};

// cookie setter
function setUserIDResponseCookie(req, res) {
  if (req.cookies?.['myapp-userid'] !== undefined && req.user) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + oneDayInMilliseconds);

    res.cookie('myapp-userid', req.user.id, {
      expires: expirationDate,
      httpOnly: false,
    });
  } else {
    res.clearCookie('myapp-userid');
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
  passport.authenticate('google'),
  setUserIDResponseCookie,
  (req, res, next) => {
    // if success
    if (req.user) {
      res.redirect('https://roomieapp.netlify.app/home');
    } else {
      res.redirect('/auth/failure');
    }
    next();
  }
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
  res.send('Something Went Wrong');
});

// auth logout
// router.get('/google', (req, res) => {
//   // handle with passport
//   res.send('logging out');
// });

module.exports = router;
