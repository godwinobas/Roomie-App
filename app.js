import dotenv from 'dotenv';
dotenv.config();
import routes from './routes/routes.js';
import express from 'express';
const app = express();
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './auth.js';
import cookieParser from 'cookie-parser';

// const SQLiteStoreSession = SQLiteStore(session);
// import SQLiteStore from 'connect-sqlite3';
// const path = require('path');
import jwt from 'jsonwebtoken';

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
