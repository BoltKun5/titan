import { BudgetCategory, BudgetEntryType, PaymentMethod } from '../../../../../enums';

export interface ICreateFeePlanBody {
  seasonId: string;
  category: string;
  amount: number;
  installments?: number;
}

export interface IRecordPaymentBody {
  clubMemberId: string;
  feePlanId: string;
  amount: number;
  method?: PaymentMethod;
  dueDate?: string;
  notes?: string;
}

export interface ICreateBudgetEntryBody {
  seasonId: string;
  type: BudgetEntryType;
  category: BudgetCategory;
  label: string;
  amount: number;
  date: string;
  notes?: string;
}
