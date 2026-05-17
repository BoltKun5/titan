import { FederationGender } from '../../../../enums';

export type IFederationPlayer = {
  id: string;
  externalId: string;
  federationId: string;
  licenseNumber: string | null;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: FederationGender | null;
  nationality: string | null;
  photoUrl: string | null;
  height: number | null;
  weight: number | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
