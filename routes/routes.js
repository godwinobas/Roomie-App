const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// homepage
router.get('/', (req, res) => {
  res.redirect('/auth/google');
});

// consent page
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.send('You reached the call back URI');
  }
);

// router.get('/auth/success', isLoggedIn, (req, res) => {
//   let name = req.user.displayName;
//   res.send(`Hi ${name}, You are successfully Logged-in!`);
// });

// router.get('/auth/failure', (req, res) => {
//   res.send('Something Went Wrong');
// });

// auth logout
router.get('/google', (req, res) => {
  // handle with passport
  res.send('logging out');
});

module.exports = router;
