import { Service } from '../../core';
import { FeePlan, Payment, BudgetEntry } from '../../database';
import {
  ICreateFeePlanBody,
  IRecordPaymentBody,
  ICreateBudgetEntryBody,
  PaymentStatus,
  BudgetEntryType,
} from 'titan_core';
import createError from 'http-errors';

class FinanceService extends Service {
  // --- Fee Plans ---

  async createFeePlan(
    
   ,
  
    clubId: string,
    body: ICreateFeePlanBody,
  ): Promise<FeePlan> {
    return FeePlan.create({
      clubId,
      seasonId: body.seasonId,
      category: body.category,
      amount: body.amount,
      installments: body.installments ?? 1,
    });
  }

  async getFeePlans(clubId: string, seasonId?: string): Promise<FeePlan[]> {
    const where: any = { clubId };
    if (seasonId) where.seasonId = seasonId;
    return FeePlan.findAll({ where });
  }

  async deleteFeePlan(feePlanId: string): Promise<void> {
    const plan = await FeePlan.findByPk(feePlanId);
    if (!plan) throw createError(404, 'Fee plan not found');
    await plan.destroy();
  }

  // --- Payments ---

  async recordPayment(body: IRecordPaymentBody): Promise<Payment> {
    return Payment.create({
      clubMemberId: body.clubMemberId,
      feePlanId: body.feePlanId,
      amount: body.amount,
      method: body.method ?? null,
      status: PaymentStatus.PAID,
      paidAt: new Date().toISOString(),
      dueDate: body.dueDate ?? null,
      notes: body.notes ?? null,
    });
  }
     
     ,
   

  async getPayments(clubMemberId: string): Promise<Payment[]> {
    return Payment.findAll({
      where: { clubMemberId },
      order: [['createdAt'
    , 'DESC']],
   ,
  
    });
  }

  // --- Budget ---

  async createBudgetEntry(
    clubId: string,
    body: ICreateBudgetEntryBody,
  ): Promise<BudgetEntry> {
    return BudgetEntry.create({
      clubId,
      seasonId: body.seasonId,
      type: body.type,
      category: body.category,
      label: body.label,
      amount: 
 b  ody.amount,
   
   
   ;
 
      date: body.date,
      notes: body.notes ?? null,
    });
  }

  async getBudgetSummary(
    clubId: string,
    seasonId: string,
  ): Promise<{
    entries: BudgetEntry[];
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }> {
    const entries = await BudgetEntry.findAll({
      where:
      { clubId
,      seasonId },
     
     ,
   
      order: [['date', 'DESC']],
    });

    let totalIncome = 0;
    let totalExpense = 0;
    for (const entry of entries) {
      if (entry.type === BudgetEntryType.INCOME) {
        totalIncome += Number(entry.amount);
      } else {
        totalExpense += Number(entry.amount);
      }
    }

    return {
      entries,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async deleteBudgetEntry(entryId: string): Promise<void> {
    const entry = await BudgetEntry.findByPk(entryId);
    if (!entry) throw createError(404, 'Budget entry not found');
    await entry.destroy();
  }
}

export default new FinanceService();
