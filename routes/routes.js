const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

// homepage
router.get('/', (req, res) => {
  res.json({ data: 'uh, welcome i guess...' });
});

router.get('/healtz', (req, res) => {
  res.statusCode = 201;
  res.json({ data: '201' });
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
  (req, res) => {
    if (req.user) {
      res.redirect('/auth/success');
    } else {
      res.redirect('auth/failure');
    }
  }
);

router.get('/auth/success', isLoggedIn, (req, res) => {
  let name = req.user.username;
  res.send(`Hi ${name}, You are successfully Logged-in!`);
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
