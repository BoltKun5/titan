import { Router } from 'express';
import auth from '../middlewares/auth';
import cardController from '../controllers/card.controller';
import facultativeAuth from '../middlewares/facultative-auth';
import admin from '../middlewares/admin';

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use('/card', route);

  route.get('/list', facultativeAuth, cardController.getCardList);

  route.get('/stats', auth, cardController.getStats);

  route.post('/update', auth, cardController.update);

  route.post('/create', admin, cardController.create);

  return route;
};
