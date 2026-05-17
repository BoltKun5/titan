import { Request, Response, NextFunction } from 'express';
import { ILocals } from '../../../core';
import dashboardService from '../../../services/titan/dashboard.service';
import { TitanRole } from 'titan_core';

class DashboardController {
  get = async (
    req: Request<{ clubAccountId: string }>,
    res: Response<any, ILocals>,
    next: NextFunction,
  ) => {
    const { clubAccountId } = req.params;
    const seasonId = req.query.seasonId as string;
    const userId = res.locals.currentUser.id;
    const role = res.locals.clubRole!;

    if (!seasonId) {
      return res
        .status(400)
        .json({ message: 'seasonId query parameter required' });
    }

    let data: any;

    switch (role) {
      case TitanRole.ADMIN:
      case TitanRole.MANAGER:
        data = await dashboardService.getDirigeantDashboard(
          clubAccountId,
          seasonId,
        );
        break;
      case TitanRole.COACH:
        data = await dashboardService.getEntraineurDashboard(
          clubAccountId,
          userId,
          seasonId,
        );
        break;
      case TitanRole.PLAYER:
      case TitanRole.VIEWER:
      default:
        data = await dashboardService.getJoueurDashboard(
          clubAccountId,
          userId,
          seasonId,
        );
        break;
    }

    res.json({ role, data });
    next();
  };
}

export default new DashboardController();
