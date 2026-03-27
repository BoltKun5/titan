import { Router } from 'express';
import memberController from '../../controllers/titan/member.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';
import { TitanRole } from 'titan_core';

const route = Router();

export const TitanMemberRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Members
  route.get('/:clubId/members', auth, memberController.list);
  route.post(
    '/:clubId/members',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.create,
  );
  route.get('/:clubId/members/:memberId', auth, memberController.get);
  route.put(
    '/:clubId/members/:memberId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.update,
  );
  route.delete(
    '/:clubId/members/:memberId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    memberController.remove,
  );

  // Licenses & Medical Certificates
  route.post(
    '/:clubId/licenses',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.createLicense,
  );
  route.post(
    '/:clubId/medical-certificates',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.createMedicalCertificate,
  );

  return route;
};
