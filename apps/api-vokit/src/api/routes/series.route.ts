import { Router } from 'express';
import serieController from '../controllers/serie.controller';
import admin from '../middlewares/admin';

const route = Router();

export const SeriesRouter = (app: Router): Router => {
  app.use('/series', route);

  route.get('/all-series', serieController.getAllSeries);

  route.post('/create-set', admin, serieController.createSet);

  route.post('/create-serie', admin, serieController.createSerie);

  return route;
};
