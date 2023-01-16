import { Router } from 'express';
import userController from '../controllers/user.controller';
import auth from '../middlewares/auth';

const route = Router();

export const UserRouter = (app: Router): Router => {
  app.use('/user', route);

  route.get('/me', auth, userController.me);

  return route;
};
