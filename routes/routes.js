import { Router } from 'express';
const router = Router();
import jwt from 'jsonwebtoken';
import { requireAuth, checkUser } from '../middlewares/middleware.js';
// import Nuser from '../models/Nuser.js';

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

router.get('/auth/user', requireAuth, checkUser, (req, res) => {
  let user;
  user = {
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
  };
  res.json({ data: user });
});

router.get('/mockfrontend', (req, res) => {
  res.send('this is our front for the main time');
});

// auth logout
// router.get('/google', (req, res) => {
//   // handle with passport
//   res.send('logging out');
// });

export default router;
