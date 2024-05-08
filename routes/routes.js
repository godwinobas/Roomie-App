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

// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google'),
//   (req, res) => {
//     if (req.user) {
//       res.redirect('/auth/success');
//     } else {
//       res.redirect('auth/failure');
//     }
//   }
// );

router.get(
  '/auth/user',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
  (req, res) => {
    if (req.user) {
      res.redirect('auth/user/success');
    } else {
      res.redirect('auth/failure');
    }
  }
);

router.get('/auth/user/success', isLoggedIn, (req, res) => {
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
