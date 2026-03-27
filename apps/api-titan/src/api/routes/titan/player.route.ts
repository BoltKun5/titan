import { Router } from 'express';
import playerController from '../../controllers/titan/player.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanPlayerRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Player CRUD
  route.get('/:clubId/players', auth, playerController.getByClub);
  route.post('/:clubId/players', auth, playerController.create);
  route.get(
    '/:clubId/players/search/license',
    auth,
    playerController.findByLicense,
  );
  route.get(
    '/:clubId/players/search/federation',
    auth,
    playerController.findByFederationId,
  );

  // Single player
  route.get('/players/:playerId', auth, playerController.getById);
  route.put('/players/:playerId', auth, playerController.update);
  route.delete('/players/:playerId', auth, playerController.delete);

  // Link / unlink user
  route.post('/players/:playerId/link-user', auth, playerController.linkUser);
  route.delete(
    '/players/:playerId/link-user',
    auth,
    playerController.unlinkUser,
  );

  return route;
};
