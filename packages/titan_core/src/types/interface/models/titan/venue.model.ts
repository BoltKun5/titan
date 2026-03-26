export type IVenue = {
  id: string;
  clubId: string;
  name: string;
  address: string | null;
  capacity: number | null;
  createdAt?: string;
  updatedAt?: string;
};
