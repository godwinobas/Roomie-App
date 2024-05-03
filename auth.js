const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const User = require('./models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://roomie-app-325b.onrender.com/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log('user is:' + currentUser);
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.email,
          })
            .save()
            .then((newUser) => {
              console.log('new user created:' + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
