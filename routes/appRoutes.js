import { requireAuth, checkUser } from '../middlewares/middleware.js';
import { Router } from 'express';
import {
  aAccomodation,
  aUser,
  available,
} from '../controllers/appController.js';

const appRouter = Router();

appRouter.get('/auth/user', requireAuth, checkUser, aUser);
appRouter.post('/addAccomodation', requireAuth, checkUser, aAccomodation);
appRouter.get('/available-roomies', available);

export default appRouter;
