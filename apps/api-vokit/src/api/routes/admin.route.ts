import { Router } from 'express';
require('express-async-errors');

const route = Router();

export const AdminRouter = (app: Router): Router => {
  app.use('/admin', route);

  return route;
};
