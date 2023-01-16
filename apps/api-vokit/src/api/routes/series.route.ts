import { Router } from 'express';
import serieController from '../controllers/serie.controller';

const route = Router();

export const SeriesRouter = (app: Router): Router => {
  app.use('/series', route);

  route.get('/all-series', serieController.getAllSeries);

  return route;
};
