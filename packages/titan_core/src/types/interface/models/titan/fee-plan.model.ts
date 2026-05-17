export type IFeePlan = {
  id: string;
  clubAccountId: string;
  seasonId: string;
  category: string;
  amount: number;
  installments: number;
  createdAt?: string;
  updatedAt?: string;
};
