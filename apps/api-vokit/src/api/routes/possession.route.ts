import { Router } from 'express';
import auth from '../middlewares/auth';
import possessionController from '../controllers/possession.controller';

const route = Router();

export const PossessionRouter = (app: Router): Router => {
  app.use('/possession', route);

  route.post('/update', auth, possessionController.update);

  route.post('/create', auth, possessionController.create);

  route.post('/simple-delete', auth, possessionController.simpleDelete);

  route.post('/force-delete', auth, possessionController.forceDelete);

  route.post('/multiple-create', auth, possessionController.multipleCreate);

  route.post('/set-quantity', auth, possessionController.setQuantity);

  route.get('/historic', auth, possessionController.getHistoric);

  route.get('/boosters', auth, possessionController.getBoosters);

  return route;
};
