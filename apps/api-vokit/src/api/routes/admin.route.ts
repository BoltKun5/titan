import { Router } from 'express';
import admin from '../middlewares/admin';
import adminController from '../controllers/admin.controller';

const route = Router();

export const AdminRouter = (app: Router): Router => {
  app.use('/admin', route);

  route.get('/force-import-data', admin, adminController.forceImportData);

  route.get('/data-set-rename', admin, adminController.getSetRename);

  route.post('/data-set-rename', admin, adminController.postSetRename);

  route.delete('/data-set-rename', admin, adminController.deleteSetRename);

  route.get('/import-test-data', admin, adminController.importTestData);

  return route;
};
