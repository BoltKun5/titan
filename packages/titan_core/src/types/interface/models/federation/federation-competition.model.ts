import { SportType, FederationCompetitionType, FederationGender } from '../../../../enums';

export type IFederationCompetition = {
  id: string;
  externalId: string;
  federationId: string;
  seasonId: string;
  sport: SportType;
  name: string;
  level: string;
  type: FederationCompetitionType;
  gender: FederationGender;
  category: string;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
