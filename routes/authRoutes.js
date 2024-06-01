import { Router } from 'express';
import {
  aFailure,
  aSuccess,
  gCallb,
  gAuth,
  pAuth,
  signupPost,
  loginPost,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signupPost);
router.post('/login', loginPost);
router.get('/goauth', gAuth);
router.get('/auth/google', pAuth);
router.get('/auth/google/callback', gCallb);
router.get('/auth/failure', aFailure);
router.get('/auth/protected', aSuccess);

export default router;
