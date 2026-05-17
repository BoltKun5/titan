import { SportType } from '../../../../enums';

export type IFederationSeason = {
  id: string;
  externalId: string;
  federationId: string;
  sport: SportType;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
