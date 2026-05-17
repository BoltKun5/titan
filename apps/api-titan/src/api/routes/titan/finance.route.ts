import { Router } from 'express';
import financeController from '../../controllers/titan/finance.controller';
import auth from '../../middlewares/auth';
import { requireClubRole } from '../../middlewares/require-club-role';
import { TitanRole } from 'titan_core';

const route = Router();

export const TitanFinanceRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Fee Plans
  route.get('/:clubAccountId/fee-plans', auth, financeController.getFeePlans);
  route.post(
    '/:clubAccountId/fee-plans',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.createFeePlan,
  );
  route.delete(
    '/:clubAccountId/fee-plans/:planId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.deleteFeePlan,
  );

  // Payments
  route.get('/:clubAccountId/payments', auth, financeController.getPayments);
  route.post(
    '/:clubAccountId/payments',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.recordPayment,
  );

  // Budget
  route.get('/:clubAccountId/budget', auth, financeController.getBudgetSummary);
  route.post(
    '/:clubAccountId/budget',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.createBudgetEntry,
  );
  route.delete(
    '/:clubAccountId/budget/:entryId',
    auth,
    requireClubRole(TitanRole.ADMIN, TitanRole.MANAGER),
    financeController.deleteBudgetEntry,
  );

  return route;
};
