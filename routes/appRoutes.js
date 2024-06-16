import { requireAuth, checkUser } from '../middlewares/middleware.js';
import { Router } from 'express';
import { aUser } from '../controllers/appController.js';

const appRouter = Router();

appRouter.get('/auth/user', requireAuth, checkUser, aUser);

export default appRouter;
