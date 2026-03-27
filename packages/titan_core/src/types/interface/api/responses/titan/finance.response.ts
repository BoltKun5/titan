import { IFeePlan, IPayment, IBudgetEntry } from '../../../models';

export interface IFeePlanResponse {
  feePlan: IFeePlan;
}

export interface IFeePlanListResponse {
  feePlans: IFeePlan[];
}

export interface IPaymentResponse {
  payment: IPayment;
}

export interface IPaymentListResponse {
  payments: IPayment[];
}

export interface IBudgetEntryResponse {
  entry: IBudgetEntry;
}

export interface IBudgetSummaryResponse {
  entries: IBudgetEntry[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
