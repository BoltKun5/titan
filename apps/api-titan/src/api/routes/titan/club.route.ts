import { Router } from 'express';
import clubController from '../../controllers/titan/club.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanClubRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Club CRUD
  route.get('/', auth, clubController.getUserClubs);
  route.post('/', auth, clubController.create);
  route.get('/:clubId', auth, clubController.get);
  route.put('/:clubId', auth, clubController.update);

  // Sport Config
  route.get('/:clubId/sport-config', auth, clubController.getSportConfig);

  // Seasons
  route.get('/:clubId/seasons', auth, clubController.getSeasons);
  route.post('/:clubId/seasons', auth, clubController.createSeason);
  route.put('/:clubId/seasons/:seasonId', auth, clubController.updateSeason);
  route.delete('/:clubId/seasons/:seasonId', auth, clubController.deleteSeason);

  // Venues
  route.get('/:clubId/venues', auth, clubController.getVenues);
  route.post('/:clubId/venues', auth, clubController.createVenue);
  route.put('/:clubId/venues/:venueId', auth, clubController.updateVenue);
  route.delete('/:clubId/venues/:venueId', auth, clubController.deleteVenue);

  return route;
};
