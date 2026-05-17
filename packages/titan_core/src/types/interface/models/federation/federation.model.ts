import { SportType, FederationCode } from '../../../../enums';

export type IFederation = {
  id: string;
  code: FederationCode;
  name: string;
  sport: SportType;
  country: string;
  baseUrl: string;
  createdAt?: string;
  updatedAt?: string;
};
