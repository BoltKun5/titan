import { Router } from 'express';
import onboardingController from '../../controllers/titan/onboarding.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanOnboardingRouter = (app: Router): Router => {
  app.use('/titan/onboarding', route);

  // Recherche des clubs FFHB (et autres fédérations à terme)
  route.get(
    '/federation-clubs',
    auth,
    onboardingController.searchFederationClubs,
  );

  // Vérification de disponibilité avant claim
  route.get(
    '/federation-clubs/:federationClubId/availability',
    auth,
    onboardingController.checkAvailability,
  );

  // Création du titan_club_account
  route.post('/claim', auth, onboardingController.claim);

  return route;
};
