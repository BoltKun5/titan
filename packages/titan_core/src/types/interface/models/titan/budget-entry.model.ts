import { BudgetEntryType, BudgetCategory } from '../../../../enums';

export type IBudgetEntry = {
  id: string;
  clubId: string;
  seasonId: string;
  type: BudgetEntryType;
  category: BudgetCategory;
  label: string;
  amount: number;
  date: string;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};
