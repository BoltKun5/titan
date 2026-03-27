import { PaymentStatus, PaymentMethod } from '../../../../enums';

export type IPayment = {
  id: string;
  clubMemberId: string;
  feePlanId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod | null;
  paidAt: string | null;
  dueDate: string | null;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
};
