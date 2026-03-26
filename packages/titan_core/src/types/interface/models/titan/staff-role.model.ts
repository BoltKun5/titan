export type IStaffRole = {
  id: string;
  clubId: string;
  userId: string;
  role: string;
  seasonId: string | null;
  createdAt?: string;
  updatedAt?: string;
};
