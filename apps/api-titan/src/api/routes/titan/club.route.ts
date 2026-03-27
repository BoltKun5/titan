import { Router } from 'express';
import clubController from '../../controllers/titan/club.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';
import { TitanRole } from 'titan_core';

const route = Router();

export const TitanClubRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Club CRUD
  route.get('/', auth, clubController.getUserClubs);
  route.post('/', auth, clubController.create);
  route.get('/:clubId', auth, clubController.get);
  route.put(
    '/:clubId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.update,
  );

  // Sport Config
  route.get('/:clubId/sport-config', auth, clubController.getSportConfig);

  // My Role
  route.get('/:clubId/my-role', auth, clubController.getMyRole);

  // Staff Roles
  route.get(
    '/:clubId/staff',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.getStaffRoles,
  );
  route.post(
    '/:clubId/staff',
    auth,
    requireClubRole(TitanRole.ADMIN),
    clubController.assignStaffRole,
  );
  route.delete(
    '/:clubId/staff/:staffRoleId',
    auth,
    requireClubRole(TitanRole.ADMIN),
    clubController.removeStaffRole,
  );

  // Invitations
  route.post(
    '/:clubId/invitations',
    auth,
    requireClubRole(TitanRole.ADMIN),
    clubController.createInvitation,
  );

  // Seasons
  route.get('/:clubId/seasons', auth, clubController.getSeasons);
  route.post(
    '/:clubId/seasons',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.createSeason,
  );
  route.put(
    '/:clubId/seasons/:seasonId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.updateSeason,
  );
  route.delete(
    '/:clubId/seasons/:seasonId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.deleteSeason,
  );

  // Venues
  route.get('/:clubId/venues', auth, clubController.getVenues);
  route.post(
    '/:clubId/venues',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.createVenue,
  );
  route.put(
    '/:clubId/venues/:venueId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.updateVenue,
  );
  route.delete(
    '/:clubId/venues/:venueId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    clubController.deleteVenue,
  );

  return route;
};

// Invitation acceptance route (separate — no clubId param)
const inviteRoute = Router();
export const TitanInviteRouter = (app: Router): Router => {
  app.use('/titan/invitations', inviteRoute);
  inviteRoute.post('/:code/accept', auth, clubController.acceptInvitation);
  return inviteRoute;
};
