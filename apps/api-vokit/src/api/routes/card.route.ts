import { Router } from 'express';
import auth from '../middlewares/auth';
import cardController from '../controllers/card.controller';

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use('/card', route);

  route.get('/list', auth, cardController.getCardList);

  route.get('/stats', auth, cardController.getStats);

  return route;
};
