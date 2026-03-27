import { Router } from 'express';
import dashboardController from '../../controllers/titan/dashboard.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';

const route = Router();

export const TitanDashboardRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  route.get(
    '/:clubId/dashboard',
    auth,
    requireClubRole(),
    dashboardController.get,
  );

  return route;
};
