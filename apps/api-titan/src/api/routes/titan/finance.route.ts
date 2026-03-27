import { Router } from 'express';
import financeController from '../../controllers/titan/finance.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';
import { TitanRole } from 'titan_core';

const route = Router();

export const TitanFinanceRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Fee Plans
  route.get('/:clubId/fee-plans', auth, financeController.getFeePlans);
  route.post(
    '/:clubId/fee-plans',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.createFeePlan,
  );
  route.delete(
    '/:clubId/fee-plans/:planId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.deleteFeePlan,
  );

  // Payments
  route.get('/:clubId/payments', auth, financeController.getPayments);
  route.post(
    '/:clubId/payments',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.recordPayment,
  );

  // Budget
  route.get('/:clubId/budget', auth, financeController.getBudgetSummary);
  route.post(
    '/:clubId/budget',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.createBudgetEntry,
  );
  route.delete(
    '/:clubId/budget/:entryId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.deleteBudgetEntry,
  );

  return route;
};
