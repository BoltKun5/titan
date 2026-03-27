import { Router } from 'express';
import matchController from '../../controllers/titan/match.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';
import { TitanRole } from 'titan_core';

const route = Router();

export const TitanMatchRouter = (app: Router): Router => {
  app.use('/titan', route);

  // Matches (scoped to club)
  route.get('/clubs/:clubId/matches', auth, matchController.list);
  route.post(
    '/clubs/:clubId/matches',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    matchController.create,
  );

  // Match operations
  route.get('/matches/:matchId', auth, matchController.get);
  route.put('/matches/:matchId', auth, matchController.update);
  route.delete('/matches/:matchId', auth, matchController.remove);

  // Lineup & Events
  route.put('/matches/:matchId/lineup', auth, matchController.setLineup);
  route.post('/matches/:matchId/events', auth, matchController.addEvent);
  route.delete(
    '/matches/:matchId/events/:eventId',
    auth,
    matchController.deleteEvent,
  );

  return route;
};
