import { Router } from 'express';
import serieController from '../controllers/serie.controller';
import admin from '../middlewares/admin';

const route = Router();

export const SeriesRouter = (app: Router): Router => {
  app.use('/series', route);

  route.get('/all-series', serieController.getAllSeries);

  route.post('/create-set', admin, serieController.createSet);

  route.post('/update-set', admin, serieController.updateSet);

  route.post('/import-data', admin, serieController.importData);

  route.post('/create-serie', admin, serieController.createSerie);

  route.post('/update-serie', admin, serieController.updateSerie);

  return route;
};
