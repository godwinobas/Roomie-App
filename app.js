require('dotenv').config();
const routes = require('./routes/routes');
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./auth');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const jwt = require('jsonwebtoken');
// const path = require('path');

// connect to mongodb
function databaseConnection() {
  const connStr = process.env.DB_URI;
  mongoose.connect(connStr);
  console.log('Connected to Server Successfully');
}
databaseConnection();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: false,
    },
    // store: new SQLiteStore({ db: 'sessions.db', dir: './db.js' }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

let corsOptions = {
  origin: process.env.CORS_REQUEST_ORIGIN,
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(routes);
// app.use(express.static(path.join(__dirname, 'client')));

app.listen(3000, () => {
  console.log('app now listening for requests on port 3000');
});
