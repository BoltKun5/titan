import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import DashboardController from '../controllers/dashboard.controller';

const route = Router();

export const DashboardRouter = (app: Router): Router => {
  app.use('/', route);

  return route;
};
