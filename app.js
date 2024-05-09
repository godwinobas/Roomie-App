require('dotenv').config();
const routes = require('./routes/routes');
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
// const path = require('path');
const auth = require('./auth');

// connect to mongodb
function databaseConnection() {
  const connStr = process.env.DB_URI;
  mongoose.connect(connStr);
  console.log('Connected to Server Successfully');
}
databaseConnection();

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

let corsOptions = {
  origin: ['https://roomieapp.netlify.app'],
  allowedHeaders: '*',
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
