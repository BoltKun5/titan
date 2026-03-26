export type IFeePlan = {
  id: string;
  clubId: string;
  seasonId: string;
  category: string;
  amount: number;
  installments: number;
  createdAt?: string;
  updatedAt?: string;
};
