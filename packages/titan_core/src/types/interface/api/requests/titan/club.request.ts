import { SportType } from '../../../../../enums';

export interface ICreateClubBody {
  name: string;
  sport: SportType;
  logo?: string | null;
  colors?: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  federationId?: string;
}

export interface IUpdateClubBody {
  name?: string;
  logo?: string | null;
  colors?: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  federationId?: string;
}
