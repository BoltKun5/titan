import { Router } from 'express';
import admin from '../middlewares/admin';
import adminController from '../controllers/admin.controller';

const route = Router();

export const AdminRouter = (app: Router): Router => {
  app.use('/admin', route);

  route.post('/import-data', admin, adminController.importData);

  route.get('/data-set-rename', admin, adminController.getSetRename);

  route.post('/data-set-rename', admin, adminController.postSetRename);

  route.delete('/data-set-rename', admin, adminController.deleteSetRename);

  return route;
};
