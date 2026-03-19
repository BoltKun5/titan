import { Router } from 'express';
import authController from '../controllers/auth.controller';

const route = Router();

export const AuthRouter = (app: Router): Router => {
  app.use('/auth', route);

  route.post('/signin', authController.signIn);

  route.post('/signup', authController.signUp);

  return route;
};
