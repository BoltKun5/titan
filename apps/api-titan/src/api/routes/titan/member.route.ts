import { Router } from 'express';
import memberController from '../../controllers/titan/member.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';
import { TitanRole } from 'titan_core';

const route = Router();

export const TitanMemberRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Members
  route.get('/:clubAccountId/members', auth, memberController.list);
  route.post(
    '/:clubAccountId/members',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.create,
  );
  route.get('/:clubAccountId/members/:memberId', auth, memberController.get);
  route.put(
    '/:clubAccountId/members/:memberId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.update,
  );
  route.delete(
    '/:clubAccountId/members/:memberId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    memberController.remove,
  );

  // Licenses & Medical Certificates
  route.post(
    '/:clubAccountId/licenses',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.createLicense,
  );
  route.post(
    '/:clubAccountId/medical-certificates',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER, TitanRole.COACH),
    memberController.createMedicalCertificate,
  );

  return route;
};
