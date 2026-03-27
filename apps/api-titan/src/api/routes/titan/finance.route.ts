import { Router } from 'express';
import financeController from '../../controllers/titan/finance.controller';
import auth from '../../middlewares/auth';

const route = Router();

export const TitanFinanceRouter = (app: Router): Router => {
  app.use('/titan/clubs', route);

  // Fee Plans
  route.get('/:clubId/fee-plans', auth, financeController.getFeePlans);
  route.post('/:clubId/fee-plans', auth, financeController.createFeePlan);
  route.delete(
    '/:clubId/fee-plans/:planId',
    auth,
    financeController.deleteFeePlan,
  );

  // Payments
  route.get('/:clubId/payments', auth, financeController.getPayments);
  route.post('/:clubId/payments', auth, financeController.recordPayment);

  // Budget
  route.get('/:clubId/budget', auth, financeController.getBudgetSummary);
  route.post('/:clubId/budget', auth, financeController.createBudgetEntry);
  route.delete(
    '/:clubId/budget/:entryId',
    auth,
    financeController.deleteBudgetEntry,
  );

  return route;
};
