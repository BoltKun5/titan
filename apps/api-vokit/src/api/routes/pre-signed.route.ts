import { Router } from 'express';
import preSignedController from '../controllers/pre-signed.controller';

const route = Router();

export const PreSignedRouter = (app: Router): Router => {
  app.use('/pre-signed', route);

  route.get('/', preSignedController.get);

  route.post('/update-password', preSignedController.updatePassword);

  return route;
};
