import { Request, Response } from 'express';
import { IResponse } from 'titan_core';
import { Controller, LoggerModel, ILocals } from '../../../core';
import { financeService } from '../../../services/titan';
import FinanceValidation from '../../validations/titan/finance.validation';

class FinanceController implements Controller {
  private static readonly logger = new LoggerModel(FinanceController.name);

  async createFeePlan(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = FinanceValidation.createFeePlanBody(req.body);
    const plan = await financeService.createFeePlan(req.params.clubId, body);
    res.json({ data: plan });
  }

  async getFeePlans(
    req: Request<{ clubId: string }, any, any, { seasonId?: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const plans = await financeService.getFeePlans(
      req.params.clubId,
      req.query.seasonId,
    );
    res.json({ data: plans });
  }

  async deleteFeePlan(
    req: Request<{ clubId: string; planId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await financeService.deleteFeePlan(req.params.planId);
    res.json({ data: null });
  }

  async recordPayment(
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = FinanceValidation.recordPaymentBody(req.body);
    const payment = await financeService.recordPayment(body);
    res.json({ data: payment });
  }

  async getPayments(
    req: Request<
      
     
     
     
    
      { clubId: string },
      any,
      any,
      { memberId?: string; seasonId?: string }
    >,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const payments = await financeService.getPayments(
      req.params.clubId,
      req.query.memberId,
      req.query.seasonId,
    );
    res.json({ data: payments });
  }

  async createBudgetEntry(
      
     ,
    
    req: Request<{ clubId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const body = FinanceValidation.createBudgetEntryBody(req.body);
    const entry = await financeService.createBudgetEntry(
      req.params.clubId,
      body,
    );
    res.json({ data: entry });
  }

  async getBudgetSummary(
    req: Request<{ clubId: string }, any, any, { seasonId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    const summary = await financeService.getBudgetSummary(
      req.params.clubId,
      req.query.seasonId,
    );
    res.json({ data: summary });
  }

  async deleteBudgetEntry(
    req: Request<{ clubId: string; entryId: string }>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    await financeService.deleteBudgetEntry(req.params.entryId);
    res.json({ data: null });
  }
}

export default new FinanceController();
