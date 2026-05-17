import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import onboardingService from '../../../services/titan/onboarding.service';
import OnboardingValidation from '../../validations/titan/onboarding.validation';

class OnboardingController implements Controller {
  private static readonly logger = new LoggerModel(OnboardingController.name);

  async searchFederationClubs(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const { q, federation } = OnboardingValidation.searchQuery(req.query);
    const clubs = await onboardingService.searchFederationClubs(q, federation);
    res.json({ data: clubs });
  }

  async checkAvailability(
    req: Request<{ federationClubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const result = await onboardingService.checkClaimAvailability(
      req.params.federationClubId,
    );
    res.json({ data: result });
  }

  async claim(
    req: Request,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = OnboardingValidation.claimBody(req.body);
    const account = await onboardingService.claimFederationClub(
      body.federationClubId,
      { displayName: body.displayName, subscriptionPlan: body.subscriptionPlan },
    );
    res.json({ data: account });
  }
}

export default new OnboardingController();
