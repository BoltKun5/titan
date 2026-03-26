import { Router } from 'express';
import matchController from '../../controllers/titan/match.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanMatchRouter = (app: Router): Router => {
  app.use('/titan', route);

  // Matches (scoped to club)
  route.get('/clubs/:clubId/matches', auth, matchController.list);
  route.post('/clubs/:clubId/matches', auth, matchController.create);

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
