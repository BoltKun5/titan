import { Router } from 'express';

const route = Router();

export const AdminRouter = (app: Router): Router => {
  app.use('/admin', route);

  return route;
};
