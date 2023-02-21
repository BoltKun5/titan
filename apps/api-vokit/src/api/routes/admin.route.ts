import { Router } from 'express';
import admin from '../middlewares/admin';
import adminController from '../controllers/admin.controller';
require('express-async-errors');

const route = Router();

export const AdminRouter = (app: Router): Router => {
  app.use('/admin', route);

  route.post('/import-data', admin, adminController.importData);

  route.post('/import-test-data', admin, adminController.importTestData);

  route.get('/data-set-rename', admin, adminController.getSetRename);

  route.post('/data-set-rename', admin, adminController.postSetRename);

  route.delete('/data-set-rename', admin, adminController.deleteSetRename);

  return route;
};
