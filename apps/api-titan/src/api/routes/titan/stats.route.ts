import { Router } from 'express';
import statsController from '../../controllers/titan/stats.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanStatsRouter = (app: Router): Router => {
  app.use('/titan/stats', route);

  // Player match stats
  route.post('/match-stats', auth, statsController.recordMatchStats);
  route.put('/match-stats/:statsId', auth, statsController.updateMatchStats);
  route.delete('/match-stats/:statsId', auth, statsController.deleteMatchStats);
  route.get(
    '/players/:playerId/match-stats',
    auth,
    statsController.getMatchStatsByPlayer,
  );
  route.get(
    '/matches/:matchId/stats',
    auth,
    statsController.getMatchStatsByMatch,
  );

  // Player season stats
  route.get(
    '/players/:playerId/seasons',
    auth,
    statsController.getPlayerSeasonStats,
  );
  route.post(
    '/players/:playerId/seasons/:seasonId/recompute',
    auth,
    statsController.recomputePlayerSeasonStats,
  );

  // Team season stats
  route.get(
    '/teams/:teamId/seasons/:seasonId',
    auth,
    statsController.getTeamSeasonStats,
  );
  route.put(
    '/teams/:teamId/seasons/:seasonId',
    auth,
    statsController.upsertTeamSeasonStats,
  );

  // Rankings
  route.get(
    '/clubs/:clubId/seasons/:seasonId/top-scorers',
    auth,
    statsController.getTopScorers,
  );
  route.get(
    '/clubs/:clubId/seasons/:seasonId/top-assists',
    auth,
    statsController.getTopAssists,
  );
  route.get(
    '/clubs/:clubId/seasons/:seasonId/top-saves',
    auth,
    statsController.getTopSaves,
  );

  // Club overview
  route.get(
    '/clubs/:clubId/seasons/:seasonId/overview',
    auth,
    statsController.getClubStatsOverview,
  );

  return route;
};
