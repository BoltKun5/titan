import { SportType } from '../../../../enums';

export type IClub = {
  id: string;
  name: string;
  logo: string | null;
  colors: string[] | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  federationId: string | null;
  sport: SportType;
  createdAt?: string;
  updatedAt?: string;
};
