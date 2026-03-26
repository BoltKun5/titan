import { Router } from 'express';
import memberController from '../../controllers/titan/member.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanMemberRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Members
  route.get('/:clubId/members', auth, memberController.list);
  route.post('/:clubId/members', auth, memberController.create);
  route.get('/:clubId/members/:memberId', auth, memberController.get);
  route.put('/:clubId/members/:memberId', auth, memberController.update);
  route.delete('/:clubId/members/:memberId', auth, memberController.remove);

  // Licenses & Medical Certificates
  route.post('/:clubId/licenses', auth, memberController.createLicense);
  route.post(
    '/:clubId/medical-certificates',
    auth,
    memberController.createMedicalCertificate,
  );

  return route;
};
