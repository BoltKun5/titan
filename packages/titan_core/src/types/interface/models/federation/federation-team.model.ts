import { FederationGender } from '../../../../enums';

export type IFederationTeam = {
  id: string;
  externalId: string;
  federationId: string;
  clubId: string;
  seasonId: string;
  name: string;
  category: string;
  genderSection: FederationGender;
  level: string | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
