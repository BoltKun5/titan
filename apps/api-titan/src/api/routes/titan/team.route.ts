import { Router } from 'express';
import teamController from '../../controllers/titan/team.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanTeamRouter = (app: Router): Router => {
  app.use('/titan', route);

  // Teams (scoped to club)
  route.get('/clubs/:clubId/teams', auth, teamController.list);
  route.post('/clubs/:clubId/teams', auth, teamController.create);

  // Team operations
  route.get('/teams/:teamId', auth, teamController.get);
  route.put('/teams/:teamId', auth, teamController.update);
  route.delete('/teams/:teamId', auth, teamController.remove);

  // Team players
  route.post('/teams/:teamId/players', auth, teamController.addPlayer);
  route.delete(
    '/teams/:teamId/players/:playerId',
    auth,
    teamController.removePlayer,
  );

  return route;
};
